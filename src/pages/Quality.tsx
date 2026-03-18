import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, ArrowDownRight, ArrowUpRight, X, Search, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Cell } from 'recharts';

interface QualityProps {
  onOpenAI: () => void;
}

const QUALITY_TREND = [
  { date: '01-15', satisfaction: 98.38 },
  { date: '01-22', satisfaction: 97.50 },
  { date: '01-29', satisfaction: 96.20 },
  { date: '02-05', satisfaction: 92.10 },
  { date: '02-12', satisfaction: 84.99 },
  { date: '02-19', satisfaction: 86.50 },
];

const NEGATIVE_CATEGORY = [
  { name: '婴幼儿奶粉', value: 4079, mom: 12 },
  { name: '高端纯牛奶', value: 3091, mom: 5 },
  { name: '基础品牌', value: 1997, mom: 3 },
  { name: '常温酸奶', value: 1250, mom: -2 },
  { name: '成人奶粉', value: 892, mom: 8 },
  { name: '功能奶', value: 674, mom: 1 },
];

const COMPETITOR_TREND = [
  { date: 'Sep', 本品: 92, 竞品A: 88, 竞品B: 94 },
  { date: 'Oct', 本品: 93, 竞品A: 89, 竞品B: 93 },
  { date: 'Nov', 本品: 91, 竞品A: 90, 竞品B: 95 },
  { date: 'Dec', 本品: 94, 竞品A: 92, 竞品B: 94 },
  { date: 'Jan', 本品: 95, 竞品A: 94, 竞品B: 96 },
  { date: 'Feb', 本品: 96, 竞品A: 95, 竞品B: 95 },
];

const RADAR_DATA = [
  { subject: '产品质量', A: 95, B: 87, fullMark: 100 },
  { subject: '口感', A: 92, B: 84, fullMark: 100 },
  { subject: '物流服务', A: 75, B: 87, fullMark: 100 },
  { subject: '客服响应', A: 80, B: 92, fullMark: 100 },
  { subject: '包装', A: 88, B: 85, fullMark: 100 },
  { subject: '价格', A: 82, B: 88, fullMark: 100 },
];

const ROOT_CAUSE_DIMENSIONS = [
  { name: '消化不良', value: 1264, mom: 18, alert: true },
  { name: '物流破损', value: 978, mom: 8, alert: false },
  { name: '溶解性差', value: 621, mom: 3, alert: false },
  { name: '口感异常', value: 489, mom: -2, alert: false },
  { name: '包装问题', value: 412, mom: 5, alert: false },
  { name: '价格偏高', value: 315, mom: -1, alert: false },
];

const ROOT_CAUSE_CORPUS: Record<string, any> = {
  '消化不良': {
    count: 128,
    scenario: '宝宝喝后消化不良',
    items: [
      { text: "孩子喝了这批奶粉一直拉绿便，换了其他品牌就好了，感觉是配方有问题...", source: "京东", date: "03-02" },
      { text: "连续两罐喝完宝宝肚子不舒服，上一批次完全没问题...", source: "天猫", date: "03-05" },
      { text: "喝完之后一直哭闹，去医院检查说是消化不良，这奶粉是不是改配方了？", source: "小红书", date: "03-08" },
    ]
  },
  '物流破损': {
    count: 85,
    scenario: '收到货时包装破损',
    items: [
      { text: "箱子都变形了，里面奶粉罐瘪了一大块，根本不敢给孩子喝！", source: "京东", date: "03-01" },
      { text: "快递直接扔在驿站，拿回来发现漏粉了，客服还不给退换...", source: "天猫", date: "03-04" },
      { text: "包装太简陋了，连个泡沫都不垫，收到的时候罐子都破了，奶粉洒了一箱。", source: "抖音", date: "03-06" },
    ]
  },
  '溶解性差': {
    count: 62,
    scenario: '冲泡时结块难溶',
    items: [
      { text: "怎么摇都化不开，奶瓶底下一层厚厚的结块，水温也是按说明来的啊。", source: "天猫", date: "03-03" },
      { text: "这批次溶解度太差了，经常堵住奶嘴，宝宝喝不到一直哭。", source: "京东", date: "03-07" },
      { text: "冲泡后挂壁严重，感觉有很多颗粒物没有溶解，以前买的不会这样。", source: "小红书", date: "03-09" },
    ]
  },
  '口感异常': {
    count: 45,
    scenario: '味道与之前不同',
    items: [
      { text: "打开有一股很重的腥味，宝宝喝了一口就吐了，死活不肯再喝。", source: "京东", date: "03-02" },
      { text: "感觉比以前甜了很多，是不是加了香精？不敢给孩子喝了。", source: "天猫", date: "03-05" },
      { text: "奶粉颜色发黄，味道也不对，像受潮了一样，找客服也不理。", source: "抖音", date: "03-08" },
    ]
  },
  '包装问题': {
    count: 38,
    scenario: '包装设计或质量缺陷',
    items: [
      { text: "盖子太难打开了，每次都要费很大劲，而且密封性感觉不好。", source: "小红书", date: "03-01" },
      { text: "勺子设计不合理，每次舀奶粉都会洒出来很多，太浪费了。", source: "京东", date: "03-04" },
      { text: "罐子边缘很锋利，不小心把手划破了，希望能改进一下包装。", source: "天猫", date: "03-07" },
    ]
  },
  '价格偏高': {
    count: 25,
    scenario: '认为性价比低',
    items: [
      { text: "涨价太快了吧，上个月买才多少钱，现在直接贵了几十块，喝不起了。", source: "京东", date: "03-03" },
      { text: "活动力度越来越小，平时买太贵了，准备换其他性价比高的牌子。", source: "天猫", date: "03-06" },
      { text: "虽然质量不错，但价格确实偏高，长期喝负担有点重。", source: "小红书", date: "03-09" },
    ]
  }
};

