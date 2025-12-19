export interface Transaction {
  id: string;
  symbol: string;
  portfolio: string;
  currency: string;
  shares: number;
  price: number;
  commission: number;
  date: string;
  type: 'Buy' | 'Sell' | 'Dividend' | 'Dividend Reinvest' | 'Sell All' | 'Other';
  amount: number;
}

export interface MarketDataPoint {
  date: string;
  price: number;
}

export interface MarketDataMap {
  [symbol: string]: MarketDataPoint[];
}

export interface Holding {
  symbol: string;
  shares: number;
  currentPrice: number;
  value: number;
  currency: string;
  returnPcnt: number;
  avgCost: number;
  costBasis: number;
  isOverridden?: boolean;
}

export interface ChartDataPoint {
  date: string;
  rawDate: number;
  value: number;
  invested: number;
  returnAbs: number;
  returnPct: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  returnPcnt: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  volatility: number;
  winRate: number;
  avgInvestAmt: number;
}

export interface ProcessedData {
  summary: PortfolioSummary;
  chartData: ChartDataPoint[];
  holdings: Holding[];
  transactions: Transaction[];
}

export interface ApiResponse {
  marketData: MarketDataMap;
  exchangeRate: number;
}