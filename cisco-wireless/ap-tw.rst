.. Copyright (c) 2023 by Gyoza Associate, Inc.
.. All rights reserved.

==================
Cisco Access Point
==================


.. contents:: Table of Contents
   :depth: 3


背景
====

一般背景知識

無線802.11 term
---------------

* band 頻寬，2.4G 與 5G 其實不是剛好用那頻率而是 2.4–2.4835G
  5.15 GHz 到 5.85 GHz

* channel 在這個寬度內切割不同的寬度來做每個 channel 的傳輸，
  在802.11n 是 20MHz 總共有 11 個，但不彼此干涉的只有1,6,11三個，後來更多像
  40M 80M 等。

* radio chain: 可以想成一串 queue，例如 3x4 表示這個 AP 有3個 Tx chain 來一個個
  傳送，有4個 Rx chain 來接收，一個 Tx 要跟對方的一個 Rx 成對，每次傳送
  單位為 spatial stream.

* antenna and stream ，一隻Tx 天線搭配對方一隻Rx 天線，一次傳遞
  一個 packet 稱為 spatial stream. 或簡單講 stream (data).

* 3x4:2 表示 Tx 3, Rx 4, stream 最大能玩兩個。正常講 stream 數目跟最多天線
  數目要一樣，多的天線在有 noisy 時，能再快速的重新啟動新連結，或者硬體壞掉
  時，能備援。所以會有這種 stream 數目小於天線數目的情況。像 1x2:2 可能用在
  client 上，表示如果要 upload 就只能玩一個 stream ，但 download 可以玩兩個。

* mimo (multi input/multi output)
  只能夠一次對一個 client 使用多隻天線同時進行收與送， 基本 su-mimo，使用兩種
  方法做到 MIMO

  1. modulation, spatial streams(spatial multiplexing)
     一對 TxRx 負責一次傳輸，單位以 packet ，可能100 bytes ，也可能1000bytes
     當兩邊都同時有多支天線時，傳送不同 packet，如果只有一隻天線，或最大 stream
     是 1，那是沒有 spatial stream 的。

  2. beamforming: 原本是指根據跟 client 溝通時的資料研判計算，調整多支天線的訊號，
     產生具有指向性的波束，向設備集中發射訊號，在訊號干擾或訊號遠距衰減時很有用。
     但多支天線集中發射也能在相同一次傳輸的 packet ，能拆解成給多支天線傳送。
     不同的相位，能形成一次傳輸不同部份的 packet 組成單一 packet。
     不過一般機器的 beamforming 很少拿來做 MU-MIMO。

在目前 WIFI AP 上，多用 spatial stream 做到 MIMO，很少有 beamforming，beamforming
都是用來做加強訊號能量用的。

* mu-mimo (multi user MIMO)
  當兩邊都有 MU-MIMO 時，才能做 MU-MIMO，之前只能對單一client 工作，現在
  當手機， laptop 等多個 client 都可以同時做 MIMO ，但這要兩邊都有支援才有用。

* OFDM 與 OFDMA, 不同的多工 multiplexing 技巧，主要 MU-MIMO 是用多支天線，
  OFDMA 是把 channel 再切割成更小單位來傳遞不同 packet 。TDM a channel

* mcs index: 一張表，讓人清楚知道規格所有可能的能力。https://mcsindex.com/

傳統 MIMO 是當有多個 clients 時，client 要有多支天線才有 MIMO，如果只有一
支天線，那沒有用，但即使多個 client 有多支天線時，每次還是只能服務一個客人。
MU-MIMO 則是當有多個 clients 都支援 MU-MIMO 時，才會同個時間內可能服務多人，
因此買有 MU-MIMO 的 AP 對於802.11n，的好處只有其他 clients 趕快做完傳輸，
也就是要真發生 MU-MIMO 的次數多了，別的傳輸在短時間做完了，有多餘的時間多處
理 802.11n 的機子，這叫 airtime efficiency。但不支援 MU-MIMO 的機子連上有
MU-MIMO 的 AP，還是只能一次處理一個客戶。因此買 AP, 手機，筆電，都要注意規格
，兩邊都要匹配才有用。

