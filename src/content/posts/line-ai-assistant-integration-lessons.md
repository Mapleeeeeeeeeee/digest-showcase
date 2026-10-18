---
title: "用 Claude Code 做 LINE AI 助理：八個整合與測試經驗"
author: "Going Li"
authorId: "pfbid02Qt6Kf6dyiwz3HZ9VFzAGKCYfYrqT9ULutLLjMdPFGm1p2464bCD5QW3hqPqu8WJEl"
date: "2026-09-30T15:25:45.000Z"
category: "知識精華"
tags: ["Claude Code", "LINE", "整合", "測試"]
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1407222454309170/"
likes: 212
comments: 11
shares: 78
images: []
---

【用 Claude Code 做一個「在 LINE 裡用自己的 AI」的機器人：踩到的 8 個坑】  
  
我是華語中心的組長，不是工程師。這陣子讓 Claude Code 陪我做了一個 LINE 機器人：拍會議通知或活動海報傳給它，就會自動加進 Google 行事曆；平常也能直接聊天、看圖、翻譯。後來整理成可以分享的版本，背後的 AI 可以選 ChatGPT、Gemini 或 Claude，用你自己的金鑰。  
  
（第二張圖是我自用版的畫面，多了 Obsidian 筆記和 Mac 遠端功能；分享出來的版本只有聊天、看圖、行事曆。）  
  
東西本身不是重點，下面是過程中真的卡過、希望早點知道的事。  
  
━━ 一、跟 LINE 和 Google 有關的坑 ━━  
  
1\. LINE Developers Console 已經不能直接建立 Messaging API 頻道  
  
網路上舊教學幾乎都失效了。現在要先建「LINE 官方帳號」，再到官方帳號後台（Official Account Manager）的「設定 → Messaging API」啟用，而且那裡選的 Provider 綁定後改不了。另外 Channel access token 不在官方帳號後台，要回 Developers Console 的 Messaging API 分頁最下面按 Issue。  
  
2\. Google Apps Script 當 LINE webhook：Verify 一定失敗，但其實能用  
  
LINE 規定 webhook 要在 2 秒內回 200，但 Apps Script 的 doPost 一律回 302 轉址。所以 Console 的 Verify 會顯示錯誤，可是訊息照樣處理得到（doPost 已經跑完了）。要注意兩件事：  
  
・Webhook redelivery 一定要關，不然每則都會被重送  
  
・用事件裡的 webhookEventId 去重，同一則只處理一次  
  
3\. Apps Script 讀不到 HTTP 標頭，所以驗不了 LINE 簽章  
  
我的做法是在 webhook 網址後面加 ?key\=一串隨機碼，doPost 先比對這個 key，不對就直接丟掉，再加上「只回應第一個綁定的 LINE 使用者」。  
  
4\. 用程式呼叫 GAS web app 時，約 1/4 的回應會卡 10–40 秒  
  
這是我的機器人要寫行事曆時實測到的。GAS 伺服器端每次只跑 0\.3–2 秒，但呼叫端常常等很久，甚至逾時。更麻煩的是，逾時的那次活動其實已經建好了，使用者重傳就變兩筆。還有一次回來的居然是 doGet 的內容。  
  
最後的做法：  
  
・每筆寫入帶一個冪等鍵（訊息 ID＋標題＋時間做雜湊），GAS 端用 LockService＋CacheService 擋重複  
  
・只有看到 doPost 才會回的欄位（eventId）才算成功，只看 ok:true 不算  
  
・逾時不等於失敗，回覆說「可能已經加入，請先確認」  
  
━━ 二、三家 AI API 的坑（2026\-09 查的官方文件） ━━  
  
5\. Gemini 3 叫工具時會附 thoughtSignature，沒原樣送回會直接 400  
  
最簡單的做法：把 candidates\[0\]\.content 整包塞回對話紀錄，不要自己重組 part，就不會弄丟。  
  
6\. OpenAI Responses API 用 store:false 時，上一輪的 reasoning 和 function\_call 項目都要原封不動送回去  
  
另外 429 同時代表「太快」和「沒錢了」，要看 error\.code：credit\_balance\_exhausted 才是額度用完。錯誤訊息如果只寫「太忙了請稍後再試」，使用者會一直等下去。  
  
7\. Claude：對話紀錄裡有 tool\_use 時，每一輪請求都要帶 tools  
  
我原本在最後一輪拿掉 tools 想逼它直接回答，結果被 API 拒絕。  
  
額外提醒：Gemini 的生圖模型 gemini\-2\.5\-flash\-image 在 2026/10/2 停用，要改用 gemini\-3\.1\-flash\-image（沒有免費額度）。我是讓 Claude Code 查官方停用公告才發現的，差兩天就壞了。  
  
━━ 三、怎麼跟 Claude Code 合作 ━━  
  
8\. 模擬測試全過，不代表是對的  
  
Claude Code 幫我在 Node 裡模擬整個 Apps Script 環境，19 項測試全過。但這些測試跟程式是根據同一份「對文件的理解」寫出來的，理解錯了，兩邊會一起錯、測試照樣全綠。所以一定要真的打一次 API。  
  
我的做法：開一個臨時的雲端工作（Cloud Run job），把金鑰用密鑰管理掛進去，在裡面跑真實測試，金鑰全程不經過 Claude 的對話。跑完就把工作和映像檔刪掉。  
  
幾個讓我少走冤枉路的習慣：  
  
・查 API 用法時，請 Claude Code 開背景 agent 只讀官方文件，每個結論附網址。第一次我把三家塞給同一個 agent，查到一半卡死，改成一家一個就順了。  
  
・請它「故意把程式改壞，看測試會不會變紅」（mutation test）。測試抓不到故意放的 bug，那個測試就沒有用。  
  
・我給的「例如」不等於需求範圍。我一開始舉了三個例子（行事曆、筆記、生圖），Claude 就照例子做成了行事曆小幫手，漏掉我真正要的「在 LINE 裡用完整的 AI」。後來我在需求裡直接寫「例子只是說明」，就不會再這樣了。  
  
━━ 如果你也想做一個 ━━  
  
程式和教學都公開在 GitHub（MIT，可以自由改）：  
  
[https://github\.com/goingli0324/line\-ai\-assistant](<https://github.com/goingli0324/line-ai-assistant>)  
  
設定教學（照著做約 30–40 分鐘，全程免費，只付 AI 用量）：  
  
[https://github\.com/goingli0324/line\-ai\-assistant/blob/main/docs/setup\-simple\.md](<https://github.com/goingli0324/line-ai-assistant/blob/main/docs/setup-simple.md>)  
  
誠實說明：Claude 和 Gemini 我用真的 API 測過；ChatGPT 因為我沒有 OpenAI 金鑰，只做了模擬測試。如果有人用 ChatGPT 版遇到問題，歡迎留言告訴我。
