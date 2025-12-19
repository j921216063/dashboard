'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Icons, formatValue, formatUSD, formatMoney, formatInt, COLORS, DEFAULT_CSV_DATA } from '@/lib/utils';
import { parseCSV, processPortfolioData } from '@/lib/finance';
import { ProcessedData, MarketDataMap, Transaction } from '@/types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import LZString from 'lz-string';

const generateSharedCSV = (txs: Transaction[]) => {
  let csv = "Id,Symbol,Portfolio,Currency,Shares Owned,Cost Per Share,Commission,Transaction Date,Type,Amount\n";
  txs.forEach(t => {
     csv += `"${t.id}","${t.symbol}","${t.portfolio}","${t.currency}","${t.shares}","${t.price}","${t.commission}","${t.date}","${t.type}","${Math.abs(t.amount)}"\n`;
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
                    <div className={`px-2 py-0.5 rounded text-xs font-bold ${isUp?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>
                        {isUp?'▲': '▼'}
                    </div>
                )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
            {subValue && <div className={`mt-2 text-sm flex items-center font-medium ${isUp?'text-red-600':isDown?'text-green-600':'text-gray-600'}`}>{subValue}</div>}
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
    const currentYear = new Date().getFullYear();
    const yearTxs = data.transactions
        .filter((t: any) => new Date(t.date).getFullYear() === currentYear)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
                <tspan x={x} dy="1.1em" fill="#6B7280">{`${formatValue(value, currencyMode, exchangeRate, true)}`}</tspan>
                <tspan x={x} dy="1.1em" fill="#6B7280">{`(${(percent * 100).toFixed(0)}%)`}</tspan>
            </text>
        );
    };

    return (
        <div id="pdf-hidden-zone" className="fixed top-0 left-[-15000px] w-[1280px] -z-50 bg-white">
            {/* Page 1: Dashboard Overview */}
            <div className="pdf-page w-[1280px] min-h-[900px] p-[60px] pb-20 bg-white mb-5 relative box-border">
                <div className="flex justify-between items-end border-b-2 border-blue-600 pb-4 mb-6">
                    <div><h1 className="text-3xl font-extrabold text-gray-900">{selectedPortfolio}</h1><p className="text-gray-500 mt-1">年度投資績效報告 (Dashboard View)</p></div>
                    <div className="text-right"><p className="text-sm text-gray-400">製表日期</p><p className="font-bold">{new Date().toLocaleDateString()}</p></div>
                </div>
                
                {/* Metric Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <MetricCard title="目前市值" value={formatValue(data.summary.totalValue, currencyMode, exchangeRate, true)} subValue={formatValue(data.summary.totalValue, currencyMode==='TWD'?'USD':'TWD', exchangeRate, true)} trend={data.summary.returnPcnt>=0?'up':'down'} />
                    <MetricCard title="淨投入本金" value={formatValue(data.summary.totalCost, currencyMode, exchangeRate, true)} subValue={formatValue(data.summary.totalCost, currencyMode==='TWD'?'USD':'TWD', exchangeRate, true)} trend="neutral" />
                    <MetricCard title="總報酬" value={formatValue(data.summary.totalReturn, currencyMode, exchangeRate, true)} subValue={formatValue(data.summary.totalReturn, currencyMode==='TWD'?'USD':'TWD', exchangeRate, true)} trend={data.summary.totalReturn>=0?'up':'down'} />
                    <MetricCard title="XIRR" value={`${data.summary.annualizedReturn.toFixed(2)}%`} subValue="年化資金效率" trend={data.summary.annualizedReturn>0?'up':'down'} />
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
                    <table className="w-full text-sm text-left whitespace-nowrap"><thead className="bg-gray-50 font-bold text-gray-600"><tr><th className="p-3">代號</th><th className="p-3 text-right">股數</th><th className="p-3 text-right">現價(原幣)</th><th className="p-3 text-right">總市值(TWD)</th><th className="p-3 text-right">總市值(USD)</th><th className="p-3 text-right">報酬率</th></tr></thead><tbody>{pdfHoldings.map((h, i) => (<tr key={i} className="border-t border-gray-100"><td className="p-3 font-bold">{h.symbol}</td><td className="p-3 text-right">{h.shares.toFixed(2)}</td><td className="p-3 text-right">{h.currency==='TWD'?'NT$':'$'}{h.currentPrice.toFixed(2)}</td><td className="p-3 text-right">{formatValue(h.value, 'TWD', exchangeRate)}</td><td className="p-3 text-right text-gray-500">{formatValue(h.value, 'USD', exchangeRate)}</td><td className={`p-3 text-right font-bold ${h.returnPcnt>=0?'text-red-600':'text-green-600'}`}>{h.returnPcnt.toFixed(2)}%</td></tr>))}</tbody></table>
                </div>
            </div>

            {/* Page 3+: Transactions (Current Year Only) */}
            {pages.length > 0 ? pages.map((chunk, idx) => (
                <div key={idx} className="pdf-page w-[1280px] min-h-[900px] p-[60px] pb-20 bg-white mb-5 relative box-border">
                    <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-800">{currentYear} 年度交易紀錄</h2><span className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-600">頁 {idx + 3}</span></div>
                    <table className="w-full text-sm text-left border rounded-lg overflow-hidden whitespace-nowrap"><thead className="bg-gray-50 font-bold text-gray-600"><tr><th className="p-4 border-b">日期</th><th className="p-4 border-b">類型</th><th className="p-4 border-b">標的</th><th className="p-4 border-b text-right">股數</th><th className="p-4 border-b text-right">單價</th><th className="p-4 border-b text-right">總額(USD)</th><th className="p-4 border-b text-right">總額(TWD)</th></tr></thead><tbody>{chunk.map((t: any, ti: number) => (<tr key={ti} className="border-b last:border-0 hover:bg-gray-50"><td className="p-4 text-gray-600">{t.date.split('T')[0]}</td><td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${t.type==='Buy'?'bg-red-100 text-red-700':t.type.includes('Sell')?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'}`}>{t.type}</span></td><td className="p-4 font-bold">{t.symbol}</td><td className="p-4 text-right font-mono">{parseFloat(t.shares).toFixed(2)}</td><td className="p-4 text-right font-mono">{t.currency === 'TWD' ? 'NT$' : '$'}{parseFloat(t.price).toFixed(2)}</td><td className="p-4 text-right font-mono font-bold">{t.currency === 'USD' ? '$' : ''}{t.amount ? Math.abs(t.amount).toLocaleString(undefined, {minimumFractionDigits:2}) : '-'}</td><td className="p-4 text-right font-mono font-bold text-gray-500">{t.amount ? formatValue(Math.abs(t.amount), 'TWD', exchangeRate) : '-'}</td></tr>))}</tbody></table>
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
                const earliestDate = new Date(transactions.reduce((min, t) => t.date < min ? t.date : min, transactions[0].date));
                earliestDate.setDate(earliestDate.getDate() - 7); 

                const res = await fetch('/api/market-data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ symbols, startDate: earliestDate.toISOString() })
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
            const url = `${baseUrl}?data=${compressed}&portfolio=${encodeURIComponent(selectedPortfolio)}`;
            
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
        const now = new Date();
        const points = data.chartData;
        let cutoffDate;
        if (timeRange === 'YTD') cutoffDate = new Date(now.getFullYear(), 0, 1);
        else if (timeRange === '1Y') cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        else if (timeRange === '3Y') cutoffDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
        else if (timeRange === '5Y') cutoffDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
        else if (timeRange === '10Y') cutoffDate = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());
        const filtered = timeRange === 'ALL' ? points : points.filter(p => p.rawDate >= (cutoffDate || new Date(0)));
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
                doc.save(`${selectedPortfolio}_Report.pdf`);
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
        return <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12">{`${name} ${(percent * 100).toFixed(0)}%`}</text>;
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
                        <button onClick={() => setCurrencyMode('TWD')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${currencyMode==='TWD' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>TWD</button>
                        <button onClick={() => setCurrencyMode('USD')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${currencyMode==='USD' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>USD</button>
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
                        <p className="text-gray-500 text-sm">投資組合深度分析報告 • 結算日 {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* ... (Rest of the Dashboard: KPI Cards, Charts, Tables - Same as existing code) ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="目前市值" value={formatValue(data.summary.totalValue, currencyMode, exchangeRate, true)} trend={data.summary.returnPcnt >= 0 ? 'up' : 'down'} subValue={formatValue(data.summary.totalValue, currencyMode==='TWD'?'USD':'TWD', exchangeRate, true)} />
                    <MetricCard title="淨投入本金" value={formatValue(data.summary.totalCost, currencyMode, exchangeRate, true)} trend="neutral" subValue={formatValue(data.summary.totalCost, currencyMode==='TWD'?'USD':'TWD', exchangeRate, true)} />
                    <MetricCard title="總報酬" value={formatValue(data.summary.totalReturn, currencyMode, exchangeRate, true)} trend={data.summary.totalReturn >= 0 ? 'up' : 'down'} subValue={`${data.summary.returnPcnt > 0 ? '+' : ''}${data.summary.returnPcnt.toFixed(2)}%`} />
                    <MetricCard title="內部報酬率 (XIRR)" value={`${data.summary.annualizedReturn.toFixed(2)}%`} trend={data.summary.annualizedReturn > 0 ? 'up' : 'down'} subValue="年化資金效率" />
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
                                    <button onClick={() => setChartMode('value')} className={`px-2 py-1 rounded ${chartMode==='value' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>市值</button>
                                    <button onClick={() => setChartMode('profit')} className={`px-2 py-1 rounded ${chartMode==='profit' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>總損益</button>
                                    <button onClick={() => setChartMode('percent')} className={`px-2 py-1 rounded ${chartMode==='percent' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>損益 %</button>
                                </div>
                            </div>
                            <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
                                {['YTD', '1Y', '3Y', '5Y', '10Y', 'ALL'].map(range => (
                                    <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${timeRange === range ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{range === 'YTD' ? '今年' : range === 'ALL' ? '全部' : range.replace('Y', '年')}</button>
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
                                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={v => `${v/1000}k`} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(val) => [formatValue(val, currencyMode, 1, true), '']} />
                                        <Legend iconType="circle" />
                                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={0.1} fill="#3b82f6" name="資產市值" />
                                        <Area type="monotone" dataKey="invested" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} name="淨成本" />
                                    </AreaChart>
                                ) : chartMode === 'profit' ? (
                                    <AreaChart data={filteredChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" minTickGap={50} tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={v => `${v/1000}k`} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(val) => [formatValue(val, currencyMode, 1, true), '']} />
                                        <Legend iconType="circle" />
                                        <Area type="monotone" dataKey="returnAbs" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} name="總損益金額" />
                                    </AreaChart>
                                ) : (
                                    <LineChart data={filteredChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" minTickGap={50} tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={v => `${v}%`} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} formatter={(val) => [`${val.toFixed(2)}%`, '']} />
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
                                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                                    </Pie>
                                    <Tooltip formatter={(val, name, props) => [`${formatValue(val, currencyMode, exchangeRate, true)} (${(props.payload.percent * 100).toFixed(1)}%)`, name]} contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
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
                                        <td className="px-6 py-4 text-right font-mono"><span className={`px-2 py-1 rounded text-xs font-bold ${h.returnPcnt >= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{h.returnPcnt > 0 ? '+' : ''}{h.returnPcnt.toFixed(2)}%</span></td>
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
                                        <td className="px-6 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'Buy' ? 'bg-red-100 text-red-700' : tx.type.includes('Sell') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{tx.type === 'Buy' ? '買入' : tx.type === 'Sell' ? '賣出' : tx.type === 'Dividend Reinvest' ? '股息再投' : tx.type}</span></td>
                                        <td className="px-6 py-3 text-right font-mono">{tx.shares.toFixed(2)}</td>
                                        <td className="px-6 py-3 text-right font-mono text-gray-600">${tx.price.toFixed(2)}</td>
                                        <td className="px-6 py-3 text-right font-mono font-bold text-gray-900">${Math.abs(tx.amount).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
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