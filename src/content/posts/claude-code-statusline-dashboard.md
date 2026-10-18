---
title: "Claude Code 狀態列：彙整跨對話的用量與工作摘要"
author: "鍾均"
authorId: "pfbid02zGAoTEDfhdkSdcwNJQw6bNLLvTY5a99vwxK86ZiDzK2niqRS1pwiuxC6hTFduWtyl"
date: "2026-04-19T08:53:07.000Z"
category: "知識精華"
tags: ["Claude Code", "開源", "狀態列"]
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1278090437222373/"
likes: 1961
comments: 49
shares: 685
images: []
---

Claude 其實什麼都知道，只是不想告訴你  
之前透過偷看其他前輩的 Claude Code CLI 配置，才知道 Claude 原來是有內建 statusline \(狀態列\) 的，在輸入框底下，你可以利用一個簡單的 js 腳本，把任何你想放的東西塞進去，所以心血來潮就嘗試自己來做一個看看。  
  
不做還好，一做嚇一跳，Claude 回傳的 payload 其實超級有料：錢、時間、行數、token 數、5h / 7d quota、context 剩多少、git worktree 甚至 transcript 檔案路徑都送給你了，只是沒人知道，光是把 payload 這些東西塞進 statusline 就很強了，也是大部分開源工具做到的程度，但是用了一陣子後才發現似乎不太對勁。  
  
1️⃣每個 session 的 quota 各說各話  
  
quota 是所有 session 共享的，開了 4 個 session 平行跑，每個 session 的 payload 都只回傳自己 session 的狀態，4 個 session 的數字沒有一個是真相。  
  
修法蠻簡單的，只需要維護一個全域檔案，所有 session 把自己拿到的最新資訊寫上來，最後所有 session 統一抓檔案最近更新的值即可。  
  
2️⃣cost 會被它偷偷 reset  
  
正常的 cost 回傳的是這個 session 累積花了多少錢 \(多少價值的 tokens\)，結果跑了 3 天，看到 $500，然後某次 context compact 過後，它變 $5❓  
  
雖然不太清楚 Claude 這波操作是何意味，但是其實只要用簡單的數學就可以解決，只需要維護兩個變數 \(累計 cost, 最新的 cost 值\)，如果發現最新的 cost 值變小就代表 reset，否則累計 cost 就加上當前 cost 跟前一次的差值即可。  
  
3️⃣如果 5h/7d 的時間重置，quota 不會自動歸零  
  
payload 有個很貼心的欄位叫 rate\_limits\.five\_hour\.resets\_at，會回傳這個 5h 窗口什麼時候到期，我一開始拿它來做倒數，看起來一切正常，結果當它倒數到 0，就會直接卡在那，一整晚沒動 Claude，早上起來看 statusline 還以為 quota 爆了不能用，但實際上窗口早就 reset 好幾輪了。  
  
原因一樣是因為當時的狀態是最後一次對話結束的值，只需要自動偵測當前時間是否過期，如果過期就強制歸零即可。  
  
除了以上這些 debug，我還加了許多別人沒有的獨家功能：  
1\. 跨 session：cost/tokens 預設是每個 session 獨立計算，但是正常人想知道的應該是所有 session 的加總，所以我一樣利用共享檔案來實現這件事，才發現我這個月用 100 美的價格用了價值超過 1000 美的 tokens \(用好用滿😂\)  
2\. 全 session 摘要：每 10 則訊息自動讓 Claude 生成 session 摘要顯示在狀態列，再也不會忘記每個 session 在做什麼  
3\. 自動 session 命名：每次 resume 對話的時候，總是忘記哪個是哪個，我直接讓腳本利用 session 摘要自動把 session rename，輕鬆找到對應 session  
4\. 客製化資訊：可以利用斜線指令 /statusline\-rows 決定要保留哪些資訊，只留下自己需要的功能  
5\. 其他也有像是 Agents / MCP / 已編輯的檔案 / 對話歷史\.\.\. 等等功能，等待大家來挖掘！  
  
實測使用 statusline 之後，整個工作心情都好起來了，所有資訊公開透明，不用再去猜還有多久撞上限，省去打斜線指令找資訊的繁瑣，最重要的是看自己到底薛了 Anthropic 多少錢😂  
  
經過反覆修正和迭代，決定把它分享給大家，如果你也想要擁有一個這樣的 statusline，歡迎自由取用喔！有任何想要許願的功能也歡迎！  
  
\(如果覺得這個專案不錯的話，歡迎按個星星喔⭐\)  
  
\(因為要放示意圖，連結我放在留言區\)
