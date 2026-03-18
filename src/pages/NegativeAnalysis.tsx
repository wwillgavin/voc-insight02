import React, { useState } from 'react';
import { Sparkles, Bot, ChevronRight, AlertTriangle, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

interface NegativeAnalysisProps {
  onOpenAI: () => void;
}

const DIMENSION_DATA = [
  { name: '卖家服务', current: 1668, prev: 1489, trend: 'up', ratio: 12 },
  { name: '买家态度', current: 1533, prev: 1419, trend: 'up', ratio: 8 },
  { name: '产品质量', current: 1236, prev: 1274, trend: 'down', ratio: 3 },
  { name: '味道', current: 1119, prev: 1065, trend: 'up', ratio: 5 },
  { name: '包装', current: 1092, prev: 1070, trend: 'up', ratio: 2 },
  { name: '促销', current: 1027, prev: 1000, trend: 'up', ratio: 2 },
  { name: '价格', current: 806, prev: 800, trend: 'up', ratio: 0 },
  { name: '物流', current: 609, prev: 500, trend: 'up', ratio: 21 },
  { name: '不良反应', current: 389, prev: 300, trend: 'up', ratio: 29 },
];

const NEGATIVE_BRAND_DATA = [
  { name: '金典', volume: 1203, ratio: 29, mom: 8, alert: false },
  { name: '安慕希', volume: 986, ratio: 24, mom: -3, alert: false },
  { name: '伊利纯牛奶', volume: 754, ratio: 18, mom: 2, alert: false },
  { name: '畅轻', volume: 521, ratio: 13, mom: 15, alert: true },
  { name: '每益添', volume: 389, ratio: 9, mom: -1, alert: false },
];

const NEGATIVE_FLAVOR_DATA = [
  { name: '原味', volume: 1456, mom: 5, alert: false },
  { name: '草莓味', volume: 892, mom: 12, alert: true },
  { name: '蓝莓味', volume: 643, mom: -2, alert: false },
  { name: '香草味', volume: 512, mom: 3, alert: false },
];

const NEGATIVE_SHOP_DATA = [
  { name: '京东自营旗舰店', volume: 1203, ratio: 29, mom: 2, alert: false },
  { name: '天猫官方旗舰店', volume: 897, ratio: 22, mom: -1, alert: false },
  { name: '抖音直播间', volume: 634, ratio: 15, mom: 5, alert: false },
  { name: '第三方代销店', volume: 489, ratio: 12, mom: 18, alert: true },
];

const NEGATIVE_WORD_TREND_DATA = [
  { date: '25-04', 重胶水味: 120, 不送货上门: 350, 没奶味: 200 },
  { date: '25-05', 重胶水味: 130, 不送货上门: 320, 没奶味: 210 },
  { date: '25-06', 重胶水味: 150, 不送货上门: 300, 没奶味: 205 },
  { date: '25-07', 重胶水味: 180, 不送货上门: 280, 没奶味: 220 },
  { date: '25-08', 重胶水味: 220, 不送货上门: 250, 没奶味: 215 },
  { date: '25-09', 重胶水味: 280, 不送货上门: 210, 没奶味: 230 },
];

const REAL_CORPUS_DATA: Record<string, string[]> = {
  '快递员差评': [
    "快递员直接把包裹扔在小区门口的快递柜里，连个电话都不打，我家里有宝宝，奶粉急需用，结果还得自己跑一趟取货，太不负责了！",
    "快递员打电话说放驿站了，我问能不能送上门，他直接说‘我们不送货上门，你自己来拿’，这服务态度也太差了吧？",
    "快递员把奶粉放在楼道口就走了，也没敲门，我家宝宝刚出生，奶粉是刚需，这种粗暴操作让人很无语。",
    "下单时明确写了‘请送货上门’，结果快递员还是扔到代收点，还说‘系统不让改’，这不是推卸责任吗？",
    "快递员把一箱奶粉放在雨里两小时都没人管，等我去取的时候外面纸箱都湿透了，里面罐子都发霉了，你们得给个说法！"
  ],
  '质量差': [
    "冲泡后奶粉结块严重，怎么摇都化不开，宝宝喝了吐奶，跟之前买的完全不一样，怀疑是批次问题。",
    "打开罐子闻到一股奇怪的腥味，不是奶香，像塑料味，宝宝喝了一口就哭，不敢再喂了。",
    "奶粉里发现黑色颗粒物，拍照给客服看，他们只说‘可能是生产过程中的杂质’，这种解释能接受吗？",
    "连续三罐都出现挂壁现象，奶瓶壁全是透明小结晶，按说明书水温冲的，难道是配方变了？",
    "奶粉包装鼓包，铝箔膜鼓得很高，客服说是‘气压变化导致’，但我担心是变质了，孩子吃了会不会出事？"
  ],
  '没奶味': [
    "这款奶粉味道特别淡，一点奶香味都没有，宝宝根本不爱喝，以前喝的那款明显更香，换过来后喝一半就吐了。",
    "冲出来像白开水一样，没有奶味，也没有甜味，宝宝闻都不闻，是不是添加了什么奇怪的成分？",
    "我试了不同水温、不同比例，还是觉得味道寡淡，不像奶粉，更像是营养粉，孩子喝着没兴趣。",
    "对比过其他品牌，这款真的毫无奶香，反而有点重胶水味，我怀疑是不是原料有问题。",
    "宝宝喝完后嘴里都是怪味，不是奶香，而是那种化工味，我怕长期喝会影响味觉发育，想换回去。"
  ]
};

export default function NegativeAnalysis({ onOpenAI }: NegativeAnalysisProps) {
  const [selectedDim, setSelectedDim] = useState(DIMENSION_DATA[2]); // Default '产品质量'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState('产品质量');

  return (
    <div className="flex w-full h-full overflow-hidden relative">
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${isDrawerOpen ? 'pr-[500px]' : ''}`}>
        <div className="space-y-6 flex flex-col pb-8">
          {/* Top Filters */}
          <div className="flex items-center justify-end bg-white p-3 rounded-lg border border-border-color">
            <div className="flex gap-3">
              <select className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none">
                <option>全部品类</option>
              </select>
              <select className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none">
                <option>全部品牌</option>
              </select>
              <select className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none">
                <option>全部渠道</option>
              </select>
            </div>
          </div>

          {/* Content Sections */}
          <div className="flex flex-col gap-6">
            <DimensionSection selectedDim={selectedDim} setSelectedDim={setSelectedDim} />
            <NegativeMultiDimension />
            <PainVsGainSection onOpenDrawer={(type) => { setDrawerType(type); setIsDrawerOpen(true); }} />
          </div>
        </div>
      </div>

      {/* Drawer */}
      <div className={`fixed top-[64px] right-0 h-[calc(100vh-64px)] w-[500px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.05)] border-l border-border-color transition-transform duration-300 z-40 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-color">
          <div>
            <h3 className="text-lg font-bold text-text-main">创建改善工单</h3>
            <div className="text-sm text-brand flex items-center gap-1 mt-1">
              <Bot size={14} /> AI 已自动填充，可修改后提交
            </div>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="text-text-minor hover:text-text-main p-1">
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
              defaultValue={`液奶事业部 · ${drawerType}维度负面声量改善专项`}
            />
          </div>

          {/* 关联事业部 & 关联维度 */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-text-main">关联事业部</label>
              <select className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand bg-white">
                <option>液奶事业部</option>
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-text-main">关联维度</label>
              <select className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand bg-white">
                <option>{drawerType}</option>
              </select>
            </div>
          </div>

          {/* 关联品类 & 优先级 */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-text-main">关联品类</label>
              <select className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand bg-white">
                <option>高端纯牛奶</option>
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-text-main">优先级</label>
              <select className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand bg-white">
                <option>🔴 第一顺位</option>
                <option>🟡 第二顺位</option>
                <option>🟢 第三顺位</option>
              </select>
            </div>
          </div>
          <div className="text-xs text-text-minor flex items-center gap-1 bg-gray-50 p-2 rounded">
            <AlertTriangle size={14} className="text-orange-500" /> 需2个工作日内处理，超5天推送至组长
          </div>

          {/* 负责人 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">负责人</label>
            <select className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand bg-white">
              <option>张三</option>
              <option>李四</option>
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
              defaultValue={`「${drawerType}」维度负面声量 1,236 条，环比 ▲15%，连续2月上升。高频词集中在「重胶水味」「没奶味」，风味与预期差距明显。`}
            />
          </div>

          {/* 改进建议 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-main">改进建议</label>
            <textarea 
              className="w-full border border-border-color rounded-md px-3 py-2 text-sm text-text-main outline-none focus:border-brand min-h-[100px] resize-none"
              defaultValue={`1. 排查近期批次配方变更，核查风味添加剂\n2. 对比历史低投诉批次的生产参数差异\n3. 建议2周内完成配方复核`}
            />
          </div>

          {/* 关联语料 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-text-main">关联语料</label>
              <button className="text-xs text-brand hover:underline">展开全部</button>
            </div>
            <div className="bg-gray-50 border border-border-color rounded-md p-3 space-y-2">
              <div className="text-sm text-text-main flex gap-2">
                <span className="text-text-minor">•</span>
                <span>"奶味很淡，有明显胶水味..." <span className="text-text-minor text-xs">[京东 02-15]</span></span>
              </div>
              <div className="text-sm text-text-main flex gap-2">
                <span className="text-text-minor">•</span>
                <span>"跟之前批次口感差很多..." <span className="text-text-minor text-xs">[天猫 02-18]</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-color flex justify-end gap-3 bg-gray-50">
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="px-4 py-2 border border-border-color rounded-md text-sm font-medium text-text-main hover:bg-gray-100 bg-white"
          >
            取消
          </button>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-blue-600 shadow-sm"
          >
            提交工单并同步至工单系统 →
          </button>
        </div>
      </div>
    </div>
  );
}

function NegativeMultiDimension() {
  const [activeTab, setActiveTab] = useState('品牌');

  return (
    <div className="deeptag-card flex flex-col">
      <div className="p-4 border-b border-border-color flex gap-6">
        {['品牌', '口味', '店铺', '词动'].map(tab => (
          <button 
            key={tab}
            className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-brand text-brand' : 'border-transparent text-text-sub hover:text-text-main'}`}
            onClick={() => setActiveTab(tab)}
          >
            负面{tab}
          </button>
        ))}
      </div>
      
      <div className="p-6 min-h-[300px]">
        {activeTab === '品牌' && (
          <div className="flex gap-6">
            <div className="flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-color text-text-sub text-sm">
                    <th className="pb-3 font-medium">品牌名称</th>
                    <th className="pb-3 font-medium">负面声量</th>
                    <th className="pb-3 font-medium">占比</th>
                    <th className="pb-3 font-medium">环比</th>
                  </tr>
                </thead>
                <tbody>
                  {NEGATIVE_BRAND_DATA.map((row, idx) => (
                    <tr key={idx} className={`border-b border-gray-100 ${row.alert ? 'bg-red-50/30' : ''}`}>
                      <td className="py-3 text-sm font-medium text-text-main">{row.name}</td>
                      <td className="py-3 text-sm font-bold text-text-main">{row.volume.toLocaleString()}</td>
                      <td className="py-3 text-sm text-text-main">{row.ratio}%</td>
                      <td className={`py-3 text-sm flex items-center gap-1 ${row.mom < 0 ? 'text-status-positive' : 'text-status-negative'}`}>
                        {row.mom > 0 ? '▲' : '▼'}{Math.abs(row.mom)}%
                        {row.alert && <span className="w-2 h-2 bg-status-negative rounded-full" title="环比涨幅异常"></span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-[300px] bg-insight-purple-bg/30 border border-insight-purple-text/20 p-4 rounded-lg flex flex-col">
              <div className="flex items-center gap-2 text-insight-purple-text font-semibold mb-2">
                <Bot size={18} /> AI 解读
              </div>
              <p className="text-sm text-text-sub leading-relaxed">
                「畅轻」品牌本期负面声量环比激增 <span className="text-status-negative font-bold">15%</span>，主要集中在包装破损和保质期临近问题，建议重点排查该品牌近期的仓储及发货批次。
              </p>
            </div>
          </div>
        )}

        {activeTab === '口味' && (
          <div className="space-y-4">
            {NEGATIVE_FLAVOR_DATA.map((item, i) => (
              <div key={item.name} className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                <div className="w-20 text-sm font-medium text-text-main">{item.name}</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-r-md overflow-hidden flex items-center">
                  <div 
                    className="h-full bg-status-negative" 
                    style={{width: `${(item.volume / 1456) * 100}%`}}
                  ></div>
                </div>
                <div className="w-16 text-right text-sm font-bold text-text-main">{item.volume.toLocaleString()}</div>
                <div className={`w-16 text-right text-sm flex items-center justify-end gap-1 ${item.mom < 0 ? 'text-status-positive' : 'text-status-negative'}`}>
                  {item.mom > 0 ? '▲' : '▼'}{Math.abs(item.mom)}%
                  {item.alert && <span className="w-2 h-2 bg-status-negative rounded-full"></span>}
                </div>
              </div>
            ))}
            <div className="text-xs text-text-minor mt-4 pt-4 border-t border-border-color">
              * 点击口味可下钻查看该口味的专属负面词云及原始语料
            </div>
          </div>
        )}

        {activeTab === '店铺' && (
          <div className="space-y-4">
            {NEGATIVE_SHOP_DATA.map((item, i) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-text-main truncate" title={item.name}>{item.name}</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-r-md overflow-hidden flex items-center">
                  <div 
                    className="h-full bg-status-negative" 
                    style={{width: `${(item.volume / 1203) * 100}%`}}
                  ></div>
                </div>
                <div className="w-16 text-right text-sm font-bold text-text-main">{item.volume.toLocaleString()}</div>
                <div className="w-16 text-right text-sm text-text-minor">占比{item.ratio}%</div>
                <div className={`w-16 text-right text-sm flex items-center justify-end gap-1 ${item.mom < 0 ? 'text-status-positive' : 'text-status-negative'}`}>
                  {item.mom > 0 ? '▲' : '▼'}{Math.abs(item.mom)}%
                  {item.alert && <span className="w-2 h-2 bg-status-negative rounded-full" title="异常增长"></span>}
                </div>
              </div>
            ))}
            <div className="text-xs text-status-negative mt-4 pt-4 border-t border-border-color flex items-center gap-1">
              <AlertTriangle size={14} /> 风险提示：第三方代销店负面声量环比异常增长 18%，需加强渠道管控。
            </div>
          </div>
        )}

        {activeTab === '词动' && (
          <div className="flex gap-6 h-[250px]">
            <div className="flex-1 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={NEGATIVE_WORD_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                  <Line type="monotone" dataKey="重胶水味" stroke="#F53F3F" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="不送货上门" stroke="#52C41A" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="没奶味" stroke="#1677FF" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="w-[300px] bg-insight-purple-bg/30 border border-insight-purple-text/20 p-4 rounded-lg flex flex-col">
              <div className="flex items-center gap-2 text-insight-purple-text font-semibold mb-4">
                <Bot size={18} /> AI 词动解读
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-bold text-text-main mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-status-negative rounded-full"></span> 新兴词预警
                  </div>
                  <p className="text-sm text-text-sub">「重胶水味」近3月持续上升 <span className="text-status-negative font-bold">▲34%</span></p>
                </div>
                <div>
                  <div className="text-sm font-bold text-text-main mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-status-positive rounded-full"></span> 消退词提示
                  </div>
                  <p className="text-sm text-text-sub">「不送货上门」近2月明显下降 <span className="text-status-positive font-bold">▼21%</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DimensionSection({ selectedDim, setSelectedDim }: any) {
  return (
    <div className="flex gap-6 h-[350px]">
      {/* Left: Bar Chart */}
      <div className="w-[55%] deeptag-card p-5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="deeptag-title text-lg">负面维度排行</h3>
          <span className="text-xs text-text-minor">红色实条=本期，灰色细条=上期</span>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DIMENSION_DATA} layout="vertical" margin={{ top: 0, right: 50, left: 0, bottom: 0 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 13, fill: '#4E5969', fontWeight: 500}} width={80} />
              <Tooltip cursor={{fill: '#F5F7FA'}} />
              <Bar dataKey="prev" name="上期" fill="#E5E7EB" radius={[0, 4, 4, 0]} barSize={6} />
              <Bar dataKey="current" name="本期" fill="#F5A65B" radius={[0, 4, 4, 0]} onClick={(data) => setSelectedDim(data)} cursor="pointer">
                {DIMENSION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === selectedDim.name ? '#E09247' : '#F5A65B'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right: Detail Panel */}
      <div className="w-[45%] deeptag-card p-6 flex flex-col bg-gradient-to-br from-white to-gray-50/50">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-text-main mb-1">维度：{selectedDim.name}</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-text-sub">当前声量: <span className="font-bold text-text-main text-lg">{selectedDim.current.toLocaleString()}</span></span>
              <span className={`font-medium ${selectedDim.trend === 'up' ? 'text-status-negative' : 'text-status-positive'}`}>
                环比 {selectedDim.trend === 'up' ? '▲' : '▼'}{selectedDim.ratio}%
              </span>
            </div>
          </div>
          <button className="text-brand bg-blue-50 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors">
            一键派发工单 →
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-text-sub mb-3">Top5 高频词</h4>
          <div className="flex flex-wrap gap-2">
            {['质量差', '品质不好', '质量一般', '重胶水味', '没奶味'].map((word, i) => (
              <span key={word} className="px-3 py-1 bg-white border border-border-color rounded-full text-sm text-text-main shadow-sm">
                {word} <span className="text-text-minor text-xs ml-1">{100 - i * 15}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto bg-insight-purple-bg/30 border border-insight-purple-text/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-insight-purple-text font-semibold mb-2">
            <Bot size={18} /> AI 根因推断
          </div>
          <p className="text-sm text-text-sub leading-relaxed">
            该维度连续2月上升，主要集中在风味类投诉（"重胶水味"、"没奶味"）。建议启动配方专项改善工单，并核查近期生产批次的原料稳定性。
          </p>
        </div>
      </div>
    </div>
  );
}









function PainVsGainSection({ onOpenDrawer }: { onOpenDrawer: (type: string) => void }) {
  const gains = [
    { name: '口感细腻', value: 8920, trend: '+12%' },
    { name: '营养丰富', value: 7430, trend: '+8%' },
    { name: '包装精美', value: 6110, trend: '+5%' },
    { name: '方便携带', value: 4890, trend: '+3%' },
    { name: '客服响应快', value: 3720, trend: '+1%' },
  ];
  const pains = [
    { name: '物流配送差', value: 3201, trend: '+21%' },
    { name: '产品质量差', value: 1236, trend: '+15%' },
    { name: '味道异常', value: 1119, trend: '+8%' },
    { name: '价格偏贵', value: 806, trend: '+4%' },
    { name: '包装破损', value: 609, trend: '+2%' },
  ];

  return (
    <div className="deeptag-card flex flex-col">
      <div className="p-6 border-b border-border-color flex justify-between items-center">
        <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
          爽点 vs 痛点 
          <span className="text-sm font-normal text-brand bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
            <Sparkles size={14}/> AI解读
          </span>
        </h3>
      </div>
      <div className="flex">
        {/* Gains */}
        <div className="w-1/2 p-6 border-r border-border-color">
          <h4 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
            🌟 产品爽点 TOP5
          </h4>
          <div className="space-y-6">
            {gains.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-5 text-center font-bold text-text-minor">{['①', '②', '③', '④', '⑤'][i]}</div>
                <div className="w-20 text-sm font-medium text-text-main truncate" title={item.name}>{item.name}</div>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden flex items-center">
                  <div 
                    className="h-full bg-status-positive" 
                    style={{width: `${(item.value / 8920) * 100}%`}}
                  ></div>
                </div>
                <div className="w-24 text-right text-sm flex items-center justify-end gap-2">
                  <span className="font-bold text-text-main">{item.value.toLocaleString()}</span>
                  <span className="text-xs text-status-positive">{item.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pains */}
        <div className="w-1/2 p-6">
          <h4 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
            😤 产品痛点 TOP5
          </h4>
          <div className="space-y-6">
            {pains.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-5 text-center font-bold text-text-minor">{['①', '②', '③', '④', '⑤'][i]}</div>
                <div className="w-20 text-sm font-medium text-text-main truncate" title={item.name}>{item.name}</div>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden flex items-center">
                  <div 
                    className="h-full bg-status-negative" 
                    style={{width: `${(item.value / 3201) * 100}%`}}
                  ></div>
                </div>
                <div className="w-24 text-right text-sm flex items-center justify-end gap-2">
                  <span className="font-bold text-text-main">{item.value.toLocaleString()}</span>
                  <span className="text-xs text-status-negative">{item.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-insight-blue-bg/50 to-white p-6 border-t border-border-color">
        <div className="flex items-center gap-2 text-brand font-bold mb-3">
          <Bot size={20} /> AI 综合洞察
        </div>
        <p className="text-sm text-text-main leading-relaxed mb-4">
          本期用户体验存在明显分裂：产品口感与营养获得高度认可，但物流配送与客服服务是损害整体体验的主要短板。建议将末端配送列为优先改善项，同时将口感优势强化为核心宣传卖点，预计可带动满意度提升约 3-5 个百分点。
        </p>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-minor">针对痛点 TOP1「物流配送差」· TOP2「产品质量差」可快速创建改善工单：</span>
          <button 
            onClick={() => onOpenDrawer('物流配送')}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-border-color rounded hover:bg-gray-50 text-sm text-text-main shadow-sm"
          >
            📋 创建"物流配送"工单
          </button>
          <button 
            onClick={() => onOpenDrawer('产品质量')}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-border-color rounded hover:bg-gray-50 text-sm text-text-main shadow-sm"
          >
            📋 创建"产品质量"工单
          </button>
        </div>
      </div>
    </div>
  );
}
