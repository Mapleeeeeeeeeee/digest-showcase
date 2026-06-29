---
title: "Rex 的全包工作流：用 Claude Code 從前端工程師到一人全包"
author: "Natalie Feng Lin"
authorId: "627625202"
authorUrl: "https://www.facebook.com/627625202"
date: 2026-06-19T02:28:23.000Z
category: "社群活動"
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1325540795810670/"
likes: 228
comments: 6
shares: 92
images:
  - "https://scontent-lga3-2.xx.fbcdn.net/v/t39.30808-6/725860230_10174491885545203_5135273237824928848_n.jpg?stp=dst-jpg_tt6&cstp=mx1584x898&ctp=s1584x898&_nc_cat=105&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=BHbxoFg3EFMQ7kNvwHjAvIM&_nc_oc=AdoHmobCUroSFhBuwiBCOC9l1h0lqgxhn5uSBheYHx6Mm-IZSfQSX_2iPksyRAXH5iM&_nc_zt=23&_nc_ht=scontent-lga3-2.xx&_nc_gid=cIJHK7A9eag0CvT7mq4agQ&_nc_ss=7c289&oh=00_Af-mNRT1r47NWQays8KaSYX7YZQ_LlcwQEJ5W8MEbclqcg&oe=6A4449E3"
---
以下是 Rex 上週在 Claude 開發者 meetup 上 demo 的內容，我有用 AI 幫忙整理這場分享。他用的 deck 連結放在留言區。

Rex 是 FULY AI 創辦人暨 CEO。Rex 也是連續創業者，前一間公司進過 Techstars，更早之前在Yahoo跟趨勢科技當前端工程師。Rex 這次以 live demo 為主，分享他自己做的工作流程小工具，一方面看看能做到什麼程度，一方面也想跟大家交流還能怎麼優化。

--

從前端工程師到全包工程師
→ Rex Chen 分享 Claude Code 怎麼讓他從前端工程師升級成一人全包工程師的紀錄

他開場開了個玩笑：本來想講 harness engineering，但用了 Fable 5 加 ultracode 之後，他想想，還是分享開發產品的心得就好。Rex Chen 來自 FulyAI，是 Techstars 跟 AppWorks 的 alumni，曾任 Yahoo、趨勢科技的資深前端工程師，8 年全包工程師、20 幾年工程師資歷。他現在幾乎所有事情都自己一個人來，設計、客服全包。最近一個月他把手上幾個小工具全部從底層重做了一次、refactor 到最新版，像是升級他用來做 app 的那個框架，以前每隔幾個月升一次、在新電腦上幾乎沒順過，套件相依性一堆問題，他交給 Claude 去處理，做得很精準、省了非常多功夫。

--

→ 最近做的幾個小工具

他先 demo 了幾個東西：

-- Fuly：他們做的 app，會在一台機器上持續顯示即時成交，這個工具可以讓使用者的成績提升大約 40%。他把整個東西從 app 到網頁都重做，過程中還把 server 搬了家，成本因此少了大約 60 到 70%

-- TG_Bot：他們有一個五千多人的 Telegram 社群，一直有人發廣告、帶單，他以前幾乎裝過市面上每一個反垃圾 bot，但都擋得很爛，後來他用 Claude 自己寫了一個，把發廣告的模式都記下來、漏掉的就問它為什麼，現在已經擋掉超過一萬五千次，他甚至在考慮把這些 ID 名單 open source 出來

-- Lecture Studio：一個簡報工具，左邊是 Markdown、右邊直接變成簡報，他先用純文字寫大綱、貼進去讓它生成、再來回修，需要變化時還能請它把圖片變成 SVG 向量

-- Travel Agent：因為要帶小孩去澳洲，他做了一個行程規劃工具。以前用 Trello 或 Notion 排很麻煩，現在他跟它說「七天東京、兩天迪士尼」，幾十秒就生出一份詳細行程，連交通、時間、在地美食都有，還能用地圖檢視、換成旅遊達人的私房景點，實測下來大概七到八成沒問題

-- ClaudeCode Companion：一個監看 Claude Code 的工具，左邊是他在跑的 project、右邊是各個 session，可以查歷史、把 log 排得比較好讀，還能用 Trello 式的看板排卡片、按一個鍵就跑，甚至把 PLAN 變成簡報來讀，幾個 session 同時在跑時就會即時亮燈

--

→ 你是哪種人

