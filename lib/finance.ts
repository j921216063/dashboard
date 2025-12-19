import { Transaction, MarketDataMap, ProcessedData, PortfolioSummary, ChartDataPoint, Holding } from '@/types';

// --- Math Helpers ---
const xirr = (transactions: { amount: number; date: Date }[], currentValue: number, valuationDate: Date) => {
    try {
        const cashFlows = [...transactions];
        cashFlows.push({ amount: currentValue, date: valuationDate });
        const t0 = cashFlows[0].date.getTime();
        const xnpv = (r: number) => cashFlows.reduce((acc, cf) => acc + cf.amount / Math.pow(1 + r, (cf.date.getTime() - t0) / 31536000000), 0);
        let rate = 0.1;
        for(let i=0; i<50; i++) {
            const v = xnpv(rate);
            if(Math.abs(v) < 1e-6) break;
            const d = (xnpv(rate + 0.0001) - v) / 0.0001;
            if (d === 0) break; 
            rate = rate - v / d;
        }
        return isFinite(rate) ? rate * 100 : 0;
    } catch(e) { return 0; }
};

const sharpe = (returns: number[]) => {
    if (returns.length < 2) return 0;
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length);
    return stdDev === 0 ? 0 : ((mean * 52) - 0.02) / (stdDev * Math.sqrt(52));
};

const mdd = (values: number[]) => {
    let maxVal = 0;
    let maxDD = 0;
    for (const v of values) {
        if (v > maxVal) maxVal = v;
        const dd = (maxVal - v) / maxVal;
        if (dd > maxDD) maxDD = dd;
    }
    return maxDD * 100;
};

const vol = (returns: number[]) => {
    if (returns.length < 2) return 0;
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(52) * 100;
};

// --- Core Parsing ---
export const parseCSV = (csvText: string): Transaction[] => {
    if (!csvText) return [];
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const data: Transaction[] = [];
    const re = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        const values = line.split(re).map(val => val.replace(/^"|"$/g, '').trim());
        const entry: any = {};
        headers.forEach((header, index) => { entry[header] = values[index]; });

        if (entry['Transaction Date'] && entry['Symbol'] && !entry['Symbol'].includes('CASH')) {
            const type = entry['Type'] || 'Other';
            // Fix: remove $ and , from numbers to prevent parsing errors
            const cleanNumber = (val: string) => parseFloat(val ? val.replace(/[$,]/g, '') : '0');
            
            const shares = cleanNumber(entry['Shares Owned']);
            const price = cleanNumber(entry['Cost Per Share']);
            const commission = cleanNumber(entry['Commission']);
            
            const currency = entry['Currency'] || 'USD';
            let amount = 0;
            
            if (type === 'Buy' || type === 'Dividend Reinvest') {
                amount = -((shares * price) + commission);
            } else if (type.includes('Sell')) {
                amount = ((shares * price) - commission);
            }

            // Safe Date Parsing for Mobile (Safari)
            let isoDate = '';
            try {
                let dateStr = entry['Transaction Date'];
                if (!dateStr) throw new Error('Empty date');
                
                // Handle "2024-02-16 GMT+0800" -> "2024/02/16"
                // 1. Remove timezone junk if present to simplify
                let cleanStr = dateStr.split(' GMT')[0].trim(); 
                
                // 2. Replace dashes with slashes for Safari support (YYYY/MM/DD)
                cleanStr = cleanStr.replace(/-/g, '/');

                let d = new Date(cleanStr);
                
                // Double check validity
                if (Object.prototype.toString.call(d) === "[object Date]" && !isNaN(d.getTime())) {
                    isoDate = d.toISOString();
                } else {
                     // Last ditch attempt: use raw string if simple cleaning failed (e.g. standard ISO format)
                     d = new Date(dateStr);
                     if (!isNaN(d.getTime())) {
                         isoDate = d.toISOString();
                     } else {
                         throw new Error('Invalid Date');
                     }
                }
            } catch (e) {
                console.warn('Skipping invalid date:', entry['Transaction Date']);
                continue;
            }

            data.push({
                id: i.toString(),
                symbol: entry['Symbol'],
                portfolio: entry['Portfolio'] || 'Default',
                currency, shares, price, commission,
                date: isoDate,
                type: type as any, amount
            });
        }
    }
    return data;
};

