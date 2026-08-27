import React, { useState } from 'react';
import { Terminal, Copy, Info } from 'lucide-react';

const PYTHON_CODE = `import re

# 1. 定義系統提示詞 (System Prompt)
SYSTEM_PROMPT = """
你是一個智慧助理。你可以使用以下工具：
- calculate(expression): 計算數學表達式的值。

請使用以下格式回答：
Thought: 思考下一步該做什麼。
Action: 呼叫的工具，格式為 calculate("算式")。
Observation: 工具執行的結果。
... (重複 Thought -> Action -> Observation 循環)
Final Answer: 給使用者的最終答案。
"""

# 模擬一個簡單的計算機工具
def calculate(expression):
    try:
        # 安全評估 (僅供學習演示，生產環境請勿使用 eval)
        return str(eval(expression))
    except Exception as e:
        return f"Error: {e}"

# 模擬大腦 (LLM) 回應
def mock_llm_api(messages):
    # 這裡實務上會呼叫 Gemini 或 OpenAI 的 API
    last_msg = messages[-1]["content"]
    
    if "計算" in last_msg and "Action" not in last_msg:
        return """Thought: 使用者需要計算複合數學題，我需要先算出 128 * 5 的結果。
Action: calculate("128 * 5")"""
    
    elif "Observation: 640" in last_msg:
        return """Thought: 我已經得到 128 * 5 = 640 的結果。現在我需要將其加上 200。
Action: calculate("640 + 200")"""
        
    elif "Observation: 840" in last_msg:
        return """Thought: 我已經算出最終結果為 840。可以給出最終解答。
Final Answer: 您的計算結果是 840。"""
    
    return "Final Answer: 我能為您做些什麼？"

# 2. 核心 Agent 迴圈 (ReAct Loop)
def run_agent(user_query):
    # 初始化短期記憶 (對話歷史)
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_query}
    ]
    
    print(f"★ 任務開始：{user_query}\\n")
    
    step = 1
    while step < 10:
        # (A) 大腦思考並做出決策 (Reasoning)
        response = mock_llm_api(messages)
        print(f"--- Step {step} [LLM Response] ---")
        print(response)
        
        # 記錄到短期記憶中
        messages.append({"role": "assistant", "content": response})
        
        # (B) 檢查是否輸出最終答案
        if "Final Answer:" in response:
            break
            
        # (C) 解析 Action 呼叫工具
        action_match = re.search(r"Action:\\s*(\\w+)\\(\\"([^\\"]+)\\"\\)", response)
        if action_match:
            tool_name = action_match.group(1)
            tool_arg = action_match.group(2)
            
            # (D) 執行行動 (Execution)
            print(f"\\n[Tool Executing] 呼叫 {tool_name} 參數: {tool_arg}")
            observation = ""
            if tool_name == "calculate":
                observation = calculate(tool_arg)
                
            print(f"[Observation] 工具回傳結果: {observation}\\n")
            
            # 將觀察結果寫入短期記憶
            messages.append({"role": "user", "content": f"Observation: {observation}"})
        else:
            print("\\n[Error] 無法解析 Action 格式，強制結束。")
            break
            
        step += 1

# 執行 Agent
run_agent("請幫我計算 128 * 5 加上 200 是多少？")`;

const JS_CODE = `// 1. 定義系統提示詞 (System Prompt)
const SYSTEM_PROMPT = \`
你是一個智慧助理。你可以使用以下工具：
- calculator(expr): 進行數學計算。

請使用以下格式回答：
Thought: 思考下一步。
Action: calculator("算式")
Observation: 結果。
Final Answer: 最終答案。
\`;

// 模擬工具執行
function calculator(expr) {
  try {
    return String(eval(expr)); // 僅作教學演示
  } catch (e) {
    return 'Error: ' + e.message;
  }
}

// 模擬 LLM API 呼叫
function mockLlmCall(messages) {
  const lastMsg = messages[messages.length - 1].content;
  
  if (lastMsg.includes('計算') && !lastMsg.includes('Observation')) {
    return 'Thought: 需要先計算 500 * 2。\\nAction: calculator("500 * 2")';
  } else if (lastMsg.includes('Observation: 1000')) {
    return 'Thought: 得到結果 1000，任務完成。\\nFinal Answer: 結果為 1000。';
  }
  return 'Final Answer: 準備就緒。';
}

// 2. ReAct Agent 迴圈
function runAgent(query) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: query }
  ];

  console.log("★ 任務啟動：" + query);
  
  let step = 1;
  while (step < 5) {
    const response = mockLlmCall(messages);
    console.log(\`\\n--- Step \${step} [LLM] ---\\n\`, response);
    messages.push({ role: 'assistant', content: response });

    if (response.includes('Final Answer:')) {
      break;
    }

    // 解析 Action
    const match = response.match(/Action:\\s*(\\w+)\\(\\"([^\\"]+)\\"\\)/);
    if (match) {
      const toolName = match[1];
      const toolArg = match[2];
      
      console.log(\`[Tool Dispatcher] 呼叫 \${toolName}("\${toolArg}")\`);
      const observation = calculator(toolArg);
      console.log("[Observation]", observation);
      
      messages.push({ role: 'user', content: \`Observation: \${observation}\` });
    }
    step++;
  }
}

runAgent("幫我計算 500 * 2");`;