Cisco AP
========

思科 AP 是比一般家用簡單的商用 AP 還強大的 AP ，主要是硬體規格好，機件穩固
，軟體管理強大，能夠一次上幾百幾千台的管理。需要一個特別的 Controller 當作
管理主機。有三個 mode

* autonomous  類似一般家用型，自己是 AP 也帶有簡單設定。
* lightweight 只能單純做 AP ，需要 Controller 才有用。
* controller  能變身成同時有 AP 與強大 controller。

Controller/AP and AP/AP 間為 CAPWAP protocol 定義在 RFC 5246 5247

用 controller 的好處

* 中央集權管理，能看到所有 AP 使用狀況。並且能設定每個 AP 的能力。
* 能自動計算 client 位置，client 能無縫接到任一控管的 AP，使用者沒感覺換到另一台AP。
* 能定義切割多個 WLAN SSID 與 相接的 VLAN。通常有內定的 guest wlan。
* 有更多的 security 控制，例如 VPN, radius login，等一般 router/switch 能力。
* 也有無線 mesh 功能，這 mesh 能力沒什麼用。既然有 controller 了。
* 更多的其他管理。Cisco controller 甚至可以跨整個 VPN 到遠方管理 AP。

有的 models 可以變成 autonomous/lightweight ，有的能成 lightweight/controller
，但新的 WIFI 6 有的只能成為 lightweight。要小心的是 Meraki 產品線，是 cloud
based 管理的，也就是他們 controller 都在 amazon, azure 上，然後要每年繳保護費
才能用硬體。這只能用 openwrt 把他們轉成可以用，但有的型號有保護還不能轉。

用 controller 的壞處，基本就是太多設定不是一般人可以了解完成的。

* 太複雜太多的設定
* 安全性設定非常複雜

controller 也有單一機器的型號，也有虛擬機。

models
------

目前看來只有 AIREOS AP 跟 ISR switch/router 內建 AP 兩系列，其他像 business
AP 系列屬於簡單型，不需要 controller 的。有的太老屬於 802.11n 以前的。

AIREOS 型號最後以 C 結尾，表示內定 firmware 可作 controller，ISR 最後以 W
結尾表示裡面有 AP。兩者內定如果沒有 controller 其實都可以去 software.cisco.com
下載軟體轉成 controller/AP 兩用。其實就只是 Linux 裡面跑 cgroup container，
裡面有兩個系統在跑而已。如果是單純 lightweight AP 就只有一個 Linux 在跑。

硬體能力上，有的

* 能做 software dual 5G，能自動變成 2 個 5G，不光是 2.4/5G而已。
* ax 有的有 4 radios, 1x2.4G, 2x5G, 1x6G.
* 有的有 bluetooth
* 4800 裡面的天線，還有一組用來時時監測 clients ，自動加強訊號 beamforming。
* 還有很多不是一般外面 AP 有的強大硬體。

802.11 是由 ieee 定義的，另外有 WIFI alliance 就是常聽到的 Wifi5, Wifi6 ...
的定義，802.11的定義其實比 WIFI 的定義規格要好，例如 802.11ac 本來就有 8x8:8，
但 Wifi 5 wave 2 只有 4x4:4， 所以 Cisco 的機器常有超出 Wifi alliance 的定
義。不過 clients 要有相對應的能力才有意義。

AIREOS 型號

* 1700 ~ 3700 -> 802.11acw1, can be autonomous/lightweight
* 1800 ~ 4800 -> 802.11acw2, can be lightweight/controller (ME)
* 9100 ~ 9130 -> 802.11ax, can be lightweight/controller (EWC)
* 9136 ~ 916x -> 802.11ax, only lightweight, need 9800&smart license

ISR router with AP model # end with W 型號

* 110x -> 802.11acw2 can be lightwight/ME
* 111x -> 802.11acw2 can be lightwight/ME
* 112x -> 802.11acw2 can be lightwight/ME
* 113x -> 802.11ax can be lightwight/EWC

結尾英文意義

