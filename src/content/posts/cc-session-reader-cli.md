---
title: "cc-session-reader：用 CLI 讀乾淨的對話紀錄省 token"
author: "Maple Kuo"
authorId: "61585105004197"
authorUrl: "https://www.facebook.com/61585105004197"
date: 2026-06-24T07:03:47.000Z
category: "知識精華"
tags:
  - "CLI 工具"
  - "Token 優化"
  - "Claude Code"
  - "開源"
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1329599262071490/"
likes: 164
comments: 10
shares: 37
images:
  - "https://scontent-lga3-1.xx.fbcdn.net/v/t39.99422-6/731105187_2075888452999766_3584496141339363042_n.png?stp=dst-jpg_tt6&cstp=mx614x628&ctp=s590x590&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=Z6dMsqjaNXcQ7kNvwGI4QGE&_nc_oc=AdrxHPbIYQKe69CCD86j_-VFr3erdSN_mFGTOf9eoycLbKD4a0VVaZyNn2q0mrMu-Qw&_nc_zt=14&_nc_ht=scontent-lga3-1.xx&_nc_gid=POGHSjscK3c2ZM_g4iOCkA&_nc_ss=72289&oh=00_Af_5SnxtEy6wbf9CULjOKThsvPmyZN6qHuuIz-6LyZirjQ&oe=6A447164"
  - "https://scontent-lga3-2.xx.fbcdn.net/v/t39.99422-6/728196300_1843423649968508_3677374838604117886_n.png?stp=dst-jpg_tt6&cstp=mx614x628&ctp=s590x590&_nc_cat=105&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=fVgyWFG-zXUQ7kNvwHuVISa&_nc_oc=AdoMKPVZQSv5exVHBlOgdDTJSKVp6LA6FYOvNg2_BMMJjZiYlOFXuU6xSqVAATNp3dw&_nc_zt=14&_nc_ht=scontent-lga3-2.xx&_nc_gid=POGHSjscK3c2ZM_g4iOCkA&_nc_ss=72289&oh=00_Af8Gc1-q-YKCo7h5Zu7O_hdTQU-P_wrTDY8nfcpa4s2KNQ&oe=6A4445B4"
---
Hi 大家，我想跟大家分享我最近做的一個 CLI 工具：cc-session-reader

因應 token 越來越貴，大家都在想盡各種辦法省 token，所以這個工具可以省下 token，而且我發現好像省下不少，但我最一開始打造這個 CLI 是，我平常有個習慣，三不五時會讓 Claude 回去讀過去我跟他的對話紀錄，來找找看有沒有什麼可以改善我工作流的地方，比如我一直在重複強調某些事，可以做成 skills、或是抽成 hook、甚至丟進 CLAUDE[.]md 等等

（雖然官方有 /insights，但我幾乎不用，都用這種方式來回顧過去改善工作流）

但我覺得回去讀原始的 josnl 太花 token，每次他都要寫一個一次性的 python script 自己過濾，而且我也曾看過他抱怨「太多噪音」，所以索性開發一個 CLI，能夠直接讀乾淨的歷史紀錄

因為我最初的目的只有要了解自己有哪些可以改善，所以其實只有我下的 prompt 跟 Claude 的回覆是重點，所以把工具的結果，skills 的呼叫，subagents 的結果等等都壓縮成一行，其他原本 Harness 的資訊都直接過濾掉，經過這個 CLI 過濾一輪之後我就發現，原本 300K ctx 的對話，透過 CLI 讀出來可能只剩下 30K，直接壓了 90%，那一輪的對話工具 call 的越多，壓縮率越高

後來我把這個工具分享給同事看之後，提供了一個想法是，既然他能讀過去的 session，會不會能取代 auto-compact 這件事，畢竟 auto-compact 過了一層 LLM，ctx 大幅下降，但資訊肯定是有損的，而且還需要花 output token 的費用

如果要思考這個工具能不能取代 auto-compact，要考慮的點最主要是 cache 的問題，長對話會有 cache 的優勢（但只要 miss 一次就會哭），還有長對話性能勢必會下降，因此開新對話然後用這個 CLI 讀紀錄，就要挑戰「讀取進來的成本，是否低於舊對話的 cache hit 價格」，這個 benchmark 就涉及到 Anthropic 如何計算 cache，以及 input output token 的計價方式，這邊比較複雜，用 AI 也不會完全正確，後續再來開一篇文跟大家分享，以及 prompt cache 到底是什麼

但結論是，這個 CLI 工具我實測下來是能夠打過 cache hit 的！如果你平常工作中間去吃個飯休息，導致 cache 過期就更不用說，用這個 CLI 肯定更划算，但缺點是，這個 CLI 也不能說是完全無損，畢竟 tool 跟 subagents 呼叫的結果都被我壓縮掉了（但如果 Claude 判斷有需要，可以全部展開，或局部展開），但跟 auto-compact 比起來，我認為資訊損失是更少的，畢竟大部分的資訊量都在你的提示詞跟 Claude 的回應

附件兩張圖是以我自己本機的 session 實測， context 代表原始對話（也就是在該 session 打 /context 會看到的數字），NewCtx 代表開新 session，用這個 CLI 讀取舊有 session 紀錄的，K 代表每下一次 prompt，Claude call 多少次工具（call 越多次，用 CLI 壓縮越划算），10 turn and 100 turn 省是指，原始對話 vs 新 session 使用 CLI 繼承歷史，一直對話下去，CLI 會相對原本對話省多少錢

總而言之，這個 CLI 可以幫你省錢😎可以用來回顧對話，或是你下次工作到一半去休息（超過一個小時），回來之後不要接續對話（價格會全部原價計算），可以開新對話然後用這個工具去原始對話再繼續！

repo 在留言區，是用 Go 寫的，支援跨平台，文件都寫好了，可以直接丟給 Claude Code 幫你安裝，並且自己跑一遍 benchmark（但需要申請 API Key，Anthropic 有個官方的計算 token 的 endpoint，免費但需要 Key）

如果喜歡的話請記得點個星星！😎
