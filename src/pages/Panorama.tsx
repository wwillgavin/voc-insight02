import React, { useState, useRef } from 'react';
import { Sparkles, Bot, Info, X, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, ReferenceDot } from 'recharts';

interface PanoramaProps {
  onOpenAI: () => void;
}

const DATA_SETS: Record<string, any> = {
  '全部事业部': {
    trend: [
      { date: '02-10', positive: 4000, neutral: 1000, negative: 500 },
      { date: '02-11', positive: 4200, neutral: 1100, negative: 480 },
      { date: '02-12', positive: 4100, neutral: 1050, negative: 520 },
      { date: '02-13', positive: 4500, neutral: 1200, negative: 600 },
      { date: '02-14', positive: 3800, neutral: 900, negative: 2500, isAnomaly: true },
      { date: '02-15', positive: 3900, neutral: 950, negative: 1800 },
      { date: '02-16', positive: 4300, neutral: 1100, negative: 800 },
    ],
    metrics: {
      satisfaction: { value: 91.3, mom: -1.2, yoy: 0.3 },
      positiveRate: { value: 95.8, mom: 0.5, yoy: -0.8 }
    },
    platform: [
      { name: '京东', value: 38, color: '#1677FF' },
      { name: '天猫', value: 32, color: '#52C41A' },
      { name: '抖音', value: 15, color: '#FADC19' },
      { name: '小红书', value: 10, color: '#FA8C16' },
      { name: '微博', value: 5, color: '#722ED1' },
    ],
    platformInsight: { title: '最大声量来源', value: '京东 38%', color: 'text-brand' },
    heatmap: [
      { name: '婴幼儿奶粉', pos: 80, neg: 90, risk: 'high' },
      { name: '高端纯牛奶', pos: 90, neg: 70, risk: 'high' },
      { name: '基础白奶', pos: 60, neg: 60, risk: 'medium' },
      { name: '常温酸奶', pos: 70, neg: 40, risk: 'medium' },
      { name: '成人奶粉', pos: 50, neg: 30, risk: 'low' },
      { name: '功能奶', pos: 40, neg: 20, risk: 'low' },
      { name: '低温牛奶', pos: 30, neg: 10, risk: 'low' },
      { name: '儿童奶粉', pos: 20, neg: 10, risk: 'low' },
      { name: '低温酸奶', pos: 25, neg: 5, risk: 'low' },
    ],
    aiInsight: "2月14日负面峰值，疑似春节物流积压集中爆发，建议核查京东仓储数据。"
  },
  '液奶事业部': {
    trend: [
      { date: '02-10', positive: 2800, neutral: 700, negative: 400 },
      { date: '02-11', positive: 2900, neutral: 750, negative: 380 },
      { date: '02-12', positive: 2850, neutral: 720, negative: 420 },
      { date: '02-13', positive: 3100, neutral: 800, negative: 500 },
      { date: '02-14', positive: 2600, neutral: 600, negative: 2100, isAnomaly: true },
      { date: '02-15', positive: 2700, neutral: 650, negative: 1500 },
      { date: '02-16', positive: 3000, neutral: 750, negative: 650 },
    ],
    metrics: {
      satisfaction: { value: 85.3, mom: -3.5, yoy: -1.2 },
      positiveRate: { value: 81.7, mom: -2.1, yoy: -4.5 }
    },
    platform: [
      { name: '京东', value: 42, color: '#F5A65B' },
      { name: '天猫', value: 28, color: '#1677FF' },
      { name: '抖音', value: 15, color: '#52C41A' },
      { name: '小红书', value: 10, color: '#FADC19' },
      { name: '微博', value: 5, color: '#722ED1' },
    ],
    platformInsight: { title: '最大负面来源', value: '京东 42%', color: 'text-status-negative' },
    heatmap: [
      { name: '高端纯牛奶', pos: 40, neg: 80, risk: 'high' },
      { name: '基础白奶', pos: 50, neg: 60, risk: 'medium' },
      { name: '功能奶', pos: 30, neg: 20, risk: 'low' },
      { name: '低温牛奶', pos: 20, neg: 10, risk: 'low' },
    ],
    aiInsight: "液奶事业部2月14日负面声量激增，主要集中在京东平台，提及“破损”、“漏奶”较多，疑似春节期间物流暴力分拣导致，建议紧急排查京东仓储及物流环节。"
  }
};

