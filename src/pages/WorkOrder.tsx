import React, { useState } from 'react';
import { Sparkles, Bot, AlertCircle, Clock, CheckCircle2, FileText, Plus, Search } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine } from 'recharts';

interface WorkOrderProps {
  onOpenAI: () => void;
}

const SUMMARY_DATA = [
  { title: '总工单', value: 512, color: 'text-text-main' },
  { title: '待处理', value: 387, color: 'text-orange-600' },
  { title: '超期预警', value: 23, color: 'text-status-negative', isWarning: true },
  { title: '结项率', value: '24.4%', color: 'text-status-positive' },
  { title: '计划完成率', value: '32.3%', color: 'text-brand' },
  { title: '体验改善成效', value: '▼1,240条', color: 'text-status-positive', subtext: '本季度已结项工单' },
];

const CLOSURE_RATE_DATA = [
  { name: '已结项', value: 125, color: '#52C41A' },
  { name: '未结项', value: 387, color: '#E5E7EB' },
];

const COMPLETION_TREND = [
  { month: 'Sep', rate: 18 },
  { month: 'Oct', rate: 20 },
  { month: 'Nov', rate: 22 },
  { month: 'Dec', rate: 24 },
  { month: 'Jan', rate: 22 },
  { month: 'Feb', rate: 24.4 },
];

const TABLE_DATA = [
  { id: '01', title: '物流配送改善', dept: '液奶', dim: '物流', owner: '张三', status: '超期', statusColor: 'red' },
  { id: '02', title: '包装优化专项', dept: '酸奶', dim: '包装', owner: '李四', status: '进行中', statusColor: 'blue' },
  { id: '03', title: '口感配方调整', dept: '奶酪', dim: '味道', owner: '王五', status: '已结项', statusColor: 'green' },
  { id: '04', title: '客服话术升级', dept: '集团', dim: '服务', owner: '赵六', status: '进行中', statusColor: 'blue' },
  { id: '05', title: '促销规则简化', dept: '成人', dim: '促销', owner: '钱七', status: '待处理', statusColor: 'gray' },
];

const IMPROVEMENT_TRACKING_DATA = [
  { id: 'W001', title: '华东区冷链物流提速', dept: '液奶', dim: '物流', closeDate: '2025-08-15', preVolume: 1250, postVolume: 850, change: -32, status: 'good' },
  { id: 'W002', title: '金典包装盖易开性优化', dept: '液奶', dim: '包装', closeDate: '2025-08-20', preVolume: 890, postVolume: 820, change: -7.8, status: 'warning' },
  { id: 'W003', title: '安慕希草莓味甜度调整', dept: '酸奶', dim: '味道', closeDate: '2025-09-01', preVolume: 650, postVolume: 710, change: 9.2, status: 'bad' },
  { id: 'W004', title: '电商破损包赔流程简化', dept: '集团', dim: '服务', closeDate: '2025-09-10', preVolume: 420, postVolume: 210, change: -50, status: 'good' },
];

const IMPROVEMENT_TREND_DATA = [
  { date: '08-01', volume: 45 },
  { date: '08-05', volume: 42 },
  { date: '08-10', volume: 48 },
  { date: '08-15', volume: 40 },
  { date: '08-20', volume: 30 },
  { date: '08-25', volume: 28 },
  { date: '08-30', volume: 25 },
  { date: '09-05', volume: 22 },
];

