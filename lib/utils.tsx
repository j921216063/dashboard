import React from 'react';

// --- SVG Icons ---
const SvgIcon = ({ path, className = "", size = 20, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    {path}
  </svg>
);

export const Icons = {
  Loader2: (p: any) => <SvgIcon path={<path d="M21 12a9 9 0 1 1-6.219-8.56"/>} className={`animate-spin ${p.className || ''}`} {...p} />,
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
      return `${symbol}${Math.floor(convertedVal).toLocaleString()}`;
  }
   
  return `${symbol}${convertedVal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
};

export const formatUSD = (v: number) => `$${v.toLocaleString(undefined, {minimumFractionDigits:2})}`;
export const formatMoney = (v: number, isTWD: boolean = false) => `${isTWD?'NT$':'$'}${v.toLocaleString(undefined, {minimumFractionDigits:2})}`;
export const formatInt = (v: number, isTWD: boolean = false) => `${isTWD?'NT$':'$'}${Math.floor(v).toLocaleString()}`;

export const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#64748b', '#06b6d4'];

export const DEFAULT_CSV_DATA = `Id,Symbol,Name,Display Symbol,Exchange,Portfolio,Currency,Shares Owned,Cost Per Share,Commission,Transaction Date,Transaction Time,Purchase Exchange Rate,Type,Accounting,Accounting Execution Ids,Notes

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
`;