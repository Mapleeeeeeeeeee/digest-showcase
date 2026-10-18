# Architecture: 站內影片與部署更新

## 概述
沿用 Astro 靜態內容及 GitHub Pages。本地 MP4 由瀏覽器原生 video 播放；部署版本標記與靜態版本端點供前景頁面檢查更新。本輪在全部驗收後建立單一 commit。

## 架構決策
| 模組 | 結構 | 依據 | 替代方案與不選原因 |
|---|---|---|---|
| 文章影片 | videos 欄位與原生播放器 | 7 個附件可取得 MP4，不需新依賴 | Facebook iframe 本次播放失敗；永久使用短效 CDN 來源會失效 |
| 混合附件 | 保留 images，影片記錄 afterImage | 原照片只有一份資料，仍可還原混合次序 | 新 media 欄位重複所有 images 會形成兩份真相 |
| 更新偵測 | 靜態 version.json + 瀏覽器 watcher | Pages HTML max-age=600，不能修改遠端瀏覽器舊快取 | Service Worker 與換主機超過本次必要範圍 |

## Files to Create / Modify
新建 PostMedia 元件、build-version 模組、version.json 靜態端點、更新 watcher 與有行為意義的測試；新增 public/videos/posts MP4。
修改內容 schema、文章模板、BaseLayout、7 支影片所屬文章 frontmatter。不得改正文、images、舊文章日期或前次歷史。

## Responsibility Map
| 元件 | 負責 | 不碰 |
|---|---|---|
| 內容 schema | 驗證本地影片路徑、來源網址與 afterImage 範圍 | 下載與播放 |
| PostMedia | 由 images 與 videos 推導有序附件，原生 controls/playsinline/preload=metadata，失敗仍有原文入口 | 版本檢查、外部抓取 |
| build-version 與 version endpoint | 同次建置一致的版本標記 | 瀏覽器導航 |
| 更新 watcher | 驗證版本回應、前景檢查、播放中延後、避免導航迴圈 | 改變 Pages HTTPheaders、離線快取 |
| 影片採集 | 7 支 MP4、原始來源/音軌/尺寸/時長核對 | 摘要或改寫正文 |

## Interface Design
內容新增 videos，預設空陣列：`{ src: string; sourceUrl: string; poster?: string; afterImage: number }[]`。
src 與 poster 為站內根相對資源，經 buildUrl 加站台 base。afterImage 是此影片之前的照片數，為 0..images.length 的整數；同位置影片依陣列順序。不得複製 images 成另一份內容資料。
版本端點回 `{ version: string }`。BaseLayout 提供本頁建置版本與 buildUrl('/version.json')。watcher 僅在有效且不同版本導航，更新 `__site_version` query 並保留其他 query/hash。該 query 已是目標版本時不再導航。

## Data Flow
Journey 1：來源附件 → 驗證下載/完整解碼 → 本地MP4與frontmatter → schema → 有序媒體元件 → 使用者播放/暫停/跳轉。
Journey 2：CI同次版本 → HTML版本與version.json → 瀏覽器載入/回前景/每15秒檢查 → 有效新版 → 播放中暫存、否則以帶版號URL替換頁面。

## 資料邊界
| 來源 | 轉換處 | 不符合時 |
|---|---|---|
| Facebook 影片 | 採集時檢查HTTP、ffprobe、ffmpeg完整解碼 | 不發布缺漏或壞影片 |
| Markdown影片 | Astro內容schema | build失敗，避免壞路徑與非法afterImage |
| 版本端點JSON | watcher入口 | HTTP/網路/逾時/JSON/缺欄位失敗維持原頁 |

## 交易與一致性
CI建置及部署以完整artifact為單位。影片檔案、frontmatter、播放器、版本端點必須同一次發布。無資料庫交易。影片來源快照與下載審計置於workspace work，不將簽名URL作站內永久來源。

## Build Sequence
### Phase 1：來源與本地影片（additive）
依賴：scout完成。擁有7個MP4與對應frontmatter，不改正文/images。驗收：7個ID符合原來源、afterImage順序正確、全檔解碼成功。
### Phase 2：影片呈現（additive）
依賴：介面已定，可與Phase1並行。擁有schema/PostMedia/文章模板及相關測試。驗收：無影片頁保持原圖功能、混合媒體有序、播放器具controls與playsinline、不自動播放，有原文入口。
### Phase 3：部署更新（additive）
依賴：介面已定，可與Phase1/2並行。擁有BaseLayout/build-version/version endpoint/watcher及相關測試。驗收：同版不導航，新版保留URL自動刷新，失敗不誤導航，影片播放中延後，同版號不迴圈。
### Phase 4：整合驗證與發布
依賴：Phase1/2/3完成。獨立審查、實際瀏覽器逐支播放/跳轉、兩版本部署切換、lint/build/test、43篇全文與74張照片回歸核對。修完所有阻擋後單一commit並push，確認線上7支影片HTTP範圍讀取及播放。

## Infra Reuse
src/lib/url.ts buildUrl；既有圖片路徑處理與Lightbox；Node內建test runner；既有Astro build與GitHub Pages workflow。npm為既有套件工具。

## Test Strategy
UT僅測watcher有分支的更新決策與預期失敗，不測內建API本身。IT驗證schema到有序媒體HTML，及版本HTML/endpoint同版；用可控版本回應覆蓋同版、新版、失敗、播放中延後、重載防迴圈。
真實檔案用完整解碼驗證；真實瀏覽器以7支本地影片實際播放/暫停/中段跳轉。更新功能用先載A、供應B的瀏覽器場景驗證導航及路徑/hash保留。GitHub Pages真實快取標頭不mock為可控，僅版本端點失敗/新版可在本機可控環境模擬。

## 開放問題
無。新版可取得後以15秒前景檢查為目標，CDN傳播與瀏覽器背景節流不承諾絕對時限。舊快取頁第一次尚無watcher的限制已向使用者說明。
