/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bot, Bell, User, ChevronRight, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import Pages (to be created)
import Home from './pages/Home';
import Panorama from './pages/Panorama';
import NegativeAnalysis from './pages/NegativeAnalysis';
import Quality from './pages/Quality';
import WorkOrder from './pages/WorkOrder';

const TABS = [
  { id: 'home', label: '首页全览' },
  { id: 'panorama', label: '声量全景' },
  { id: 'negative', label: '负面深析' },
  { id: 'quality', label: '品质监测' },
  { id: 'workorder', label: '工单闭环' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onNavigate={setActiveTab} onOpenAI={() => setIsAIPanelOpen(true)} />;
      case 'panorama': return <Panorama onOpenAI={() => setIsAIPanelOpen(true)} />;
      case 'negative': return <NegativeAnalysis onOpenAI={() => setIsAIPanelOpen(true)} />;
      case 'quality': return <Quality onOpenAI={() => setIsAIPanelOpen(true)} />;
      case 'workorder': return <WorkOrder onOpenAI={() => setIsAIPanelOpen(true)} />;
      default: return <Home onNavigate={setActiveTab} onOpenAI={() => setIsAIPanelOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-main font-sans text-text-main">
      {/* Top Navigation */}
      <header className="h-14 bg-white border-b border-border-color flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8C12 5 15 3 18 5L42 20C45 22 45 26 42 28L18 43C15 45 12 43 12 40V8Z" fill="#1677FF"/>
              <path d="M20 16C20 14 21.5 13 23 14L36 22.5C37.5 23.5 37.5 24.5 36 25.5L23 34C21.5 35 20 34 20 32V16Z" fill="white"/>
              <path d="M12 8C12 5 15 3 18 5L23 8L20 16L12 18V8Z" fill="#40A9FF"/>
            </svg>
            <span className="font-bold text-xl tracking-tight text-[#1677FF]">VOC智能看板</span>
          </div>
          
          <nav className="flex items-center gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'text-brand bg-blue-50' 
                    : 'text-text-sub hover:text-text-main hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAIPanelOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-insight-purple-bg text-insight-purple-text text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Sparkles size={16} />
            <span>AI 全局解读</span>
          </button>
          <div className="w-px h-4 bg-border-color mx-1"></div>
          <button className="text-text-sub hover:text-text-main relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-status-negative rounded-full border border-white"></span>
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-text-sub hover:bg-gray-200">
            <User size={18} />
          </button>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="px-6 py-3 flex items-center gap-2 text-sm text-text-minor">
        <span>VOC智能看板</span>
        <ChevronRight size={14} />
        <span className="text-text-main font-medium">{TABS.find(t => t.id === activeTab)?.label}</span>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 pb-6 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global AI Panel */}
      <AnimatePresence>
        {isAIPanelOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAIPanelOpen(false)}
              className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-border-color"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-color bg-gradient-to-r from-insight-purple-bg/50 to-white">
                <div className="flex items-center gap-2 text-insight-purple-text font-semibold">
                  <Bot size={20} />
                  <span>AI 智能解读</span>
                </div>
                <button 
                  onClick={() => setIsAIPanelOpen(false)}
                  className="text-text-minor hover:text-text-main p-1 rounded-md hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AITypingSection 
                  title="📊 核心发现"
                  content="当前负面声量较上月上升 12.3%，主要集中在「物流配送」和「产品口感」。液奶事业部受春节物流积压影响最为显著。"
                  delay={0}
                />
                <AITypingSection 
                  title="⚡ 风险预警"
                  content="「不良反应」维度声量环比 +28%，属于食品安全敏感词，婴幼儿奶粉品类尤为突出，建议优先排查生产批次与仓储环境。"
                  delay={1.5}
                  isWarning
                />
                <AITypingSection 
                  title="💡 改进建议"
                  content="优先处理卖家服务类工单（1,668条），预计可改善整体满意度约 2-3 个百分点。建议推动京东仓储配送 SLA 升级，重点城市先行试点。"
                  delay={3}
                />
              </div>

              <div className="p-4 border-t border-border-color bg-gray-50 flex gap-3">
                <button className="flex-1 py-2 bg-white border border-border-color rounded-md text-sm font-medium text-text-main hover:bg-gray-50 transition-colors">
                  📋 生成分析报告
                </button>
                <button className="flex-1 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
                  📨 推送企微
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper component for typewriter effect
function AITypingSection({ title, content, delay, isWarning = false }: { title: string, content: string, delay: number, isWarning?: boolean }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    let typingInterval: NodeJS.Timeout;

    timeout = setTimeout(() => {
      setIsTyping(true);
      let i = 0;
      typingInterval = setInterval(() => {
        if (i < content.length) {
          setDisplayedContent(content.substring(0, i + 1));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30); // Typing speed
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(typingInterval);
    };
  }, [content, delay]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-lg border ${isWarning ? 'bg-status-negative/10 border-status-negative/20' : 'bg-gray-50 border-gray-100'}`}
    >
      <h4 className={`font-semibold mb-2 ${isWarning ? 'text-status-negative' : 'text-text-main'}`}>{title}</h4>
      <p className="text-sm text-text-sub leading-relaxed min-h-[60px]">
        {displayedContent}
        {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-brand animate-pulse align-middle"></span>}
      </p>
    </motion.div>
  );
}