export default function WorkOrder({ onOpenAI }: WorkOrderProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-6 gap-4">
        {SUMMARY_DATA.map((item, i) => (
          <div key={i} className="deeptag-card p-4 cursor-pointer hover:border-brand transition-colors">
            <div className="text-text-sub text-sm font-medium mb-2">{item.title}</div>
            <div className={`text-2xl font-bold ${item.color} flex items-center gap-2`}>
              {item.isWarning && <AlertCircle size={20} />}
              {item.value}
            </div>
            {item.subtext && <div className="text-xs text-text-minor mt-1">{item.subtext}</div>}
          </div>
        ))}
      </div>

      {/* Middle Section */}
      <div className="flex gap-6 h-[280px]">
        {/* Left: Charts */}
        <div className="w-[45%] deeptag-card p-5 flex flex-col">
          <h3 className="deeptag-title text-lg mb-4">结项率与完成率趋势</h3>
          <div className="flex-1 flex gap-4">
            <div className="w-1/2 relative flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CLOSURE_RATE_DATA} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                    {CLOSURE_RATE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-text-main">24.4%</span>
                <span className="text-xs text-text-sub">整体结项率</span>
              </div>
            </div>
            <div className="w-1/2 flex flex-col">
              <span className="text-xs text-text-sub mb-2 text-center">行动计划月度完成率</span>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COMPLETION_TREND} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{fontSize: 10, fill: '#86909C'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 10, fill: '#86909C'}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#F5F7FA'}} />
                  <Bar dataKey="rate" fill="#1677FF" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Overdue Warnings */}
        <div className="w-[55%] deeptag-card p-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border-color bg-status-negative/5 flex justify-between items-center">
            <h3 className="deeptag-title text-lg flex items-center gap-2 text-status-negative">
              <AlertCircle size={20} /> 超期预警列表
            </h3>
            <span className="text-xs text-text-sub bg-white px-2 py-1 rounded border border-border-color">
              超 10天 未处理 → 自动推送业务负责人
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="p-3 border border-status-negative/20 bg-status-negative/5 rounded-lg flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-status-negative rounded-full"></span>
                  <span className="font-bold text-status-negative">超期 &gt;10天</span>
                  <span className="text-sm font-medium text-text-main">液奶_物流配送#023</span>
                </div>
                <div className="text-sm text-text-sub ml-4">负责人：张三 | 超期 2天</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white border border-border-color rounded text-sm font-medium hover:bg-gray-50">催办</button>
                <button className="px-3 py-1.5 bg-status-negative text-white rounded text-sm font-medium hover:bg-status-negative/90">延期申请</button>
              </div>
            </div>

            <div className="p-3 border border-amber-200 bg-amber-50 rounded-lg flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  <span className="font-bold text-amber-600">即将超期（5日内）</span>
                  <span className="text-sm font-medium text-text-main">酸奶_包装优化#041</span>
                </div>
                <div className="text-sm text-text-sub ml-4">负责人：李四 | 剩余 3天</div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsDetailOpen(true)}
                  className="px-3 py-1.5 bg-white border border-border-color rounded text-sm font-medium hover:bg-gray-50 text-brand"
                >
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Table */}
      <div className="deeptag-card p-5 flex-1 flex flex-col min-h-[300px]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-minor" size={16} />
              <input type="text" placeholder="搜索工单..." className="pl-9 pr-4 py-1.5 bg-gray-50 border border-border-color rounded-md text-sm outline-none focus:border-brand w-64" />
            </div>
            <select className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none">
              <option>全部状态</option>
              <option>超期</option>
              <option>进行中</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsReportOpen(true)} className="text-insight-purple-text hover:bg-insight-purple-bg px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors border border-insight-purple-text/20">
              <Bot size={16} /> 生成月度 AI 总结
            </button>
            <button className="bg-brand text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 hover:bg-blue-600 transition-colors shadow-sm">
              <Plus size={16} /> 新建工单
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto border border-border-color rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-text-sub text-sm border-b border-border-color">
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">工单标题</th>
                <th className="p-3 font-medium">事业部</th>
                <th className="p-3 font-medium">维度</th>
                <th className="p-3 font-medium">负责人</th>
                <th className="p-3 font-medium">状态</th>
                <th className="p-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_DATA.map((row, i) => (
                <tr key={i} className="border-b border-border-color hover:bg-gray-50/50 transition-colors text-sm">
                  <td className="p-3 text-text-minor">{row.id}</td>
                  <td className="p-3 font-medium text-text-main">{row.title}</td>
                  <td className="p-3 text-text-sub">{row.dept}</td>
                  <td className="p-3 text-text-sub">{row.dim}</td>
                  <td className="p-3 text-text-sub">{row.owner}</td>
                  <td className="p-3">
                    <span className={`flex items-center gap-1.5 ${
                      row.statusColor === 'red' ? 'text-status-negative' : 
                      row.statusColor === 'blue' ? 'text-blue-600' : 
                      row.statusColor === 'green' ? 'text-status-positive' : 'text-text-minor'
                    }`}>
                      {row.statusColor === 'red' && <span className="w-1.5 h-1.5 rounded-full bg-status-negative"></span>}
                      {row.statusColor === 'blue' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                      {row.statusColor === 'green' && <span className="w-1.5 h-1.5 rounded-full bg-status-positive"></span>}
                      {row.statusColor === 'gray' && <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>}
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => setIsDetailOpen(true)} className="text-brand hover:underline mr-3">详情</button>
                    <button className="text-text-sub hover:text-text-main">
                      {row.status === '超期' ? '催办' : row.status === '已结项' ? '归档' : '更新'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Improvement Tracking Module */}
      <div className="deeptag-card p-5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="deeptag-title text-lg">改善效果追踪</h3>
          <div className="flex gap-3">
            <select className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none">
              <option>全部事业部</option>
              <option>液奶</option>
              <option>酸奶</option>
            </select>
            <select className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none">
              <option>全部维度</option>
              <option>物流</option>
              <option>包装</option>
            </select>
            <select className="bg-gray-50 border border-border-color rounded px-3 py-1.5 text-sm outline-none">
              <option>近三个月结项</option>
              <option>近半年结项</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left: Table */}
          <div className="w-[60%] border border-border-color rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-text-sub text-sm border-b border-border-color">
                  <th className="p-3 font-medium">工单名称</th>
                  <th className="p-3 font-medium">维度</th>
                  <th className="p-3 font-medium">结项时间</th>
                  <th className="p-3 font-medium text-right">改善前声量</th>
                  <th className="p-3 font-medium text-right">改善后声量</th>
                  <th className="p-3 font-medium text-right">声量变化</th>
                </tr>
              </thead>
              <tbody>
                {IMPROVEMENT_TRACKING_DATA.map((row, i) => (
                  <tr key={i} className="border-b border-border-color hover:bg-gray-50/50 transition-colors text-sm cursor-pointer">
                    <td className="p-3 font-medium text-text-main">{row.title}</td>
                    <td className="p-3 text-text-sub">{row.dim}</td>
                    <td className="p-3 text-text-minor">{row.closeDate}</td>
                    <td className="p-3 text-right text-text-main">{row.preVolume}</td>
                    <td className="p-3 text-right text-text-main">{row.postVolume}</td>
                    <td className="p-3 text-right font-bold">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        row.status === 'good' ? 'bg-status-positive/10 text-status-positive' :
                        row.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                        'bg-status-negative/10 text-status-negative'
                      }`}>
                        {row.change > 0 ? '+' : ''}{row.change}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right: Trend & Insight */}
          <div className="w-[40%] flex flex-col gap-4">
            <div className="flex-1 border border-border-color rounded-lg p-4 relative">
              <h4 className="text-sm font-bold text-text-main mb-2">「华东区冷链物流提速」结项前后声量趋势</h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={IMPROVEMENT_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#86909C'}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #E5E7EB'}} />
                  <ReferenceLine x="08-15" stroke="#F53F3F" strokeDasharray="3 3" label={{ position: 'top', value: '结项日', fill: '#F53F3F', fontSize: 12 }} />
                  <Line type="monotone" dataKey="volume" stroke="#1677FF" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-insight-purple-bg/30 border border-insight-purple-text/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-insight-purple-text font-semibold mb-2">
                <Bot size={18} /> AI 闭环洞察
              </div>
              <p className="text-sm text-text-sub leading-relaxed">
                本季度物流类工单结项后，物流负面声量平均下降 <span className="text-status-positive font-bold">35%</span>，改善效果显著；但包装类工单（如金典包装盖优化）结项后，负面声量未见明显下降，建议复盘包装改善方案的有效性。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDetailOpen(false)}></div>
          <div className="relative w-[500px] bg-white h-full shadow-2xl flex flex-col border-l border-border-color animate-in slide-in-from-right">
            <div className="p-5 border-b border-border-color flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-text-main">工单详情 #023</h2>
              <button onClick={() => setIsDetailOpen(false)} className="text-text-minor hover:text-text-main">✕</button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div>
                <h3 className="text-xl font-bold text-text-main mb-2">液奶事业部 · 物流配送体验改善</h3>
                <div className="flex items-center gap-4 text-sm text-text-sub">
                  <span className="flex items-center gap-1 text-status-negative font-medium"><span className="w-2 h-2 rounded-full bg-status-negative"></span> 超期处理中</span>
                  <span>优先级：第一顺位</span>
                </div>
                <div className="mt-2 text-sm text-text-minor">负责人：张三 | 创建时间：2026-02-01</div>
              </div>

              <div className="bg-gray-50 border border-border-color rounded-lg p-4">
                <h4 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                  📊 关联数据（AI 自动关联）
                </h4>
                <div className="space-y-2 text-sm text-text-sub">
                  <div className="flex justify-between"><span>本品物流负面声量：</span><span className="font-medium text-text-main">609 条</span></div>
                  <div className="flex justify-between"><span>行业均值：</span><span className="font-medium text-text-main">312 条</span></div>
                  <div className="flex justify-between pt-2 border-t border-border-color">
                    <span>差距：</span><span className="font-bold text-status-negative">↑ 95%（显著高于行业均值）</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-text-main mb-3">📋 处理进度记录</h4>
                <div className="space-y-4 border-l-2 border-border-color ml-2 pl-4 relative">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white"></div>
                    <div className="text-xs text-text-minor mb-1">2026-02-05</div>
                    <div className="text-sm text-text-main"><span className="font-medium">张三：</span>已与京东物流确认，等待排查</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand border-2 border-white"></div>
                    <div className="text-xs text-text-minor mb-1">2026-02-12</div>
                    <div className="text-sm text-text-main"><span className="font-medium">张三：</span>京东已反馈，计划2周内优化</div>
                  </div>
                </div>
                <button className="mt-4 text-sm text-brand font-medium flex items-center gap-1 hover:underline">
                  <Plus size={14} /> 添加进度记录
                </button>
              </div>

              <div className="bg-insight-purple-bg/30 border border-insight-purple-text/20 rounded-lg p-4">
                <h4 className="font-semibold text-insight-purple-text mb-2 flex items-center gap-2">
                  <Bot size={18} /> AI 改进建议
                </h4>
                <p className="text-sm text-text-sub leading-relaxed">
                  语料分析显示，用户投诉集中在「最后一公里」配送不规范，建议推动京东仓储配送 SLA 升级，重点城市先行试点并追踪试点后声量变化。
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-border-color bg-gray-50 flex gap-3">
              <button className="flex-1 py-2 bg-white border border-border-color rounded-md text-sm font-medium text-text-main hover:bg-gray-100">标记结项</button>
              <button className="flex-1 py-2 bg-white border border-border-color rounded-md text-sm font-medium text-text-main hover:bg-gray-100">申请延期</button>
              <button className="flex-1 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-blue-600 shadow-sm">推送提醒</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsReportOpen(false)}></div>
          <div className="relative w-full max-w-4xl max-h-full bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-border-color flex justify-between items-center bg-gradient-to-r from-insight-purple-bg to-white">
              <h2 className="text-xl font-bold text-insight-purple-text flex items-center gap-2">
                <Bot size={24} /> 🤖 AI 工单月度洞察报告 · 2026年2月
              </h2>
              <div className="flex gap-3">
                <button className="bg-brand text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-sm hover:bg-blue-600">推送企微</button>
                <button onClick={() => setIsReportOpen(false)} className="text-text-minor hover:text-text-main px-2">✕</button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
              {/* Summary */}
              <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm">
                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">📦 本月工单总览</h3>
                <div className="grid grid-cols-4 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-text-sub mb-1">总工单</div>
                    <div className="text-3xl font-bold text-text-main">128</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-brand mb-1">新增</div>
                    <div className="text-3xl font-bold text-brand">45</div>
                  </div>
                  <div className="bg-status-positive/10 p-4 rounded-lg text-center">
                    <div className="text-sm text-status-positive mb-1">已结项</div>
                    <div className="text-3xl font-bold text-status-positive">32</div>
                  </div>
                  <div className="bg-status-negative/10 p-4 rounded-lg text-center border border-status-negative/20">
                    <div className="text-sm text-status-negative mb-1">超期</div>
                    <div className="text-3xl font-bold text-status-negative flex items-center justify-center gap-1"><span className="text-xl">🔴</span> 8</div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="flex gap-6 h-64">
                <div className="w-1/2 bg-white p-6 rounded-xl border border-border-color shadow-sm flex flex-col">
                  <h3 className="text-md font-bold text-text-main mb-4">📊 工单类型分布</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-[16px] border-brand border-r-status-positive border-b-orange-500 border-l-purple-500 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-sub">分布</div>
                    </div>
                    <div className="ml-8 space-y-2 text-sm">
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-brand rounded-sm"></span>物流 38%</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-status-positive rounded-sm"></span>服务 25%</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-500 rounded-sm"></span>质量 22%</div>
                      <div className="flex items-center gap-2"><span className="w-3 h-3 bg-purple-500 rounded-sm"></span>包装 15%</div>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 bg-white p-6 rounded-xl border border-border-color shadow-sm flex flex-col">
                  <h3 className="text-md font-bold text-text-main mb-4">🏢 涉及部门分布</h3>
                  <div className="flex-1 space-y-4 justify-center flex flex-col">
                    {[
                      { name: '电商运营', val: 42, color: 'bg-blue-500' },
                      { name: '供应链', val: 28, color: 'bg-blue-400' },
                      { name: '产品研发', val: 18, color: 'bg-blue-300' },
                      { name: '客服中心', val: 12, color: 'bg-blue-200' },
                    ].map(d => (
                      <div key={d.name} className="flex items-center gap-3">
                        <div className="w-16 text-sm text-text-sub text-right">{d.name}</div>
                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${d.color}`} style={{width: `${d.val}%`}}></div>
                        </div>
                        <div className="w-8 text-sm font-medium">{d.val}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Insight Text */}
              <div className="bg-insight-purple-bg/20 p-6 rounded-xl border border-insight-purple-text/30">
                <h3 className="text-lg font-bold text-insight-purple-text mb-4 flex items-center gap-2">
                  <Bot size={20} /> 核心洞察与改进机会
                </h3>
                <div className="space-y-4 text-sm text-text-main leading-relaxed">
                  <p>本月共处理工单 128 个，覆盖物流、质量、服务 3 大核心环节，涉及电商运营、供应链等 4 个部门，结项率 24.4%，环比上升 2.4 个百分点。</p>
                  <div className="p-4 bg-white rounded-lg border border-border-color shadow-sm">
                    <span className="font-bold text-status-negative">【核心问题】</span> 物流配送类工单占比最高（38%），平均处理周期 8.3 天，超出第一顺位工单规定时效 4.3 天，响应效率亟需改善。
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-border-color shadow-sm">
                    <span className="font-bold text-brand">【改进机会】</span> 末端配送问题已连续 3 月位居 TOP1，建议升级为集团级专项改善项目。同时，产品口感类工单中「没奶味」诉求集中，建议研发部门启动配方复核，预计可降低该维度负面声量约 15-20%。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
