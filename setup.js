const fs = require('fs');
const path = require('path');

// Helper to create directory
const mkdir = (dir) => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Helper to write file
const writeFile = (filePath, content) => {
  const dir = path.dirname(filePath);
  mkdir(dir);
  fs.writeFileSync(filePath, content.trim());
  console.log(`Created: ${filePath}`);
};

// --- File Contents ---

const packageJson = `
{
  "name": "portfolioviz-pro-v2",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "13.5.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.12.0",
    "yahoo-finance2": "^2.11.1",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "lz-string": "^1.5.0",
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3"
  }
}
`;

const tsconfig = `
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;

const nextConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
`;

const tailwindConfig = `
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
`;

const globalsCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-slate-50 text-slate-900;
}
`;

const gitignore = `
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel
`;

const typesIndex = `
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
`;

const libUtils = `
import React from 'react';

// --- SVG Icons ---
const SvgIcon = ({ path, className = "", size = 20, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    {path}
  </svg>
);

export const Icons = {
  Loader2: (p: any) => <SvgIcon path={<path d="M21 12a9 9 0 1 1-6.219-8.56"/>} className={\`animate-spin \${p.className || ''}\`} {...p} />,
  Activity: (p: any) => <SvgIcon path={<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>} {...p} />,
  Briefcase: (p: any) => <SvgIcon path={<><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>} {...p} />,
  Upload: (p: any) => <SvgIcon path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></>} {...p} />,
  Clipboard: (p: any) => <SvgIcon path={<><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></>} {...p} />,
  Download: (p: any) => <SvgIcon path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></>} {...p} />,
  TrendingUp: (p: any) => <SvgIcon path={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>} {...p} />,
  PieChart: (p: any) => <SvgIcon path={<><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>} {...p} />,
  Layers: (p: any) => <SvgIcon path={<><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></>} {...p} />,
  Calendar: (p: any) => <SvgIcon path={<><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></>} {...p} />,
  ChevronLeft: (p: any) => <SvgIcon path={<path d="m15 18-6-6 6-6"/>} {...p} />,
  ChevronRight: (p: any) => <SvgIcon path={<path d="m9 18 6-6-6-6"/>} {...p} />,
  ChevronDown: (p: any) => <SvgIcon path={<path d="m6 9 6 6 6-6"/>} {...p} />,
  X: (p: any) => <SvgIcon path={<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>} {...p} />,
  Edit2: (p: any) => <SvgIcon path={<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>} {...p} />,
  Check: (p: any) => <SvgIcon path={<polyline points="20 6 9 17 4 12"/>} {...p} />,
  ArrowUp: (p: any) => <SvgIcon path={<path d="m18 15-6-6-6 6"/>} {...p} />,
  ArrowDown: (p: any) => <SvgIcon path={<path d="m6 9 6 6 6-6"/>} {...p} />,
  RefreshCw: (p: any) => <SvgIcon path={<><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></>} {...p} />,
  DollarSign: (p: any) => <SvgIcon path={<><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>} {...p} />,
  Share2: (p: any) => <SvgIcon path={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></>} {...p} />,
  Copy: (p: any) => <SvgIcon path={<><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>} {...p} />,
  Home: (p: any) => <SvgIcon path={<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>} {...p} />,
  Link: (p: any) => <SvgIcon path={<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>} {...p} />
};

// --- Formatters ---
export const formatValue = (val: number | undefined, currency: string, exchangeRate: number, isInt: boolean = false) => {
  if (val === undefined || val === null) return '-';
  const rate = currency === 'TWD' ? exchangeRate : 1;
  const convertedVal = val * rate;
  const symbol = currency === 'TWD' ? 'NT$' : '$';
    
  if (isInt) {
      return \`\${symbol}\${Math.floor(convertedVal).toLocaleString()}\`;
  }
    
  return \`\${symbol}\${convertedVal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}\`;
};

export const formatUSD = (v: number) => \`$\${v.toLocaleString(undefined, {minimumFractionDigits:2})}\`;
export const formatMoney = (v: number, isTWD: boolean = false) => \`\${isTWD?'NT$':'$'}\${v.toLocaleString(undefined, {minimumFractionDigits:2})}\`;
export const formatInt = (v: number, isTWD: boolean = false) => \`\${isTWD?'NT$':'$'}\${Math.floor(v).toLocaleString()}\`;

export const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#64748b', '#06b6d4'];

export const DEFAULT_CSV_DATA = \`Id,Symbol,Name,Display Symbol,Exchange,Portfolio,Currency,Shares Owned,Cost Per Share,Commission,Transaction Date,Transaction Time,Purchase Exchange Rate,Type,Accounting,Accounting Execution Ids,Notes

"1","IMOM","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD",,,,,,,,,,
"2","IMOM","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD","143","27.97","0","2024-02-16 GMT+0800","21:47:00",,"Buy",,,
"3","IMOM","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD","13","28.3","0","2024-11-08 GMT+0800","23:43:00","0","Buy",,,
"4","IMOM","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD","2","28.25","0","2024-11-12 GMT+0800","23:40:00","0","Buy",,,
"5","IMOM","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD","4.98839","26.6078","0","2024-12-31 GMT+0800","00:42:00","0","Dividend Reinvest",,,

"6","AVUV","Avantis U.S. Small Cap Value ET",,"PCX","Firstrade 帳戶","USD",,,,,,,,,,
"7","AVUV","Avantis U.S. Small Cap Value ET",,"PCX","Firstrade 帳戶","USD","41","88.6","0","2024-02-16 GMT+0800","22:28:00",,"Buy",,,
"8","AVUV","Avantis U.S. Small Cap Value ET",,"PCX","Firstrade 帳戶","USD","0.09574","91.915","0","2024-03-25 GMT+0800","09:44:00","0","Dividend Reinvest",,,
"9","AVUV","Avantis U.S. Small Cap Value ET",,"PCX","Firstrade 帳戶","USD","0.13963","88.234","0","2024-06-26 GMT+0800","22:46:00","0","Dividend Reinvest",,,
"10","AVUV","Avantis U.S. Small Cap Value ET",,"PCX","Firstrade 帳戶","USD","0.1175","94.9781","0","2024-09-25 GMT+0800","00:15:00","0","Dividend Reinvest",,,
"11","AVUV","Avantis U.S. Small Cap Value ET",,"PCX","Firstrade 帳戶","USD","2","103.68","0","2024-11-07 GMT+0800","23:37:00","0","Sell","Weighted Average",,
"12","AVUV","Avantis U.S. Small Cap Value ET",,"PCX","Firstrade 帳戶","USD","0.12412","96.44","0","2024-12-19 GMT+0800","00:39:00","0","Dividend Reinvest",,,
"13","AVUV","Avantis U.S. Small Cap Value ET",,"PCX","Firstrade 帳戶","USD","0.10587","88.505","0","2025-03-27 GMT+0800","00:41:00","0","Dividend Reinvest",,,

"14","QVAL","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD",,,,,,,,,,
"15","QVAL","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","85","41.16","0","2024-02-16 GMT+0800","22:36:00",,"Buy",,,
"16","QVAL","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","1","40.64","0","2024-02-20 GMT+0800","22:51:00",,"Buy",,,
"17","QVAL","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","0.19534","42.9","0","2024-03-15 GMT+0800","00:27:00","0","Dividend Reinvest",,,
"18","QVAL","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","0.37915","43.07","0","2024-06-21 GMT+0800","22:41:00","0","Dividend Reinvest",,,
"19","QVAL","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","0.20276","44.24","0","2024-09-13 GMT+0800","00:13:00","0","Dividend Reinvest",,,
"20","QVAL","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","0.2861","44.8095","0","2024-12-31 GMT+0800","00:47:00","0","Dividend Reinvest",,,
"21","QVAL","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","0.14458","41.775","0","2025-03-14 GMT+0800","00:48:00","0","Dividend Reinvest",,,"P"

"22","VTI","Vanguard Total Stock Market ETF",,"PCX","Firstrade 帳戶","USD",,,,,,,,,,
"23","VTI","Vanguard Total Stock Market ETF",,"PCX","Firstrade 帳戶","USD","48","249.67","0","2024-02-16 GMT+0800","22:44:00",,"Buy",,,
"24","VTI","Vanguard Total Stock Market ETF",,"PCX","Firstrade 帳戶","USD","0.11819","258.8275","0","2024-03-27 GMT+0800","09:46:00","0","Dividend Reinvest",,,
"25","VTI","Vanguard Total Stock Market ETF",,"PCX","Firstrade 帳戶","USD","0.11979","267.6454","0","2024-07-02 GMT+0800","10:16:00","0","Dividend Reinvest",,,
"26","VTI","Vanguard Total Stock Market ETF",,"PCX","Firstrade 帳戶","USD","0.10458","281.1376","0","2024-10-01 GMT+0800","23:32:00","0","Dividend Reinvest",,,
"27","VTI","Vanguard Total Stock Market ETF",,"PCX","Firstrade 帳戶","USD","2","295.01","0","2024-11-07 GMT+0800","23:33:00","0","Sell","Weighted Average",,
"28","VTI","Vanguard Total Stock Market ETF",,"PCX","Firstrade 帳戶","USD","0.10361","294.6618","0","2024-12-26 GMT+0800","00:50:00","0","Dividend Reinvest",,,
"29","VTI","Vanguard Total Stock Market ETF",,"PCX","Firstrade 帳戶","USD","0.11889","269.49","0","2025-03-31 GMT+0800","00:50:00","0","Dividend Reinvest",,,

"30","QMOM","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD",,,,,,,,,,
"31","QMOM","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","88","54.96","0","2024-02-16 GMT+0800","22:46:00",,"Buy",,,
"32","QMOM","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","1","54.2","0","2024-02-20 GMT+0800","22:50:00",,"Buy",,,
"33","QMOM","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","1","53.49","0","2024-02-21 GMT+0800","22:52:00",,"Buy",,,
"34","QMOM","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","8","68.63","0","2024-11-07 GMT+0800","23:39:00","0","Sell","Weighted Average",,
"35","QMOM","Alpha Architect U.S. Quantitati",,"NGM","Firstrade 帳戶","USD","0.80332","64.37","0","2024-12-31 GMT+0800","00:46:00","0","Dividend Reinvest",,,

"36","AVES","Avantis Emerging Markets Value ",,"PCX","Firstrade 帳戶","USD",,,,,,,,,,
"37","AVES","Avantis Emerging Markets Value ",,"PCX","Firstrade 帳戶","USD","38","46.68","0","2024-02-20 GMT+0800","22:46:00",,"Buy",,,
"38","AVES","Avantis Emerging Markets Value ",,"PCX","Firstrade 帳戶","USD","1","46.26","0","2024-04-16 GMT+0800","09:48:00","0","Buy",,,
"39","AVES","Avantis Emerging Markets Value ",,"PCX","Firstrade 帳戶","USD","0.26866","48.5","0","2024-06-26 GMT+0800","22:48:00","0","Dividend Reinvest",,,
"40","AVES","Avantis Emerging Markets Value ",,"PCX","Firstrade 帳戶","USD","1","49.995","0","2024-11-08 GMT+0800","23:44:00","0","Buy",,,
"41","AVES","Avantis Emerging Markets Value ",,"PCX","Firstrade 帳戶","USD","0.84878","46.8792","0","2024-12-19 GMT+0800","00:37:00","0","Dividend Reinvest",,,

"42","IVAL","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD",,,,,,,,,,
"43","IVAL","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD","86","25.77","0","2024-02-20 GMT+0800","22:47:00",,"Buy",,,
"44","IVAL","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD","0.33739","26.4385","0","2024-03-15 GMT+0800","00:24:00","0","Dividend Reinvest",,,
"45","IVAL","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD","1.06738","24.8083","0","2024-06-21 GMT+0800","22:37:00","0","Dividend Reinvest",,,
"46","IVAL","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD","0.10463","25.041","0","2024-09-13 GMT+0800","00:11:00","0","Dividend Reinvest",,,
"47","IVAL","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD","13","24.67","0","2024-11-08 GMT+0800","23:42:00","0","Buy",,,
"48","IVAL","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD","0.69103","24.0945","0","2024-12-31 GMT+0800","00:44:00","0","Dividend Reinvest",,,
"49","IVAL","Alpha Architect International Q",,"NGM","Firstrade 帳戶","USD","0.18288","25.59","0","2025-03-14 GMT+0800","00:45:00","0","Dividend Reinvest",,,

"50","VXUS","Vanguard Total International St",,"NGM","Firstrade 帳戶","USD",,,,,,,,,,
"51","VXUS","Vanguard Total International St",,"NGM","Firstrade 帳戶","USD","176","58.25","0","2024-02-20 GMT+0800","22:48:00",,"Buy",,,
"52","VXUS","Vanguard Total International St",,"NGM","Firstrade 帳戶","USD","0.46209","59.5992","0","2024-03-20 GMT+0800","00:21:00","0","Dividend Reinvest",,,
"53","VXUS","Vanguard Total International St",,"NGM","Firstrade 帳戶","USD","0.98989","60.3299","0","2024-06-25 GMT+0800","22:44:00","0","Dividend Reinvest",,,
"54","VXUS","Vanguard Total International St",,"NGM","Firstrade 帳戶","USD","0.52951","63.87","0","2024-09-24 GMT+0800","00:14:00","0","Dividend Reinvest",,,
"55","VXUS","Vanguard Total International St",,"NGM","Firstrade 帳戶","USD","9","62.1899","0","2024-11-08 GMT+0800","23:43:00","0","Buy",,,
"56","VXUS","Vanguard Total International St",,"NGM","Firstrade 帳戶","USD","2.22069","59.2293","0","2024-12-24 GMT+0800","00:52:00","0","Dividend Reinvest",,,
"57","VXUS","Vanguard Total International St",,"NGM","Firstrade 帳戶","USD","0.39587","66.86","0","2025-03-25 GMT+0800","00:52:00","0","Dividend Reinvest",,,

"58","AVDV","Avantis International Small Cap",,"PCX","Firstrade 帳戶","USD",,,,,,,,,,
"59","AVDV","Avantis International Small Cap",,"PCX","Firstrade 帳戶","USD","36","61.5","0","2024-02-20 GMT+0800","22:49:00",,"Buy",,,
"60","AVDV","Avantis International Small Cap",,"PCX","Firstrade 帳戶","USD","0.46133","64.6604","0","2024-06-26 GMT+0800","22:49:00","0","Dividend Reinvest",,,
"61","AVDV","Avantis International Small Cap",,"PCX","Firstrade 帳戶","USD","0.64585","64.04","0","2024-12-19 GMT+0800","00:35:00","0","Dividend Reinvest",,,

"62","USD=CASH",,,,"Firstrade 帳戶","USD",,,,,,,,,,
"63","USD=CASH",,,,"Firstrade 帳戶","USD","590.02","0","0","2024-11-07 GMT+0800","23:33:00",,"Buy",,,"賣出 VTI - Vanguard Total Stock Market ETF"
"64","USD=CASH",,,,"Firstrade 帳戶","USD","207.36","0","0","2024-11-07 GMT+0800","23:37:00",,"Buy",,,"賣出 AVUV - Avantis U.S. Small Cap Value ET"
"65","USD=CASH",,,,"Firstrade 帳戶","USD","549.04","0","0","2024-11-07 GMT+0800","23:39:00",,"Buy",,,"賣出 QMOM - Alpha Architect U.S. Quantitati"
"66","USD=CASH",,,,"Firstrade 帳戶","USD","320.71","0","0","2024-11-08 GMT+0800","23:42:00",,"Sell",,,"買進 IVAL - Alpha Architect International Q"
"67","USD=CASH",,,,"Firstrade 帳戶","USD","367.9","0","0","2024-11-08 GMT+0800","23:43:00",,"Sell",,,"買進 IMOM - Alpha Architect International Q"
"68","USD=CASH",,,,"Firstrade 帳戶","USD","559.7091","0","0","2024-11-08 GMT+0800","23:43:00",,"Sell",,,"買進 VXUS - Vanguard Total International St"
"69","USD=CASH",,,,"Firstrade 帳戶","USD","49.995","0","0","2024-11-08 GMT+0800","23:44:00",,"Sell",,,"買進 AVES - Avantis Emerging Markets Value "
"70","USD=CASH",,,,"Firstrade 帳戶","USD","56.5","0","0","2024-11-12 GMT+0800","23:40:00",,"Sell",,,"買進 IMOM - Alpha Architect International Q"

"71","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD",,,,,,,,,,
"72","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","10.45569","102.34","3.21","2022-02-22 GMT+0800","23:49:00",,"Buy",,,
"73","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.48145","96.69","1.59","2022-03-07 GMT+0800","23:51:00",,"Buy",,,
"74","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.07409","98.54","0.9","2022-04-18 GMT+0800","23:56:00",,"Buy",,,
"75","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.55696","89.98","0.9","2022-05-16 GMT+0800","23:58:00",,"Buy",,,
"76","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.91647","84.51","0.9","2022-06-16 GMT+0800","00:03:00",,"Buy",,,
"77","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.7844","86.43","0.89","2022-07-18 GMT+0800","00:05:00",,"Buy",,,
"78","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.31278","94.11","0.9","2022-08-16 GMT+0800","00:06:00",,"Buy",,,
"79","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.78908","85.5","0.89","2022-09-16 GMT+0800","00:08:00",,"Buy",,,
"80","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","6.21969","80.39","0.9","2022-10-17 GMT+0800","00:09:00",,"Buy",,,
"81","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.64399","88.59","0.9","2022-11-16 GMT+0800","00:11:00",,"Buy",,,
"82","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.74167","87.08","0.9","2022-12-16 GMT+0800","00:12:00",,"Buy",,,
"83","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.48127","91.22","0.9","2023-01-17 GMT+0800","00:13:00",,"Buy",,,
"84","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.40483","92.51","0.9","2023-02-16 GMT+0800","00:14:00",,"Buy",,,
"85","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.6942","87.81","0.9","2023-03-20 GMT+0800","00:17:00",,"Buy",,,
"86","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.37231","93.07","0.9","2023-04-17 GMT+0800","00:18:00",,"Buy",,,
"87","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.38759","92.81","0.9","2023-05-16 GMT+0800","00:19:00",,"Buy",,,
"88","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.27594","94.77","0.9","2023-06-23 GMT+0800","00:20:00",,"Buy",,,
"89","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.06443","98.73","0.9","2023-07-17 GMT+0800","00:21:00",,"Buy",,,
"90","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.19536","96.24","0.9","2023-08-16 GMT+0800","00:22:00",,"Buy",,,
"91","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","6.37336","97.28","1","2023-09-11 GMT+0800","00:23:00",,"Buy",,,
"92","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.44566","89.98","0.88","2023-10-26 GMT+0800","00:25:00",,"Buy",,,
"93","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.76262","98.69","0.84","2023-11-29 GMT+0800","00:26:00",,"Buy",,,
"94","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.68571","102.44","0.86","2023-12-26 GMT+0800","00:27:00",,"Buy",,,
"95","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","5.31392","101.62","0.97","2024-01-19 GMT+0800","00:28:00",,"Buy",,,
"96","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.464","107.53","0.86","2024-02-26 GMT+0800","00:30:00",,"Buy",,,
"97","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.32593","108.65","0.84","2024-03-11 GMT+0800","13:03:00","0","Buy",,,
"98","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.65738","107.36","0.9","2024-04-26 GMT+0800","18:13:00","0","Buy",,,
"99","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.18753","109.85","0.82","2024-05-09 GMT+0800","22:50:00","0","Buy",,,
"100","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.08626","112.54","0.82","2024-06-06 GMT+0800","20:50:00","0","Buy",,,
"101","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.90303","106.06","0.93","2024-08-05 GMT+0800","14:05:00","0","Buy",,,
"102","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.017","117","0.84","2024-08-29 GMT+0800","21:50:00","0","Buy",,,
"103","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","3.91134","120.15","0.46","2024-09-26 GMT+0800","00:17:00","0","Buy",,,
"104","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.35803","119.32","0.52","2024-10-28 GMT+0800","19:47:00","0","Buy",,,
"105","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","3.79383","121.25","0.46","2024-11-29 GMT+0800","11:12:00","0","Buy",,,
"106","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","3.84909","119.51","0.46","2024-12-26 GMT+0800","23:02:00","0","Buy",,,
"107","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.65002","120.43","0.56","2025-01-21 GMT+0800","15:08:00","0","Buy",,,
"108","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","3.7634","122.23","0.46","2025-02-06 GMT+0800","15:10:00","0","Buy",,,
"109","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","3.85293","119.39","0.46","2025-03-06 GMT+0800","15:11:00","0","Buy",,,
"110","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.8581","102.92","0.5","2025-04-09 GMT+0800","15:12:00","0","Buy",,,
"111","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.12713","121.15","0.5","2025-05-23 GMT+0800","15:13:00","0","Buy",,,
"112","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","3.98947","125.33","0.5","2025-06-06 GMT+0800","15:14:00","0","Buy",,,
"113","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","4.71553","129.36","0.61","2025-07-03 GMT+0800","15:15:00","0","Buy",,,
"114","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","3.86101","129.5","0.03","2025-08-04 GMT+0800","15:16:00","0","Buy",,,
"115","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","3.63259","134.89","0.01","2025-09-08 GMT+0800","15:17:00","0","Buy",,,
"116","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","0.50312","139.13","0.01","2025-10-03 GMT+0800","18:12:00","0","Dividend Reinvest",,,
"117","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","3.53383","138.66","0.01","2025-10-16 GMT+0800","18:13:00","0","Buy",,,
"118","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","3.40232","141.08","0.01","2025-11-13 GMT+0800","18:14:00","0","Buy",,,
"119","VT","Vanguard Total World Stock Inde",,"PCX","美股VT三人組","USD","3.37743","142.12","0.01","2025-12-15 GMT+0800","17:40:00","0","Buy",,,

"120","USD=CASH",,,,"美股VT三人組","USD",,,,,,,,,,

"121","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD",,,,,,,,,,
"122","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","2.12285","89.5","0.34","2022-12-16 GMT+0800","01:48:00",,"Buy",,,
"123","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","2.08287","91.22","0.34","2023-01-17 GMT+0800","01:50:00",,"Buy",,,
"124","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","2.27003","92.51","0.37","2023-02-16 GMT+0800","01:52:00",,"Buy",,,
"125","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","2.30024","86.95","0.36","2023-03-16 GMT+0800","01:53:00",,"Buy",,,
"126","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","2.14892","93.07","0.36","2023-04-17 GMT+0800","01:54:00",,"Buy",,,
"127","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","2.04729","92.81","0.34","2023-05-16 GMT+0800","01:56:00",,"Buy",,,
"128","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.93188","98.35","0.34","2023-06-16 GMT+0800","01:57:00",,"Buy",,,
"129","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.91239","99.35","0.34","2023-07-24 GMT+0800","01:58:00",,"Buy",,,
"130","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.98812","95.57","0.34","2023-08-23 GMT+0800","01:59:00",,"Buy",,,
"131","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","2.05592","97.28","0.36","2023-09-11 GMT+0800","02:00:00",,"Buy",,,
"132","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","2.11159","89.98","0.34","2023-10-26 GMT+0800","02:02:00",,"Buy",,,
"133","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.92532","98.69","0.34","2023-11-29 GMT+0800","02:03:00",,"Buy",,,
"134","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.85476","102.44","0.34","2023-12-26 GMT+0800","02:04:00",,"Buy",,,
"135","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.86972","101.62","0.34","2024-01-19 GMT+0800","02:05:00",,"Buy",,,
"136","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.88756","105.96","0.36","2024-02-20 GMT+0800","02:06:00",,"Buy",,,
"137","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.82282","109.72","0.36","2024-03-25 GMT+0800","20:48:00",,"Buy",,,
"138","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.73659","109.41","0.34","2024-04-03 GMT+0800","09:53:00",,"Buy",,,
"139","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.72963","109.85","0.34","2024-05-09 GMT+0800","22:48:00",,"Buy",,,
"140","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.68781","112.54","0.34","2024-06-06 GMT+0800","20:52:00",,"Buy",,,
"141","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.88575","106.06","0.36","2024-08-05 GMT+0800","13:56:00",,"Buy",,,
"142","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.53843","117","0.32","2024-08-29 GMT+0800","21:47:00",,"Buy",,,
"143","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.58118","120.15","0.18","2024-09-26 GMT+0800","00:18:00",,"Buy",,,
"144","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.67617","119.32","0.2","2024-10-28 GMT+0800","19:50:00",,"Buy",,,
"145","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.48455","121.25","0.18","2024-11-29 GMT+0800","11:14:00",,"Buy",,,
"146","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","1.58985","119.51","0.19","2024-12-26 GMT+0800","23:04:00",,"Buy",,,
"147","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人組舊","USD","0","119.37","0","2025-01-07 GMT+0800","00:12:00","0","Sell All","FIFO",,

"148","USD=CASH",,,,"舒雅VT雙人組舊","USD",,,,,,,,,,

"149","006208.TW","Fubon Asset Management Co Ltd F",,"TAI","飛台股","TWD",,,,,,,,,,
"150","006208.TW","Fubon Asset Management Co Ltd F",,"TAI","飛台股","TWD","78","86.59","1","2024-03-06 GMT+0800","20:54:00",,"Buy",,,
"151","006208.TW","Fubon Asset Management Co Ltd F",,"TAI","飛台股","TWD","79","88.91","1","2024-04-19 GMT+0800","09:51:00","0","Buy",,,
"152","006208.TW","Fubon Asset Management Co Ltd F",,"TAI","飛台股","TWD","325","94.32","4","2024-05-09 GMT+0800","21:42:00","0","Buy",,,
"153","006208.TW","Fubon Asset Management Co Ltd F",,"TAI","飛台股","TWD","74","101.99","1","2024-06-06 GMT+0800","20:24:00","0","Buy",,,
"154","006208.TW","Fubon Asset Management Co Ltd F",,"TAI","飛台股","TWD","85","109.67","1","2024-07-03 GMT+0800","01:37:00","0","Buy",,,
"155","006208.TW","Fubon Asset Management Co Ltd F",,"TAI","飛台股","TWD","76","95.99","1","2024-08-05 GMT+0800","10:21:00","0","Buy",,,
"156","006208.TW","Fubon Asset Management Co Ltd F",,"TAI","飛台股","TWD","502","0","0","2024-08-09 GMT+0800","15:17:00","0","Dividend","FIFO",,
"157","006208.TW","Fubon Asset Management Co Ltd F",,"TAI","飛台股","TWD","0","107.2","185","2024-08-16 GMT+0800","12:20:00","0","Sell All","FIFO",,

"158","TWD=CASH","TWD",,,"飛台股","TWD",,,,,,,,,,
"159","TWD=CASH","TWD",,,"飛台股","TWD","502","0","0","2024-08-09 GMT+0800","15:17:00",,"Buy",,,"從 006208.TW 來的股利 - Fubon Asset Management Co Ltd F"
"160","TWD=CASH","TWD",,,"飛台股","TWD","76752.87108","0","0","2024-08-16 GMT+0800","12:20:00",,"Buy",,,"賣出 006208.TW - Fubon Asset Management Co Ltd F"
"161","TWD=CASH","TWD",,,"飛台股","TWD","77254.87","0","0","2024-08-17 GMT+0800","21:37:00","0","Sell",,,

"162","0050.TW","Yuanta Securities Inv Trust Co ",,"TAI","寶的台股","TWD",,,,,,,,,,
"163","0050.TW","Yuanta Securities Inv Trust Co ",,"TAI","寶的台股","TWD","48","155.52","1","2024-03-13 GMT+0800","20:14:00","0","Buy",,,
"164","0050.TW","Yuanta Securities Inv Trust Co ",,"TAI","寶的台股","TWD","47","151.91","1","2024-04-23 GMT+0800","23:22:00","0","Buy",,,
"165","0050.TW","Yuanta Securities Inv Trust Co ",,"TAI","寶的台股","TWD","180","160.96","4","2024-05-09 GMT+0800","21:40:00","0","Buy",,,
"166","0050.TW","Yuanta Securities Inv Trust Co ",,"TAI","寶的台股","TWD","46","173.63","1","2024-06-11 GMT+0800","20:22:00","0","Buy",,,
"167","0050.TW","Yuanta Securities Inv Trust Co ",,"TAI","寶的台股","TWD","49","197.18","1","2024-07-15 GMT+0800","20:14:00","0","Buy",,,
"168","0050.TW","Yuanta Securities Inv Trust Co ",,"TAI","寶的台股","TWD","44","162.89","1","2024-08-05 GMT+0800","10:19:00","0","Buy",,,
"169","0050.TW","Yuanta Securities Inv Trust Co ",,"TAI","寶的台股","TWD","370","0","0","2024-08-09 GMT+0800","13:30:00","0","Dividend","FIFO",,
"170","0050.TW","Yuanta Securities Inv Trust Co ",,"TAI","寶的台股","TWD","414","182.8","182","2024-08-17 GMT+0800","13:31:00","0","Sell All","FIFO",,

"171","TWD=CASH","TWD",,,"寶的台股","TWD",,,,,,,,,,

"172","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD",,,,,,,,,,
"173","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.90983","120.43","0.23","2025-01-21 GMT+0800","17:19:00","0","Buy",,,
"174","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.47263","122.23","0.18","2025-02-06 GMT+0800","17:20:00","0","Buy",,,
"175","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.50766","119.39","0.18","2025-03-06 GMT+0800","17:22:00","0","Buy",,,
"176","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.74892","102.92","0.18","2025-04-09 GMT+0800","17:23:00","0","Buy",,,
"177","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.65085","121.15","0.2","2025-05-23 GMT+0800","17:25:00","0","Buy",,,
"178","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.59579","125.33","0.2","2025-06-06 GMT+0800","17:27:00","0","Buy",,,
"179","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.62338","129.36","0.21","2025-07-03 GMT+0800","17:28:00","0","Buy",,,
"180","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.5444","129.5","0.03","2025-08-04 GMT+0800","17:29:00","0","Buy",,,
"181","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.48268","134.89","0.01","2025-09-08 GMT+0800","17:30:00","0","Buy",,,
"182","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.44238","138.66","0.01","2025-10-16 GMT+0800","17:30:00","0","Buy",,,
"183","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.346767","141.08","0.01","2025-11-13 GMT+0800","17:31:00","0","Buy",,,
"184","VT","Vanguard Total World Stock Inde",,"PCX","舒雅VT雙人","USD","1.33689","142.12","0.01","2025-12-15 GMT+0800","05:32:00","0","Buy",,,
\`;
`;

const libFinance = `
import { Transaction, MarketDataMap, ProcessedData, PortfolioSummary, ChartDataPoint, Holding } from '@/types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

// --- Math Helpers ---
const xirr = (transactions: { amount: number; date: string }[], currentValue: number, valuationDate: string) => {
    try {
        const cashFlows = [...transactions];
        cashFlows.push({ amount: currentValue, date: valuationDate });
        
        const t0 = dayjs(cashFlows[0].date).valueOf();
        
        const xnpv = (r: number) => cashFlows.reduce((acc, cf) => {
            const dt = (dayjs(cf.date).valueOf() - t0) / 31536000000;
            return acc + cf.amount / Math.pow(1 + r, dt);
        }, 0);

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

// --- Date Parsing Helper ---
const safeParseDate = (dateStr: string): string | null => {
    if (!dateStr) return null;
    let clean = dateStr.replace(/GMT([+-]\\d{4})?/, '').trim();
    const d = dayjs(clean);
    if (d.isValid()) return d.toISOString();
    return null;
};

// --- Core Parsing ---
export const parseCSV = (csvText: string): Transaction[] => {
    if (!csvText) return [];
    const lines = csvText.trim().split('\\n');
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

            const isoDate = safeParseDate(entry['Transaction Date']);
            
            if (isoDate) {
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
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
    
    if (filteredTx.length === 0) return null;

    const holdingsMap: Record<string, number> = {}; 
    const costBasisMap: Record<string, number> = {}; 
    const currencyMap: Record<string, string> = {};
    let totalInvested = 0; 
    
    const xirrFlows: { amount: number; date: string }[] = []; 
    
    const priceLookup: Record<string, Map<string, number>> = {};
    
    Object.keys(marketData).forEach(sym => { 
        priceLookup[sym] = new Map(marketData[sym].map(d => [d.date, d.price])); 
    });

    const firstTxDate = dayjs(filteredTx[0].date);
    if (!firstTxDate.isValid()) return null;

    let currentDate = firstTxDate.hour(23).minute(59).second(59).millisecond(999);
    const now = dayjs().hour(23).minute(59).second(59).millisecond(999);
    
    const chartData: ChartDataPoint[] = [];
    let txIndex = 0;
    const lastKnownPrices: Record<string, number> = {};

    let loopCount = 0;
    const MAX_LOOPS = 365 * 50; 

    while (currentDate.isBefore(now) || currentDate.isSame(now)) {
        if (loopCount++ > MAX_LOOPS) break;

        const currentDateTs = currentDate.valueOf();
        const dateStr = currentDate.format('YYYY-MM-DD');

        while (txIndex < filteredTx.length && dayjs(filteredTx[txIndex].date).valueOf() <= currentDateTs) {
            const tx = filteredTx[txIndex];
            if (!holdingsMap[tx.symbol]) { 
                holdingsMap[tx.symbol] = 0; 
                costBasisMap[tx.symbol] = 0; 
                currencyMap[tx.symbol] = tx.currency; 
            }
            
            if (tx.price > 0) {
                lastKnownPrices[tx.symbol] = tx.price;
            } else if (Math.abs(tx.amount) > 0 && tx.shares > 0) {
                lastKnownPrices[tx.symbol] = Math.abs(tx.amount) / tx.shares;
            }

            if (tx.type === 'Buy') {
                holdingsMap[tx.symbol] += tx.shares;
                costBasisMap[tx.symbol] += Math.abs(tx.amount);
                totalInvested += Math.abs(tx.amount);
                xirrFlows.push({ amount: tx.amount, date: tx.date });
            } else if (tx.type.includes('Sell') || tx.type === 'Sell All') {
                 if (holdingsMap[tx.symbol] > 0) {
                     const ratio = tx.shares / holdingsMap[tx.symbol];
                     const costRemoved = costBasisMap[tx.symbol] * ratio;
                     costBasisMap[tx.symbol] -= costRemoved;
                     totalInvested -= costRemoved;
                     holdingsMap[tx.symbol] -= tx.shares;
                 }
                 xirrFlows.push({ amount: tx.amount, date: tx.date });
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
                } 
                else {
                    const lookupPrice = priceLookup[sym]?.get(dateStr);
                    if (lookupPrice && lookupPrice > 0) {
                        lastKnownPrices[sym] = lookupPrice;
                    }
                    price = lastKnownPrices[sym] || 0;
                }

                if (price <= 0 && costBasisMap[sym] > 0 && shares > 0) {
                    price = costBasisMap[sym] / shares;
                    lastKnownPrices[sym] = price;
                }

                dailyValue += shares * price;
            }
        });

        if (dailyValue <= 0.001 && totalInvested > 0) {
            const safeValue = totalInvested;
            chartData.push({ 
                date: dateStr, 
                rawDate: currentDateTs, 
                value: safeValue, 
                invested: totalInvested,
                returnAbs: 0,
                returnPct: 0
            });
        } else if (dailyValue > 0 || totalInvested > 0) {
            chartData.push({ 
                date: dateStr, 
                rawDate: currentDateTs,
                value: dailyValue, 
                invested: totalInvested,
                returnAbs: dailyValue - totalInvested,
                returnPct: totalInvested > 0 ? (dailyValue - totalInvested) / totalInvested * 100 : 0
            });
        }
        currentDate = currentDate.add(1, 'day');
    }

    const currentHoldings: Holding[] = [];
    let currentTotalValue = 0;
    
    Object.keys(holdingsMap).forEach(sym => {
        const shares = holdingsMap[sym];
        if (shares > 0.001) {
            let price = priceOverrides[sym] ? priceOverrides[sym] : (lastKnownPrices[sym] || 0);
            
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
        annualizedReturn: xirr(xirrFlows, currentTotalValue, dayjs().toISOString()),
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
`;

const apiRoute = `
import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { MarketDataMap } from '@/types';
import dayjs from 'dayjs';

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
    const period1 = startDate ? dayjs(startDate).toDate() : dayjs('2015-01-01').toDate();
    const marketData: MarketDataMap = {};

    console.log(\`Fetching data for: \${uniqueSymbols.join(', ')}\`);

    await Promise.all(
      uniqueSymbols.map(async (symbol) => {
        try {
          const queryOptions = { period1: period1, interval: '1d' as const };
          const quote = await yahooFinance.historical(symbol as string, queryOptions);
          marketData[symbol as string] = quote.map((q) => {
            const dateStr = dayjs(q.date).format('YYYY-MM-DD');
            return {
              date: dateStr,
              price: q.adjClose || q.close,
            };
          });
        } catch (error) {
          console.error(\`Error fetching \${symbol}:\`, error);
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
`;

const dashboardComponent = `
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Icons, formatValue, formatUSD, formatMoney, formatInt, COLORS, DEFAULT_CSV_DATA } from '@/lib/utils';
import { parseCSV, processPortfolioData } from '@/lib/finance';
import { ProcessedData, MarketDataMap, Transaction } from '@/types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import LZString from 'lz-string';
import dayjs from 'dayjs';

const generateSharedCSV = (txs: Transaction[]) => {
  let csv = "Id,Symbol,Portfolio,Currency,Shares Owned,Cost Per Share,Commission,Transaction Date,Type,Amount\\n";
  txs.forEach(t => {
     csv += \`"\${t.id}","\${t.symbol}","\${t.portfolio}","\${t.currency}","\${t.shares}","\${t.price}","\${t.commission}","\${t.date}","\${t.type}","\${Math.abs(t.amount)}"\\n\`;
  });
  return csv;
};

const MetricCard = ({ title, value, subValue, trend }: any) => {
    const isUp = trend === 'up';
    const isDown = trend === 'down';
    return (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                {(isUp || isDown) && (
                    <div className={\`px-2 py-0.5 rounded text-xs font-bold \${isUp?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}\`}>
                        {isUp?'▲': '▼'}
                    </div>
                )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
            {subValue && <div className={\`mt-2 text-sm flex items-center font-medium \${isUp?'text-red-600':isDown?'text-green-600':'text-gray-600'}\`}>{subValue}</div>}
        </div>
    );
};

const PasteModal = ({ isOpen, onClose, onPaste }: any) => {
    const [text, setText] = useState("");
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-900">貼上 CSV 資料</h3><button onClick={onClose}><Icons.X size={20}/></button></div>
                <div className="p-6 flex-1 overflow-hidden"><textarea className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" value={text} onChange={(e)=>setText(e.target.value)} placeholder="請貼上 Firstrade 的 CSV 內容..." /></div>
                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-100">取消</button><button onClick={()=>{onPaste(text);onClose();setText("")}} disabled={!text.trim()} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">匯入</button></div>
            </div>
        </div>
    );
};

const ShareModal = ({ isOpen, onClose, url }: any) => {
    if (!isOpen) return null;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        alert("連結已複製！");
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-gray-900">分享投資組合</h3><button onClick={onClose}><Icons.X size={20}/></button></div>
                <p className="text-sm text-gray-500 mb-4">此連結將只包含目前選定的投資組合資料。</p>
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg border border-gray-200">
                    <input readOnly value={url} className="bg-transparent flex-1 text-sm outline-none text-gray-600 font-mono" />
                    <button onClick={copyToClipboard} className="p-2 hover:bg-white rounded-md transition-colors text-blue-600"><Icons.Copy size={18}/></button>
                </div>
            </div>
        </div>
    );
};

const PdfTemplate = ({ data, selectedPortfolio, exchangeRate, currencyMode }: any) => {
    if (!data) return null;
    const currentYear = dayjs().year();
    const yearTxs = data.transactions
        .filter((t: any) => dayjs(t.date).year() === currentYear)
        .sort((a: any, b: any) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

    const pages = [];
    for (let i = 0; i < yearTxs.length; i += 15) pages.push(yearTxs.slice(i, i + 15));
    
    const pdfHoldings = [...data.holdings].sort((a:any, b:any) => b.value - a.value);
    const totalValue = data.summary.totalValue;

    const renderPdfPieLabel = (props: any) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, value, index, name, percent } = props;
        const RADIAN = Math.PI / 180;
        const radius = outerRadius * 1.5; 
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const textAnchor = x > cx ? 'start' : 'end';
        return (
            <text x={x} y={y} fill="#374151" textAnchor={textAnchor} dominantBaseline="central" fontSize="11">
                <tspan x={x} dy="-0.5em" fontWeight="bold" fontSize="12">{name}</tspan>
                <tspan x={x} dy="1.1em" fill="#6B7280">{\`\${formatValue(value, currencyMode, exchangeRate, true)}\`}</tspan>
                <tspan x={x} dy="1.1em" fill="#6B7280">{\`(\${(percent * 100).toFixed(0)}%)\`}</tspan>
            </text>
        );
    };

    return (
        <div id="pdf-hidden-zone" className="fixed top-0 left-[-15000px] w-[1280px] -z-50 bg-white">
            {/* Page 1: Dashboard Overview */}
            <div className="pdf-page w-[1280px] min-h-[900px] p-[60px] pb-20 bg-white mb-5 relative box-border">
                <div className="flex justify-between items-end border-b-2 border-blue-600 pb-4 mb-6">
                    <div><h1 className="text-3xl font-extrabold text-gray-900">{selectedPortfolio}</h1><p className="text-gray-500 mt-1">年度投資績效報告 (Dashboard View)</p></div>
                    <div className="text-right"><p className="text-sm text-gray-400">製表日期</p><p className="font-bold">{dayjs().format('YYYY/MM/DD')}</p></div>
                </div>
                
                {/* Metric Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <MetricCard title="目前市值" value={formatValue(data.summary.totalValue, currencyMode, exchangeRate, true)} subValue={formatValue(data.summary.totalValue, currencyMode==='TWD'?'USD':'TWD', exchangeRate, true)} trend={data.summary.returnPcnt>=0?'up':'down'} />
                    <MetricCard title="淨投入本金" value={formatValue(data.summary.totalCost, currencyMode, exchangeRate, true)} subValue={formatValue(data.summary.totalCost, currencyMode==='TWD'?'USD':'TWD', exchangeRate, true)} trend="neutral" />
                    <MetricCard title="總報酬" value={formatValue(data.summary.totalReturn, currencyMode, exchangeRate, true)} subValue={formatValue(data.summary.totalReturn, currencyMode==='TWD'?'USD':'TWD', exchangeRate, true)} trend={data.summary.totalReturn>=0?'up':'down'} />
                    <MetricCard title="XIRR" value={\`\${data.summary.annualizedReturn.toFixed(2)}%\`} subValue="年化資金效率" trend={data.summary.annualizedReturn>0?'up':'down'} />
                </div>

                {/* Risk Metrics - Added to PDF */}
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-blue-900 font-bold flex items-center gap-2"><Icons.Activity size={20} /> 進階風險指標 (Risk Metrics)</h3>
                        <div className="flex items-center gap-2 text-blue-700 text-xs font-mono bg-blue-100 px-2 py-1 rounded"><span>匯率基準: {exchangeRate}</span></div>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                        <div><span className="text-blue-600 text-xs font-bold uppercase block mb-1">最大回撤</span><span className="text-2xl font-bold text-gray-900">-{data.summary.maxDrawdown.toFixed(2)}%</span></div>
                        <div><span className="text-blue-600 text-xs font-bold uppercase block mb-1">夏普比率</span><span className="text-2xl font-bold text-gray-900">{data.summary.sharpeRatio.toFixed(2)}</span></div>
                        <div><span className="text-blue-600 text-xs font-bold uppercase block mb-1">波動率</span><span className="text-2xl font-bold text-gray-900">{data.summary.volatility.toFixed(2)}%</span></div>
                        <div><span className="text-blue-600 text-xs font-bold uppercase block mb-1">獲利勝率</span><span className="text-2xl font-bold text-gray-900">{data.summary.winRate.toFixed(1)}%</span></div>
                    </div>
                </div>

                {/* Charts */}
                <div className="flex gap-4 h-[300px]">
                    <div className="flex-1 border rounded-lg p-4">
                        <h3 className="font-bold mb-4 text-gray-700">資產成長趨勢 ({currencyMode})</h3>
                        <div style={{width:'750px', height:'240px'}}>
                            <AreaChart width={750} height={240} data={data.chartData}>
                                <XAxis dataKey="date" hide/><YAxis hide domain={['auto','auto']}/>
                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <Legend />
                                <Area type="monotone" dataKey="value" name="資產市值" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" isAnimationActive={false} />
                                <Area type="monotone" dataKey="invested" name="淨成本" stroke="#10b981" strokeDasharray="5 5" fillOpacity={0} isAnimationActive={false} />
                            </AreaChart>
                        </div>
                    </div>
                    <div className="w-1/3 border rounded-lg p-4">
                        <h3 className="font-bold mb-4 text-gray-700">資產配置</h3>
                        <div style={{width:'350px', height:'240px'}}>
                            <PieChart width={350} height={240}>
                                <Pie 
                                    data={pdfHoldings.map((h, i) => ({ name: h.symbol, value: h.value, percent: totalValue>0?h.value/totalValue:0, color: COLORS[i % COLORS.length] }))} 
                                    dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} 
                                    isAnimationActive={false} 
                                    label={renderPdfPieLabel}
                                >
                                    {pdfHoldings.map((e,i)=><Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                                </Pie>
                            </PieChart>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Page 2: Holdings */}
            <div className="pdf-page w-[1280px] min-h-[900px] p-[60px] pb-20 bg-white mb-5 relative box-border">
                 <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-800">個別資產明細 (Holdings)</h2></div>
                 <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left whitespace-nowrap"><thead className="bg-gray-50 font-bold text-gray-600"><tr><th className="p-3">代號</th><th className="p-3 text-right">股數</th><th className="p-3 text-right">現價(原幣)</th><th className="p-3 text-right">總市值(TWD)</th><th className="p-3 text-right">總市值(USD)</th><th className="p-3 text-right">報酬率</th></tr></thead><tbody>{pdfHoldings.map((h, i) => (<tr key={i} className="border-t border-gray-100"><td className="p-3 font-bold">{h.symbol}</td><td className="p-3 text-right">{h.shares.toFixed(2)}</td><td className="p-3 text-right">{h.currency==='TWD'?'NT$':'$'}{h.currentPrice.toFixed(2)}</td><td className="p-3 text-right">{formatValue(h.value, 'TWD', exchangeRate)}</td><td className="p-3 text-right text-gray-500">{formatValue(h.value, 'USD', exchangeRate)}</td><td className={\`p-3 text-right font-bold \${h.returnPcnt>=0?'text-red-600':'text-green-600'}\`}>{h.returnPcnt.toFixed(2)}%</td></tr>))}</tbody></table>
                </div>
            </div>

            {/* Page 3+: Transactions (Current Year Only) */}
            {pages.length > 0 ? pages.map((chunk, idx) => (
                <div key={idx} className="pdf-page w-[1280px] min-h-[900px] p-[60px] pb-20 bg-white mb-5 relative box-border">
                    <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-800">{currentYear} 年度交易紀錄</h2><span className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-600">頁 {idx + 3}</span></div>
                    <table className="w-full text-sm text-left border rounded-lg overflow-hidden whitespace-nowrap"><thead className="bg-gray-50 font-bold text-gray-600"><tr><th className="p-4 border-b">日期</th><th className="p-4 border-b">類型</th><th className="p-4 border-b">標的</th><th className="p-4 border-b text-right">股數</th><th className="p-4 border-b text-right">單價</th><th className="p-4 border-b text-right">總額(USD)</th><th className="p-4 border-b text-right">總額(TWD)</th></tr></thead><tbody>{chunk.map((t: any, ti: number) => (<tr key={ti} className="border-b last:border-0 hover:bg-gray-50"><td className="p-4 text-gray-600">{t.date.split('T')[0]}</td><td className="p-4"><span className={\`px-2 py-1 rounded text-xs font-bold \${t.type==='Buy'?'bg-red-100 text-red-700':t.type.includes('Sell')?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'}\`}>{t.type}</span></td><td className="p-4 font-bold">{t.symbol}</td><td className="p-4 text-right font-mono">{parseFloat(t.shares).toFixed(2)}</td><td className="p-4 text-right font-mono">{t.currency === 'TWD' ? 'NT$' : '$'}{parseFloat(t.price).toFixed(2)}</td><td className="p-4 text-right font-mono font-bold">{t.currency === 'USD' ? '$' : ''}{t.amount ? Math.abs(t.amount).toLocaleString(undefined, {minimumFractionDigits:2}) : '-'}</td><td className="p-4 text-right font-mono font-bold text-gray-500">{t.amount ? formatValue(Math.abs(t.amount), 'TWD', exchangeRate) : '-'}</td></tr>))}</tbody></table>
                </div>
            )) : <div className="pdf-page w-[1280px] min-h-[900px] p-[60px] bg-white flex items-center justify-center border-2 border-dashed"><p className="text-gray-400 text-xl">本年度尚無交易紀錄</p></div>}
        </div>
    );
};

const EmptyState = ({ onImport, onPaste, onLoadDemo }: any) => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center border border-gray-100">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><Icons.Briefcase size={40} className="text-blue-600"/></div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">投資組合儀表板</h1>
            <div className="space-y-4">
                <button onClick={onImport} className="w-full flex items-center justify-center gap-3 px-6 py-4 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg transition-all"><Icons.Upload size={20}/>匯入 CSV 檔案</button>
                <button onClick={onPaste} className="w-full flex items-center justify-center gap-3 px-6 py-4 font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all"><Icons.Clipboard size={20}/>貼上 CSV 文字</button>
                <div className="relative py-2"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400">或是</span></div></div>
                <button onClick={onLoadDemo} className="text-sm text-gray-500 hover:text-blue-600 font-medium">載入範例資料體驗看看</button>
            </div>
        </div>
    </div>
);

export default function Dashboard() {
    const [rawData, setRawData] = useState<string | null>(null);
    const [selectedPortfolio, setSelectedPortfolio] = useState("");
    const [marketData, setMarketData] = useState<MarketDataMap>({});
    const [isLoading, setIsLoading] = useState(false);
    const [timeRange, setTimeRange] = useState("ALL");
    const [chartMode, setChartMode] = useState("value");
    const [currencyMode, setCurrencyMode] = useState("TWD");
    const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [exchangeRate, setExchangeRate] = useState(32.0); // Will be updated by API
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
    const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'value', direction: 'desc' });
    
    // Sharing State
    const [isSharedMode, setIsSharedMode] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    const [showShareModal, setShowShareModal] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const transactions = useMemo(() => parseCSV(rawData || ''), [rawData]);
    const portfolios = useMemo(() => Array.from(new Set(transactions.map(t => t.portfolio))), [transactions]);

    // Init from URL Params (State as URL)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const compressedData = params.get('data');
        const portfolioParam = params.get('portfolio');

        if (compressedData && portfolioParam) {
            try {
                // Decompress data
                const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
                if (decompressed) {
                    setRawData(decompressed);
                    setSelectedPortfolio(decodeURIComponent(portfolioParam));
                    setIsSharedMode(true);
                }
            } catch (e) {
                console.error("Failed to decompress shared data", e);
                alert("無法讀取分享的資料，連結可能已損壞。");
            }
        }
    }, []);

    // Default portfolio selection (only if not shared mode)
    useEffect(() => {
        if (!isSharedMode && portfolios.length > 0 && !selectedPortfolio) setSelectedPortfolio(portfolios[0]);
    }, [portfolios, selectedPortfolio, isSharedMode]);

    // Data Fetching Logic (Same as before)
    useEffect(() => {
        const fetchData = async () => {
            if (transactions.length === 0) return;
            const symbols = Array.from(new Set(transactions.map(t => t.symbol)));
            if(symbols.length === 0) return;

            setIsLoading(true);
            try {
                const minDateStr = transactions.reduce((min, t) => t.date < min ? t.date : min, transactions[0].date);
                const earliestDate = dayjs(minDateStr).subtract(7, 'day').toISOString();

                const res = await fetch('/api/market-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ symbols, startDate: earliestDate })
                });
                if (!res.ok) throw new Error('API Failed');
                const json = await res.json();
                setMarketData(json.marketData);
                if (json.exchangeRate) setExchangeRate(json.exchangeRate);
            } catch (err) {
                console.error("Fetch error", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [transactions]);

    const data = useMemo(() => {
        if (Object.keys(marketData).length === 0 || !selectedPortfolio) return null;
        return processPortfolioData(transactions, marketData, selectedPortfolio, priceOverrides);
    }, [marketData, selectedPortfolio, transactions, priceOverrides]);

    // Handle Share Logic (State as URL)
    const handleShare = () => {
        if (!data || !selectedPortfolio) return;
        
        // Filter ONLY current portfolio transactions to protect privacy
        const portfolioTxs = transactions.filter(t => t.portfolio === selectedPortfolio);
        const csvContent = generateSharedCSV(portfolioTxs);
        
        try {
            // Compress CSV
            const compressed = LZString.compressToEncodedURIComponent(csvContent);
            const baseUrl = window.location.origin + window.location.pathname;
            // Construct URL
            const url = \`\${baseUrl}?data=\${compressed}&portfolio=\${encodeURIComponent(selectedPortfolio)}\`;
            
            // Check length warning (approx 2000 chars is safe limit for some old browsers/proxies, but modern ones handle more)
            if (url.length > 8000) {
                alert("警告：資料量過大，生成的連結可能會被某些瀏覽器截斷。");
            }

            setShareUrl(url);
            setShowShareModal(true);
        } catch (e: any) {
            alert("分享失敗: " + e.message);
        }
    };

    const handleReset = () => {
        // Clear URL params and reload
        window.location.href = window.location.pathname;
    };

    // ... (Keep existing chart data logic: filteredChartData, sortedHoldings) ...
    const filteredChartData = useMemo(() => {
        if (!data || !data.chartData) return [];
        const now = dayjs();
        const points = data.chartData;
        let cutoffDate = dayjs(0); // Default epoch
        
        if (timeRange === 'YTD') cutoffDate = now.startOf('year');
        else if (timeRange === '1Y') cutoffDate = now.subtract(1, 'year');
        else if (timeRange === '3Y') cutoffDate = now.subtract(3, 'year');
        else if (timeRange === '5Y') cutoffDate = now.subtract(5, 'year');
        else if (timeRange === '10Y') cutoffDate = now.subtract(10, 'year');
        
        const filtered = timeRange === 'ALL' ? points : points.filter(p => dayjs(p.rawDate).isAfter(cutoffDate));
        const rate = currencyMode === 'TWD' ? exchangeRate : 1;
        
        return filtered.map(p => ({ ...p, value: p.value * rate, invested: p.invested * rate, returnAbs: p.returnAbs * rate }));
    }, [data, timeRange, currencyMode, exchangeRate]);

    const sortedHoldings = useMemo(() => {
        if (!data || !data.holdings) return [];
        const sorted = [...data.holdings];
        sorted.sort((a: any, b: any) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [data, sortConfig]);

    const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if(f) {
            const r = new FileReader();
            r.onload = ev => setRawData(ev.target?.result as string);
            r.readAsText(f);
        }
    };

    const requestSort = (key: string) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') direction = 'asc';
        setSortConfig({ key, direction });
    };

    const handleDownloadPDF = async () => { /* ... existing logic ... */ 
        if (isGeneratingPdf) return;
        setIsGeneratingPdf(true);
        await new Promise(r => setTimeout(r, 1000));
        try {
            const doc = new jsPDF('l', 'pt', 'a4');
            const container = document.getElementById('pdf-hidden-zone');
            const pages = container?.querySelectorAll('.pdf-page');
            if (pages && pages.length > 0) {
                for (let i = 0; i < pages.length; i++) {
                    if (i > 0) doc.addPage();
                    const canvas = await html2canvas(pages[i] as HTMLElement, { scale: 2, logging: false, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' });
                    const imgData = canvas.toDataURL('image/jpeg', 1.0);
                    const pdfWidth = doc.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                }
                doc.save(\`\${selectedPortfolio}_Report.pdf\`);
            }
        } catch (e: any) { alert('PDF Error: ' + e.message); } finally { setIsGeneratingPdf(false); }
    };

    const savePriceEdit = (symbol: string) => { /* ... existing logic ... */ 
        if (editValue && !isNaN(parseFloat(editValue))) setPriceOverrides(prev => ({ ...prev, [symbol]: parseFloat(editValue) }));
        setEditingSymbol(null); setEditValue("");
    };

    const loadDemoData = () => {
        setRawData(DEFAULT_CSV_DATA); 
        setSelectedPortfolio("Firstrade 帳戶");
    };

    // Render Logic
    if (!rawData) return ( <> <PasteModal isOpen={isPasteModalOpen} onClose={() => setIsPasteModalOpen(false)} onPaste={setRawData} /> <input type="file" ref={fileInputRef} onChange={handleFileLoad} accept=".csv" className="hidden" /> <EmptyState onImport={() => fileInputRef.current?.click()} onPaste={() => setIsPasteModalOpen(true)} onLoadDemo={loadDemoData} /> </> );
    
    if (isLoading || !data) return ( <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50"> <div className="animate-spin text-blue-600 mb-4"><Icons.Loader2 size={40} /></div> <p className="text-slate-600 font-medium">{isSharedMode ? "正在載入分享的投資組合..." : "正在分析資料..."}</p> </div> );

    const totalValue = data.summary.totalValue;
    const pieData = sortedHoldings.map((h, i) => ({ name: h.symbol, value: h.value, percent: totalValue > 0 ? h.value / totalValue : 0, color: COLORS[i % COLORS.length] }));
    const currentTxs = [...data.transactions].slice((currentPage-1)*10, currentPage*10);

    const renderCustomPieLabel = (props: any) => { /* ... existing logic ... */ 
        const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name } = props;
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + (outerRadius + 30) * Math.cos(-midAngle * RADIAN);
        const y = cy + (outerRadius + 30) * Math.sin(-midAngle * RADIAN);
        return <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12">{\`\${name} \${(percent * 100).toFixed(0)}%\`}</text>;
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12 font-sans">
            <PasteModal isOpen={isPasteModalOpen} onClose={() => setIsPasteModalOpen(false)} onPaste={setRawData} />
            <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} url={shareUrl} />
            <input type="file" ref={fileInputRef} onChange={handleFileLoad} accept=".csv" className="hidden" />
            
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 h-16 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => !isSharedMode && setRawData(null)}>
                    <div className="bg-blue-600 p-1.5 rounded-lg"><Icons.Briefcase size={20} className="text-white" /></div>
                    <span className="font-bold text-xl tracking-tight text-gray-900">Portfolio<span className="text-blue-600">Viz</span></span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                        <button onClick={() => setCurrencyMode('TWD')} className={\`px-3 py-1 text-xs font-bold rounded-md transition-all \${currencyMode==='TWD' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}\`}>TWD</button>
                        <button onClick={() => setCurrencyMode('USD')} className={\`px-3 py-1 text-xs font-bold rounded-md transition-all \${currencyMode==='USD' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}\`}>USD</button>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 group focus-within:ring-2 ring-blue-500 ring-offset-1 transition-all">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">USD/TWD</span>
                        <div className="flex items-center gap-1">
                            <input type="number" value={exchangeRate} onChange={(e) => setExchangeRate(parseFloat(e.target.value))} className="w-16 bg-transparent text-sm font-mono font-bold text-blue-600 focus:outline-none text-right" />
                            <div className="text-gray-400 hover:text-blue-500 cursor-pointer" onClick={() => {}}><Icons.RefreshCw size={14} /></div>
                        </div>
                    </div>
                    
                    {!isSharedMode && (
                        <>
                            <button onClick={() => setIsPasteModalOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hidden sm:flex"><Icons.Clipboard size={16} /><span>貼上</span></button>
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hidden sm:flex"><Icons.Upload size={16} /><span>匯入</span></button>
                        </>
                    )}
                    
                    {!isSharedMode && (
                        <button onClick={handleShare} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors">
                            <Icons.Share2 size={16} /><span>分享</span>
                        </button>
                    )}

                    {isSharedMode && (
                        <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 shadow-sm transition-colors">
                            <Icons.Home size={16} /><span>回首頁</span>
                        </button>
                    )}

                    <button onClick={handleDownloadPDF} disabled={isGeneratingPdf} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-[110px] justify-center transition-all active:scale-95">
                        {isGeneratingPdf ? <Icons.Loader2 size={16} className="animate-spin"/> : <Icons.Download size={16} />}
                        <span>{isGeneratingPdf ? "生成中..." : "下載 PDF"}</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            {isSharedMode ? (
                                <h1 className="text-3xl font-extrabold text-gray-900">{selectedPortfolio} <span className="text-sm font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded ml-2 align-middle">分享檢視</span></h1>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-extrabold text-gray-900">{selectedPortfolio}</h1>
                                    <div className="relative group">
                                        <select value={selectedPortfolio} onChange={(e) => setSelectedPortfolio(e.target.value)} className="appearance-none bg-gray-100 text-sm font-bold text-gray-700 px-4 py-2 pr-8 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-200 transition-colors">
                                            {portfolios.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"><Icons.ChevronDown size={16} /></div>
                                    </div>
                                </>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm">投資組合深度分析報告 • 結算日 {dayjs().format('YYYY/MM/DD')}</p>
                    </div>
                </div>

                {/* ... (Rest of the Dashboard: KPI Cards, Charts, Tables - Same as existing code) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="目前市值" value={formatValue(data.summary.totalValue, currencyMode, exchangeRate, true)} trend={data.summary.returnPcnt >= 0 ? 'up' : 'down'} subValue={formatValue(data.summary.totalValue, currencyMode==='TWD'?'USD':'TWD', exchangeRate, true)} />
                    <MetricCard title="淨投入本金" value={formatValue(data.summary.totalCost, currencyMode, exchangeRate, true)} trend="neutral" subValue={formatValue(data.summary.totalCost, currencyMode==='TWD'?'USD':'TWD', exchangeRate, true)} />
                    <MetricCard title="總報酬" value={formatValue(data.summary.totalReturn, currencyMode, exchangeRate, true)} trend={data.summary.totalReturn >= 0 ? 'up' : 'down'} subValue={\`\${data.summary.returnPcnt > 0 ? '+' : ''}\${data.summary.returnPcnt.toFixed(2)}%\`} />
                    <MetricCard title="內部報酬率 (XIRR)" value={\`\${data.summary.annualizedReturn.toFixed(2)}%\`} trend={data.summary.annualizedReturn > 0 ? 'up' : 'down'} subValue="年化資金效率" />
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-blue-900 font-bold flex items-center gap-2"><Icons.Activity size={20} /> 進階風險指標 (Risk Metrics)</h3>
                        <div className="flex items-center gap-2 text-blue-700 text-xs font-mono bg-blue-100 px-2 py-1 rounded"><span>匯率基準: {exchangeRate}</span></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div><span className="text-blue-600 text-xs font-bold uppercase block mb-1">最大回撤 (Max Drawdown)</span><span className="text-2xl font-bold text-gray-900">-{data.summary.maxDrawdown.toFixed(2)}%</span></div>
                        <div><span className="text-blue-600 text-xs font-bold uppercase block mb-1">夏普比率 (Sharpe Ratio)</span><span className="text-2xl font-bold text-gray-900">{data.summary.sharpeRatio.toFixed(2)}</span></div>
                        <div><span className="text-blue-600 text-xs font-bold uppercase block mb-1">波動率 (Volatility)</span><span className="text-2xl font-bold text-gray-900">{data.summary.volatility.toFixed(2)}%</span></div>
                        <div><span className="text-blue-600 text-xs font-bold uppercase block mb-1">獲利勝率 (Win Rate)</span><span className="text-2xl font-bold text-gray-900">{data.summary.winRate.toFixed(1)}%</span></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Icons.TrendingUp size={20} className="text-blue-600"/> 資產成長趨勢 ({currencyMode})</h3>
                                <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium">
                                    <button onClick={() => setChartMode('value')} className={\`px-2 py-1 rounded \${chartMode==='value' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}\`}>市值</button>
                                    <button onClick={() => setChartMode('profit')} className={\`px-2 py-1 rounded \${chartMode==='profit' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}\`}>總損益</button>
                                    <button onClick={() => setChartMode('percent')} className={\`px-2 py-1 rounded \${chartMode==='percent' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}\`}>損益 %</button>
                                </div>
                            </div>
                            <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
                                {['YTD', '1Y', '3Y', '5Y', '10Y', 'ALL'].map(range => (
                                    <button key={range} onClick={() => setTimeRange(range)} className={\`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap \${timeRange === range ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}\`}>{range === 'YTD' ? '今年' : range === 'ALL' ? '全部' : range.replace('Y', '年')}</button>
                                ))}
                            </div>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartMode === 'value' ? (
                                    <AreaChart data={filteredChartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" minTickGap={50} tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={v => \`\${v/1000}k\`} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(val) => [formatValue(val, currencyMode, 1, true), '']} />
                                        <Legend iconType="circle" />
                                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={0.1} fill="#3b82f6" name="資產市值" />
                                        <Area type="monotone" dataKey="invested" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} name="淨成本" />
                                    </AreaChart>
                                ) : chartMode === 'profit' ? (
                                    <AreaChart data={filteredChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" minTickGap={50} tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={v => \`\${v/1000}k\`} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(val) => [formatValue(val, currencyMode, 1, true), '']} />
                                        <Legend iconType="circle" />
                                        <Area type="monotone" dataKey="returnAbs" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} name="總損益金額" />
                                    </AreaChart>
                                ) : (
                                    <LineChart data={filteredChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" minTickGap={50} tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={v => \`\${v}%\`} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(val) => [\`\${val.toFixed(2)}%\`, '']} />
                                        <Legend iconType="circle" />
                                        <Line type="monotone" dataKey="returnPct" stroke="#f59e0b" strokeWidth={2} dot={false} name="損益幅度 %" />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Icons.PieChart size={20} className="text-indigo-600"/> 資產配置</h3>
                        <div className="flex-1 min-h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={pieData} 
                                        dataKey="value" 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        paddingAngle={5}
                                        label={renderCustomPieLabel}
                                    >
                                        {pieData.map((entry, index) => <Cell key={\`cell-\${index}\`} fill={entry.color} stroke="none" />)}
                                    </Pie>
                                    <Tooltip formatter={(val, name, props) => [\`\${formatValue(val, currencyMode, exchangeRate, true)} (\${(props.payload.percent * 100).toFixed(1)}%)\`, name]} contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                        <Icons.Layers size={20} className="text-purple-600" />
                        <h3 className="font-bold text-gray-900">個別資產明細</h3>
                        <p className="text-xs text-gray-500 ml-auto flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><span>提示: 點擊</span><Icons.Edit2 size={12}/><span>可手動修正現價</span></p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={()=>requestSort('symbol')}>代號</th>
                                    <th className="px-6 py-3 text-right cursor-pointer hover:bg-gray-100 transition-colors" onClick={()=>requestSort('shares')}>股數</th>
                                    <th className="px-6 py-3 text-right cursor-pointer hover:bg-gray-100 transition-colors" onClick={()=>requestSort('avgCost')}>均價 (原幣)</th>
                                    <th className="px-6 py-3 text-right cursor-pointer hover:bg-gray-100 transition-colors" onClick={()=>requestSort('currentPrice')}>現價 (原幣) {sortConfig.key === 'currentPrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th className="px-6 py-3 text-right cursor-pointer hover:bg-gray-100 transition-colors" onClick={()=>requestSort('value')}>總市值 (TWD) {sortConfig.key === 'value' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
                                    <th className="px-6 py-3 text-right cursor-pointer hover:bg-gray-100 transition-colors" onClick={()=>requestSort('value')}>總市值 (USD)</th>
                                    <th className="px-6 py-3 text-right cursor-pointer hover:bg-gray-100 transition-colors" onClick={()=>requestSort('returnPcnt')}>報酬率</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedHoldings.map((h: any) => (
                                    <tr key={h.symbol} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{h.symbol}</td>
                                        <td className="px-6 py-4 text-right font-mono">{h.shares.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right font-mono text-gray-600">{h.currency==='TWD'?'NT$':'$'}{h.avgCost.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-right font-mono">
                                            {editingSymbol === h.symbol ? (
                                                <div className="flex items-center justify-end gap-1">
                                                    <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-20 px-2 py-1 border border-blue-400 rounded text-right focus:ring-2 ring-blue-200 outline-none" autoFocus onKeyDown={(e) => e.key === 'Enter' && savePriceEdit(h.symbol)} />
                                                    <button onClick={() => savePriceEdit(h.symbol)} className="text-green-600 hover:text-green-700 bg-green-50 p-1 rounded"><Icons.Check size={14}/></button>
                                                    <button onClick={() => setEditingSymbol(null)} className="text-red-500 hover:text-red-600 bg-red-50 p-1 rounded"><Icons.X size={14}/></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2 group">
                                                    <span className={h.isOverridden ? "text-blue-600 font-bold" : "text-blue-600 font-medium"}>{h.currency==='TWD'?'NT$':'$'}{h.currentPrice.toFixed(2)}</span>
                                                    <button onClick={() => { setEditingSymbol(h.symbol); setEditValue(h.currentPrice.toString()); }} className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Edit2 size={14} /></button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right"><div className="font-bold text-gray-900 font-mono">{formatValue(h.value, 'TWD', exchangeRate)}</div></td>
                                        <td className="px-6 py-4 text-right text-gray-500 font-mono">{formatValue(h.value, 'USD', exchangeRate)}</td>
                                        <td className="px-6 py-4 text-right font-mono"><span className={\`px-2 py-1 rounded text-xs font-bold \${h.returnPcnt >= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}\`}>{h.returnPcnt > 0 ? '+' : ''}{h.returnPcnt.toFixed(2)}%</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Icons.Calendar size={20} className="text-orange-500" /> 交易紀錄 <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">共 {data.transactions.length} 筆</span></h3>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"><Icons.ChevronLeft size={16} /></button>
                            <span className="text-sm text-gray-600">頁 {currentPage} / {Math.ceil(data.transactions.length / 10)}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(Math.ceil(data.transactions.length / 10), p + 1))} disabled={currentPage === Math.ceil(data.transactions.length / 10)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"><Icons.ChevronRight size={16} /></button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-3">日期</th>
                                    <th className="px-6 py-3">代號</th>
                                    <th className="px-6 py-3">類型</th>
                                    <th className="px-6 py-3 text-right">股數</th>
                                    <th className="px-6 py-3 text-right">單價</th>
                                    <th className="px-6 py-3 text-right">總額 (USD)</th>
                                    <th className="px-6 py-3 text-right">總額 (TWD)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentTxs.map((tx: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-gray-600">{tx.date.split('T')[0]}</td>
                                        <td className="px-6 py-3 font-bold">{tx.symbol}</td>
                                        <td className="px-6 py-3"><span className={\`px-2 py-1 rounded text-xs font-bold \${tx.type === 'Buy' ? 'bg-red-100 text-red-700' : tx.type.includes('Sell') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}\`}>{tx.type === 'Buy' ? '買入' : tx.type === 'Sell' ? '賣出' : tx.type === 'Dividend Reinvest' ? '股息再投' : tx.type}</span></td>
                                        <td className="px-6 py-3 text-right font-mono">{tx.shares.toFixed(2)}</td>
                                        <td className="px-6 py-3 text-right font-mono text-gray-600">\${tx.price.toFixed(2)}</td>
                                        <td className="px-6 py-3 text-right font-mono font-bold text-gray-900">\${Math.abs(tx.amount).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                                        <td className="px-6 py-3 text-right font-mono font-bold text-gray-500">{formatValue(Math.abs(tx.amount), 'TWD', exchangeRate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            
            {isGeneratingPdf && <PdfTemplate data={data} selectedPortfolio={selectedPortfolio} exchangeRate={exchangeRate} currencyMode={currencyMode} />}
        </div>
    );
}
`;

const pageTsx = `
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return <Dashboard />;
}
`;

const layoutTsx = `
import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_TC } from 'next/font/google';

const notoSansTC = Noto_Sans_TC({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans',
});

export const metadata: Metadata = {
  title: 'PortfolioViz Pro',
  description: 'Advanced Portfolio Visualization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={notoSansTC.className}>{children}</body>
    </html>
  );
}
`;

const postcssConfig = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

// --- Write Files ---

writeFile('package.json', packageJson);
writeFile('tsconfig.json', tsconfig);
writeFile('next.config.mjs', nextConfig);
writeFile('tailwind.config.ts', tailwindConfig);
writeFile('postcss.config.js', postcssConfig);
writeFile('app/globals.css', globalsCss);
writeFile('.gitignore', gitignore);
writeFile('types/index.ts', typesIndex);
writeFile('lib/utils.tsx', libUtils);
writeFile('lib/finance.ts', libFinance);
writeFile('app/api/market-data/route.ts', apiRoute);
writeFile('components/Dashboard.tsx', dashboardComponent);
writeFile('app/page.tsx', pageTsx);
writeFile('app/layout.tsx', layoutTsx);

console.log('Project setup complete! Run "npm install" and then "npm run dev".');