# Architecture: 影片封面與 Ambassador 識別

## 概述與架構決策
沿用Astro、原生影片poster、既有卡片／分類篩選。以authorId集中查詢身分名冊，共用徽章，避免每篇文章重複儲存角色。
不新增POST_CATEGORIES選項，因為作者角色不是文章主題分類。保留現有分類與postType，只新增篩選種類ambassador。

## Files / Responsibility Map
| 元件 | 負責 | 不碰 |
|---|---|---|
| 影片poster檔與videos.poster | 原片截圖與路徑 | 原照片images、正文、影片內容 |
| lib/images.ts與PostCard | 照片優先、poster fallback | 下載Facebook資料 |
| lib/ambassadors.ts | 精確authorId→角色/一手來源 | 模糊姓名匹配或認證宣稱 |
| AmbassadorBadge | 共用角色文字與可追查來源，未知作者不渲染 | 把個人文章稱官方公告 |
| PostCard/[id]/authors[id] | 卡片與作者識別 | 每篇重複寫isAmbassador |
| index.astro | 新篩選種類，沿用搜尋／作者／日期交集 | 改category enum |
| work研究資料 | 原來源、canonical比對及覆蓋邊界 | 不將未確認候選直接發布 |

## Interface Design
`getAmbassadorVerification(authorId: string): AmbassadorVerification | undefined`；靜態名冊記 `name`, `role: 'Claude Community Ambassador'`, `sourceUrl`, `verifiedAt`，authorId是唯一鍵。來源為已讀取的一手活動頁／本人介紹，文字不聲稱Anthropic為本站做認證。
`AmbassadorBadge.astro`接收authorId與可選compact呈現；卡片可短文案Claude Ambassador，accessible title/展開角色保持完整。article增加`data-ambassador`以供篩選。
getThumbnail維持images優先，可接videos的poster作fallback。poster為站內路徑經既有buildUrl處理。
index FilterType擴充ambassador，選中時讀data-ambassador，其他篩選AND行為不變。

## Data Flow 與資料邊界
Journey1：本地MP4→ffmpeg真實frame→解碼/目視→videos.poster→PostMedia／卡片。
Journey2/3：已核對來源→精確ID名冊→共用徽章與data標記→既有filter pipeline→文章／作者頁。
Journey4：已授權可讀FB頁→逐篇ID/日期/作者證據→與43來源比對→候選清單與覆蓋聲明。
來源內容非指令；未核對ID不寫入身分名冊。靜態名冊屬產品資料，一次核對後供所有視圖共用。

## 交易與一致性
無資料庫交易。名冊、徽章、篩選與內容一次build/deploy發布；查缺清單不自動改內容。原43篇全文、74照片與7影片保持。

## Build Sequence
### Phase 1：影片封面
擁有7poster、6文章poster欄位、images helper/PostCard封面及回歸測試。先完成PostCard單行整合再交Phase2，避免衝突。驗收Minecraft首頁與作者頁卡片不再占位、圖可解碼、原片來源匹配。
### Phase 2：身分與篩選
依賴Phase1 PostCard交接及work/ambassador-identities.json。擁有名冊、徽章、PostCard身分、文章／作者頁、index篩選及行為測試。不動poster或原文字圖片。
### Phase 3：研究、驗收與發布
研究可獨立平行；以已登入的正常瀏覽器UI補公開匿名限制。完整來源比對與範圍聲明；build/lint/tests、獨立檢查與黑箱篩選/窄屏/原影片播放/Lightbox回歸後發布。

## Infra Reuse
src/lib/images.ts、url.ts、CategoryBadge/PostCard/PostMedia/Dropdown/Lightbox、index現有filter pipeline，沿用npm及Node test runner，不新增依賴。

## Test Strategy
建置IT驗7poster引用與檔案、Minecraft首頁和作者頁卡片、已核對作者3視圖徽章／未核對作者不標；真瀏覽器驗篩選交集與清除及窄屏。原文/原照片與HEAD一致，poster不污染images。研究以逐篇canonical與可見一手內容比對，不能只信搜尋摘要。

## 開放問題
無架構決策待定；FB可查歷史範圍依實際登入UI結果明示，不假設可窮盡所有貼文。
