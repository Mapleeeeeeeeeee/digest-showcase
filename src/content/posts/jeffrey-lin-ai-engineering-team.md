---
title: "打造 AI 工程團隊的過程｜Jeffrey Lin，ABConvert 創辦人暨執行長"
author: "林楓"
authorId: "627625202"
authorUrl: "https://www.facebook.com/627625202"
date: "2026-03-25T00:44:51.000Z"
category: "社群活動"
tags: ["社群活動","Claude"]
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1259496599081757/"
likes: 13
comments: 1
shares: 3
images: []
videos: []
---

打造 AI 工程團隊的過程｜Jeffrey Lin，ABConvert 創辦人暨執行長  

–  

幾週前在台北 Claude 社群聚會上，ABConvert 的 Jeffrey Lin 在中研院為工程師們進行了一場 demo 與分享。  

ABConvert 是一款 Shopify A/B 測試應用程式，讓商家無需撰寫任何程式碼，就能對定價、免運門檻及其他店鋪元素進行測試，目前已成長至服務超過 2,000 名用戶。Jeffrey 分享了他的 SaaS 新創公司在 Claude Code 及其他 AI 工具問世並持續強化之後，如何隨之演進。  

Jeffrey 是自學出身的開發者，學習之路從 Udemy、Stack Overflow 和技術部落格開始。ChatGPT 推出後，他轉向用提示詞尋求指引，並搭配 Copilot 自動補全。他開始用 Cursor 和 Windsurf 進行 vibe coding，感覺生產力不錯，但一直碰到 token 限制的問題。在與團隊合作的過程中，他很快意識到：vibe coding 更像是一種生活方式，而非真正能幫助業務成長的生產力工具。  

導入 context engineering 之後，他不再每次都從零開始下提示，而是透過清理日誌、重構程式碼、在 CLAUDE\. md 中加入 Linus 提示，以及將 Claude Code 設為功能交付的預設工具，逐步將 context 建立到主要程式碼庫中。他開始在團隊內部培養圍繞持續改善循環的工作習慣，遇到不確定的地方，就直接問 Claude Code。  

如今，ABConvert 將多個 AI agents 並行運作，作為核心工程工作流程的一部分：  

→ 一個 SRE agent，全天候監控日誌並推送錯誤修復   
→ 一個技術支援 agent，抓取 Intercom 對話並進行問題排查   
→ 一個產品工程 agent，接收 Linear 工單並交付功能   
→ 一個公司知識 agent，常駐於 Slack，回答內部研究問題，並從 PostHog 和 MongoDB 提取資料以獲取洞察  

投資基礎建設是打造 AI 工程團隊的第一步。建立 context、設置可觀測性、維護穩健的 CI/CD 與程式碼審查流程，並導入工單系統。同樣至關重要的是，教導團隊中的每個人如何撰寫好的提示詞——這其實是一種解決問題的能力，而非 AI 專屬技能。剛開始時，團隊成員可能會抗拒依賴 agents，因此需要透過實際用 agents 解決真實任務來建立信任感。焦慮感消退之後，大家才會更願意將工作委派給 AI。  

要打造自我改善的循環，就必須清楚定義指標。1% 的改善會隨時間複利累積，但前提是這些改善必須可量化，而且在設定指標時，聚焦於產出比聚焦於投入更為重要。上一季，ABConvert 交付的 PR 數量與過去 2\.5 年的總和相當，品質更高，事故也更少。一旦基礎建設、信任感和指標都到位，就可以相應地進行任務委派。  

在技術層面，Jeffrey 梳理出 AI 工程團隊所需的各個層次：  

→ 編排層，負責處理原則與協調，工具包括 n8n、Linear 和 OpenClaw。   
→ Context 層，存放策略內容，涵蓋 GitHub、Notion、Skills\. md 和技術文件。   
→ 資料層，是 agents 提取資訊的來源，包括 PostHog、Intercom、MongoDB 和 Google Cloud。   
→ 執行層，是實際構建與交付的地方，借助 Claude Code、GitHub Actions、cron jobs 和腳本來完成。  

總體而言，每位貢獻者都應該學會打造自己的 AI 隊友，並對其進行相應的管理。對於非技術背景的人來說，以工程師思維思考的門檻其實更低，因此鼓勵大家嘗試自己動手打造 MVP。雖然 AI 現在能夠提升團隊的能力，但基礎必須足夠紮實，團隊才能與 AI 一同成長。  

–
