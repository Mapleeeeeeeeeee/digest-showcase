---
title: "ZFS 資料救援經驗：AI 協助追查歷史交易節點"
author: "Maple Kuo"
authorId: "61585105004197"
date: "2026-04-07T12:57:29.000Z"
category: "知識精華"
tags: ["Claude Code", "資料救援", "使用經驗"]
sourceUrl: "https://www.facebook.com/groups/1224997379198346/permalink/1269522614745822/"
likes: 814
comments: 33
shares: 91
images: ["/images/posts/zfs-recovery-community-story-01-27150197351230961.jpg","/images/posts/zfs-recovery-community-story-02-27150197171230979.jpg","/images/posts/zfs-recovery-community-story-03-27150197261230970.jpg","/images/posts/zfs-recovery-community-story-04-27150197387897624.jpg"]
authorUrl: "https://www.facebook.com/61585105004197"
---

Claude 又一次創造奇蹟了  
  
但不知道為什麼這種事情都是發生在 Claude 身上，還沒看過有人用 Codex 的故事🤣

---

轉分享自：[曹書睿](https://www.facebook.com/cao.shu.rui.688850/posts/pfbid03XDQ2VTsa7bqEybu9byajGg7BGaXBMG8x2TBeBZoZUc4TZTCp3MCyPCN3MNbJbvcl)

去年五月底，公司 NAS 突然炸了。  
所有專案內容，全部炸掉。  
12 顆 16TB 硬碟，大概 90TB 的動畫製作檔案、序列檔、專案原始檔，一夕之間全部打不開。  
雖然有線上備份，但 90TB 的量不可能全部丟雲端，當初只備份了最近三個月的專案。所以近三年的東西，全部不見了。  
最靠北的是，硬碟一顆都沒壞。12 顆全部健康。  
壞掉的是 ZFS 的 metadata——你可以把它想成是一本書的目錄頁被撕掉了，所有的內容都還在書裡面，但系統已經不知道哪一頁是什麼、怎麼把它們拼回來。  
我以為 NAS 不可能整組一起炸掉，結果 ZFS metadata corruption 就是這麼可怕的東西。  
那時候瘋狂求救，找了好幾間資料救援公司。不管怎樣的漫天開價我都說 OK，一台國產車的價格我都準備好了，就是決心要拿回這些檔案。  
但是⋯⋯沒有人肯接。  
每一間看完都跟我說 ZFS metadata 損壞太嚴重，救不了。放棄。  
就這樣過了快一年。  
中間該重做的東西也都硬著頭皮重做完了。但每次想到那些消失的檔案還是很幹，怪自己當初沒有做本地的第二份備份。  
直到前陣子，自己在玩 Claude，各種東西都丟給它搞，越玩越覺得這東西有點猛。  
某天睡醒突然想到：我是不是可以自己試試看救那些硬碟？  
反正那 12 顆硬碟放在那邊我也不敢拿去格式化重用，就算失敗也不會更糟。  
開始跟 Claude 討論，它幫我分析了整個 ZFS RAIDZ1 的結構、metadata 損壞的原因、可能的救援路線。然後幫我列出需要買的設備：一張 LSI 9300\-8i HBA 卡、兩條 SAS 轉 SATA 線、幾條電源分接線。全部加起來不到五千塊。  
中間拖了好幾個禮拜，今天終於所有東西到貨了。  
把 12 顆硬碟接上 PC，用 Ubuntu 開機，裝了 Claude Code 讓 AI 直接在終端機裡下指令。  
ZFS 是業界公認最難救的檔案系統之一。不像傳統 RAID 有固定的排列方式可以暴力重組，ZFS 的資料分佈是動態的，metadata 壞了就等於整張地圖消失。這也是為什麼專業救援公司都不肯接。  
但 Claude Code 做了一件事：它一個一個去嘗試 ZFS 歷史上的每一個交易節點，從最近的一路往回找，找到了一個 metadata 還完整的時間點，然後從那個時間點把整個資料池掛載回來。  
結果我真的救出來了。  
所有的資料都可以被辨認。目錄結構完整。檔名完整。三年份的專案，全部回來了。  
我不是工程師，我完全沒有 Linux 和 ZFS 的經驗。全程都是 AI 一步一步告訴我該打什麼指令、該怎麼判斷、下一步要做什麼。  
花費：不到五千塊的硬體。  
省下：一台國產車的救援費。  
救回：三年份的心血。  
這就是未來嗎？  
教訓留給自己也分享給大家：  
RAID 不是備份。一定要做離線冷備。不要像我一樣等到炸了才後悔。
