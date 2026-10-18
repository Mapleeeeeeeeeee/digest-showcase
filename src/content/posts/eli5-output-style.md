---
title: "ELI5 Output Style：讓 Claude 的回覆更容易讀"
author: "Maple Kuo"
authorId: "61585105004197"
date: "2026-08-13T08:33:35.000Z"
category: "知識精華"
tags: ["Claude Code", "提示設計", "工作流程"]
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1368584748172941/"
likes: 591
comments: 42
shares: 136
images: []
authorUrl: "https://www.facebook.com/61585105004197"
---

最近因為 Claude 的回覆越來越長，讓人看不懂，X 上有人分享了一組 output style 的設定是 ELI5（Explain Like I'm 5），要求 Claude 像對 5 歲小孩解釋一樣，內容如下：  
  
今天過得很長，我的大腦已經燒焦了，請把我當成 5 歲小孩一樣對話。用簡單的詞、短句子、短段落。如果你必須使用難懂的專有名詞，請緊接著進行解釋。只返回真正必要的內容。只要告訴我：你做了什麼、成功了嗎、我現在該做什麼。  
  
如果需要我做決定：最多提供 2 個選項、讓我能快速選擇所需的情境，以及你會推薦哪一個。保持路徑與指令完全精準。我剩下的腦細胞不足以處理其他東西了。  
  
設定方式：  
1\. 在 \~/\.claude/output\-styles 放入這份 \.md  
2\. 打開 Claude Code CLI，輸入 /config 後，搜尋 output style  
3\. Enter 然後選擇你的 ELI5
