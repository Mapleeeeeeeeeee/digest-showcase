---
title: "以下是 James 上週在 Claude 開發者 meetup 上 demo 的內容，我有用 AI 幫忙整理這場分享"
author: "林楓"
authorId: "627625202"
authorUrl: "https://www.facebook.com/627625202"
date: "2026-06-17T15:56:59.000Z"
category: "社群活動"
tags: ["社群活動","Claude"]
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1324458075918942/"
likes: 498
comments: 13
shares: 242
images: ["/images/posts/james-claude-product-planning-recap-01-10174479934255203.jpg"]
videos: []
---

以下是 James 上週在 Claude 開發者 meetup 上 demo 的內容，我有用 AI 幫忙整理這場分享。他用的 deck 連結放在留言區。  

James 是 Growing3 共同創辦人。之前在 Dcard、Yahoo、台積電擔任機器學習工程師。James 分享他怎麼用 Claude Code 加速日常工作流、學習新東西、做一些自用的小工具，以一個過去手刻 ML 系統的工程師的角度來看這件事。  

–  

如何高效使用 Claude Code  
→ James Yeh 分享如何把你的思維（文字、視覺）高效同步給模型，避免產生 AI slop 的紀錄  

James Yeh 台大電機所畢業，畢業後當了七年機器學習工程師，待過台積電、Yahoo 跟 Dcard，接著創業兩年，做鏈上數據加上 X\.com 的社群數據，切進 Marketing Tech。最近這一年他是獨立 AI 研究員，vibe coding 了 100 多個小專案，有成功的、也有砍掉重練的。這次他分享他怎麼用 AI 提升生產力，還現場 demo 了兩個自製的小工具。  

他的主力機器是放在家裡的 Mac Studio（M4 Max、128GB），terminal 用 cmux；本地算力靠一台 Windows PC（RTX 5090、96GB RAM）；外出就用 MacBook，透過 Tailscale SSH 或 RustDesk 連回家。訂閱方面是 Claude Max $200，加上 GPT、Gemini 各 $20 跟 API keys。工具上他一路從 Cursor 換到 OpenClaw，再到現在主力的 Claude Code，搭配 Remote Control。  

–  

→ 核心觀念：跟 AI 同步  

他用一句話開場：slop（垃圾）不是 AI 做出來的，是「不同步」累積出來的。  

「一直按 OK」的代價就是這樣堆出來的：看起來 OK，但其實認知不同步，於是越跑越歪，最後變成改不動的 slop。你每一步都同意了，卻從來沒有真的對齊過。不同步有兩種型態，做太少（功能缺失）比較容易發現；做太多（難 review、整包改不動）反而難發現，那些多餘的東西會一直累積，AI 每次讀都要重新處理，把你的額度燒掉。  

他也提到 agentic coding 的正確率：就算是最強的模型，單一任務的成功率也只有八到九成（在 SWE\-Bench Pro、Terminal\-Bench 這類 benchmark 上）。而且正確率會複利：每步 90%，十步之後只剩約 35%；每步 99%，十步之後也才約 90%。像職業運動員一樣，每個細節都雕到位，成果才會複利。  

跟 AI 的同步率，決定產出品質。他用了一個福音戰士的比喻：在 Neuralink 出現之前，你只能靠介面去拉這個同步率。對策是每一步先看計畫，AI 先列出詳細計畫，人快速掃過每一行，用四種回應（CRUD）去對齊。比如請 AI 做一個抓商品圖的 Chrome extension：  

\-\- 增：抓商品主圖時，SKU 圖、詳情長圖也要  

\-\- 刪：順便做的使用者登入系統，不用做  

\-\- 改：自組 OCR → 翻譯 → 去字 → 重排，改用 Gemini API 就好  

\-\- 查：API key 存 chrome\.storage，跟 localStorage 差在哪  

–  

→ 文字同步：ccview  

現在的 TUI 有幾個痛點：沒有 vim 的 yank，要往上捲、用滑鼠複製、貼上、再滾回去；fullscreen 模式下搜尋只搜得到目前畫面；classic 模式長輸出之後版型會跑掉、會閃爍、沒有 autoScroll；資料越長，往上引用越花力氣。他理想中的介面應該像 IDE 一樣對話：input box 凍結在最下面，任何一行按 y 直接 yank 進輸入框，可以固定位置瀏覽不被推走，照 prompt 跳轉一筆一筆對。  

所以他做了 ccview（Claude Code Viewer），現場 demo 了三件事：往上搜尋歷史內容、按 y 直接 yank 到 input box；固定在某個位置 review，不被新輸出推走；照 prompt 跳轉、逐筆對齊。  

–  

→ 視覺同步：一組工具  

視覺同步比文字難。他的工具組有三個：Gstack Shotgun（AI 用 top\-down 產圖片）、Superpower Visual Companion（AI 的視覺產出直接以網頁呈現），還有 Claude Design（AI 加 Figma 的高潛力工具）。接著他現場 demo 了兩個自製小工具，是從五十到一百個裡面挑出來的。  

–  

→ Demo 一：回測財經 KOL  

大家多少都有買股票，多半是 NVIDIA、美光這種科技股，也常看財經自媒體，而這類自媒體越來越多、很難挑。以前針對專業分析師有 TipRanks，分析師每季出買進、賣出或持有的看法跟目標價，很好評分，但台灣自媒體很少有可以回測的結構化資料。AI 改變了這件事：你可以把每個 KOL 的 podcast、YouTube、Substack 都變成結構化資料，再回測他們的選股贏大盤多少。他舉了兩個例子：  

\-\- 其中一個頻道每幾天出一集 50 分鐘 podcast，約 40 分鐘在聊生活，他用 AI 轉逐字稿、抓出每集重點、看好的標的（最新一集看好台積電跟蘋果）跟理由。從 2025 到今天（約一年半）提到約 487 支股票，隨便挑一支跟著做平均贏大盤約 0\.9%，全部都買贏約 30%，講最多的是美光  

\-\- 另一個頻道在 Substack 上的繁體中文選股分析排第一，隨便挑一支大致贏大盤，全部都買贏約 11%，但因為很難全部都買，他通常看中位數排名  

–  

→ Demo 二：跨境電商的圖片工作台  

他有個朋友做電商顧問，輔導很多台灣蝦皮店家。賣家會去 1688（大致是批發版的淘寶）進貨，再拿到蝦皮賣。這個工具會抓下頁面上所有商品圖，送進一個 AI 工作台，主要有兩個功能：把圖片裡的文字從簡體轉繁體或簡體轉英文，實測下來有一個模型效果明顯比其他好，每張約 60 秒，最新版的文字幾乎看不出是 AI 做的，反觀 GPT 還是看得出怪；商品轉成店面語言後，使用者上傳圖片，AI 自動寫出對應的廣告文案，再即時用 ChatGPT 生圖產出。