* i: integrated antenna 室內
* e: external antenna 室外
* w: wall 通常小小隻，黏在牆壁上。
* p: used in arena, stadiums 用於商場，機場。

Wifi 5 wave2 比 wifi 5 wave1 好

* MU-MIMO - 能跟多個手機，筆電同時傳輸。
* 4 個獨立 spatial (data) streams
* 新增 160MHz 頻道 (802.11ac 其實是有160MHz 定義的)

Wifi 6 ax 比 wifi 5 ac 好

* 新增 6G Hz 頻寬
* OFDMA, 不同多工技巧, TDM for a channel
* uplink/downlink MU-MIMO compared to ac which is only downlink MU-MIMO
* max 8 data streams, acw2 is only 4 streams (802.11ac actually is 8 streams)

AIREOS

+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 型號| 802.11n| 802.11ac1 | 802.11ac2  | 802.11ax | 外部電源 | 記憶體   | eth | power | 天線 |
+=====+========+===========+============+==========+==========+==========+=====+=======+======+
| 602i| n300   |           |            |          | 12v 2a   |          | 5x1g|       |      |
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 170x| n300   | acw1-866.7|            |          |          | 512M/64M | 1g  | 15.0w | 3x3:2|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 270x| n450   | acw1-1300 |            |          | 48v 350ma| 512M/64M | 1g  | 15.0w | 3x4:3|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 370x| n450   | acw1-1300 |            |          | 48v 350ma| 512M/64M | 1g  | 19.6w | 4x4:3|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 1815| n144.4 |           | acw2-866.7 |          |          | 1G/256M  | 1g  | i:8.3w|      |
|     |        |           |            |          |          |          |     | m:13.9| 2x2:2|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 183x| n300   |           | acw2-866.7 |          | 48v 350ma| 1G/256M  | 1g  | 15.4w | 3x3:2|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 184x| n744   |           | acw2-1733  |          | 48v 350ma| 1G/256M  | 1g  | 17.8w | 4x4:4|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 185x| n600   |           | acw2-1733  |          | 48v 350ma| 1G/256M  | 1g  | 20.9w | 4x4:4|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 280x| n450   | acw1-1300 | acw2-2340x2|          | 48v 350ma| 1G/256M  | 1g  | 26.5w | 4x4:3|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 380x| n450   | acw1-1300 | acw2-2600x2|          | 48v 350ma| 1G/256M  | 5g  | 30w   | 4x4:3|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 480x| n450   | acw1-1300 | acw2-2600x2|          | 48v 350ma| 1G/256M  | 5g  | 31w   | 4x4:3|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 9105| n444.4 |           | acw2-866.7 | ax-1.48G |          | 2G/1G    | 1g  | ?w    | 2x2:2|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 9115| n890   |           | acw2-3466.7| ax-5.38G |          | 2G/1G    | 2.5g| 21.4w | 4x4:4|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 9117| n600   |           | acw2-3466.7| ax-5.38G |          | 2G/1G    | 2.5g| 28.9w | 8x8:8|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 9120| n890   |           | acw2-3466.7| ax-5.38G |          | 2G/1G    | 2.5g| 25.5w | 4x4:4|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 9130| n1.5G  |           | acw2-3466.7| ax-5.38G |          | 2G/1G    | 5g  | 30.5w | 8x8:8|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 9136| n1.5G  |           | acw2-3466.7| ax-10.2G |          | 2G/1G    | 5g  | 47.3w | 8x8:8|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 9162| n444.4 |           | acw2-866.7 | ax-3.9G  | 12v 2.5a | 2G/1G    | 2.5g| 25.5w | 2x2:2|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 9164| n1.5G  |           | acw2-1733  | ax-7.49G | 54v 370ma| 2G/1G    | 2.5g| 30.0w | 4x4:4|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 9166| n1.5G  |           | acw2-3.4G  | ax-7.78G | 54v 370ma| 2G/1G    | 5g  | 30.5w | 4x4:4|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+


Meraki: 這是死要 license 錢，而且管理軟體在 Azure, Amazon cloud 的型號, 不好玩，但像 MR42 是可以
用openwrt 轉成我們要的AP

