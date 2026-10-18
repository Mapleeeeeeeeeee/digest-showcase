---
title: "將 Claude Code 配置從 CLAUDE.md 升級到 Hooks、Skills 和自訂 Agents｜by David Chu（前 ENS 團隊）"
author: "林楓"
authorId: "627625202"
authorUrl: "https://www.facebook.com/627625202"
date: "2026-03-23T23:24:35.000Z"
category: "社群活動"
tags: ["社群活動","Claude"]
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1258698169161600/"
likes: 104
comments: 3
shares: 34
images: []
videos: []
---

將 Claude Code 配置從 CLAUDE\.md 升級到 Hooks、Skills 和自訂 Agents｜by David Chu（前 ENS 團隊）  

–  

幾週前在台北 Claude 社群聚會上，軟體工程師 David Chu（前 ENS 團隊成員）在中研院為工程師們進行了一場 demo 與分享。  

當時他已經同時跑著 3\-5 個 Claude Code 實例，100% 的程式碼由 Claude Code 生成，每天合併 2\-4 個 PR。從許多角度來看，這套流程已經相當不錯，但他每天下班時都精神疲憊，因為他得不斷切換終端機、審查輸出、重新下提示。  

這些挫折讓他開始探索與 Claude Code 協作的不同哲學。  

關鍵的洞察來自 Claude Code 的創作者 Boris Cherny 的一篇貼文——他每天能合併 10\-30 個 PR，一個月內完成了 259 個 PR，每一行程式碼都由 Claude 撰寫。他形容這套方式「出乎意料地平凡」，並建議大家毫不留情地投資在 CLAUDE\.md 上。  

「每次 Claude 做錯了什麼，就把它加進 CLAUDE\.md，讓它永遠不再重蹈覆轍。」—— Boris Cherny  

他自己的 CLAUDE\.md 大約有 2,500 個 token，在 code review 過程中由整個團隊持續疊代。  

這與 RPI 學派的觀點形成對比——後者建議將 CLAUDE\.md 控制在 60 行以內，只保留普遍適用的規則。一旦 context window 被佔用超過約 40%，效能就會下降，這通常被稱為「笨蛋區」。  

那麼哪種哲學才是對的？David 認為兩者都對，取決於你所處的階段。過早優化本身也可能是一個陷阱。先從 Boris 的方式開始，培養習慣，再隨著規則逐漸成熟，將它們從 CLAUDE\.md 中「畢業」出去。事實上，讓 Boris 那份密集的 CLAUDE\.md 得以運作的秘密武器，是一個強制執行 Claude\.md 本身的驗證器。那個驗證器現在已成為 /simplify 指令的一部分。  

–  

David 提出了 AI 程式碼代理的五個進化層級：  

→ 第一層 對話式：你輸入提示，Claude 回應，你作出反應   
→ 第二層 配置式：CLAUDE\.md 引導行為，記憶保留學習成果   
→ 第三層 自動化：hooks 強制執行規則，skills 將工作流程編碼   
→ 第四層 編排式：具備特定角色、工具與記憶的自訂 agents   
→ 第五層 自主式：agent 團隊獨立運作並相互驗證成果  

大多數人停留在第一或第二層。這場分享的目的，就是提供一個指引，幫助大家進階到第三或第四層。  

–  

畢業路徑一：CLAUDE\.md → Hook  

Hooks 是在 Claude 工作流程的特定時刻自動觸發的指令。幾個值得注意的 hooks 包括：  

→ PreToolUse — 在工具執行前觸發，作用類似非同步程式設計中的條件判斷。適合用來防止特定檔案被讀取或修改，例如防止任何對 \.env 檔案的更動。  
→ PostToolUse — 在工具執行後觸發，作用類似非同步程式設計中的回呼函式。適合用來執行格式化工具、linter 或 logger。  
→ Stop — 在 Claude 嘗試完成任務時觸發，作為完成前的品質關卡。適合加入驗證器，讓 Claude 在通過驗證前無法停止。例如強制 Claude 修復所有失敗的測試，即使 Claude 認為這些測試超出範疇。  

附帶驗證器的 Stop hooks 非常重要。沒有驗證器的情況下，連鎖步驟會不斷累積錯誤——五個各有 80% 可靠度的步驟，整體成功率只有 33%。但加上 Stop hook 的驗證器後，即使單步可靠度只有 70%，只需 4 次嘗試就能達到 99% 的整體成功率。David 的核心洞察：好的驗證器搭配差的工作流程，勝過好的工作流程但沒有驗證器。  

–  

畢業路徑二：CLAUDE\.md → Skill  

Skills 適用於模型未經訓練的知識或工作流程，或是你希望以特定方式完成的任務。與其把所有內容塞進 CLAUDE\.md 消耗 context，Skill 只在相關時才被載入。  

幾個具體重點：  

→ Skills 適用於不常使用的工作流程——範例是一個涵蓋 Dexie\.js 設定、模式與錯誤處理的 skill。  
→ Skill 可以包含動態內容——範例是 Anthropic 的 commit\-push\-pr skill，使用前面加上 \! 的 bash 指令。  
→ Skills 可以納入團隊偏好——範例是一個 UI 元件庫章節，說明團隊在建立 UI 元件時的偏好設定。  

–  

畢業路徑三：CLAUDE\.md → 自訂 Agent  

自訂 agents 適用於專屬角色，而非特定任務。你為 skill 定義任務，為 agent 定義人設。Skill 最適合單一可重複的工作流程，agent 則最適合跨多種不同任務執行相同角色。  

–  

David 會留意 3 個訊號，告訴他是時候將某項規則從 CLAUDE\.md 中移出：  

→ 當他的 CLAUDE\.md 達到一定規模（建議約 50 行）   
→ Claude 不再持續遵守某條規則   
→ 到了定期審查的時間點  

–  

總結  

→ 當 Claude 犯錯時，先將規則加進 CLAUDE\.md。   
→ 當 Claude 不再遵守規則時，將它升級為 hook、skill 或 agent。   
→ 這樣能確保你的工具從實際遇到的摩擦中成長，而非過早優化。  

\-\-
