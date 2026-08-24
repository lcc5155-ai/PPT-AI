# Antigravity Workspace Rules

> 本檔案為 **Antigravity 專屬**的工作區規則，補充說明 Antigravity 特有的行為設定。
> 通用規則請參閱根目錄的 `AGENTS.md`。

---

## 🔧 工作區設定

**主要工作目錄**：`e:/antiGravity-2026/AI-Agent/`  
**執行指令時**：請先確認當前目錄是否在 `AI-Agent/` 下

---

## 🤖 Antigravity 行為規範

### 規劃模式 (Planning Mode)
- 進行大型功能開發前，**必須先建立 Implementation Plan**
- 計畫書需包含：目標、影響範圍、逐步任務清單
- 計畫書建立後等待使用者確認，再開始執行

### Subagent 使用原則
- 多元件並行開發時，可啟動 Subagent 分工
- 每個 Subagent 應聚焦在單一元件或單一功能
- Subagent 完成後必須彙整結果

### Artifact 規範
- 計畫書（`implementation_plan.md`）：需請使用者審閱
- 任務追蹤（`task.md`）：執行中持續更新
- 完工報告（`walkthrough.md`）：完成後建立

### 終端機指令規範
- 執行 npm 指令前，確認路徑在 `e:/antiGravity-2026/AI-Agent/`
- 預設使用 `npm run dev` 啟動開發伺服器，不自動執行 build
- 新增套件前需告知使用者並等待確認

---

## 🎨 設計規範提醒

本專案已有完整的 CSS 設計系統，修改樣式時：
1. 先查閱 `src/index.css` 中現有的 CSS 變數
2. 優先使用現有變數，不重複定義
3. 新增元件樣式加在 `index.css` 末尾，並加上清楚的區塊註解

---

## 📌 重要檔案對照表

| 檔案 | 用途 | 修改頻率 |
|------|------|---------|
| `src/index.css` | 全域設計系統 | 低（謹慎修改） |
| `src/App.jsx` | 主路由與導覽 | 中 |
| `src/components/*.jsx` | 各功能頁面 | 高 |
| `vite.config.js` | 建置設定 | 極低 |

---

*最後更新：2026-07-16*
