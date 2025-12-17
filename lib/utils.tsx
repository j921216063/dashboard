import React from 'react';

// --- Icons ---
const SvgIcon = ({ path, className = "", size = 20, ...props }: any) => (
  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    {path}
  </svg>
);

export const Icons = {
  Loader2: (p: any) => <SvgIcon path={<path d="M21 12a9 9 0 1 1-6.219-8.56"/>} className="animate-spin" {...p} />,
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