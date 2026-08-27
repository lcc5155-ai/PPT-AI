import React, { useState } from 'react';
import { Layers, Cpu, Database, Code, Sparkles } from 'lucide-react';
import Architecture from './components/Architecture';
import Simulator from './components/Simulator';
import MemoryLab from './components/MemoryLab';
import CodeLab from './components/CodeLab';

function App() {
  const [activeTab, setActiveTab] = useState('architecture');

  const renderContent = () => {
    switch (activeTab) {
      case 'architecture':
        return <Architecture />;
      case 'simulator':
        return <Simulator />;
      case 'memory':
        return <MemoryLab />;
      case 'code':
        return <CodeLab />;
      default:
        return <Architecture />;
    }
  };

  return (
    <div className="layout-container">
      {/* 頂部導航 */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        marginBottom: '40px',
        borderBottom: '1px solid var(--border-color)',
      }} className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.5px' }} className="text-neon-cyan">
              AGENT PLAYGROUND
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Interactive Learning Hub
            </span>
          </div>
        </div>

        {/* 頁面主要切換標籤 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Layers size={16} /> 核心架構
          </button>
          <button
            className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <Cpu size={16} /> ReAct 模擬器
          </button>
          <button
            className={`tab-btn ${activeTab === 'memory' ? 'active' : ''}`}
            onClick={() => setActiveTab('memory')}
          >
            <Database size={16} /> 記憶實驗室
          </button>
          <button
            className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            <Code size={16} /> 程式碼 Lab
          </button>
        </div>
      </header>

      {/* 主要內容渲染區 */}
      <main style={{ minHeight: '600px', marginBottom: '40px' }}>
        {renderContent()}
      </main>

      {/* 底部 Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px 0',
        color: 'var(--color-text-dark)',
        fontSize: '13px',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div>AI Agent 互動學習與模擬平台 © 2026. Made with Antigravity AI Co-Pilot.</div>
        <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.15)' }}>
          系統運作正常 · 全域熱鍵啟用 · 模擬引擎 v1.2.0
        </div>
      </footer>
    </div>
  );
}

export default App;