// --- Core Processing ---
export const processPortfolioData = (
    transactions: Transaction[], 
    marketData: MarketDataMap, 
    selectedPortfolio: string,
    priceOverrides: Record<string, number>
): ProcessedData | null => {
    const filteredTx = transactions
        .filter(t => t.portfolio === selectedPortfolio)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (filteredTx.length === 0) return null;

    const holdingsMap: Record<string, number> = {}; 
    const costBasisMap: Record<string, number> = {}; 
    const currencyMap: Record<string, string> = {};
    let totalInvested = 0; 
    const xirrFlows: { amount: number; date: Date }[] = []; 
    const priceLookup: Record<string, Map<string, number>> = {};
    
    Object.keys(marketData).forEach(sym => { 
        priceLookup[sym] = new Map(marketData[sym].map(d => [d.date, d.price])); 
    });

    // FIX: Set startDate to the VERY END of the first transaction day (23:59:59.999).
    // Using UTC construction ensures we don't get shifted to the previous day due to timezone offsets.
    const firstTxDate = new Date(filteredTx[0].date);
    const startDate = new Date(firstTxDate);
    startDate.setUTCHours(23, 59, 59, 999);
    
    const now = new Date();
    const endDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    const chartData: ChartDataPoint[] = [];
    let currentDate = new Date(startDate);
    
    let txIndex = 0;
    const lastKnownPrices: Record<string, number> = {};

    while (currentDate.getTime() <= endDate.getTime()) {
        const currentDateTs = currentDate.getTime();
        const dateStr = currentDate.toISOString().split('T')[0];

        while (txIndex < filteredTx.length && new Date(filteredTx[txIndex].date).getTime() <= currentDateTs) {
            const tx = filteredTx[txIndex];
            if (!holdingsMap[tx.symbol]) { 
                holdingsMap[tx.symbol] = 0; 
                costBasisMap[tx.symbol] = 0; 
                currencyMap[tx.symbol] = tx.currency; 
            }
            
            // Critical: Always cache the transaction price immediately.
            // This ensures that even if market data is missing for this day, we have a price baseline.
            if (tx.price > 0) {
                lastKnownPrices[tx.symbol] = tx.price;
            } else if (Math.abs(tx.amount) > 0 && tx.shares > 0) {
                // Derived price fallback if price column was empty but amount existed
                lastKnownPrices[tx.symbol] = Math.abs(tx.amount) / tx.shares;
            }

            if (tx.type === 'Buy') {
                holdingsMap[tx.symbol] += tx.shares;
                costBasisMap[tx.symbol] += Math.abs(tx.amount);
                totalInvested += Math.abs(tx.amount);
                xirrFlows.push({ amount: tx.amount, date: new Date(tx.date) });
            } else if (tx.type.includes('Sell') || tx.type === 'Sell All') {
                 if (holdingsMap[tx.symbol] > 0) {
                     const ratio = tx.shares / holdingsMap[tx.symbol];
                     const costRemoved = costBasisMap[tx.symbol] * ratio;
                     costBasisMap[tx.symbol] -= costRemoved;
                     totalInvested -= costRemoved;
                     holdingsMap[tx.symbol] -= tx.shares;
                 }
                 xirrFlows.push({ amount: tx.amount, date: new Date(tx.date) });
            } else if (tx.type === 'Dividend Reinvest') {
                holdingsMap[tx.symbol] += tx.shares;
            }
            txIndex++;
        }

        let dailyValue = 0;
        Object.keys(holdingsMap).forEach(sym => {
            const shares = holdingsMap[sym];
            if (shares > 0.0001) {
                let price = 0;
                
                // Priority 1: User Override
                if (priceOverrides[sym]) {
                    price = priceOverrides[sym];
                } 
                else {
                    // Priority 2: Market Data
                    const lookupPrice = priceLookup[sym]?.get(dateStr);
                    if (lookupPrice && lookupPrice > 0) {
                        lastKnownPrices[sym] = lookupPrice;
                    }
                    
                    // Priority 3: Last Known Price
                    price = lastKnownPrices[sym] || 0;
                }

                // Priority 4: Average Cost Fallback (CRITICAL FIX: Ensure this runs if price is 0)
                if (price <= 0 && costBasisMap[sym] > 0 && shares > 0) {
                    price = costBasisMap[sym] / shares;
                    lastKnownPrices[sym] = price; // Update cache
                }

                dailyValue += shares * price;
            }
        });

        if (dailyValue <= 0.001 && totalInvested > 0) {
            // Safety: Force value = invested if value is anomalously zero to prevent -100% spikes
            // This happens if price lookup fails completely for the very first day
            const safeValue = totalInvested;
            
            chartData.push({ 
                date: dateStr, 
                rawDate: new Date(currentDate), 
                value: safeValue, 
                invested: totalInvested,
                returnAbs: 0,
                returnPct: 0
            });
        } else if (dailyValue > 0 || totalInvested > 0) {
            chartData.push({ 
                date: dateStr, 
                rawDate: new Date(currentDate), 
                value: dailyValue, 
                invested: totalInvested,
                returnAbs: dailyValue - totalInvested,
                returnPct: totalInvested > 0 ? (dailyValue - totalInvested) / totalInvested * 100 : 0
            });
        }
        // Increment by 1 UTC day
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    const currentHoldings: Holding[] = [];
    let currentTotalValue = 0;
    
    Object.keys(holdingsMap).forEach(sym => {
        const shares = holdingsMap[sym];
        if (shares > 0.001) {
            let price = priceOverrides[sym] ? priceOverrides[sym] : (lastKnownPrices[sym] || 0);
            
            // Fix: Apply Avg Cost fallback for Current Holdings table as well!
            if (price <= 0 && costBasisMap[sym] > 0 && shares > 0) {
                price = costBasisMap[sym] / shares;
            }

            const val = shares * price;
            currentTotalValue += val;
            currentHoldings.push({
                symbol: sym, 
                shares, 
                currentPrice: price, 
                value: val, 
                currency: currencyMap[sym] || 'USD',
                costBasis: costBasisMap[sym],
                returnPcnt: costBasisMap[sym] > 0 ? ((val - costBasisMap[sym]) / costBasisMap[sym]) * 100 : 0,
                avgCost: shares > 0 ? costBasisMap[sym] / shares : 0,
                isOverridden: !!priceOverrides[sym]
            });
        }
    });

    const chartValues = chartData.map(c => c.value);
    const returns: number[] = [];
    for(let i=7; i<chartValues.length; i+=7) {
        const prev = chartValues[i-7];
        const curr = chartValues[i];
        if(prev > 0) returns.push((curr - prev) / prev);
    }

    const summary: PortfolioSummary = {
        totalValue: currentTotalValue,
        totalCost: totalInvested,
        totalReturn: currentTotalValue - totalInvested,
        returnPcnt: totalInvested > 0 ? ((currentTotalValue - totalInvested) / totalInvested) * 100 : 0,
        annualizedReturn: xirr(xirrFlows, currentTotalValue, new Date()),
        maxDrawdown: mdd(chartValues),
        sharpeRatio: sharpe(returns),
        volatility: vol(returns),
        winRate: currentHoldings.length > 0 ? (currentHoldings.filter(h => h.returnPcnt > 0).length / currentHoldings.length) * 100 : 0,
        avgInvestAmt: totalInvested / Math.max(1, filteredTx.length)
    };

    return { 
        summary, 
        chartData, 
        holdings: currentHoldings.sort((a,b) => b.value - a.value), 
        transactions: filteredTx.reverse() 
    };
};