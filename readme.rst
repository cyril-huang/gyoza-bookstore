========
餃子書店
========

餃子書店來於我很久以前寫的文章，介紹 scripts 與 opensource 世界使用的開發工具
，這麼多年過去，很多也都推陳出新，因此使用 github 重新開張。

* doc-intro 文件基礎介紹
* latex-intro LaTeX 排版使用介紹
* scripts 包含常用 scripts 大集合第二版
* opentoolsv2 開發軟體中常使用到的 opensource 工具第二版
* api 撰寫 application 使用的不同 API 介紹
* lnx-device Linux device driver 與 embedded system。
* c-system C 語言與系統程式寫作
* admin Linux System Admin 說明
* cisco-wireless 是我閒暇玩 Cisco 無線網路的心得。

如果要從 tex 檔製作 pdf，那要小心使用字型可能不存在，必須去改 latex 檔的字型
目前使用基本 xelatex, xeCJK 排版，沒有多餘的 TeX 的 script 去搜尋，分辨系統。 
只在 Makefile 裡面會去找

* 台灣官方的全字庫宋體
* 教育部的標準宋體
* google/adobe 的思源字型

思源 Noto Sans TC，有的系統安裝為 Noto Sans CJK TC，如果真編譯不成，請自行用
fc-list 查看可用字型，設定 setCJKmainfont 為目前系統上有的中文字型。