+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| 型號| 802.11n| 802.11ac1 | 802.11ac2  | 802.11ax | 外部電源 | 記憶體   | eth | power | 天線 | 
+=====+========+===========+============+==========+==========+==========+=====+=======+======+
| MR33| n400   |           | acw2-866.7 |          | 12v 2.5a | 256M/128M| 1g  | 15w   | 2x2:2|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+
| MR42| n600   |           | acw2-1300  |          | 12v 2.5a | 512M/128M| 1g  | 20w   | 3x3:3|
+-----+--------+-----------+------------+----------+----------+----------+-----+-------+------+

ISR , 小型商用 router/switch

+-----+--------+----------+-------------+----------+----------+----------+-----+-------+------+
| 型號| 802.11n| 802.11ac1| 802.11ac2   | 802.11ax | 外部電源 | 記憶體   | eth | power | 天線 | 
+=====+========+==========+=============+==========+==========+==========+=====+=======+======+
| 110x|        |          |             |          |          |          |     | 66w   |      |
| 112x|        |          | acw2-866.7  |          | 12v-5.5a | 8G/8G    | 1g  | 150w  | 2x2:2|
+-----+--------+----------+-------------+----------+----------+----------+-----+-------+------+
| 113x|        |          | acw2-866.7  | ax-1.48G | 12v-5.5a | 8G/16G   | 5g  | 66    |      |
|     |        |          |             |          |          |          |     | 150w  | 2x2:2|
+-----+--------+----------+-------------+----------+----------+----------+-----+-------+------+

* dual 5G models: 只有 2800,3800,4800,9120,9130 可以變身有 2 個 5g mode.
* 在二手貨市場中，我以為 3800 是最有 C/P  值的。20美金，可以有 5.2G 速度。
  買三隻比一堆貴森森的家用 Wifi6 AP 強大很多。
* ISR 中的 150w 是 switch 支援 POE 時的電源供應器，這比較貴要特別買的。

firmware/system software
------------------------

802.11ac 在 AP 上的 controller 叫 Mobility Express (ME), 802.11ax 的叫
Embedded Wireless Controller (EWC)，ME 是 based 在 AIREOS 上，EWC 是
based 在 IOS-XE，是 兩個不同 Linux distribution 上。EWC 的命令因為是 IOS-XE
based，比較是傳統人們認知的 IOS 命令，config t, show run, show ip int br
等等。

AIREOS 的版本號為 8.x.x, IOS-XE 的版本號為 17.x.x

裡面其實是個在 arm 上跑 uboot 的 Linux，當 AP 同時有 AP 與 controller
能力時，他其實是跑在 cgroup container 上而已，有兩個系統與兩個 IP，
所以要小心， IP 不能重複打架。

software.cisco.com 裡面的下載檔案範例

* AIR-AP1815-K9-ME-8-10-185-0.zip 將來要放到 TFTP server 給 AP join 用的。
* AIR-AP1815-K9-ME-8-10-185-0.tar 用來轉換 ME 系統的。
* ap3g2-k9w7-tar.153-3.JPQ.tar 用來升級 AP 系統的。
* C9800-AP-universalk9.17.09.04.zip 放到 TFTP server，轉換，升級，join用。

zip 檔必須解開，放在一個 TFTP server 內，然後 controller 內有個設定會指向
這裡，將來連上來的 AP 都可以自動升級。tar 檔是用來做 lightweight <->
controller 轉換用的。 AIR 開頭的 tar 檔是從 lightweight 轉成 controller，
C9800 是最新 Wifi 6 802.11ax 機型用的。

請看官網說明 zip 檔使用
https://www.cisco.com/c/en/us/td/docs/wireless/controller/technotes/8-2/b_Mobility_Express_Deployment_guide/b_Mobility_Express_Deployment_guide_chapter_01010.html

AP 轉換則在 login admin 後用

::

  轉 ME AP
  AP# ap-type mobile-express tftp://192.168.1.250/AIR-AP1815-K9-ME-8-10-185-0.tar
  轉回 lightweight AP
  ME# apciscoshell
  AP# ap-type capwap

