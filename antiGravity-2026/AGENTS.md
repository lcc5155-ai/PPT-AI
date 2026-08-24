# AGENTS.md — 專案共用規則 (Shared by Antigravity & OpenCode)

> 本檔案同時被 **Antigravity** 與 **OpenCode** 讀取，作為 AI 工具的行為規範。
> 請勿刪除或搬移此檔案。

---

## 📁 專案概覽

**專案名稱**：AI Agent 互動學習與模擬平台  
**專案路徑**：`e:/antiGravity-2026/AI-Agent/`  
**專案類型**：Single Page Application (SPA)  
**目標**：讓使用者直觀地學習與體驗 AI Agent 的核心技術

---

## 🛠️ 技術棧 (Tech Stack)

- **框架**：React 19 + Vite 8
- **語言**：JavaScript (JSX)，非 TypeScript
- **樣式**：Vanilla CSS（`index.css` 全域設計系統）
- **圖標庫**：Lucide React
- **Linter**：oxlint
- **套件管理**：npm

---

## 📂 專案結構

```
AI-Agent/
├── src/
│   ├── components/
│   │   ├── Architecture.jsx   # 互動架構圖
│   │   ├── Simulator.jsx      # ReAct Loop 模擬器
│   │   ├── MemoryLab.jsx      # 記憶視覺化
│   │   └── CodeLab.jsx        # 程式碼實驗室
│   ├── App.jsx                # 主應用程式與路由
│   ├── App.css                # App 層級樣式
│   ├── index.css              # 全域設計系統（CSS 變數、token）
│   └── main.jsx               # 應用程式進入點
├── public/
├── index.html
├── package.json
└── vite.config.js
```

---

## ✏️ 程式碼規範 (Code Style)

### 命名規範
- **React 元件**：PascalCase（例：`MemoryVisualizer`）
- **函數 / 變數**：camelCase（例：`handleStepClick`）
- **CSS 類名**：kebab-case（例：`react-loop-container`）
- **CSS 自訂屬性**：`--` 前綴（例：`--color-primary`）

### 元件規範
- 每個元件一個 `.jsx` 檔案，放在 `src/components/`
- 使用 **函數式元件 (Functional Components)** + React Hooks
- 禁止使用 Class Components
- Props 需有清楚的命名，避免單字母命名（`e` 除外用於 event）

### 樣式規範
- 樣式優先寫在 `index.css` 的設計系統中，使用 CSS 自訂屬性
- 不使用 inline style，除非動態計算必要
- 保持深色模式優先（dark mode first）的設計原則
- 毛玻璃效果（Glassmorphism）使用 `backdrop-filter: blur()`

### 匯入順序
1. React 核心（`react`, `react-dom`）
2. 第三方套件（`lucide-react` 等）
3. 本地元件（`./components/...`）
4. 樣式（`.css`）

---

## 🚫 禁止事項

- ❌ 禁止安裝 TailwindCSS（除非使用者明確要求）
- ❌ 禁止改用 TypeScript（保持 JSX）
- ❌ 禁止刪除或覆寫 `index.css` 的 CSS 變數區塊
- ❌ 禁止在未確認前執行 `npm run build`（開發期間用 `npm run dev`）
- ❌ 禁止在元件中直接寫死顏色（使用 CSS 變數）

---

## ✅ 開發流程

1. 執行開發伺服器：`npm run dev`（在 `AI-Agent/` 目錄下）
2. Lint 檢查：`npm run lint`
3. 建置：`npm run build`（只在交付時使用）

---

## 🤖 AI 工具分工指引

### Antigravity 負責
- 大型功能規劃與多檔案重構
- 建立 Implementation Plan 與任務追蹤
- Subagent 並行任務（例：同時處理多個元件）
- 視覺化 Artifacts（計畫書、分析報告）
- 瀏覽器自動化測試
- 排程任務（`/schedule`）

### OpenCode 負責
- 快速的 terminal 內問答與單檔修改
- 即時 debug（在 terminal 快速重現問題）
- 遠端伺服器環境的操作
- 小型、局部的程式碼調整

---

## 📝 Commit 規範

```
類型(範圍): 簡短描述

類型:
  feat     新功能
  fix      錯誤修復
  style    樣式調整（不影響功能）
  refactor 重構（不新增功能也不修 bug）
  docs     文件更新
  chore    雜項（設定檔、依賴更新）
```

範例：`feat(simulator): 新增單步執行 ReAct 迴圈功能`

---

*最後更新：2026-07-16*

---

## 🌐 語言與輸出約定

- **語言要求**：所有回覆、說明、注釋、文檔，必須使用繁體中文。
- **代碼規範**：代碼中的標示符保持英文，不使用拼音。
- **異常與日誌**：錯誤信息、日誌內容允許為英文。