他丟出兩個問題。第一個：你有沒有看過一種人，永遠在問、在比較哪個 AI 工具好用，等研究完新的又出來了，永遠在學但什麼都沒做出來。他半開玩笑說「只要你學得夠慢，就什麼都不用學了」，重點不是追工具，而是真的把東西做出來。第二個：當你下完 prompt，你是等結果、還是看過程？他自己是靠著 AI 去學習，而不是只叫它把東西做出來，因為他們做的是真正的產品，如果你只是看它怎麼做、貼上去，壞掉的時候你也不知道為什麼。

--

→ 真實案例：線上 Server CPU 100.4%

有一次線上 server 的 CPU 衝到 100.4%，意思就是快掛了。他沒有慌，而是回到 Claude Code，跟它說這台 server 的 loading 發出警告、請它找問題。他看著它檢查，後來找到原因：有一個他根本不需要的背景程序在監控某個 port，他開著沒用到的東西被外部打到，是被一個國外掃網路的研究單位掃到、打了大約 19 萬次。他請它修好並預防再發生，它又跑了一次安全性掃描、找出其他開著的 port。他把這變成一輪除錯迭代：

1/ 發現問題
2/ 尋找原因
3/ 修復
4/ 驗證
5/ 寫入 MEMORY.md
6/ 下一個問題

他的結論是：我看完過程、我學到了，AI 也記住了，下次就不會再發生。

--

→ 我的全包工作流

一個產品從無到有，他把它切成八段，每一段都有對應的 AI 工具接手，他負責「指揮加把關」。關鍵不是「全自動」，而是「全段都有 AI 主力，加上關鍵節點有人把關」。一條龍的流程是：Wireframe → 設計 → 切版 → 串接 API → 部署 → 測試 → 審核 → 上線，上線後再回到下一輪。接著他逐段拆解：

→ Wireframe：先把想法畫出來。 動手之前先把頁面結構、流程、元件擺位想清楚，他用 Whimsical 快速畫線框。結構錯了後面設計再美都白做，線框是最便宜的試錯，也是後面餵給設計工具的「需求地圖」。

→ 設計：三條路。 線框定好後他同時用三條，哪條快、對味就用哪條：

-- Google Stitch：把需求跟線框餵進去，直接生出接近成品的畫面

-- Claude Design：用對話建立一套 design system，把 Colors／Components／Spacing／Type 整理成系統，後面切版就有「唯一真相」

-- 設計 skills：固定掛 frontend-design、impeccable、shadcn-ui、ui-ux-pro-max，把「好看」變成可重複的規範

→ 切版加串接 API：交給 Claude Code。 這段是主力戰場，他用 CLAUDE.md 當專案的「憲法」（技術選型、命名、慣例、禁區全寫進去），讓 AI 每次動手前都讀；plan mode 他試過 superpowers、gsd、gstack、OpenSpec，但不喜歡產生一堆檔案的東西，覺得 Claude Opus 4.8 加 ultracode 的 plan mode 就很夠用。他用 CC Companion 監看過程，讓 AI 先 Plan、他看過再放行，並依難度切換火力：

1/ auto mode 加 Fable 5 加 ultracode：趁免費時能用多少用多少

2/ auto mode 加 Opus 4.8 加 ultracode：複雜任務、要深度推理，一開始 Plan 時用

3/ auto mode 加 Opus 4.8 加 high：Plan 完整、文件清楚時，做得快一些

他學到的事：把規範寫進 CLAUDE.md、讓 AI 先 Plan 再做，確認你看過了，才敢把大段工作交出去；沒有這兩樣，auto mode 跑越快、翻車越慘。

→ 部署：全部用 CLI。 他不進 console 點來點去，因為每個雲都有 CLI（aws、cloudflare、linode、vercel、supabase），把常用操作包成自己的 flow，一行搞定。例如「開一台裝好 Node.js、還能自選等級跟區域的 server」，他包成一支會問你問題的 shell script（new-node-server.sh）。心法是：凡是會做第二次的操作就包成 CLI flow，你累積的是一套會越用越快的個人產線，CLI 多了之後 token 消耗也少很多。

→ 測試與驗證：ultracode 加人工。 上線前最後一關，AI 跑得快但不能它說對就對。ultracode 負責廣度與一致性，並行 sub agents 大範圍掃、抓邏輯 bug 跟回歸問題；人工負責價值判斷與體驗。AI 能驗「行為對不對」，但「這體驗值不值得上線」是人的判斷。全包不是全交出去，而是知道哪一關只能自己扛。

驗證之後，抓到問題不是終點，而是下一輪的起點：找原因、修、再驗、把學到的寫進 MEMORY.md、進下一個。他最後留下一句話：把每一段重複的工作包成自己的 flow，你就是自己的全包團隊。
