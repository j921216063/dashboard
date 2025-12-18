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
            const shares = parseFloat(entry['Shares Owned'] || '0');
            const price = parseFloat(entry['Cost Per Share'] || '0');
            const commission = parseFloat(entry['Commission'] || '0');
            const currency = entry['Currency'] || 'USD';
            let amount = 0;
            
            if (type === 'Buy' || type === 'Dividend Reinvest') {
                amount = -((shares * price) + commission);
            } else if (type.includes('Sell')) {
                amount = ((shares * price) - commission);
            }

            data.push({
                id: i.toString(),
                symbol: entry['Symbol'],
                portfolio: entry['Portfolio'] || 'Default',
                currency, shares, price, commission,
                date: new Date(entry['Transaction Date']).toISOString(),
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

    const startDate = new Date(filteredTx[0].date);
    const endDate = new Date(); 
    const chartData: ChartDataPoint[] = [];
    let currentDate = new Date(startDate);
    
    let txIndex = 0;
    const lastKnownPrices: Record<string, number> = {};

    while (currentDate <= endDate) {
        const currentDateTs = currentDate.getTime();
        const dateStr = currentDate.toISOString().split('T')[0];

        while (txIndex < filteredTx.length && new Date(filteredTx[txIndex].date).getTime() <= currentDateTs) {
            const tx = filteredTx[txIndex];
            if (!holdingsMap[tx.symbol]) { 
                holdingsMap[tx.symbol] = 0; 
                costBasisMap[tx.symbol] = 0; 
                currencyMap[tx.symbol] = tx.currency; 
            }
            
            // Fix: Initialize lastKnownPrice with transaction price if unknown
            // This prevents 0 value drop when market data is missing for the transaction day
            if (lastKnownPrices[tx.symbol] === undefined && tx.price > 0) {
                lastKnownPrices[tx.symbol] = tx.price;
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
                if (priceOverrides[sym]) {
                    price = priceOverrides[sym];
                } else {
                    const lookupPrice = priceLookup[sym]?.get(dateStr);
                    if (lookupPrice !== undefined) lastKnownPrices[sym] = lookupPrice;
                    price = lastKnownPrices[sym] || 0;
                }
                dailyValue += shares * price;
            }
        });

        if (dailyValue > 0 || totalInvested > 0) {
            chartData.push({ 
                date: dateStr, 
                rawDate: new Date(currentDate), 
                value: dailyValue, 
                invested: totalInvested,
                returnAbs: dailyValue - totalInvested,
                returnPct: totalInvested > 0 ? (dailyValue - totalInvested) / totalInvested * 100 : 0
            });
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const currentHoldings: Holding[] = [];
    let currentTotalValue = 0;
    
    Object.keys(holdingsMap).forEach(sym => {
        const shares = holdingsMap[sym];
        if (shares > 0.001) {
            let price = priceOverrides[sym] ? priceOverrides[sym] : (lastKnownPrices[sym] || 0);
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