const FRAMEWORKS = [
  {
    name: "零依賴原生 (Vanilla Loop)",
    language: "Python / JS",
    desc: "使用純 re/JSON 解析 LLM 輸出的 Action 並手動執行工具。",
    pros: "極致輕量、無黑盒子、好調錯、易於客製化。",
    cons: "需自行撰寫重試邏輯、平行處理與複雜記憶策略。"
  },
  {
    name: "LangChain",
    language: "Python / TS",
    desc: "目前最龐大的 Agent 與 LLM 應用程式開發框架，內建大量生態圈整合。",
    pros: "生態圈完整、提供幾乎所有現成 API 的工具包。",
    cons: "封裝層級過深 (容易遇到 'LangChain 牆')，底層黑盒子重且版本更新頻繁。"
  },
  {
    name: "LlamaIndex",
    language: "Python / TS",
    desc: "專注於數據連接、檢索 (RAG) 與關聯性記憶的 Agent 框架。",
    pros: "RAG 生態與向量搜尋模組全場景最優，資料工程師首選。",
    cons: "若做純流程控制 (非資料檢索型 Agent) 稍顯繁重。"
  },
  {
    name: "CrewAI",
    language: "Python",
    desc: "基於角色扮演 (Role-playing) 的多代理 (Multi-Agent) 協作框架。",
    pros: "聲明式定義 Agents、Tasks 與 Crews，能非常直觀地讓多個 Agent 協作。",
    cons: "Token 消耗極大，單代理簡單任務顯得殺雞用牛刀。"
  }
];

export default function CodeLab() {
  const [selectedLang, setSelectedLang] = useState('python');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const code = selectedLang === 'python' ? PYTHON_CODE : JS_CODE;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fade-in">
      <div className="layout-header">
        <h1>程式碼實驗室</h1>
        <p>揭開 AI Agent 的神祕面紗：使用幾十行代碼實現一個完整的 ReAct 智能體</p>
      </div>

      <div className="grid-2col">
        {/* 左側：極簡程式碼實作 */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal className="text-neon-cyan" size={20} />
              <h3 style={{ fontWeight: '700' }}>零依賴 ReAct 核心代碼</h3>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn-secondary ${selectedLang === 'python' ? 'active' : ''}`}
                onClick={() => setSelectedLang('python')}
                style={{ padding: '6px 12px', fontSize: '13px', borderColor: selectedLang === 'python' ? 'var(--color-primary)' : '' }}
              >
                Python
              </button>
              <button
                className={`btn-secondary ${selectedLang === 'js' ? 'active' : ''}`}
                onClick={() => setSelectedLang('js')}
                style={{ padding: '6px 12px', fontSize: '13px', borderColor: selectedLang === 'js' ? 'var(--color-primary)' : '' }}
              >
                JavaScript
              </button>
              <button
                className="btn-secondary"
                onClick={copyToClipboard}
                style={{ padding: '6px 12px', fontSize: '13px' }}
                title="複製代碼"
              >
                {copied ? <span className="text-emerald-400">已複製！</span> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <pre className="code-block" style={{ fontSize: '13px', maxHeight: '420px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)' }}>
            <code>{selectedLang === 'python' ? PYTHON_CODE : JS_CODE}</code>
          </pre>

          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'rgba(0, 210, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
            <Info size={16} className="text-neon-cyan" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
              <strong>教學小叮嚀：</strong>Agent 迴圈的本質是<strong>狀態機</strong>。LLM 負責「做推理決定下一步 (Thought) 與決定呼叫什麼工具 (Action)」，而外部環境代為執行工具並將回傳值包裝成 <code>Observation</code> 餵回 LLM，如此周而復始。
            </span>
          </div>
        </div>

        {/* 右側：開發框架對比 */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontWeight: '700', color: 'var(--color-secondary)', marginBottom: '16px' }}>開發框架對比分析</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            從手寫原生迴圈到大型工程框架，如何根據您的專案規模與需求選擇合適的開發手段？
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FRAMEWORKS.map((fw, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14px', color: '#fff' }}>{fw.name}</strong>
                  <span style={{ fontSize: '11px', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--color-secondary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                    {fw.language}
                  </span>
                </div>
                
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>{fw.desc}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>👍 優勢：</span>
                    <span style={{ color: 'var(--color-text-main)' }}>{fw.pros}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-danger)', fontWeight: '600' }}>👎 劣勢：</span>
                    <span style={{ color: 'var(--color-text-main)' }}>{fw.cons}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
