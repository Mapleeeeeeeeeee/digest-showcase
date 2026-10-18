# Architecture: Get-a-Life 主題與留言資源

## 決策與介面
新增post-topics helper集中定義唯一這組的primaryId=get-a-life-mandala-tool、sourceIds日期升序=[mandala-life-timeline-origin,get-a-life-mandala-tool]、title、source anchors。原MD保留，helper將raw entries投影為display entries，供首頁、作者頁、prev/next一致使用；其他entry原樣通過，缺少指定source時build報錯。
展示primary沿用原id與最近6/23日期／統計，但明示「最新分享」與「2篇原文」。合併僅展示，不重綁兩個masked作者ID或將互動數相加。
content schema新增resources預設[]，每筆{label,url,sourceUrl,sourceLabel?}，url/sourceUrl只http(s)；sourceLabel可明確區分來源留言與來源貼文。取得URL證據後才新增資料。
primary頁render原2 entries為獨立source sections，沿用原文render、PostMedia、PostStats及原文入口，資源區在原文之外。每節id=source-<sourceId>。舊secondary使用Astro.redirect(postUrl(primary)+anchor,301)；static build為meta refresh/canonical/fallback link，不能宣稱Pages HTTP本身301。

## 責任與檔案
- lib/post-topics.ts：唯一group定義、來源查詢、展示投影與原作者對映，不抓外部資料。
- pages/index.astro、authors/[id].astro：使用投影後資料及搜尋標題，不另手寫隱藏規則。
- pages/posts/[id].astro：所有原source route仍產生，secondary轉址，primary兩節，prev/next基於display entries。
- components/PostCard：小幅可選topic資訊／卡片統計說明；若需要source section/resource元件可局部新增，不建立通用CMS系統。
- content.config.ts及兩MD：resources schema與已證實資料，原body/images不變。

## Build Sequence
1. scout確認repo邊界及公開留言URL，記錄來源證據。
2. 一個worker擁有topic helper／三頁／card／source元件與相關行為測試；另一worker僅擁有resources schema與兩MD frontmatter（正文媒體不能改）。不平行寫同檔。
3. root集中build/lint/tests；獨立核對原文6圖／統計／資源、browser舊網址跳轉與搜尋／篩選，通過後提交部署。

## 資料邊界與一致性
外部留言URL在人工核證入口及schema驗證，缺證據不猜；resources是編輯補充不算原文。group sources必須存在且唯一。原文／照片／各來源metrics不複製進新MD。兩作者route只對本topic覆蓋來源成員，其他同名作者保持。
一次靜態artifact發布group投影、redirect、resources，無資料庫交易／新依賴／後端。

## Test Strategy
原body與images對HEAD byte／語義核對；建置IT證首頁及兩作者各一主題卡、兩全文與6圖在來源section、各原counts正確、secondary refresh實際anchor、來源URL符合證據、導航沒有secondary。修正既有每MD一張卡與每route直接包含原媒體的假設時，改為resolve topic/source section驗，不能跳過secondary完整性。
browser實際舊URL→anchor、GitHub資源連結、兩節lightbox、搜尋兩篇詞彙與日期／作者疊加；其他媒體及Ambassador數量22保持。Astro官方/本機版本static redirect行為已由scout查證。
