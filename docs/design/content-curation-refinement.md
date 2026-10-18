# 卡片互動與 Ambassador 收錄調整

## 使用者要求
卡片 hover 太顯眼；Ambassador 文章的預告不收，只收 recap 或有資訊價值者。使用者已確認本輪只更新候選清單，不新增文章。

## 行為與驗收
- 滑鼠移入卡片時，只留下輕微中性陰影；不出現橘框、不讓標題變橘、不移動整張卡片、不放大縮圖。網格與列表模式一致。
- 卡片和作者／身分連結仍可點擊，鍵盤聚焦保留清楚的中性外框。
- 既有兩篇純預告 claude-founders-meetup-announcement、claude-meetup-gaming-announcement 移出發布集合，完整原文與來源留在 content/archived-posts。
- 已發布文章由43變41，Ambassador篩選由11變9。Gaming recap及Tammy／Eric／Howie回顧仍保留；一般非Ambassador文章不受影響。
- 原文、照片、影片及封面不改寫或刪除；候選27篇不匯入。
- 待收錄清單按 docs/content-policy.md 讀全文重選，列出保留與排除理由，並保留原文連結與搜尋範圍說明。

## 驗證範圍
實際滑鼠hover前後比較邊框、標題色、transform與影像scale；鍵盤Tab聚焦；網格／列表；首頁與作者頁收錄一致、篩選／清除正常、41篇無空卡片。候選清單逐篇核分類、日期與來源，27篇決策不可漏。
