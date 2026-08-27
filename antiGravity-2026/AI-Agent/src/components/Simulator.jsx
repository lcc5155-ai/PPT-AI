import React, { useState, useEffect, useCallback } from 'react';
import { Play, SkipForward, RotateCcw, Wrench, Brain, Eye, CheckCircle, Database } from 'lucide-react';

const PRESETS = [
  {
    id: 'weather',
    label: '東京天氣與穿搭建議',
    task: '查詢東京現在的天氣，並根據溫度推薦穿搭。',
    steps: [
      {
        type: 'thought',
        title: '思考 (Thought 1)',
        desc: '使用者想要知道東京的天氣並獲得穿搭建議。大腦無法直接獲取即時天氣資訊，我需要呼叫 get_weather 工具查詢東京天氣。',
        code: `// Agent Decide Action
action = get_weather(location="Tokyo")`
      },
      {
        type: 'action',
        title: '行動 (Action 1)',
        desc: '呼叫外部 API 獲取東京天氣資訊。',
        code: `Calling tool: get_weather({ location: "Tokyo" }) ...`
      },
      {
        type: 'observation',
        title: '觀察 (Observation 1)',
        desc: '工具執行完畢，回傳東京天氣狀況：氣溫 24°C，下大雨。',
        code: `{
  "status": "success",
  "data": {
    "location": "Tokyo",
    "temperature": 24,
    "unit": "celsius",
    "condition": "Heavy Rain",
    "humidity": 85%
  }
}`
      },
      {
        type: 'thought',
        title: '思考 (Thought 2)',
        desc: '我已獲得東京的天氣資訊（24°C，下大雨）。這是一個舒適的溫度，但濕度高且有大雨。我應該建議使用者攜帶雨具，並穿著透氣薄外套搭配短袖。我已經收集到足夠的資訊，可以產出最終回答。',
        code: `// Agent Decide Final Answer
answer = format_response(temperature=24, condition="Heavy Rain")`
      },
      {
        type: 'answer',
        title: '最終回答 (Final Answer)',
        desc: '東京目前氣溫為 24°C，天氣為大雨。建議您穿著透氣輕便的短袖或薄上衣，並隨身攜帶一把大雨傘以防被淋濕。因濕度較高（85%），也可以多帶一件輕便薄外套以免在室內冷氣房著涼。',
        code: `Mission Completed successfully. Outputting final result.`
      }
    ]
  },
  {
    id: 'math',
    label: '複合數學運算',
    task: '計算 (1248 + 482) * 1.5 的結果，並算出其平方根。',
    steps: [
      {
        type: 'thought',
        title: '思考 (Thought 1)',
        desc: '這是一個複合數學運算任務。首先，我需要計算括號內的加法，然後乘以 1.5。最後，再計算該數值的平方根。我可以使用內建的 calculator 工具來做精確計算。',
        code: `// Agent Decide Action
action = calculator(expression="(1248 + 482) * 1.5")`
      },
      {
        type: 'action',
        title: '行動 (Action 1)',
        desc: '呼叫計算機工具處理數學運算。',
        code: `Calling tool: calculator({ expression: "(1248 + 482) * 1.5" }) ...`
      },
      {
        type: 'observation',
        title: '觀察 (Observation 1)',
        desc: '計算機工具回傳了第一步的運算結果：2595。',
        code: `{
  "status": "success",
  "result": 2595
}`
      },
      {
        type: 'thought',
        title: '思考 (Thought 2)',
        desc: '第一步計算結果為 2595。現在我需要計算 2595 的平方根。我將再次呼叫 calculator 工具。',
        code: `// Agent Decide Action
action = calculator(expression="sqrt(2595)")`
      },
      {
        type: 'action',
        title: '行動 (Action 2)',
        desc: '呼叫計算機工具進行平方根運算。',
        code: `Calling tool: calculator({ expression: "sqrt(2595)" }) ...`
      },
      {
        type: 'observation',
        title: '觀察 (Observation 2)',
        desc: '計算機工具回傳了平方根結果：約為 50.9411。',
        code: `{
  "status": "success",
  "result": 50.94114250778893
}`
      },
      {
        type: 'thought',
        title: '思考 (Thought 3)',
        desc: '計算完成。 (1248 + 482) * 1.5 = 2595，而 2595 的平方根約為 50.94。我將把這段推理過程與答案回報給使用者。',
        code: `// Agent Decide Final Answer
answer = format_math_response(steps=["addition", "multiplication", "sqrt"], value=50.94)`
      },
      {
        type: 'answer',
        title: '最終回答 (Final Answer)',
        desc: '計算過程如下：\n1. (1248 + 482) * 1.5 = 1730 * 1.5 = 2595\n2. 2595 的平方根約為 50.94\n\n最終結果為 50.94（四捨五入至小數點後兩位）。',
        code: `Mission Completed successfully. Outputting final result.`
      }
    ]
  }
];