const CROSS_DEPT_TREND_DATA = [
  { date: '25-04', 液奶: 92.1, 酸奶: 94.2, 婴幼儿: 90.5, 奶酪: 92.8, 成人营养: 95.1 },
  { date: '25-05', 液奶: 91.8, 酸奶: 94.8, 婴幼儿: 89.8, 奶酪: 93.0, 成人营养: 95.5 },
  { date: '25-06', 液奶: 92.5, 酸奶: 95.1, 婴幼儿: 91.2, 奶酪: 92.5, 成人营养: 96.0 },
  { date: '25-07', 液奶: 91.0, 酸奶: 94.5, 婴幼儿: 90.0, 奶酪: 93.2, 成人营养: 95.8 },
  { date: '25-08', 液奶: 90.5, 酸奶: 95.0, 婴幼儿: 89.5, 奶酪: 93.5, 成人营养: 96.5 },
  { date: '25-09', 液奶: 91.3, 酸奶: 95.6, 婴幼儿: 88.2, 奶酪: 93.1, 成人营养: 96.2 },
];

const CROSS_DEPT_TABLE_DATA = [
  { name: '液奶', current: 91.3, mom: -1.2, yoy: 2.1, trend: 'down' },
  { name: '酸奶', current: 95.6, mom: 0.8, yoy: 3.4, trend: 'up' },
  { name: '婴幼儿', current: 88.2, mom: -2.3, yoy: -1.1, trend: 'down', alert: true },
  { name: '奶酪', current: 93.1, mom: 0.3, yoy: 0.7, trend: 'flat' },
  { name: '成人营养', current: 96.2, mom: 1.1, yoy: 2.8, trend: 'up' },
];

