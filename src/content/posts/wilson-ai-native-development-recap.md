---
title: "以下是 Wilson 上週在 Claude 開發者 meetup 上 demo 的內容，我有用 AI 幫忙整理這場分享"
author: "林楓"
authorId: "627625202"
authorUrl: "https://www.facebook.com/627625202"
date: "2026-06-16T15:39:33.000Z"
category: "社群活動"
tags: ["社群活動","Claude"]
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1323620939335989/"
likes: 171
comments: 3
shares: 76
images: ["/images/posts/wilson-ai-native-development-recap-01-10174471939635203.jpg"]
videos: []
---

以下是 Wilson 上週在 Claude 開發者 meetup 上 demo 的內容，我有用 AI 幫忙整理這場分享。他用的 deck 連結放在留言區。  

Wilson 是 Hyperpoker Head of FDE, APAC。台大資工畢業，曾在 Yahoo 和 Mithril 擔任技術與產品主管，也是連續創業者。Wilson 這次會分享他正在實踐的 AI Native 公司是什麼樣子，包括他的團隊怎麼從零開始把 AI 融進組織與工作方式。  

–  

成為 AI\-Native 公司  
→ Wilson 分享 HyperPoker 怎麼把開發流程、工具鏈，跟一群 agent 一起重做的紀錄  

Wilson 是 HyperPoker 的亞太區前進部署工程主管。在這之前他創辦了 XY Finance，一個跨鏈轉帳的聚合協議，做到 1M\+ 使用者、$2\.6B 跨鏈交易量、串接 25\+ 條鏈，他把那個工程團隊從零帶到 30 人，走過 DeFi 的高峰跟熊市，也踩過各種 bridge security 的坑。  

他一開場就說：HyperPoker 現在團隊縮到不到十個人，卻能做出相對複雜的產品、而且更快，關鍵就在於他們的工作流程跟別人很不一樣，而且差很多。他們做的是一個小眾、相對封閉的市場：線下撲克。這個產業的後台系統 30 年沒變，跟很多餐廳、健身房一樣，還在用 Excel 跟 LINE，獎金用人工算，再加一台 POS 機處理會員點數，整個系統很碎，櫃檯現場一團亂。所以 HyperPoker 做了一套 total solution，把所有東西整合起來，包含訂位，你可以想成撲克版的 Booking\.com。用不到十個人、不到半年，他們就把 B2B 跟 B2C 都整合上線，累積大約兩萬名使用者，速度大概是以前的 5 到 10 倍。  

–  

→ 以前流程卡在哪裡  

他先講以前的流程怎麼跑。老闆有一個（通常好幾個）想法，用口頭或開會說明要做什麼、為什麼、要哪些功能。PM 把想法記下來、或去訪談客戶，再寫出詳細的 PRD。接著跟設計師討論 UI、UX，連每一種狀態都要想：找不到東西、有找到、結果太多時各要顯示什麼，光這部分就來回一兩週。等 PM 確認，前端才開始做，後端同時確認需求；做出來還要跟團隊、跟老闆確認，再接起來整合、測試，最後才交付。尤其在大公司，常常就是卡在那裡等。以前光前期就要好幾個月，後面開發再三到六個月，從想法到上線大概要半年。  

–  

→ 砍到剩三個階段  

把中間砍掉之後，現在只剩三個非常快的階段：  

1/ 老闆用 Claude、Codex 或 no\-code 工具，一天就兜出一個 MVP，直接拿去問客戶「這是你要的嗎」。一開始鎖定一般使用者，但客戶回饋讓他們轉向合法的撲克協會，老闆直接拿 MVP 去確認可行性，把整個說明跟討論的階段全部收進這一步。  

2/ 等東西到 PM 手上已經很具體、也經過市場驗證，PM 這時比較像設計師，大概兩週就能做出可以點、可以直接拿去市場測試的原型。  

3/ 後端工程師才進來，處理一萬、十萬連線的並發，還有可靠性跟效能，大約兩個月上線，同時跟客戶溝通。  

把原本八個環節壓成三個，正是速度的來源。  

–  

→ 角色是怎麼被合併的  

重點不是裁掉設計師跟前端，而是把那些能力內化到剩下的人加上 AI 工具裡：  