export default function Simulator() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState([]);
  const [customTask, setCustomTask] = useState('');

  useEffect(() => {
    resetSimulator();
  }, [selectedPreset]);

  const resetSimulator = () => {
    setCurrentStepIdx(-1);
    setIsPlaying(false);
    setHistory([]);
  };

  const nextStep = useCallback(() => {
    if (currentStepIdx < selectedPreset.steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      setHistory(prev => [...prev, selectedPreset.steps[nextIdx]]);
    }
  }, [currentStepIdx, selectedPreset.steps]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStepIdx < selectedPreset.steps.length - 1) {
      timer = setTimeout(() => {
        nextStep();
      }, 2000);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, nextStep, selectedPreset.steps.length]);

  const handleCustomTaskSubmit = (e) => {
    e.preventDefault();
    if (!customTask.trim()) return;

    // 動態生成客製化任務的模擬步驟
    const cleanTask = customTask.trim();
    const mockSteps = [
      {
        type: 'thought',
        title: '思考 (Thought 1)',
        desc: `大腦收到自訂任務：「${cleanTask}」。我需要規劃解決步驟。首先，我應該使用 web_search 來尋找與此主題相關的最新資訊。`,
        code: `action = web_search(query="${cleanTask}")`
      },
      {
        type: 'action',
        title: '行動 (Action 1)',
        desc: '發起網頁搜尋請求，獲取有關主題的資料。',
        code: `Calling tool: web_search({ query: "${cleanTask}" }) ...`
      },
      {
        type: 'observation',
        title: '觀察 (Observation 1)',
        desc: '搜尋工具成功返回網頁爬取內容片段。',
        code: `{
  "status": "success",
  "results": [
    { "title": "認識 AI Agents 的基本組成", "snippet": "AI Agent 由大腦、規劃、記憶與工具組成..." },
    { "title": "2026年 AI Agent 發展趨勢", "snippet": "自主 Agent 正在深度結合工作流自動化與 RAG 技術..." }
  ]
}`
      },
      {
        type: 'thought',
        title: '思考 (Thought 2)',
        desc: '根據搜尋回傳的結果，我現在理解了這個主題。我可以組織這些資訊，形成一份結構完整、符合使用者要求的解答。',
        code: `action = format_response()`
      },
      {
        type: 'answer',
        title: '最終回答 (Final Answer)',
        desc: `這是為您查詢有關「${cleanTask}」的解答。AI Agent（人工智慧代理）目前主要往自主工作流、多代理協作（Multi-Agent System）以及與外部工具（API、計算機、搜尋）深度整合的方向發展。它們結合了短期對話記憶與長期向量庫 RAG 檢索，使其能在複雜情境下做出主動的決策。`,
        code: `Mission Completed successfully. Outputting final result.`
      }
    ];

    const tempPreset = {
      id: 'custom',
      label: '自訂任務',
      task: cleanTask,
      steps: mockSteps
    };

    setSelectedPreset(tempPreset);
    setCurrentStepIdx(-1);
    setHistory([]);
  };

  const getStepIcon = (type) => {
    switch (type) {
      case 'thought':
        return <Brain className="text-neon-cyan" size={18} />;
      case 'action':
        return <Wrench className="text-neon-purple" size={18} />;
      case 'observation':
        return <Eye className="text-amber-400" size={18} />;
      case 'answer':
        return <CheckCircle className="text-emerald-400" size={18} />;
      default:
        return null;
    }
  };


  return (
    <div className="fade-in">
      <div className="layout-header">
        <h1>ReAct Loop 互動模擬器</h1>
        <p>步進式觀察 AI Agent 的「思考 (Thought) → 行動 (Action) → 觀察 (Observation)」推理迴圈</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
        {/* 控制面板 */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 預設任務選擇 */}
            <div>
              <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>選擇模擬情境</span>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    className={`btn-secondary ${selectedPreset.id === preset.id ? 'active' : ''}`}
                    onClick={() => setSelectedPreset(preset)}
                    style={{
                      borderColor: selectedPreset.id === preset.id ? 'var(--color-primary)' : '',
                      background: selectedPreset.id === preset.id ? 'rgba(0, 210, 255, 0.08)' : ''
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 自訂任務輸入 */}
            <form onSubmit={handleCustomTaskSubmit} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={customTask}
                onChange={(e) => setCustomTask(e.target.value)}
                placeholder="輸入您想讓 Agent 執行的自訂任務（例如：分析機器學習趨勢...）"
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              <button type="submit" className="btn-glow" style={{ textShadow: 'none' }}>
                自訂模擬
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block' }}>當前任務描述</span>
                <span style={{ fontSize: '15px', fontWeight: '600' }}>{selectedPreset.task}</span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={resetSimulator} title="重設模擬">
                  <RotateCcw size={16} /> 重設
                </button>
                <button
                  className="btn-secondary"
                  onClick={nextStep}
                  disabled={isPlaying || currentStepIdx === selectedPreset.steps.length - 1}
                  title="執行下一步"
                >
                  <SkipForward size={16} /> 單步執行
                </button>
                <button
                  className="btn-glow"
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={currentStepIdx === selectedPreset.steps.length - 1}
                  style={{ textShadow: 'none' }}
                >
                  {isPlaying ? '暫停' : '自動播放'} <Play size={16} style={{ fill: 'currentColor' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2col">
        {/* 左側：ReAct 迴圈視覺化歷程 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', minHeight: '400px' }}>
            <h3 style={{ marginBottom: '20px', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              ReAct 執行歷史軌跡
            </h3>

            {currentStepIdx === -1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '280px', color: 'var(--color-text-muted)' }}>
                <Brain size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <p>請點擊「單步執行」或「自動播放」以啟動 Agent 推理循環</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {history.map((step, idx) => (
                  <div
                    key={idx}
                    className="fade-in"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '16px',
                      borderLeft: `4px solid ${
                        step.type === 'thought' ? 'var(--color-primary)' :
                        step.type === 'action' ? 'var(--color-secondary)' :
                        step.type === 'observation' ? 'var(--color-warning)' :
                        'var(--color-success)'
                      }`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      {getStepIcon(step.type)}
                      <span style={{ fontWeight: '700', fontSize: '15px' }}>{step.title}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>Step {idx + 1}</span>
                    </div>

                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '12px', lineHeight: '1.5' }}>
                      {step.desc}
                    </p>

                    <pre className="code-block" style={{ fontSize: '12px', padding: '10px', background: '#030509' }}>
                      <code>{step.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右側：短期記憶 (Context) 與主控台 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 短期記憶狀態 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
              <Database size={18} /> 短期記憶監視器 (Context)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
              隨著推理的推進，每一次的 Thought、Action 與 Observation 都會被串接並存入記憶，成為大腦下一步決策的上下文。
            </p>

            <div style={{ background: '#04060a', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '16px', maxHeight: '240px', overflowY: 'auto' }}>
              {currentStepIdx === -1 ? (
                <div style={{ fontSize: '13px', color: 'var(--color-text-dark)', fontStyle: 'italic' }}>
                  記憶區為空。等待 Agent 啟動...
                </div>
              ) : (
                <div style={{ fontFamily: 'Fira Code, monospace', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ color: 'var(--color-text-dark)' }}>{"{"} SYSTEM PROMPT {"}"}</div>
                  {history.map((step, idx) => (
                    <div key={idx} style={{ paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{
                        color:
                          step.type === 'thought' ? 'var(--color-primary)' :
                          step.type === 'action' ? 'var(--color-secondary)' :
                          step.type === 'observation' ? 'var(--color-warning)' :
                          'var(--color-success)'
                      }}>
                        [{step.type.toUpperCase()}]
                      </span>{' '}
                      <span style={{ color: '#d1d5db' }}>
                        {step.type === 'thought' ? '我需要執行行動...' :
                         step.type === 'action' ? '呼叫特定工具...' :
                         step.type === 'observation' ? '獲取工具結果...' :
                         '回答完畢。'}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: 'inline-block', width: '8px', height: '15px', backgroundColor: 'var(--color-primary)', animation: 'dash 1s infinite alternate', verticalAlign: 'middle' }}></div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              <span>Context Token 數: {currentStepIdx === -1 ? '0' : `${150 + currentStepIdx * 120} / 8,192`}</span>
              <span>滾動窗狀態: 正常</span>
            </div>
          </div>

          {/* 工具調度台日誌 */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)' }}>
              <Wrench size={18} /> 工具庫與執行 console
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>天氣 API</span>
                <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '600' }}>get_weather</span>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>數學計算機</span>
                <span style={{ fontSize: '12px', color: 'var(--color-secondary)', fontWeight: '600' }}>calculator</span>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>網頁搜尋</span>
                <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: '600' }}>web_search</span>
              </div>
            </div>

            <div style={{ fontFamily: 'monospace', fontSize: '11px', background: '#000', color: '#00ff00', padding: '12px', borderRadius: '6px', minHeight: '80px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              {currentStepIdx === -1 && <div>[SYSTEM] Console Idle. Awaiting execution...</div>}
              {history.map((step, idx) => {
                if (step.type === 'action') {
                  return <div key={idx} style={{ color: 'var(--color-secondary)' }}>[DISPATCHER] Executing {step.code.split(':')[1]?.trim() || step.code}</div>;
                }
                if (step.type === 'observation') {
                  return <div key={idx} style={{ color: 'var(--color-warning)' }}>[OBSERVER] Tool returned status code 200. Pipe back to Brain.</div>;
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
