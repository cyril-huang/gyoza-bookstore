==================
Cisco 無線網路使用
==================

企業級無線網路，不是一般家用 asus/tp-link 或者中華電信那種網路設備可比的。在
穩定，可靠度，擴展度等軟硬體設計測試都是相當昂貴的，雖然現在 wifi6, wifi7,
wifi8 都已經出來，但其實二手的 wifi5 的速度還是外網吃不飽的，有很多錢，可以買
二手的 wifi6 AP，沒有錢也可以買幾百台幣的 wifi5 AP，三台就能覆蓋透天厝。

這篇原本是我用英文寫的使用說明介紹，很多都是一般網路上連英文沒有的資訊，後來
我想了想，就用中文重寫一遍，以饕中文讀者。

* virtual wireless controller 不是用 vmware 而是使用 linux VM 介紹，甚至用最
  基本的 qemu/linux bridge 就能使用，一般 google 是找不到怎麼做的。
* 包含目前Cisco 無線網路企業級 AP 型號列表。
* 包含 license 解說。
* 包含所有可能 controller 使用與設定。
* 包含可能 crash ，join 不了等問題 solution。
* 包含 certificate 過期問題解決。
* 能以一台 Linux 就搞定所有 pppoe, DNS, DHCP server, wireless controller,
  virtual management switch 家裡網路所有設定。

待續包括漫遊，遠端管理等將來再補齊。