export default function Panorama({ onOpenAI }: PanoramaProps) {
  const [globalTimeRange, setGlobalTimeRange] = useState('近30天');
  const [selectedDept, setSelectedDept] = useState('全部事业部');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedChannel, setSelectedChannel] = useState('全部');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  const deptSectionRef = useRef<HTMLDivElement>(null);

  const currentData = DATA_SETS[selectedDept] || DATA_SETS['全部事业部'];

  const handleDeptSelect = (deptName: string) => {
    const fullName = deptName.includes('事业部') ? deptName : `${deptName}事业部`;
    setSelectedDept(fullName);
    deptSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6 h-full flex flex-col pb-8">
      {/* Top Global Time Filter */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-border-color shadow-sm">
        <div className="text-sm font-medium text-text-main pl-2 flex items-center gap-2">
          全局时间范围 <span className="text-xs text-text-minor font-normal">（作用于全页）</span>
        </div>
        <div className="flex bg-gray-50 rounded border border-border-color p-0.5">
          {['近30天', '近90天', '按月', '按年'].map(t => (
            <button 
              key={t} 
              onClick={() => setGlobalTimeRange(t)}
              className={`px-4 py-1.5 text-sm rounded-sm transition-colors ${globalTimeRange === t ? 'bg-white shadow-sm font-medium text-brand' : 'text-text-sub hover:text-text-main'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cross Department Comparison (Full Data) */}
      <CrossDeptComparison onDeptSelect={handleDeptSelect} />

      {/* Visual Divider */}
      <div ref={deptSectionRef} className="relative py-6 mt-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-dashed border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#f5f5f5] px-4 text-sm font-medium text-text-minor flex items-center gap-2">
            <ChevronDown size={16} /> 以下内容按事业部查看
          </span>
        </div>
      </div>

      {/* Sub-filters for Department View */}
      <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-border-color sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-minor pl-2">查看事业部</span>
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-brand/5 border border-brand/20 rounded px-3 py-1.5 text-sm outline-none font-medium text-brand cursor-pointer hover:bg-brand/10 transition-colors"
          >
            <option>全部事业部</option>
            <option>液奶事业部</option>
            <option>酸奶事业部</option>
            <option>婴幼儿事业部</option>
            <option>奶酪事业部</option>
            <option>成人营养事业部</option>
          </select>
        </div>
        <div className="w-px h-4 bg-border-color mx-2"></div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-minor">品类/品牌</span>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option>全部</option>
            <option>高端纯牛奶</option>
            <option>基础白奶</option>
          </select>
        </div>
        <div className="w-px h-4 bg-border-color mx-2"></div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-minor">渠道/平台</span>
          <select 
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option>全部</option>
            <option>京东</option>
            <option>天猫</option>
            <option>抖音</option>
          </select>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="deeptag-card p-5 h-[300px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h3 className="deeptag-title text-lg">声量趋势 <span className="text-sm font-normal text-text-minor ml-2">({selectedDept})</span></h3>
            <div className="flex gap-3 text-sm">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-positive"></span>正面</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400"></span>中性</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-negative"></span>负面</span>
            </div>
          </div>
          <button onClick={onOpenAI} className="text-insight-purple-text hover:bg-insight-purple-bg px-2 py-1 rounded text-sm flex items-center gap-1 transition-colors">
            <Sparkles size={14} /> AI 解读
          </button>
        </div>
        <div className="flex-1 min-h-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentData.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
              <RechartsTooltip content={<TrendTooltip />} />
              <Line type="monotone" dataKey="positive" stroke="#52C41A" strokeWidth={2} dot={false} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="neutral" stroke="#C9CDD4" strokeWidth={2} dot={false} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="negative" stroke="#F5A65B" strokeWidth={2} dot={false} activeDot={{r: 6}} />
              
              {/* AI Anomaly Marker */}
              <ReferenceDot x="02-14" y={2500} r={12} fill="#F5F0FF" stroke="#722ED1" strokeWidth={2} 
                onMouseEnter={() => setHoveredNode('02-14')}
                onMouseLeave={() => setHoveredNode(null)}
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Custom AI Tooltip for the anomaly */}
          {hoveredNode === '02-14' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full -mt-4 bg-white p-3 rounded-lg shadow-xl border border-insight-purple-text/30 z-10 w-64 pointer-events-none">
              <div className="flex items-center gap-1 text-insight-purple-text font-semibold mb-1 text-sm">
                <Bot size={14} /> AI 异常诊断
              </div>
              <p className="text-xs text-text-sub">{currentData.aiInsight}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-6 h-[280px]">
        {/* Left: Gauges */}
        <div className="w-[48%] deeptag-card p-5 flex flex-col justify-center relative">
          <div className="absolute top-4 left-5 text-sm font-medium text-text-minor">核心指标 <span className="font-normal">({selectedDept})</span></div>
          <div className="flex h-full mt-6">
            <div className="flex-1 flex flex-col items-center justify-center border-r border-border-color">
              <div className="relative w-32 h-16 overflow-hidden mb-4">
                <div className="absolute w-32 h-32 rounded-full border-[12px] border-gray-100 border-b-transparent border-r-transparent transform -rotate-45"></div>
                <div className="absolute w-32 h-32 rounded-full border-[12px] border-brand border-b-transparent border-r-transparent transform -rotate-45" style={{clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'}}></div>
              </div>
              <div className="text-3xl font-bold text-text-main mb-1">{currentData.metrics.satisfaction.value}%</div>
              <div className="text-sm text-text-sub font-medium">满意度</div>
              <div className="flex gap-3 text-xs mt-2">
                <span className={currentData.metrics.satisfaction.mom < 0 ? 'text-status-negative' : 'text-status-positive'}>环比 {currentData.metrics.satisfaction.mom > 0 ? '▲' : '▼'}{Math.abs(currentData.metrics.satisfaction.mom)}%</span>
                <span className={currentData.metrics.satisfaction.yoy < 0 ? 'text-status-negative' : 'text-status-positive'}>同比 {currentData.metrics.satisfaction.yoy > 0 ? '▲' : '▼'}{Math.abs(currentData.metrics.satisfaction.yoy)}%</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-32 h-16 overflow-hidden mb-4">
                <div className="absolute w-32 h-32 rounded-full border-[12px] border-gray-100 border-b-transparent border-r-transparent transform -rotate-45"></div>
                <div className="absolute w-32 h-32 rounded-full border-[12px] border-status-positive border-b-transparent border-r-transparent transform -rotate-45" style={{clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'}}></div>
              </div>
              <div className="text-3xl font-bold text-text-main mb-1">{currentData.metrics.positiveRate.value}%</div>
              <div className="text-sm text-text-sub font-medium">正面声量率</div>
              <div className="flex gap-3 text-xs mt-2">
                <span className={currentData.metrics.positiveRate.mom < 0 ? 'text-status-negative' : 'text-status-positive'}>环比 {currentData.metrics.positiveRate.mom > 0 ? '▲' : '▼'}{Math.abs(currentData.metrics.positiveRate.mom)}%</span>
                <span className={currentData.metrics.positiveRate.yoy < 0 ? 'text-status-negative' : 'text-status-positive'}>同比 {currentData.metrics.positiveRate.yoy > 0 ? '▲' : '▼'}{Math.abs(currentData.metrics.positiveRate.yoy)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Platform Distribution */}
        <div className="w-[52%] deeptag-card p-5 flex flex-col">
          <h3 className="deeptag-title text-lg mb-2">平台声量分布 <span className="text-sm font-normal text-text-minor ml-1">({selectedDept})</span></h3>
          <div className="flex-1 flex items-center">
            <div className="w-1/2 h-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={currentData.platform} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                    {currentData.platform.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-text-sub">{currentData.platformInsight.title}</span>
                <span className={`text-lg font-bold ${currentData.platformInsight.color}`}>{currentData.platformInsight.value}</span>
              </div>
            </div>
            <div className="w-1/2 pl-4">
              <div className="space-y-3">
                {currentData.platform.map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{backgroundColor: item.color}}></div>
                      <span className="text-text-main">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Heatmap */}
      <div className="deeptag-card p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="deeptag-title text-lg">品类声量热力矩阵 <span className="text-sm font-normal text-text-minor ml-1">({selectedDept})</span></h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-text-sub flex items-center gap-1"><Info size={14}/> 颜色越深风险越高</span>
            <button onClick={onOpenAI} className="text-insight-purple-text hover:bg-insight-purple-bg px-2 py-1 rounded flex items-center gap-1 transition-colors">
              <Sparkles size={14} /> AI 解读
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 flex-1">
          {currentData.heatmap.map((item: any) => {
            const bgColors = {
              high: 'bg-status-negative/10 border-status-negative/20 hover:bg-status-negative/20',
              medium: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
              low: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            };
            return (
              <div key={item.name} className={`p-4 rounded-lg border cursor-pointer transition-colors flex flex-col justify-between ${bgColors[item.risk as keyof typeof bgColors]}`}>
                <div className="font-medium text-text-main">{item.name}</div>
                <div className="flex justify-between items-end mt-2">
                  <div className="text-xs text-text-sub">
                    <div>正: {item.pos}k</div>
                    <div>负: <span className={item.risk === 'high' ? 'text-status-negative font-bold' : ''}>{item.neg}k</span></div>
                  </div>
                  {item.risk === 'high' && <span className="text-xs bg-status-negative text-white px-1.5 py-0.5 rounded">高风险</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CrossDeptComparison({ onDeptSelect }: { onDeptSelect: (dept: string) => void }) {
  const [metric, setMetric] = useState('满意度');
  const [timeGranularity, setTimeGranularity] = useState('按月');
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="deeptag-card p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-border-color pb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-text-main">各事业部满意度 & 正面声量率对比</h3>
          <span className="text-xs bg-gray-100 text-text-minor px-2 py-1 rounded">全量展示，不受下方事业部筛选影响</span>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-gray-100 p-1 rounded-md">
            <button 
              className={`px-3 py-1 text-sm rounded transition-colors ${metric === '满意度' ? 'bg-white shadow-sm font-medium text-text-main' : 'text-text-sub hover:text-text-main'}`}
              onClick={() => setMetric('满意度')}
            >满意度</button>
            <button 
              className={`px-3 py-1 text-sm rounded transition-colors ${metric === '正面声量率' ? 'bg-white shadow-sm font-medium text-text-main' : 'text-text-sub hover:text-text-main'}`}
              onClick={() => setMetric('正面声量率')}
            >正面声量率</button>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-md">
            <button 
              className={`px-3 py-1 text-sm rounded transition-colors ${timeGranularity === '按月' ? 'bg-white shadow-sm font-medium text-text-main' : 'text-text-sub hover:text-text-main'}`}
              onClick={() => setTimeGranularity('按月')}
            >按月</button>
            <button 
              className={`px-3 py-1 text-sm rounded transition-colors ${timeGranularity === '按年' ? 'bg-white shadow-sm font-medium text-text-main' : 'text-text-sub hover:text-text-main'}`}
              onClick={() => setTimeGranularity('按年')}
            >按年</button>
          </div>
        </div>
      </div>

      {/* Upper: Line Chart */}
      <div className="h-[300px] mb-8 relative">
        <div className="absolute top-0 right-0 z-10">
          <button 
            onClick={() => setShowAI(!showAI)}
            className="text-insight-purple-text bg-insight-purple-bg/30 hover:bg-insight-purple-bg px-2 py-1 rounded text-sm flex items-center gap-1 transition-colors"
          >
            <Sparkles size={14} /> AI 解读
          </button>
        </div>
        
        {showAI && (
          <div className="absolute top-10 right-0 z-20 w-80 bg-white border border-insight-purple-text/30 shadow-xl rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-insight-purple-text font-bold text-sm">
                <Bot size={16} /> AI 综合洞察
              </div>
              <button onClick={() => setShowAI(false)} className="text-text-minor hover:text-text-main"><X size={14} /></button>
            </div>
            <p className="text-sm text-text-sub leading-relaxed">
              本期<span className="font-bold text-text-main">液奶事业部</span>表现最优，满意度达92.5%，环比上升1.2%。<br/>
              <span className="font-bold text-status-negative">酸奶事业部</span>满意度出现异常下滑（环比下降2.1%），主要受近期包装变更引发的负面讨论影响，建议重点关注。
            </p>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={CROSS_DEPT_TREND_DATA} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
            <RechartsTooltip contentStyle={{borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
            <Line type="monotone" dataKey="液奶" stroke="#1677FF" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} name="液奶" />
            <Line type="monotone" dataKey="酸奶" stroke="#52C41A" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} name="酸奶" />
            <Line type="monotone" dataKey="婴幼儿" stroke="#FA8C16" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} name="婴幼儿" />
            <Line type="monotone" dataKey="奶酪" stroke="#722ED1" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} name="奶酪" />
            <Line type="monotone" dataKey="成人营养" stroke="#86909C" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} name="成人营养" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Lower: Table */}
      <div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-color text-text-sub text-sm">
              <th className="pb-3 font-medium">事业部</th>
              <th className="pb-3 font-medium">本期值</th>
              <th className="pb-3 font-medium">环比</th>
              <th className="pb-3 font-medium">同比</th>
              <th className="pb-3 font-medium">趋势</th>
            </tr>
          </thead>
          <tbody>
            {CROSS_DEPT_TABLE_DATA.map((row, idx) => (
              <tr 
                key={idx} 
                className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${row.alert ? 'bg-red-50/30' : ''}`}
                onClick={() => onDeptSelect(row.name)}
                title={`点击查看 ${row.name} 事业部详细数据`}
              >
                <td className="py-4 text-sm font-medium text-text-main flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{
                    backgroundColor: row.name === '液奶' ? '#1677FF' : 
                                     row.name === '酸奶' ? '#52C41A' : 
                                     row.name === '婴幼儿' ? '#FA8C16' : 
                                     row.name === '奶酪' ? '#722ED1' : '#86909C'
                  }}></div>
                  {row.name}
                </td>
                <td className="py-4 text-sm font-bold text-text-main">{row.current}%</td>
                <td className={`py-4 text-sm ${row.mom < 0 ? 'text-status-negative' : 'text-status-positive'}`}>
                  {row.mom > 0 ? '▲' : '▼'}{Math.abs(row.mom)}%
                </td>
                <td className={`py-4 text-sm ${row.yoy < 0 ? 'text-status-negative' : 'text-status-positive'}`}>
                  {row.yoy > 0 ? '▲' : '▼'}{Math.abs(row.yoy)}%
                </td>
                <td className="py-4 text-sm text-text-minor flex items-center gap-2">
                  {row.trend === 'up' ? '↗' : row.trend === 'down' ? '↘' : '→'}
                  {row.alert && <span className="w-2 h-2 bg-status-negative rounded-full" title="下滑超过2%"></span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TrendTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-border-color shadow-lg rounded-lg min-w-[150px]">
        <p className="font-bold text-text-main mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between text-sm mb-1">
            <span style={{color: entry.color}}>{entry.name}:</span>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
        {label === '02-14' && (
          <div className="mt-2 pt-2 border-t border-border-color text-xs text-insight-purple-text flex items-center gap-1">
            <Bot size={12} /> AI 异常标注点
          </div>
        )}
      </div>
    );
  }
  return null;
};

