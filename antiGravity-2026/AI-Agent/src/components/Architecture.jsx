import React, { useState } from 'react';
import { Brain, Cpu, Database, Wrench, ArrowRight, Layers, HelpCircle, Code } from 'lucide-react';

export default function Architecture() {
  const [selectedNode, setSelectedNode] = useState('brain');

  const nodes = {
    brain: {
      title: 'LLM 大腦推理 (Brain / LLM Reasoning)',
      icon: <Brain className="text-neon-cyan" size={24} />,
      badge: 'Reasoning Engine',
      description: '大腦是 Agent 的決策中心。它接收輸入、分析語境、做出推理與判斷，並決定下一步該採取什麼行動 (Action)。',
      techDetails: [
        { label: '核心作用', value: '意圖識別、語意理解、文字生成、邏輯推理' },
        { label: '系統提示詞 (System Prompt)', value: '設定 Agent 的角色定位、行為邊界與思考規則（如：「你是一個嚴謹的分析師...」）' },
        { label: '主流模型', value: 'Gemini, Claude, GPT-4o, Llama 3' }
      ],
      promptExample: `[SYSTEM PROMPT]
你是一個智慧助理。你擁有使用計算機與搜尋引擎的工具。
請使用以下 ReAct 格式回答問題：
Thought: 思考下一步要做什麼。
Action: 要呼叫的工具名稱與參數。
Observation: 工具執行的結果。
... (重複上述步驟，直到得出結論)
Final Answer: 給使用者的最終回答。`,
    },
    planning: {
      title: '規劃與拆解 (Planning / Deconstruction)',
      icon: <Cpu className="text-neon-purple" size={24} />,
      badge: 'Reasoning Flow',
      description: '將複雜任務拆解為多個子步驟，並建立執行計畫。包含自我修正 (Self-Reflection) 與思維鏈 (Chain of Thought)。',
      techDetails: [
        { label: '主要流派', value: 'ReAct (Reason + Act), Plan-and-Execute, Reflexion, Tree of Thoughts (ToT)' },
        { label: '自我修正', value: '若工具執行失敗或結果不如預期，大腦能識別錯誤並調整規劃' },
        { label: '思維鏈 (CoT)', value: '在生成答案前，先進行一步步的邏輯推導 (Let\'s think step by step)' }
      ],
      promptExample: `[Thought Step Example]
使用者問題：「算一下 1256 的 1.2 倍再減去 350 是多少？」
大腦思維過程：
1. 任務包含兩個子步驟：(A) 1256 * 1.2；(B) 將結果減去 350。
2. 我需要先呼叫計算機工具來計算 1256 * 1.2。
3. 呼叫 Action: calculator(expression="1256 * 1.2")`,
    },
    memory: {
      title: '記憶機制 (Memory System)',
      icon: <Database className="text-amber-500" size={24} />,
      badge: 'Context & Semantics',
      description: '讓 Agent 具備「記住事情」的能力。分為短期記憶（當前對話上下文）與長期記憶（歷史資料、外部向量資料庫）。',
      techDetails: [
        { label: '短期記憶', value: '以對話歷史 (Chat History) 的形式儲存在 Prompt 中，受限於 Context Window 大小' },
        { label: '長期記憶', value: '透過向量嵌入 (Vector Embedding) 存入資料庫 (RAG)，在需要時透過語意搜尋撈回' },
        { label: '記憶整理', value: '利用大腦對歷史對話進行摘要 (Summarize) 以節省 Token 空間' }
      ],
      promptExample: `[Memory Injected Prompt]
[長期記憶檢索結果]
- 使用者偏好：喜歡簡明扼要的回答，偏好 Python 程式碼。
- 過去對話摘要：使用者在 5 分鐘前詢問過快速排序演算法的複雜度。

[短期記憶 (對話歷史)]
User: 幫我寫出它的程式碼。
Assistant: (基於長期記憶得知要寫 Python 的快速排序...)`,
    },
    tools: {
      title: '工具與行動 (Tools & Action)',
      icon: <Wrench className="text-emerald-500" size={24} />,
      badge: 'Execution API',
      description: 'LLM 大腦本身無法連網或執行複雜運算。工具是 Agent 的手與腳，大腦透過生成特定格式的指令 (JSON / 函式呼叫) 來操作外部世界。',
      techDetails: [
        { label: '工具類型', value: '搜尋引擎 API、代碼執行沙盒 (Python Code Sandbox)、資料庫查詢、天氣 API、檔案讀寫' },
        { label: '呼叫機制', value: 'Function Calling (函式呼叫)。大腦輸出特定的參數 JSON，由環境代為執行後將結果回傳給大腦' },
        { label: '安全性', value: '工具執行時需做沙盒化或權限控管，避免 Agent 執行惡意指令' }
      ],
      promptExample: `[Function Schema & Output]
// 定義給大腦看的工具結構
{
  "name": "web_search",
  "description": "搜尋網路以獲取最新資訊",
  "parameters": { "query": "string" }
}

// 大腦決定呼叫時的輸出 (Action)
{"name": "web_search", "arguments": {"query": "yt-dlp 最新版本"}}`,
    }
  };

  return (
    <div className="fade-in">
      <div className="layout-header">
        <h1>Agent 互動架構圖</h1>
        <p>點擊架構圖中的各個組件，解構 AI Agent 的核心組成元素與運作邏輯</p>
      </div>

      <div className="grid-2col">
        {/* 左側：SVG 互動架構圖 */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <h3 style={{ marginBottom: '24px', fontWeight: '600', color: 'var(--color-primary)' }} className="text-neon-cyan">
            AI Agent 運作結構與數據流
          </h3>

          <div style={{ position: 'relative', width: '100%', maxWidth: '500px', aspectRatio: '4/3' }}>
            <svg viewBox="0 0 500 375" style={{ width: '100%', height: '100%' }}>
              {/* 定義發光濾鏡 */}
              <defs>
                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 背景連接線與數據流動畫 */}
              {/* Brain -> Planning */}
              <path d="M 250,110 L 250,170" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
              <path d="M 250,110 L 250,170" stroke="var(--color-secondary)" strokeWidth="2" className="data-flow-line" style={{ animationDelay: '0s' }} />

              {/* Planning -> Tools */}
              <path d="M 250,210 L 250,270" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
              <path d="M 250,210 L 250,270" stroke="var(--color-success)" strokeWidth="2" className="data-flow-line" style={{ animationDelay: '0.5s' }} />

              {/* Brain <-> Memory (Left) */}
              <path d="M 210,90 Q 110,90 110,180 T 210,290" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
              <path d="M 210,90 Q 110,90 110,180 T 210,290" fill="none" stroke="var(--color-primary)" strokeWidth="2" className="data-flow-line" style={{ animationDelay: '1s' }} />

              {/* Nodes */}
              {/* 1. LLM Brain (Top Center) */}
              <g 
                cursor="pointer" 
                onClick={() => setSelectedNode('brain')}
                className={`node-group ${selectedNode === 'brain' ? 'pulse-active' : ''}`}
                style={{ transition: 'all 0.3s' }}
              >
                <rect x="180" y="50" width="140" height="60" rx="10" 
                  fill={selectedNode === 'brain' ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255,255,255,0.03)'} 
                  stroke={selectedNode === 'brain' ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)'} 
                  strokeWidth="2" 
                />
                <Brain x="195" y="68" className={selectedNode === 'brain' ? 'text-neon-cyan' : 'text-gray-400'} size={24} />
                <text x="265" y="86" fill="#fff" fontSize="14" fontWeight="600" textAnchor="middle">大腦推理 (LLM)</text>
              </g>

              {/* 2. Planning (Center) */}
              <g 
                cursor="pointer" 
                onClick={() => setSelectedNode('planning')}
                className={`node-group ${selectedNode === 'planning' ? 'pulse-active' : ''}`}
              >
                <rect x="180" y="160" width="140" height="60" rx="10" 
                  fill={selectedNode === 'planning' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.03)'} 
                  stroke={selectedNode === 'planning' ? 'var(--color-secondary)' : 'rgba(255,255,255,0.2)'} 
                  strokeWidth="2" 
                />
                <Cpu x="195" y="178" className={selectedNode === 'planning' ? 'text-neon-purple' : 'text-gray-400'} size={24} />
                <text x="265" y="196" fill="#fff" fontSize="14" fontWeight="600" textAnchor="middle">規劃 (Planning)</text>
              </g>

              {/* 3. Memory (Left Center) */}
              <g 
                cursor="pointer" 
                onClick={() => setSelectedNode('memory')}
                className={`node-group ${selectedNode === 'memory' ? 'pulse-active' : ''}`}
              >
                <rect x="40" y="160" width="100" height="60" rx="10" 
                  fill={selectedNode === 'memory' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)'} 
                  stroke={selectedNode === 'memory' ? '#f59e0b' : 'rgba(255,255,255,0.2)'} 
                  strokeWidth="2" 
                />
                <Database x="52" y="178" className={selectedNode === 'memory' ? 'text-amber-500' : 'text-gray-400'} size={22} />
                <text x="102" y="196" fill="#fff" fontSize="13" fontWeight="600" textAnchor="middle">記憶 (Memory)</text>
              </g>

              {/* 4. Tools (Bottom Center) */}
              <g 
                cursor="pointer" 
                onClick={() => setSelectedNode('tools')}
                className={`node-group ${selectedNode === 'tools' ? 'pulse-active' : ''}`}
              >
                <rect x="180" y="270" width="140" height="60" rx="10" 
                  fill={selectedNode === 'tools' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)'} 
                  stroke={selectedNode === 'tools' ? 'var(--color-success)' : 'rgba(255,255,255,0.2)'} 
                  strokeWidth="2" 
                />
                <Wrench x="195" y="288" className={selectedNode === 'tools' ? 'text-emerald-400' : 'text-gray-400'} size={24} />
                <text x="265" y="306" fill="#fff" fontSize="14" fontWeight="600" textAnchor="middle">工具行動 (Tools)</text>
              </g>

              {/* 外圈虛線：Agent 邊界 */}
              <rect x="15" y="15" width="470" height="345" rx="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="6,6" />
              <text x="35" y="35" fill="rgba(255,255,255,0.2)" fontSize="12" fontWeight="600" letterSpacing="1">AGENT BOUNDARY</text>
            </svg>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span> 短期/長期記憶流
            </span>
            <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }}></span> 任務規劃流程
            </span>
            <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span> 外部工具呼叫
            </span>
          </div>
        </div>

        {/* 右側：詳細解說面板 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', borderRadius: '8px' }}>
                  {nodes[selectedNode].icon}
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{nodes[selectedNode].title}</h2>
              </div>
              <span style={{
                background: 'rgba(0, 210, 255, 0.1)',
                border: '1px solid rgba(0, 210, 255, 0.2)',
                color: 'var(--color-primary)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '600'
              }}>{nodes[selectedNode].badge}</span>
            </div>

            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px', fontSize: '15px' }}>
              {nodes[selectedNode].description}
            </p>

            <h4 style={{ fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} /> 核心技術細節
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {nodes[selectedNode].techDetails.map((detail, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--color-primary)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '600', display: 'block' }}>{detail.label}</span>
                  <span style={{ fontSize: '14px', color: 'var(--color-text-main)' }}>{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt / 結構範例 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)' }}>
              <Code size={16} /> 運作機制與 Prompt 範例
            </h4>
            <pre className="code-block" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              <code>{nodes[selectedNode].promptExample}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