舊版升級 AP 也用

::

  AP# ap-type mobile-express tftp://192.168.1.250/ap3g2-k9w7-tar.153-3.JPQ.tar

有些可以用另外一種命令

::

  AP# archive download-sw /overwrite /reload tftp:[[//location]/directory]/image-name

不管怎樣, apXgX 是適用不同 AP 型號，解開 zip 檔後可看到所有支援型號。

官網說明支援版本
check https://www.cisco.com/c/en/us/td/docs/wireless/compatibility/matrix/compatibility-matrix.html#ctr-ap_support

如何 login AP
-------------

如果拿到舊的，被人用過的，可以按 reset mode 按鈕 20 秒以上就會回到內定。30
秒以上會清除所有組態檔。

硬體上通常有三個 port

* console
* ethernet
* aux 用來連 modem 的，不是每個型號都有。

通常有兩種方法進入

* serial console 這要用 Cisco console cable，這要小心的是現在 console 除了 RJ
  45 外，也有 mini, micro USB，連到 PC 上面在 Linux 上，必須是 /dev/ttyACM0。
* 從內定 eth0 或 eth1 進入內定 IP，這通常是 10.0.0.1 或 192.168.1.1 要去看說明
  startup。

debian 安裝 tftp server， root of tftp server is /srv/tftp

::

  Linux# apt install tftp-hpa tftpd-hpa

用 root 連 /dev/ttyXXXX，小心 engineer sample 裡面的 baudrate 有的被改成
115200，如果亂掉了，拔掉 USB 接頭重插即可

::

  Linux# apt install screen
  Linux# screen /dev/ttyS0 ( for serial port to Linux)
  Linux# screen /dev/ttyUSB0 (for usb port to Linux)
  Linux# screen /dev/ttyUSB0 115200
  Linux# screen /dev/ttyACM0 (micro usb port to device)

內定

* default username/password: Cisco/Cisco
* default enable: Cisco or enablepass

進去後先看版本，enable 後

::

  AP# logging console disable
  AP# show version

Cisco Wireless Controller (WLC)
===============================

除了 ME 與 EWC ，還有單一機型的 WLC 與虛擬機 vWLC，反正他就是一台 Linux 。

Cisco 版權
----------

剛開始被嚇到了，以為跟微軟一樣要付錢才能玩，但不是那回事，除了 meraki 外，
買了機器就應有權力可以玩，所以 meraki 的機器居然在 seminar 上是用送的。

* RTU: Right to Use license 這只是一個 EULA (end user license agreement)，
  honor-based model license 意思是讓使用者用上癮的 license，這種不會綁定
  任何機器，序號等等，只是個聲明，不能亂搞，破壞等等。
* Evaluation license: 只是一種有期限提醒的 license。期限到了，只會一直在
  syslog 鬼叫而已。
* Feature Licenses: 先進功能需要 feature license 才能使用，例如有的有 VPN
  ，什麼 boost performance等等。
* Permanent licenses: 永久有效 license，有些先進 features 提供終身 license。
  像 IOS technology packages(包跨了 IPB, UC, SEC, DATA)，有的只是像 telecom
  需要的功能，很多根本也不知道做什麼用的。
* Smart license: 新 license model, 當公司或城市規模相當大時，基本上一定會買
  更多功能，更多人使用的 license，DNA license 管理可以自動幫你管全部公司的
  Cisco 設備 license ，這稱為 smart license，但也表示所有機器都在 Cisco 控管
  。據說新的WLC 9800 系列必須為每個 AP 買 DNA 管理版權才能用。DNA 是一套網路
  管理軟體，思科內部有多套在競爭。

不同 WLC 的 License
-------------------

* Mobility Express 與 EWC- 特殊 AP 轉成 controller 的軟體，像
  AIREOS 18xx,28xx,38xx,48xx,910x ~ 9130, 完全不需要什麼 activate license。
  轉了就能用。
