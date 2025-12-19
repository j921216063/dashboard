import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { MarketDataMap } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { symbols, startDate } = await request.json();

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json({ error: 'Invalid symbols' }, { status: 400 });
    }

    // Polyfill for Node.js < 18.14.1
    if (typeof Headers !== 'undefined' && !Headers.prototype.getSetCookie) {
      Headers.prototype.getSetCookie = function() {
        const val = this.get('set-cookie');
        return val ? [val] : [];
      };
    }

    const uniqueSymbols = Array.from(new Set(symbols));
    const period1 = startDate ? new Date(startDate) : new Date('2015-01-01');
    const marketData: MarketDataMap = {};

    console.log(`Fetching data for: ${uniqueSymbols.join(', ')}`);

    await Promise.all(
      uniqueSymbols.map(async (symbol) => {
        try {
          const queryOptions = { period1: period1, interval: '1d' as const };
          const quote = await yahooFinance.historical(symbol as string, queryOptions);
          marketData[symbol as string] = quote.map((q) => {
            // FIX: Safe date parsing for API results
            const dateStr = q.date.toISOString().split('T')[0];
            return {
              date: dateStr,
              price: q.adjClose || q.close,
            };
          });
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          marketData[symbol as string] = [];
        }
      })
    );

    let exchangeRate = 32.0; 
    try {
      const rateQuote = await yahooFinance.quote('TWD=X');
      if (rateQuote && rateQuote.regularMarketPrice) {
        exchangeRate = rateQuote.regularMarketPrice;
      }
    } catch (e) {
      console.error('Error fetching exchange rate:', e);
    }

    return NextResponse.json({ marketData, exchangeRate });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}