export default function Quality({ onOpenAI }: QualityProps) {
  const [activeTab, setActiveTab] = useState('quality');
  const [isRootCauseDrawerOpen, setIsRootCauseDrawerOpen] = useState(false);
  const [isWorkOrderDrawerOpen, setIsWorkOrderDrawerOpen] = useState(false);
  const [selectedRootCauseDim, setSelectedRootCauseDim] = useState(ROOT_CAUSE_DIMENSIONS[0]);
  const [isCorpusExpanded, setIsCorpusExpanded] = useState(false);

  return (
    <div className="flex w-full h-full overflow-hidden relative">
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isRootCauseDrawerOpen || isWorkOrderDrawerOpen ? 'pr-[500px]' : ''}`}>
        <div className="space-y-6 flex flex-col pb-8">
          {/* Top Tabs & Filters */}
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-border-color">
            <div className="flex gap-1 bg-gray-50 p-1 rounded-md border border-border-color">
              {[
                { id: 'quality', label: '本品品质监测' },
                { id: 'competitor', label: '竞品对比分析' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${
                    activeTab === tab.id ? 'bg-white shadow-sm text-brand' : 'text-text-sub hover:text-text-main'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <select className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none">
                <option>全部品类</option>
              </select>
              <select className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none">
                <option>全部品牌</option>
              </select>
              <select className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none">
                <option>近30天</option>
              </select>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0 flex flex-col gap-6">
            {activeTab === 'quality' && <QualityTab onOpenAI={onOpenAI} onOpenRootCause={() => setIsRootCauseDrawerOpen(true)} />}
            {activeTab === 'competitor' && <CompetitorTab onOpenAI={onOpenAI} />}
          </div>
        </div>
      </div>

      {/* Root Cause Drawer */}
      <RootCauseDrawer 
        isOpen={isRootCauseDrawerOpen} 
        onClose={() => setIsRootCauseDrawerOpen(false)} 
        onOpenWorkOrder={() => setIsWorkOrderDrawerOpen(true)}
        selectedDim={selectedRootCauseDim}
        setSelectedDim={setSelectedRootCauseDim}
        isCorpusExpanded={isCorpusExpanded}
        setIsCorpusExpanded={setIsCorpusExpanded}
      />

      {/* Work Order Drawer */}
      <WorkOrderDrawer 
        isOpen={isWorkOrderDrawerOpen} 
        onClose={() => setIsWorkOrderDrawerOpen(false)} 
        selectedDim={selectedRootCauseDim}
      />
    </div>
  );
}

function QualityTab({ onOpenAI, onOpenRootCause }: any) {
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);
  const [hasPulsed, setHasPulsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPulsed(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDiagnosisClick = (categoryName: string) => {
    setLoadingCategory(categoryName);
    setTimeout(() => {
      setLoadingCategory(null);
      if (categoryName === '婴幼儿奶粉') {
        onOpenRootCause();
      }
    }, 800);
  };

  const maxVal = Math.max(...NEGATIVE_CATEGORY.map(d => d.value));

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Top Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="deeptag-card p-5">
          <div className="text-text-sub text-sm font-medium mb-2">本品满意度</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-text-main">84.99%</div>
            <div className="flex items-center text-sm font-medium text-status-negative">
              <ArrowDownRight size={16} /> 13.4% 环比
            </div>
          </div>
        </div>
        <div className="deeptag-card p-5 border-l-4 border-l-status-negative">
          <div className="text-text-sub text-sm font-medium mb-2">负面品类 TOP1</div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-text-main">婴幼儿奶粉</div>
            <div className="flex items-center text-sm font-medium text-status-negative">
              4,079条 🔴
            </div>
          </div>
        </div>
        <div className="deeptag-card p-5">
          <div className="text-text-sub text-sm font-medium mb-2">400客服月投诉量</div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-text-main">本月新增 228 条</div>
            <div className="flex items-center text-sm font-medium text-status-negative">
              <ArrowUpRight size={16} /> 15% 环比
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-[350px]">
        {/* Left: Trend */}
        <div className="w-[55%] deeptag-card p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="deeptag-title text-lg">满意度趋势</h3>
            <button onClick={onOpenAI} className="text-insight-purple-text hover:bg-insight-purple-bg px-2 py-1 rounded text-sm flex items-center gap-1 transition-colors">
              <Sparkles size={14} /> AI 解读
            </button>
          </div>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={QUALITY_TREND} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="satisfaction" stroke="#1677FF" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
            
            {/* AI Annotation */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-insight-purple-bg/80 border border-insight-purple-text/30 p-3 rounded-lg shadow-sm backdrop-blur-sm w-3/4">
              <div className="flex items-center gap-1 text-insight-purple-text font-semibold mb-1 text-sm">
                <Bot size={14} /> AI 异常诊断
              </div>
              <p className="text-xs text-text-sub">
                2月满意度大幅下滑，疑似春节物流积压导致投诉集中爆发，建议核查2月物流数据。
              </p>
            </div>
          </div>
        </div>

        {/* Right: Bar Chart */}
        <div className="w-[45%] deeptag-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="deeptag-title text-lg">负面品类声量排行</h3>
            <span className="text-xs text-text-minor">（点击右侧「智能诊断」可查看根因分析）</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto pr-2">
            <div className="flex flex-col justify-between h-full py-2 gap-4">
              {NEGATIVE_CATEGORY.map((item, index) => {
                const isFirst = index === 0;
                const showPulse = isFirst && !hasPulsed;
                const isLoading = loadingCategory === item.name;

                return (
                  <div key={item.name} className="flex items-center gap-3 group relative">
                    <div className="w-20 text-sm font-medium text-text-main text-right truncate" title={item.name}>
                      {item.name}
                    </div>
                    
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-1 h-5 bg-gray-100 rounded-r-md overflow-hidden relative flex items-center">
                        <div 
                          className="h-full rounded-r-md transition-all duration-500"
                          style={{ 
                            width: `${(item.value / maxVal) * 100}%`,
                            backgroundColor: isFirst ? '#E09247' : '#F5A65B'
                          }}
                        />
                      </div>
                      <div className="w-12 text-sm font-medium text-text-main text-right">
                        {item.value.toLocaleString()}
                      </div>
                      <div className={`w-12 text-sm text-right ${item.mom > 0 ? 'text-status-negative' : 'text-status-positive'}`}>
                        {item.mom > 0 ? '▲' : '▼'}{Math.abs(item.mom)}%
                      </div>
                      <div className="w-24 relative flex items-center justify-end">
                        <button
                          onClick={() => handleDiagnosisClick(item.name)}
                          className={`
                            flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-300
                            ${isLoading ? 'bg-insight-purple-bg text-brand' : 'bg-insight-purple-bg/50 text-brand hover:bg-insight-purple-bg'}
                            ${showPulse ? 'animate-pulse ring-2 ring-brand/50 ring-offset-1' : ''}
                          `}
                        >
                          {isLoading ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Search size={12} />
                          )}
                          {isLoading ? '分析中...' : '智能诊断'}
                        </button>

                        {/* Tooltip */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-border-color p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                          <div className="flex items-center gap-1 text-brand font-bold text-sm mb-2">
                            <Bot size={14} /> 点击查看{item.name}
                          </div>
                          <div className="text-xs text-text-main font-medium mb-1">AI 负面根因分析</div>
                          <ul className="text-xs text-text-sub space-y-1 list-disc list-inside">
                            <li>负面维度分布</li>
                            <li>典型用户问题场景</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompetitorTab({ onOpenAI }: any) {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex gap-6 flex-1 min-h-[350px]">
        {/* Left: Trend Comparison */}
        <div className="w-[52%] deeptag-card p-5 flex flex-col">
          <h3 className="deeptag-title text-lg mb-4">满意度趋势对比</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={COMPETITOR_TREND} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 100]} tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{fontSize: 12, paddingTop: '10px'}} />
                <Line type="monotone" dataKey="本品" stroke="#1677FF" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="竞品A" stroke="#FF7D00" strokeWidth={2} strokeDasharray="5 5" dot={{r: 4}} />
                <Line type="monotone" dataKey="竞品B" stroke="#52C41A" strokeWidth={2} strokeDasharray="3 3" dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Radar Chart */}
        <div className="w-[48%] deeptag-card p-5 flex flex-col">
          <h3 className="deeptag-title text-lg mb-4">六维能力对比</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#4E5969', fontSize: 12, fontWeight: 500}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="本品" dataKey="A" stroke="#1677FF" fill="#1677FF" fillOpacity={0.3} />
                <Radar name="竞品A" dataKey="B" stroke="#FF7D00" fill="#FF7D00" fillOpacity={0.3} />
                <Legend wrapperStyle={{fontSize: 12, paddingTop: '10px'}} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="deeptag-card p-6 bg-gradient-to-r from-insight-purple-bg/50 to-white border-l-4 border-l-insight-purple-text">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-insight-purple-text font-bold">
            <Bot size={20} /> AI 竞品洞察
          </div>
          <button onClick={onOpenAI} className="text-insight-purple-text hover:bg-insight-purple-bg px-2 py-1 rounded text-sm flex items-center gap-1 transition-colors">
            <Sparkles size={14} /> 深度解读
          </button>
        </div>
        <p className="text-sm text-text-main leading-relaxed">
          本品在<span className="font-semibold text-brand">产品质量和口感</span>维度领先竞品A约8个百分点，体现出明显的产品力优势。但在<span className="font-semibold text-status-negative">物流配送和客服响应</span>维度落后竞品B约12个百分点，是当前最需补强的短板。竞品A近期「健康功效」类正向声量增长显著，建议关注其产品宣传策略变化，评估是否存在市场机会窗口。
        </p>
      </div>
    </div>
  );
}

function RootCauseDrawer({ isOpen, onClose, onOpenWorkOrder, selectedDim, setSelectedDim, isCorpusExpanded, setIsCorpusExpanded }: any) {
  const maxVal = Math.max(...ROOT_CAUSE_DIMENSIONS.map(d => d.value));
  const corpusData = ROOT_CAUSE_CORPUS[selectedDim.name] || ROOT_CAUSE_CORPUS['消化不良'];
  const displayItems = isCorpusExpanded ? corpusData.items : corpusData.items.slice(0, 2);

  return (
    <div className={`fixed top-[64px] right-0 h-[calc(100vh-64px)] w-[500px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.05)] border-l border-border-color transition-transform duration-300 z-40 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-color">
        <h3 className="text-lg font-bold text-text-main">婴幼儿奶粉 · 负面根因分析</h3>
        <button onClick={onClose} className="text-text-minor hover:text-text-main p-1 flex items-center gap-1 text-sm bg-gray-50 rounded px-2 py-1">
          返回品类列表 <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Subheader */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-text-main font-medium">负面声量 4,079条</span>
          <span className="text-status-negative font-medium">环比 ▲12.3%</span>
          <span className="text-text-sub">本期排名 <span className="text-brand font-bold">🥇第1</span></span>
        </div>

        <hr className="border-border-color" />

        {/* AI Summary */}
        <div className="bg-insight-purple-bg/30 border border-insight-purple-text/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-insight-purple-text font-bold mb-2">
            <Bot size={18} /> AI 根因总结
          </div>
          <p className="text-sm text-text-main leading-relaxed">
            本期核心问题集中在<span className="font-bold">消化不良（31%）</span>与<span className="font-bold">物流破损（24%）</span>两大方向，「绿便」「腹泻」等健康敏感词环比上升明显，建议优先排查近期批次配方。
          </p>
        </div>

        <hr className="border-border-color" />

        {/* Dimension Distribution */}
        <div>
          <h4 className="text-base font-bold text-text-main mb-4">负面维度分布</h4>
          <div className="space-y-3">
            {ROOT_CAUSE_DIMENSIONS.map((dim) => (
              <div 
                key={dim.name} 
                className={`flex items-center gap-3 cursor-pointer p-2 rounded transition-colors ${selectedDim.name === dim.name ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                onClick={() => { setSelectedDim(dim); setIsCorpusExpanded(false); }}
              >
                <div className="w-20 text-sm font-medium text-text-main">{dim.name}</div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${dim.alert ? 'bg-status-negative' : 'bg-brand'}`} 
                    style={{ width: `${(dim.value / maxVal) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-right text-sm font-medium text-text-main">{dim.value.toLocaleString()}条</div>
                <div className={`w-12 text-right text-sm ${dim.mom > 0 ? 'text-status-negative' : 'text-status-positive'}`}>
                  {dim.mom > 0 ? '▲' : '▼'}{Math.abs(dim.mom)}%
                </div>
                <div className="w-4 text-center">
                  {dim.alert && <span title="异常告警">🔴</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-border-color" />

        {/* Typical User Problems */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-base font-bold text-text-main">典型用户问题</h4>
            <span className="text-sm text-text-minor">{corpusData.count}条相关反馈</span>
          </div>
          <div className="text-sm text-text-sub mb-3">场景：{corpusData.scenario}</div>
          
          <div className="border border-border-color rounded-lg p-4 space-y-4 bg-gray-50">
            {displayItems.map((item: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <p className="text-sm text-text-main leading-relaxed">"{item.text}"</p>
                <div className="text-xs text-text-minor text-right">[{item.source} {item.date}]</div>
                {idx < displayItems.length - 1 && <hr className="border-border-color border-dashed my-2" />}
              </div>
            ))}
          </div>
          
          {!isCorpusExpanded && corpusData.items.length > 2 && (
            <button 
              onClick={() => setIsCorpusExpanded(true)}
              className="w-full mt-3 py-2 text-sm text-brand hover:bg-brand/5 rounded transition-colors"
            >
              展开更多语料 ▾
            </button>
          )}
        </div>

        <hr className="border-border-color" />

        {/* Footer Buttons */}
        <div className="flex gap-4 pt-2">
          <button 
            onClick={onOpenWorkOrder}
            className="flex-1 bg-brand text-white py-2 rounded-md hover:bg-brand/90 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            📋 创建根因改善工单
          </button>
          <button className="flex-1 bg-white border border-border-color text-text-main py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium">
            📤 导出分析报告
          </button>
        </div>
      </div>
    </div>
  );
}

function WorkOrderDrawer({ isOpen, onClose, selectedDim }: any) {
  return (
    <div className={`fixed top-[64px] right-0 h-[calc(100vh-64px)] w-[500px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.05)] border-l border-border-color transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-color">
        <div>
          <h3 className="text-lg font-bold text-text-main">创建改善工单</h3>
          <div className="text-sm text-brand flex items-center gap-1 mt-1">
            <Bot size={14} /> AI 已自动填充，可修改后提交
          </div>
        </div>
        <button onClick={onClose} className="text-text-minor hover:text-text-main p-1">
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 工单标题 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main">工单标题</label>
          <input 
            type="text" 
            className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand"
            defaultValue={`婴幼儿奶粉 · ${selectedDim.name}维度负面声量改善专项`}
          />
        </div>

        {/* 关联事业部 & 关联维度 */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-text-main">关联品类</label>
            <select className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand bg-white">
              <option>婴幼儿奶粉</option>
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-text-main">关联维度</label>
            <select className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand bg-white">
              <option>{selectedDim.name}</option>
            </select>
          </div>
        </div>

        {/* 优先级 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main">优先级</label>
          <select className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand bg-white">
            <option>🔴 第一顺位</option>
            <option>🟡 第二顺位</option>
            <option>🟢 第三顺位</option>
          </select>
        </div>

        {/* AI 生成内容 */}
        <div className="relative pt-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border-color"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm font-medium text-brand flex items-center gap-1">
              <Bot size={16} /> AI 生成内容
            </span>
          </div>
        </div>

        {/* 问题摘要 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main">问题摘要</label>
          <textarea 
            className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand min-h-[80px] resize-none"
            defaultValue={`「${selectedDim.name}」维度负面声量 ${selectedDim.value.toLocaleString()} 条，环比 ▲${selectedDim.mom}%。高频词集中在「绿便」「腹泻」，健康敏感词环比上升明显，建议优先排查近期批次配方。`}
          />
        </div>

        {/* 建议处理方案 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-main">建议处理方案</label>
          <textarea 
            className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand min-h-[100px] resize-none"
            defaultValue={`1. 紧急核查近一个月内生产的婴幼儿奶粉批次配方及留样。\n2. 收集客诉样本，进行实验室化验对比。\n3. 准备公关应对预案及客服统一话术。`}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border-color flex justify-end gap-3 bg-gray-50">
        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-main bg-white border border-border-color rounded hover:bg-gray-50 transition-colors">
          取消
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-brand rounded hover:bg-brand/90 transition-colors">
          确认创建
        </button>
      </div>
    </div>
  );
}
