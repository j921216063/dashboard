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

    const uniqueSymbols = Array.from(new Set(symbols as string[]));
    const period1 = startDate ? new Date(startDate) : new Date('2015-01-01');
    const marketData: MarketDataMap = {};

    console.log(`Fetching data for: ${uniqueSymbols.join(', ')}`);

    await Promise.all(
      uniqueSymbols.map(async (symbol) => {
        try {
          const queryOptions = { period1: period1, interval: '1d' as const };
          const quote = await yahooFinance.historical(symbol, queryOptions);
          marketData[symbol] = quote.map((q) => ({
            date: q.date.toISOString().split('T')[0],
            price: q.adjClose || q.close,
          }));
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          marketData[symbol] = [];
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