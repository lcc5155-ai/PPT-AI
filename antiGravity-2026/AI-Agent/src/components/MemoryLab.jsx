import React, { useState } from 'react';
import { Database, Plus, RefreshCw, Search, ArrowRight, BookOpen } from 'lucide-react';

const VECTOR_STORE = [
  { id: 1, text: "使用者住在台北，特別喜歡吃麻辣火鍋，但不喜歡香菜。", tag: "User Profile", vector: [0.12, 0.85, 0.45, -0.22] },
  { id: 2, text: "yt-dlp 是一款開源的命令列 YouTube 影片下載工具，基於 youtube-dl 開發。", tag: "Software Tool", vector: [0.89, -0.12, 0.15, 0.76] },
  { id: 3, text: "Vite 是一個現代化的前端構建工具，具有極速的開發伺服器啟動與熱更新功能。", tag: "Web Dev", vector: [-0.34, 0.42, 0.91, 0.05] },
  { id: 4, text: "深度學習是機器學習的分支，使用多層人工神經網路來學習複雜的特徵與表徵。", tag: "AI Theory", vector: [0.05, -0.67, 0.33, 0.88] },
  { id: 5, text: "台北明天的天氣預報是小雨，氣溫介於 22°C 到 25°C 之間。", tag: "Weather Info", vector: [0.15, 0.79, 0.22, -0.41] }
];

