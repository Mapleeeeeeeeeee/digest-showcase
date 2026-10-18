---
title: "Twinkle AI MCP Hub：讓 AI 查詢台灣開放資料"
author: "Huang Liang Hsun"
authorId: "61550939098667"
date: "2026-05-11T02:49:18.000Z"
category: "知識精華"
tags: ["MCP", "開放資料", "台灣"]
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1294632538901496/"
likes: 1859
comments: 95
shares: 708
images: []
authorUrl: "https://www.facebook.com/61550939098667"
---

🇹🇼 台灣第一個 MCP Hub 上線  
串上 data\.gov\.tw 全量 49,343 個資料集。給 Claude Desktop / Cursor / 養龍蝦族 / Hermes Agent loop / Ollama / vLLM — 都能用。你不用再浪費你的 tokens 了！  
  
\[\#故事是這樣的過去\]\([https://www\.facebook\.com/hashtag/%E6%95%85%E4%BA%8B%E6%98%AF%E9%80%99%E6%A8%A3%E7%9A%84%E9%81%8E%E5%8E%BB?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/%E6%95%85%E4%BA%8B%E6%98%AF%E9%80%99%E6%A8%A3%E7%9A%84%E9%81%8E%E5%8E%BB?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>)  
  
你想做一個會「查臺北 PM2\.5」「比較高雄各區人口」「搜尋政府決標」的 AI 助手，你要：  
  
\- 自己爬 data\.gov\.tw 5 萬個檔案  
  
\- 處理 CSV / JSON / XML / PDF / 全形數字 ParseError  
  
\- 維護 daily refresh、解 rate limit、清 broken data  
  
\- 弄 SQL normalize  
  
\- 串 MCP gateway  
\> \.\.\.你的 tokens 就是這樣浪費掉，而且還不見得做得好  
  
\[\#今天你可以這麼輕鬆\]\([https://www\.facebook\.com/hashtag/%E4%BB%8A%E5%A4%A9%E4%BD%A0%E5%8F%AF%E4%BB%A5%E9%80%99%E9%BA%BC%E8%BC%95%E9%AC%86?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/%E4%BB%8A%E5%A4%A9%E4%BD%A0%E5%8F%AF%E4%BB%A5%E9%80%99%E9%BA%BC%E8%BC%95%E9%AC%86?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>)  
  
我一直在想我們有一個這麼重要的寶庫：OpenData，在這個 agent 盛行的年代不是更應該讓他 MCP 化嗎？  
  
\- data\.gov\.tw 全部 \[\#5萬多\]\([https://www\.facebook\.com/hashtag/5%E8%90%AC%E5%A4%9A?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/5%E8%90%AC%E5%A4%9A?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>) 個資料集即時可查 \(96\.6% 覆蓋率\) \- PCC 政府電子採購網 13\.5 萬筆決標 / 招標每日同步  
  
\- 32 個台灣專用 utility tool \(身分證 / 統編 / 民國年 / 地址 / 機構查……\)  
  
\- 半秒 SQL 查詢層,跨資料源 join  
  
\- 5 國語系 \(中 / 英 / 日 / 韓 / 法\)  
  
\- 整套接到 MCP — 一支 Bearer token,任何 MCP client 都能用  
  
\[\#你只要\]\([https://www\.facebook\.com/hashtag/%E4%BD%A0%E5%8F%AA%E8%A6%81?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/%E4%BD%A0%E5%8F%AA%E8%A6%81?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>)  
  
1\. 打開 hub\.twinkleai\.tw \(放留言\)  
  
2\. 複製首頁那段 prompt  
  
3\. 貼進 Claude Desktop / Cursor  
  
對 就是這麼簡單！！！  
  
\[\#然後問AI任何台灣相關的問題\]\([https://www\.facebook\.com/hashtag/%E7%84%B6%E5%BE%8C%E5%95%8Fai%E4%BB%BB%E4%BD%95%E5%8F%B0%E7%81%A3%E7%9B%B8%E9%97%9C%E7%9A%84%E5%95%8F%E9%A1%8C?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/%E7%84%B6%E5%BE%8C%E5%95%8Fai%E4%BB%BB%E4%BD%95%E5%8F%B0%E7%81%A3%E7%9B%B8%E9%97%9C%E7%9A%84%E5%95%8F%E9%A1%8C?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>)  
  
「幫我規劃從臺北出發、3 天 2 夜的家庭親子行程,熱門景點 \+ 臺中合法民宿 \+ 沿路夜市」  
  
「列出今年金額最大的政府採購 10 件、廠商分布」  
  
「113 學年度大學招生錄取率最高的 10 個科系」  
  
它會用真實政府資料回答你，不用再幻覺了！  
  
\[\#龍蝦友善\]\([https://www\.facebook\.com/hashtag/%E9%BE%8D%E8%9D%A6%E5%8F%8B%E5%96%84?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/%E9%BE%8D%E8%9D%A6%E5%8F%8B%E5%96%84?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>) \[\#hermes友善\]\([https://www\.facebook\.com/hashtag/hermes%E5%8F%8B%E5%96%84?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/hermes%E5%8F%8B%E5%96%84?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>)  
  
 養龍蝦族 / Hermes Agent / Continue / Cline / 自己 fork 的 agent loop？也能用 — MCP 是開放協定，不是 Claude 限定。你的模型在你家機器跑，data 從這邊拿，整條資料管線都是你自己掌控。沒有 OpenAI quota、沒有 Anthropic API change、沒有 cloud LLM 綁架。換個 endpoint 就繼續用。  
  
\[\#需要更多MCP嗎\]\([https://www\.facebook\.com/hashtag/%E9%9C%80%E8%A6%81%E6%9B%B4%E5%A4%9Amcp%E5%97%8E?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/%E9%9C%80%E8%A6%81%E6%9B%B4%E5%A4%9Amcp%E5%97%8E?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>)  
  
試了有想法 / 卡住 / bug，留言到 github \(放留言\) 或寄 support@twinkleai\.tw。  
  
Twinkle AI \[\#MCP\]\([https://www\.facebook\.com/hashtag/mcp?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/mcp?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>) \[\#OpenData\]\([https://www\.facebook\.com/hashtag/opendata?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/opendata?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>) \[\#OpenClaw\]\([https://www\.facebook\.com/hashtag/openclaw?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/openclaw?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>) \[\#Hermes\]\([https://www\.facebook\.com/hashtag/hermes?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/hermes?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>) \[\#LocalFirst\]\([https://www\.facebook\.com/hashtag/localfirst?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/localfirst?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>) \[\#BuildInPublic\]\([https://www\.facebook\.com/hashtag/buildinpublic?\_\_cft\_\_\[0\]\=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS\-IOdKFlQ9AOcaZIT0qBVN\-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&amp;\_\_tn\_\_\=\*NK\-R\)](<https://www.facebook.com/hashtag/buildinpublic?__cft__[0]=AZazvAbQJ3YCSaXCX9tskwaHG2Mx9kMIcStQM0qoZg7YhlwMjR7iq1M95HLrBVzGK5tZSTb9MBejpEn2asPWFXfc0wptwN9BS-IOdKFlQ9AOcaZIT0qBVN-tS9oGdEl7UFw11X7z7kxUys1PkdOXBpIq&__tn__=*NK-R)>)