* 傳統 standalone WLC 2500,3500,5500,8500, 這裡面是 RTU，但會有 5 個，或者
  50 個 AP 連結數目 license ，型號會顯示，價格也不同，但只要你有 hardware
  就至少可以玩上幾十個 AP。250x 的內定好像比較少。家裡的網路不會需要額外買
  license。
* Aireos based vWLC. - 也是 RTU，而且可以從 software.cisco.com 下載，哈哈。
  另外像 virtual router, c8000v，俗稱 c8kv 的也可以玩。這只要用命令去 activate
  evaluation license 就可以永久玩。
* 虛擬機9800CL controller ，這是 based 在 IOX-XE 的新 CLI controller ，也是
  目前可以玩免費的。
* New standalone 9800 -新的 802.11ax 的 WLC ，真機器且需要為每個 AP 額外買
  所謂 DNA 管理 license 才能 join AP 。還需要多了解了解。

所有傳統 license (evaluation, RTU, permanent) 其實都一樣，都是可以用的，只是
evaluation 在使用者按下按鍵接受EULA後，啟動，過了三個月，自動轉成
RTU，permanent 只是安裝某些特別功能需要轉成永久而已。vWLC 是 honour based的，
可以無限使用。只是要多一道命令啟動，畫面上會要你接受 EULA 而已。

美國網友推薦版本

* Recommend the 16.9.x train for 9800 if supporting 3700/3800 and 16.12.x for 9120/9130 aps.
* Recommend 8.5.x for Aireos unless there is a specific feature you need in 8.10.x
* Remember if using Aireos VWLC you must change the AP to Flex mode or it won’t bring its radios 

但我們不玩 1700 - 3700 了，我們有強大的 x8xx 跟 91xx，另外我自己測試結果並不
是這樣，而是這些美國網友程度太差，其實用上最新版本不會有 license 問題，只是
他們不會設定。

AIREOS based 的 vWLC activate evaluation 命令

::

  (Cisco Controller) license activate evaluation ap-count eval
  (Cisco Controller) license add ap-count 100
  (Cisco Controller) show license summary
  (Cisco Controller) show auth-list

Regulation domain
=================

不同國家地區的無線電頻率限制，Cisco 型號中美國用 B 台灣用 T

US-B TW-T

T still can use B as long as the model # and contoury code input matched.
4 bandwidth but 2 bandwidth with different number of channel.
Hmmm... it's just regulation but be careful the interfer so don't use it in
large scale area or industry.

B

* 5.280 ~ 5.320 GHz; 8 channels
* 5.500 ~ 5.700 GHz;11 channels

T

* 5.280 ~ 5.320 GHz; 3 channels
* 5.500 ~ 5.700 GHz; 8 channels

Reference
=========

Wifi 5 1800 ~ 4800 802.11acw2 and ME

* https://www.youtube.com/watch?v=7E5qmmb_drQ
* https://www.youtube.com/watch?v=Fvdx9mrj4cw
* https://www.youtube.com/watch?v=n6qKyyS84Zs
* https://www.cisco.com/c/en/us/support/wireless/mobility-express/series.html
* https://www.cisco.com/c/en/us/td/docs/wireless/access_point/mob_exp/86/user_guide/b_ME_User_Guide_86.html
* https://www.cisco.com/c/en/us/td/docs/wireless/controller/technotes/8-8/b_cisco_mobility_express_8_8.html
* https://www.cisco.com/c/en/us/td/docs/wireless/controller/technotes/8-2/b_Mobility_Express_Deployment_guide/b_Mobility_Express_Deployment_guide_chapter_01100.html

Wifi 6 9115 and EWC

* https://www.youtube.com/watch?v=NBt370eiQ3I
* https://www.youtube.com/watch?v=c81VQCeqGNY
* https://www.cisco.com/c/en/us/td/docs/wireless/access_point/9115ax/quick/guide/ap9115ax-getstart.html
* https://www.cisco.com/c/en/us/support/docs/wireless/embedded-wireless-controller-on-catalyst-access-points/215303-embedded-wireless-controller-conversion.html

Detailed spec

* https://www.router-switch.com/
* https://www.cisco.com/go/aironet/compliance
