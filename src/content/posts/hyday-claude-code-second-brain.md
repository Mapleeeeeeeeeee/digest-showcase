---
title: "用 Claude Code 密集開發五個月：筆記軟體 Hyday 的人機協作思維與架構"
author: "Muki Wu"
authorId: "521813915"
authorUrl: "https://www.facebook.com/521813915"
date: 2026-05-17T15:31:36.000Z
category: "知識精華"
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1299698321728251/"
likes: 171
comments: 12
shares: 38
images:
  - "/images/posts/hyday-claude-code-second-brain-e1382a2d992a.png"
postType: "article"
---

本來還想說管理員很好心，會先留言叫我編修內文，沒有直接砍文，結果我編修到一半文章還是被砍了，前後不到 36 分鐘，沒有任何的知會

但總之，還是再分享一次吧

.

.

大家好，我用 claude code 開發了約五個月的時間，做了一個筆記軟體 Hyday，詳細可參考： https://hyday.tw

100% 全程使用 Claude Code 開發，沒有用其他的 cli，也沒有手寫程式（頂多調整一下 CSS Style)

2025 年我還在使用 Obsidian 的時候，我是用 PARA 這個資料夾結構來整理我的筆記。但隨著 AI 的興起，後來幾個月我一直想要重新調整他的結構，所以誕生了 Hyday 這套筆記軟體

Hyday 最早的版本只有 markdown 編輯器 and 日記功能，我想要的東西很單純，就是一個能讓我每天寫「今天做了什麼、想了什麼」的工具，寫著寫著，讓我意識到了一個深層的設計問題：「我還在用人類大腦整理筆記的方式設計資料庫，但實際上每天最常翻我筆記的是 AI」

我們人腦習慣的是「把檔案放在哪個資料夾」這樣的視覺分類，但 AI 不需要，AI 要的是 frontmatter、tag、index 這類能一次掃完的東西。

如果我繼續用人腦的思維去設計 Hyday，等於每次跟 AI Agent 互動時，都要他重複 grep 整個資料夾，耗時耗力，也耗 token

所以我開始建立了各種系統，第一個系統 Lifelog 的靈感來自於「活用一輩子的筆記術」這本書，書裡提到的 lifelog，是一種把生活流書寫下來，未來自己回頭看會找到模式的設計。我把書裡的概念落地成五個 markdown 標記：

\>(09:00) 開始做某件事

\<(09:45) 結束

\-(10:30) 此刻的狀態

\%(這想法不錯) 一個念頭

\!(重要) 標記重點

從 Lifelog 開始延伸，搭配 Hyday Agent，直到 Claude Channel 的問世，我開始搭配 Claude Channel 系統，透過 MCP 開發自己的 Hyday Channel，我希望 AI 在 Hyday 裡不只是 sidebar 的 chat 視窗，更是能讓筆記自己生長。

所以 Hyday Channel 會根據你最近寫的筆記，推薦下一步可以做什麼，還能知道你現在在看哪一篇筆記？在輸入什麼內容？並適時地給予你意見

我的 Hyday 最後的架構如下：

```text
Hyday/
├── sources/                ← 外部素材（AI 只讀不寫）
│   ├── books/
│   ├── articles/
│   └── pdfs/
├── 根目錄 *.md              ← 我親手寫的筆記，沒有資料夾分類，全扁平化
├── wiki/                   ← AI 編譯後的主題知識
│   ├── _schema.md          ← wiki 規範
│   ├── _tags.md            ← 全 vault tag 詞彙表
│   ├── _index.md           ← 全 vault 元資料索引
│   ├── INDEX.md            ← wiki/topics/ 主題索引
│   ├── log.md              ← 變更紀錄
│   └── topics/             ← 編譯後主題頁
└── journal/                ← 日記
```

三份索引各自的角色：

→ `_tags.md`

- 索引什麼：全 vault 所有 tag 詞彙表
- 給誰用：AI 加 tag 時必查、防止自創

→ `_index.md`

- 索引什麼：全 vault 筆記的元資料
- 給誰用：AI 找東西時的快速入口

→ `INDEX.md`

- 索引什麼：只索引 wiki/topics/
- 給誰用：找「我整理過的主題知識」

每份索引只負責一件事，各司其職、不會重疊

◆ Wiki 的核心原則：指向不複製

參考 Andrej Karpathy 的 LLM wiki 概念，我對 wiki 的定義是「重新整合、用自己的話寫、底下附來源連結」的內容。他不是純索引，也不是抄原文，而是整合與收斂的產物

我把具體的規則寫到 `wiki/_schema.md` 中，其中包括可以和不可以做的事：

✅ 可以：用自己的話組織、整合多個來源、加 mermaid 表格
✅ 可以：引用原文金句
❌ 不可以：大段抄原文，當超過 50 字時要改寫
❌ 不可以：只列「相關筆記」卻沒有實質內容，因為那就變成是純索引了

而每個 `wiki/topics/*.md` 結尾都要附上「來源」

如此以來，我的原始筆記始終是獨立的觀點，不會被 wiki 所覆寫，而 `wiki/topics` 是該主題的最新整合視角，可以進行校對更新，讓兩個層級乾淨分離

◆ 調整後的流程與架構

調整後的架構,變成了包含扁平化、三份獨立索引，以及 AI 自動規則的系統

我在 `CLAUDE.md` 裡寫了要讓 AI 自動做的事：

1. 有新的 tag 必須先登記到 `_tags.md` 才能用
2. 資料庫內引用 wikilink，不用 markdown link
3. 用整合的視角來撰寫 `wiki/topics/`，不大段抄原文

我動到的筆記如果是某 wiki 頁的來源，AI 會提醒 wiki 可能要更新

未來,我只會讓人腦（自己）做兩件事：

1. 產生想法並寫到筆記裡
2. 做判斷
   - AI 可以建議我文章要標哪些 tag，但依然由我拍板決定
   - 這個主題是否累積夠多的文章？是否要編譯到 `wiki/topics`？

剩下的索引、關聯、跨筆記整合、維護，通通交給 AI，我給他的定位是編譯人員，幫我把散落的素材編譯成結構化的知識，再隨時更新維護

關於 Hyday 的 design token，也有一份明確的名單，列出我不要的方向：

1. SaaS 樣板（漸層 hero、Inter 字型、card-in-card 那種）
2. 過度裝飾的 pill badge
3. 紫色漸層
4. sparkle icon
5. glow 效果
6. 所有 AI slop 視覺語言

五個月的開發過程很長，本意也真的不是想要行銷，只是想跟有使用 Claude Code 的朋友交流，希望能透過留言的方式，先知道大家對什麼有興趣，我才能針對性地回覆

所以有任何想了解的開發流程，歡迎討論與交流