\- 老闆：兼 BD 跟管理，行政庶務交給 AI agent（每日任務、出勤回報、團購、發薪），還兼設計師，顏色或 logo 不對就自己改、直接開 PR  

\- PM：吸收前端、設計、QA，甚至用 Playwright 加 headless browser 跑簡單的 end\-to\-end 測試  

\- 後端工程師：同時兼 CI/CD、infra、監控  

–  

→ 工具鏈與 Slack 工作流  

他們把比較舊、比較重、不接 MCP 的工具都淘汰掉，從 Jira 換成 Linear。日常以 Slack 為中心，當作公司 AI agent 的工作空間，接了好幾隻 bot：Claude Code Bot、Linear Bot、GitHub Bot，還有負責會議記錄的 Circleback。開 standup 時，工具會把會議錄下來、轉逐字稿、整理成附 action items 的 email 寄出去，所有 context 都匯進 Slack，由一隻 Claude bot 持續監看跟收集。thread 裡有人不懂就直接 tag Claude 去查，要開票就 tag Linear。  

開發循環大致是這樣：  

1/ 在 Slack 討論時 tag bot 開票，Linear 自動產生 ticket、把對話同步進去並指派同事  

2/ 同事用自己的 Claude 從 Linear 撿票、開始做、送出 PR  

3/ PR 一上，一支用 Claude API 的 Python 腳本做 code review，Wilson 另外有一個 Claude session 每三十分鐘檢查 repo 有沒有新 PR  

4/ 經過這兩道 review、不同模型來回確認後，才判定安全  

同事之間大量的 AI 互動會累積成全公司的知識，新功能壞掉的機率低很多。  

–  

→ 幾個實際的例子  

他舉了幾個現場跑出來的例子：  

\- 一位同事提了一個用 AI 隨機產生使用者名稱的方案，另一位補充前端怎麼處理，Linear 就自動開了一張 ticket（\#340），還把被引用的文件拉進去當 context，指派出去後什麼都沒漏掉  

\- 因為大家都遠端，上下班就在 Slack 貼「我現在開始／結束」，一隻 agent 把時間記到 Excel。有同事建議把提醒改到晚上七點，agent 注意到、判斷值得一提就丟給 Wilson，他說改成六點就好，agent 就把規則加進去、開始自己提醒  

\- 他用一個叫「Gilfoyle」的 persona 做 PR review，設定每三十分鐘檢查 repo、給他每個 PR 一段 20 到 200 字的摘要，他一眼就知道進度到哪  

\- 有人把功能推上測試，被問有沒有對大客戶做負載測試，沒有，開發者就直接叫 AI 去讀相關 ticket、開一張壓力測試的票，不用切到 ticket 系統、也不用 PM 介入  

\- 每次部署（現在最快兩天一次），AI 會直接在 Slack 整理這次發布：改了什麼、多少 commit、動到哪些檔案、PR 連結，有同事甚至直接在 terminal 用 Claude 把發布訊息送出去  

–  

→ 不是一個 agent，是一群 agent  

這些 agent 都掛在 Telegram 這個統一入口，各有角色（用動漫和影集角色命名）：  

\- Itachi：戰略決策／orchestrator  

\- Uraume：行政事務／cron／月曆  

\- Gilfoyle：PR review／安全把關  

\- Kakashi：收集 context／萬用助理  

\- 還有兩隻規劃中：行銷／主編／報價單，以及法律／合約審查  

它們共用一套記憶系統，放在 \~/agents/shared，分成三層（personal／company／shared），所有 agent 都能讀寫；orchestrator 會固定回顧當天的對話、寫進這份共享記憶，其他 agent 隔天就帶著前一天的 context，又不會污染到自己的。  

–  

→ 你今天就可以做的三件事  

1/ 裝 Linear MCP，把開一張票的時間從五分鐘變三十秒，OAuth、五分鐘搞定  

2/ 在 Slack 加一隻 Claude bot，tag 它幫你產 daily standup，不用每天輪流發訊息  

3/ 把一件你討厭的行政事 wrap 成 cron 加 agent，第一隻 agent 通常從「我不想再做這件事」開始