export default function MemoryLab() {
  // 短期記憶狀態
  const [messages, setMessages] = useState([
    { role: 'user', content: '嗨，我想做個前端專案。', tokens: 25 },
    { role: 'assistant', content: '太棒了！您打算使用什麼框架呢？目前 React 和 Vite 的搭配非常流行。', tokens: 45 }
  ]);
  const [memoryStrategy, setMemoryStrategy] = useState('none'); // none, sliding, summarize

  // 長期記憶狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 短期記憶：模擬新增訊息
  const addMessage = () => {
    const randomUserPrompts = [
      '幫我推薦一個好用的影片下載指令，最好是終端機的。',
      '我明天要去台北，那裡天氣怎麼樣？',
      '推薦一下台北好吃的晚餐，我喜歡吃辣的。',
      '機器學習和深度學習有什麼差別？',
      'Vite 開發環境怎麼建置？'
    ];
    const randomPrompt = randomUserPrompts[Math.floor(Math.random() * randomUserPrompts.length)];
    const newMsg = { role: 'user', content: randomPrompt, tokens: 30 };

    setMessages(prev => {
      const nextMsgs = [...prev, newMsg];
      // 模擬 Assistant 自動回覆以增加 Token
      const mockReply = { role: 'assistant', content: `收到您的要求！關於「${randomPrompt}」，大腦正在載入相關記憶以準備回答...`, tokens: 50 };
      return [...nextMsgs, mockReply];
    });
  };

  const clearMessages = () => {
    setMessages([
      { role: 'user', content: '嗨，我想做個前端專案。', tokens: 25 },
      { role: 'assistant', content: '太棒了！您打算使用什麼框架呢？目前 React 和 Vite 的搭配非常流行。', tokens: 45 }
    ]);
  };

  // 計算總 Token
  const totalTokens = messages.reduce((acc, curr) => acc + curr.tokens, 0);
  const tokenLimit = 200;

  // 根據策略過濾顯示的短期記憶
  const getProcessedMessages = () => {
    if (memoryStrategy === 'sliding' && totalTokens > tokenLimit) {
      // 簡單滑動視窗：如果超過 limit，隱藏最早的訊息
      let sum = 0;
      const reversed = [...messages].reverse();
      const visible = [];
      for (let msg of reversed) {
        if (sum + msg.tokens <= tokenLimit) {
          visible.unshift(msg);
          sum += msg.tokens;
        } else {
          visible.unshift({ ...msg, isDropped: true });
        }
      }
      return visible;
    }

    if (memoryStrategy === 'summarize' && totalTokens > tokenLimit) {
      // 總結記憶：將舊訊息折疊為一個摘要節點
      const activeMsgs = messages.slice(-2); // 僅保留最後兩句
      const summaryNode = {
        role: 'system',
        content: `【對話摘要】：使用者打算開發前端專案，詢問了關於台北美食、天氣或特定工具（如下載器、Vite、AI理論）的資訊，Agent 已提供初步回覆。`,
        tokens: 35,
        isSummary: true
      };
      return [summaryNode, ...activeMsgs];
    }

    return messages;
  };

  // 長期記憶：模擬語意搜尋 (向量比對)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);

    setTimeout(() => {
      // 根據搜尋關鍵字模擬向量餘弦相似度 (Cosine Similarity)
      const q = searchQuery.toLowerCase();
      const scored = VECTOR_STORE.map(fact => {
        let score = 0.05; // 隨機基礎相似度
        if (q.includes('下載') || q.includes('yt-dlp') || q.includes('影片') || q.includes('youtube')) {
          if (fact.id === 2) score = 0.94;
        }
        if (q.includes('台北') || q.includes('吃') || q.includes('辣') || q.includes('香菜') || q.includes('火鍋')) {
          if (fact.id === 1) score = q.includes('吃') || q.includes('辣') ? 0.88 : 0.62;
          if (fact.id === 5) score = q.includes('天氣') ? 0.91 : 0.55;
        }
        if (q.includes('vite') || q.includes('前端') || q.includes('熱更新') || q.includes('構建')) {
          if (fact.id === 3) score = 0.92;
          if (fact.id === 1 && q.includes('前端')) score = 0.25;
        }
        if (q.includes('深度學習') || q.includes('人工神經') || q.includes('神經網路') || q.includes('ai') || q.includes('機器學習')) {
          if (fact.id === 4) score = 0.95;
        }
        
        // 隨機微調
        if (score === 0.05) {
          score = Math.random() * 0.15;
        }

        return { ...fact, score: parseFloat(score.toFixed(4)) };
      }).sort((a, b) => b.score - a.score);

      setSearchResults(scored);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="fade-in">
      <div className="layout-header">
        <h1>記憶機制實驗區</h1>
        <p>探索短期對話記憶的 Token 管理策略，以及長期記憶的向量資料庫 (RAG) 語意檢索原理</p>
      </div>

      <div className="grid-2col">
        {/* 左側：短期記憶 (對話歷史與 Token 管理) */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: '700', color: 'var(--color-primary)' }}>短期記憶與 Token 滑動</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" onClick={addMessage} style={{ padding: '6px 12px', fontSize: '13px' }}>
                <Plus size={14} /> 模擬對話
              </button>
              <button className="btn-secondary" onClick={clearMessages} style={{ padding: '6px 12px', fontSize: '13px' }} title="清除歷史">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            在長期或多輪對話中，Context Limit 會被撐滿。我們必須採取記憶縮減策略，以防超出大腦極限。
          </p>

          {/* Token 計量條 */}
          <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span>當前 Token 消耗：<strong className={totalTokens > tokenLimit ? 'text-neon-purple' : 'text-neon-cyan'}>{totalTokens}</strong> / {tokenLimit} (虛擬上限)</span>
              <span>{totalTokens > tokenLimit ? '⚠️ 超出限制' : '✅ 正常'}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min((totalTokens / tokenLimit) * 100, 100)}%`,
                height: '100%',
                background: totalTokens > tokenLimit ? 'linear-gradient(90deg, #00d2ff, #a855f7)' : 'var(--color-primary)',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>

          {/* 策略選擇器 */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              className={`btn-secondary ${memoryStrategy === 'none' ? 'active' : ''}`}
              onClick={() => setMemoryStrategy('none')}
              style={{ flex: 1, fontSize: '13px', padding: '8px', borderColor: memoryStrategy === 'none' ? 'var(--color-primary)' : '' }}
            >
              無策略 (保留全部)
            </button>
            <button
              className={`btn-secondary ${memoryStrategy === 'sliding' ? 'active' : ''}`}
              onClick={() => setMemoryStrategy('sliding')}
              style={{ flex: 1, fontSize: '13px', padding: '8px', borderColor: memoryStrategy === 'sliding' ? 'var(--color-primary)' : '' }}
            >
              滑動視窗 (拋棄舊對話)
            </button>
            <button
              className={`btn-secondary ${memoryStrategy === 'summarize' ? 'active' : ''}`}
              onClick={() => setMemoryStrategy('summarize')}
              style={{ flex: 1, fontSize: '13px', padding: '8px', borderColor: memoryStrategy === 'summarize' ? 'var(--color-primary)' : '' }}
            >
              會話摘要 (自動總結)
            </button>
          </div>

          {/* 對話記錄渲染 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#04060a', borderRadius: '8px', padding: '16px', maxHeight: '300px', overflowY: 'auto' }}>
            {getProcessedMessages().map((msg, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  opacity: msg.isDropped ? 0.25 : 1,
                  background:
                    msg.isSummary ? 'rgba(168, 85, 247, 0.1)' :
                    msg.role === 'user' ? 'rgba(0, 210, 255, 0.05)' :
                    'rgba(255, 255, 255, 0.02)',
                  border:
                    msg.isSummary ? '1px dashed var(--color-secondary)' :
                    msg.role === 'user' ? '1px solid rgba(0, 210, 255, 0.1)' :
                    '1px solid rgba(255, 255, 255, 0.05)',
                  textDecoration: msg.isDropped ? 'line-through' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  <span style={{ fontWeight: '600', color: msg.isSummary ? 'var(--color-secondary)' : msg.role === 'user' ? 'var(--color-primary)' : '#fff' }}>
                    {msg.isSummary ? 'SUMMARY' : msg.role.toUpperCase()}
                  </span>
                  <span>{msg.tokens} tokens {msg.isDropped && '(已丟棄)'}</span>
                </div>
                <div>{msg.content}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：長期記憶 (Vector RAG) */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: '700', color: 'var(--color-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} /> 長期記憶與向量庫檢索 (RAG)
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            長期記憶讓 Agent 擁有一個巨大的知識庫。輸入問題後，我們會將其轉為向量，進行相似度比對，並撈取關聯度最高（Top-1）的背景知識，拼裝回 Prompt 中。
          </p>

          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: '600', display: 'block', marginBottom: '8px' }}>模擬向量知識庫 (Vector Database)</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
              {VECTOR_STORE.map(fact => (
                <div key={fact.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', background: 'rgba(255,255,255,0.02)', padding: '4px 8px', borderRadius: '4px' }}>
                  <span style={{ color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                    [{fact.tag}] {fact.text}
                  </span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--color-text-dark)' }}>[{fact.vector.join(', ')}]</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="試試搜尋：台北天氣、yt-dlp、Vite、深度學習..."
              style={{
                flex: 1,
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button type="submit" className="btn-glow" style={{ padding: '8px 16px', fontSize: '13px', textShadow: 'none' }}>
              <Search size={14} /> 語意搜尋
            </button>
          </form>

          {isSearching ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '150px' }}>
              <div style={{ border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid var(--color-secondary)', borderRadius: '50%', width: '24px', height: '24px', animation: 'dash 1s infinite linear', marginBottom: '12px' }}></div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>正在將查詢文字向量化並計算餘弦相似度...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* 搜尋結果列表 */}
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>語意比對結果</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {searchResults.slice(0, 3).map((res, idx) => (
                    <div
                      key={res.id}
                      style={{
                        padding: '10px',
                        background: idx === 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                        border: idx === 0 ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-color)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <span style={{ color: idx === 0 ? 'var(--color-success)' : 'var(--color-text-muted)', fontWeight: '600', marginRight: '6px' }}>
                          [{res.tag}]
                        </span>
                        {res.text}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-text-muted)' }}>Cosine Sim</span>
                        <strong style={{ color: idx === 0 ? 'var(--color-success)' : 'var(--color-text-main)' }}>{(res.score * 100).toFixed(1)}%</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RAG Prompt 組裝範例 */}
              <div style={{ background: '#04060a', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <BookOpen size={12} /> 被注入口袋的 Prompt 上下文 (Top-1)
                </span>
                <pre style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9ca3af', whiteSpace: 'pre-wrap' }}>
{`你是一個具備檢索能力的助理。請根據以下事實回答使用者的問題：
事實: "${searchResults[0]?.text}"
問題: "${searchQuery}"`}
                </pre>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '150px', color: 'var(--color-text-dark)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <Database size={32} style={{ opacity: 0.2, marginBottom: '8px' }} />
              <span style={{ fontSize: '12px' }}>在此輸入問題以模擬 RAG 長期記憶檢索</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
