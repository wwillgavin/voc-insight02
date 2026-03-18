import React from 'react';
import { ArrowUpRight, ArrowDownRight, Sparkles, ArrowRight } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';

interface HomeProps {
  onNavigate: (tab: string) => void;
  onOpenAI: () => void;
}

const BUBBLE_DATA = [
  { name: '液奶', volume: 341052, satisfaction: 82, negativeRatio: 15, color: '#2E7D32' }, // 浅绿色
  { name: '婴幼', volume: 87288, satisfaction: 88, negativeRatio: 8, color: '#FADC19' }, // Yellow
  { name: '成人', volume: 34090, satisfaction: 94, negativeRatio: 3, color: '#52C41A' }, // Green
  { name: '冷饮', volume: 12000, satisfaction: 96, negativeRatio: 2, color: '#64B5F6' }, // 浅蓝色
  { name: '奶酪', volume: 8500, satisfaction: 91, negativeRatio: 5, color: '#CE93D8' }, // 浅紫色
];

const BAR_DATA = [
  { name: '液奶', positive: 250000, neutral: 40000, negative: 51052 },
  { name: '婴幼', positive: 70000, neutral: 10000, negative: 7288 },
  { name: '成人', positive: 30000, neutral: 3000, negative: 1090 },
];

export default function Home({ onNavigate, onOpenAI }: HomeProps) {
  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Top Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-border-color text-sm">
          <span className="text-text-sub">时间范围:</span>
          <select className="bg-transparent font-medium outline-none cursor-pointer">
            <option>近7天</option>
            <option>近30天</option>
            <option>近90天</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard title="总声量" value="478,303" trend="up" trendValue="8.3%" />
        <MetricCard title="正面声量率" value="91.3%" trend="down" trendValue="1.2%" />
        <MetricCard title="负面预警" value="3个" trend="up" trendValue="较上期" isWarning />
        <MetricCard title="工单处理率" value="68.2%" trend="up" trendValue="5%" />
      </div>

      {/* Middle Section */}
      <div className="flex gap-6 h-[400px]">
        {/* Left: Bubble Matrix */}
        <div className="w-[58%] deeptag-card p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="deeptag-title text-lg">各事业部声量健康度矩阵</h3>
            <span className="text-xs text-text-minor">气泡大小: 负面声量占比</span>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis type="number" dataKey="volume" name="总声量" tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="satisfaction" name="满意度" domain={[70, 100]} tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
                <ZAxis type="number" dataKey="negativeRatio" range={[100, 1500]} name="负面占比" />
                <Tooltip cursor={{strokeDasharray: '3 3'}} content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{fontSize: 12}} 
                />
                {BUBBLE_DATA.map((entry, index) => (
                  <Scatter 
                    key={`scatter-${index}`} 
                    name={entry.name} 
                    data={[entry]} 
                    fill={entry.color} 
                    onClick={() => onNavigate('panorama')} 
                    cursor="pointer" 
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: AI Warning Center */}
        <div className="w-[42%] deeptag-card p-0 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-border-color flex justify-between items-center bg-gray-50/50">
            <h3 className="deeptag-title text-lg flex items-center gap-2">
              AI 智能预警中心
              <span className="bg-status-negative/10 text-status-negative text-xs px-2 py-0.5 rounded-full font-medium">3 待处理</span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <WarningItem 
              level="red" 
              dept="液奶" 
              title="负面声量 ↑18.3%" 
              desc="物流类投诉集中，建议优先处理。" 
              onAction={() => onNavigate('workorder')}
            />
            <WarningItem 
              level="yellow" 
              dept="婴幼儿" 
              title="不良反应 ↑28%" 
              desc="涉及食品安全敏感词，需立即排查。" 
              onAction={() => onNavigate('negative')}
            />
            <WarningItem 
              level="green" 
              dept="酸奶" 
              title="满意度连续3月 >95%" 
              desc="表现良好，建议总结优秀经验。" 
              actionText="查看详情"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="deeptag-card p-5 flex-1 min-h-[300px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="deeptag-title text-lg">各事业部声量对比</h3>
          <button onClick={onOpenAI} className="text-insight-purple-text hover:bg-insight-purple-bg px-2 py-1 rounded text-sm flex items-center gap-1 transition-colors">
            <Sparkles size={14} /> AI 解读
          </button>
        </div>
        <div className="w-full h-[250px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BAR_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
              <XAxis type="number" tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 13, fill: '#4E5969', fontWeight: 500}} width={60} />
              <Tooltip cursor={{fill: '#F5F7FA'}} />
              <Legend iconType="circle" wrapperStyle={{fontSize: 12, paddingTop: '10px'}} />
              <Bar dataKey="positive" name="正面" stackId="a" fill="#52C41A" radius={[0, 0, 0, 0]} onClick={() => onNavigate('panorama')} cursor="pointer" />
              <Bar dataKey="neutral" name="中性" stackId="a" fill="#DCDCDC" cursor="pointer" />
              <Bar dataKey="negative" name="负面" stackId="a" fill="#F5A65B" radius={[0, 4, 4, 0]} onClick={() => onNavigate('negative')} cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendValue, isWarning = false }: any) {
  return (
    <div className="deeptag-card p-5 flex flex-col justify-between">
      <div className="text-text-sub text-sm font-medium mb-2">{title}</div>
      <div className="flex items-end justify-between">
        <div className={`text-3xl font-bold ${isWarning ? 'text-status-negative' : 'text-text-main'}`}>
          {isWarning && <span className="text-xl mr-1">🔴</span>}
          {value}
        </div>
        <div className={`flex items-center text-sm font-medium ${trend === 'up' && !isWarning ? 'text-status-positive' : trend === 'down' ? 'text-status-negative' : 'text-status-negative'}`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trendValue}
        </div>
      </div>
    </div>
  );
}

function WarningItem({ level, dept, title, desc, actionText = '派发工单', onAction }: any) {
  const colors = {
    red: 'bg-status-negative/10 border-status-negative/20 text-status-negative',
    yellow: 'bg-orange-50 border-orange-100 text-orange-700',
    green: 'bg-status-positive/10 border-status-positive/20 text-status-positive'
  };
  const dotColors = {
    red: 'bg-status-negative',
    yellow: 'bg-orange-500',
    green: 'bg-status-positive'
  };

  return (
    <div className="p-3 mb-2 rounded-lg border border-transparent hover:bg-gray-50 transition-colors group cursor-pointer">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 mt-2 rounded-full ${dotColors[level as keyof typeof dotColors]}`}></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-text-main">{dept}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${colors[level as keyof typeof colors]}`}>{title}</span>
          </div>
          <p className="text-sm text-text-sub mb-2">{desc}</p>
          <button 
            onClick={(e) => { e.stopPropagation(); onAction?.(); }}
            className="text-brand text-sm font-medium flex items-center gap-1 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {actionText} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-border-color shadow-lg rounded-lg">
        <p className="font-bold text-text-main mb-2">{data.name}事业部</p>
        <p className="text-sm text-text-sub">总声量: <span className="font-medium text-text-main">{data.volume.toLocaleString()}</span></p>
        <p className="text-sm text-text-sub">满意度: <span className="font-medium text-text-main">{data.satisfaction}%</span></p>
        <p className="text-sm text-text-sub">负面占比: <span className="font-medium text-status-negative">{data.negativeRatio}%</span></p>
        <div className="mt-2 pt-2 border-t border-border-color text-xs text-brand cursor-pointer">
          点击查看声量全景 →
        </div>
      </div>
    );
  }
  return null;
};
