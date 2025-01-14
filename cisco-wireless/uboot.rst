.. Copyright (c) 2023 by Gyoza Associate, Inc.
.. All rights reserved.

============
Cisco U-Boot 
============


.. contents:: Table of Contents
   :depth: 3

booting sequence
================

- 所有 CPU 都會有個 program counter, 一旦 power on, reset 都會從某個位址自動
  開始執行那個位址的 code，不同 CPU 有不同位址，x86 是固定很久以前就定義的。
- 所以一定會有 ROM 藏著 firmware code，這個 ROM 在 x86 上接腳在硬體上會連到
  x86 CPU 的特殊腳位，在 embedded 系統中，一般會把 CPU 跟 Onchip SoC ROM 包在
  一起，外觀看起來就像一顆，但其實裡面有 ROM 也有 firmware 接在一起了，這就是硬
  體 memory mapping，從軟體工程師來看，他一點也不用管硬體是怎麼連的，他只要知道
  這個系統的某個特殊位址上有什麼規定，I/O位址, code 等等要放在哪裡。
- BootROM 一樣藏著起始基本硬體的 code ，例如最基本的 CPU, memory 等，並且開
  始 next stage 的 boot code，所謂起始 code 只是單純簡單的設定幾個 bit，讀取
  結果看有沒有錯誤 bit 產生。
- uboot 就是接著的 boot code ， uboot 這裡分成兩層，第一層為 uboot SPL
  (secondary program loader)，這裡面會額外的初始像儲存，網路等額外晶片的程
  式，接下來可以直接 boot linux 或者第二層 uboot shell 的 autoboot，這個
  第二層比較像 grub ，grub 是沒有 init 特殊硬體的功能的，因為 embedded
  system 的硬體是廠家固定的，所以他們知道只需要設定哪些位址的 bit，就能完成
  硬體 init。
- 不管如何 SPL 或者後來帶有 shell, debug 工具的 bootloader 都能帶上 Linux
  kernel image，接下來就是一般 Linux 的起始 kernel/initrd, init (systemd,
  bsd init), login 最後就像一般的 Linux CLI shell 了。

uboot shell 有兩種選擇

- 很舊，沒有名字
- hush shell

hush shell 支援環境變數與 script，使用 run 命令執行一個 environment 變數

- env print, printenv
- env set, setenv

::

  u-boot>> printenv
  u-boot>> env set mycmd 'echo hello; echo world;'
  u-boot>> run mycmd
  hello
  world

if, while 等等都有支援

uboot network
=============

網路晶片應該是在 uboot SPL 層要 init 完成的，在 hush shell 中應該能夠設定
ip, dhcp 等

uboot storage
=============

同樣基本 storage 的 init，傳統 Linux 本來就支援標準

- SD/MMC
- usb
- sata
- nvme
- nand

Linux mtd device 與 ubi filesystem
----------------------------------

Memory Technology Device 是 Linux 下的一種 flash memory device，跟 scsi，
nvme 等一樣地位，在 /dev/ 下的特殊 device 檔案，有他特別的通訊 protocol
能處理 nor 或者 nand memory。

usb sticks, mmc, SD/CF 等其他流行的 end user 儲存設備不是 mtd ，他們是在
/dev/sdx 下走 scsi 命令通訊的設備，這些設備中有 flash memory controller 
能了解 flash tranlation layer 命令，轉換 LBA 到真實 flash memory 位址。

mtd 不是用 LBA 而是用 offsets/size 來定址 I/O 位址。

UBI (Unsorted Block Images) 是一個 volume management system，他能把 I/O
loading 分散到 flash device 比較好的 memory 區塊(wearing leveling)，並
且知道哪些 memory 區塊屬於哪個 logical volume。與之volume 相對應的 fs
為 ubifs。

ubi 有點像 volume manager，因為他可以是一塊一塊不連續區塊組成一個 volume
，所以用 block device 的可變化長度 volume manager 觀念是一樣的，可以切割
一個 mtd 成更多 partition 組合使用，因此他也有類似 volume manager 下的
PE 這種區塊單位。 傳統 disk partition 是一連續的磁性 block 組成，而 ubi
就必須記住跳來跳去 的個區塊是屬於哪個 partition。

使用 mtd 的 nand memory 時，搭配的 file system 為 ubifs, JFFS2, YAFFS，主要處理
read/write/erase 的 wearing leveling algorithm。mtd 也能 export block device，在
上面跑 ext4 但不建議這樣用。nor 記憶體可能比較少，所以大部分都是用這三種 FS。

Linux jffs command
------------------

Linux 上使用跟一般block/fs 使用很像。

::

  # cat /proc/mtd
  # eraseall /dev/mtd5
  # mount -t jffs /dev/mtdblock5 /mnt/nand

差別在必須用特別的 mtblock 這個 device 檔來 mount

Linux ubi command
-----------------

::

  # eraseall /dev/mtd5
  # ubiformat /dev/mtd5
  # ubiattach /dev/ubi_ctrl -m 5
  # ubimkvol /dev/ubi0 -N rootfs -s 128MiB
  # mount -t ubifs ubi0_0 /mnt/ubifs
  # mount -t ubifs ubi0:rootfs /mnt/ubifs

ubi0 是device name, 建立第0個 volume 名字是rootfs
也就是說在nand device 上用 mtd 建立 partition，在 mtd partition 上再建立

Device Tree
-----------

傳統的 device 是沒有跟系統自動交談能力，這種像 PCI bus 上的 device，電路比較
複雜，昂貴等等，用在特定使用的機器上沒有必要，像 I2c SPI 等這些傳統慢速 device
，需要一個個去 initialize ，因此板子上對所有 device 是定死的，某家公司的板子，
出什麼樣子，就照那個樣子去工作就是，因此 board device tree 是針對某個特定板子
device 在什麼位址，需要一開始設定什麼值等等寫成個 profile 類似的資料結構。

語法與慣例在 https://elinux.org/Device_Tree_Usage

Cisco AP uboot commands
=======================

每個公司其實都可以根據既有的 uboot source code 自己加加減減而有自己的 commands
，因此每個 device 的 commands 都是完全不一樣的，即使都是 Cisco access point
，但型號不同則 uboot 命令都是不一樣的。

Cisco WIFI 6 以後 prompt 都用(BTLDR)

info
----

::

  version
  mfgenv      manufacture env
  bdinfo
  meminfo
  mtdparts
  fdt addr    fdt control address, 藏有 header, fdt
  nand info
  md 1fe8fc9  memory display

network:
--------

::

  setenv ipaddr 192.168.2.2
  setenv serverip 192.168.2.1
  setenv gatewayip 10.1.1.1
  ping 192.168.2.1
  dhcp
  setenv tftpdir
  tftp ${loadaddr} xxxxx.bin
  tftpboot

tftp tftpboot 這命令跟 DHCP/BootP/PXEBoot 的設定檔案一樣，從 tftp server
拿一塊 Linux kernel image 過來放到 loadaddr 這環境變數中。

network device 正常講應該是要能 dhcp 的，一開始應該已經 init 好了，
如果看到這個

::

  u-boot>> dhcp

0th port: Mailbox CRC-16 (0x0) does not match calculated CRC-16 (0xF6B)
那就是沒救了，試了好幾種方法都無法救回 AP，這好像只有 RMA 了。

boot:
-----

::

  boot      這會使用 bootcmd 的命令來 boot，但新版 WIFI 6 的 BTLDR 已經沒了
  bootipq   新版 BTLDR 改用這啟動 nand boot
  bootm     從 loadaddr 位址 boot
  netboot
  nandboot  從 nand device, mtd/ubifs 的 partition boot
  tftpboot
  boardinit bundle-axel-SS-8_10_130_0.img

boardinit 必須是一個有 hush script 藏在裡面的特別 init image，這只有 Cisco
才了解這是什麼 image，這不是 kernel image。

storage:
--------

在 cisco uboot 中

- u-boot>> mtdparts 這是看 mtd partition，通常第二個 partition 是叫做 fs
- u-boot>> ubi part fs 是掛上一個 mtd partition 到 ubi 管理中
- u-boot>> ubi info
- u-boot>> ubi info layout 這會顯示所有 ubi volume，其中第一個叫 part1, 
  第二個叫 part2，第四個叫 firmware
- u-boot>> ubifsmount part1 這會 mount ubi volume part1 且是 read-only 的
- u-boot>> ubifsls

正常來說，應該出廠一定有一個是好的 image，所以每次下載新的 image 就會覆蓋掉
另一個 part ，他就在 part1 part2 來回更新，保留一個一定能 boot 的 image，
如果兩個都被玩壞了，就只能回原廠 init 一個新 image 了。有個 bug 是出廠寫
錯 firmware image 版本的，這個就只能喊 support 支援了，真是不知道為啥有這麼
嚴重的生產錯誤發生。

在環境變數中，用 printenv 看以下變數

::

  BOOT             part1 或 part2
  FACTORY_RESET    factory reset 到哪個 partition
  nand info
  mtddevname       fs
  mtddevnum        
  mtdids           setenv mtdids nand0=mynand
  mtdparts         setenv mtdparts mtdparts=mynand:1m(nvram),1m(reserved),-(fs)
  partition        nand0,2
  loadaddr         是很多傳檔進來後開始放的記憶體位址

nand info 可以看出有幾個 nand device, nand0 與 nand1 表示兩個，然後我們要給一個
人讀的 id 設在 mtdids 上，然後要知道 mtdparts 上有幾個 partition，通常在內定
loadaddr 位址上 1m表示 1mega, - 表示剩下的大小，括號裡面也是個名字 id，所以


::

  (BTLDR) # mtdparts

  device nand0 <mynand>, # parts = 3
   #: name                size            offset          mask_flags
   0: nvram               0x00100000      0x00000000      0
   1: reserved            0x00100000      0x00100000      0
   2: fs                  0x3fe00000      0x00200000      0

  active partition: nand0,0 - (nvram) 0x00100000 @ 0x00000000

  defaults:
  mtdids  : none
  mtdparts: none

在新版 WIFI 6 BTLDR 的 mtdids mtdparts partition 變數都沒有 default ，看不出來
內定值，所以不知道 fs 真正位置在哪裡，在 WIFI 5 裡面是不需要設，都有內定設好的，
直接用 mtdparts 就可以了。

檔案與傳檔
----------

image 檔，其實有非常多的可能， Cisco 的 help 裡面並沒有講得很清楚什麼檔案形式。

- kernel image 檔，這正常是 bootloader 接下來 boot 的 image，tftp
- filesystem image 檔，整個 volume 包起來的檔。
- 帶有 uboot script 的 uboot 執行檔，這用在 boardinit 這命令上。
- 系統 upgrade 的 tar 檔而已。

但 Cisco uboot 命令有的只負責傳檔放到 loadaddr 位址

- 2800/3800/4800 的 tftpboot 會從 serverip 下拿 bootfile 放到 loadaddr
- 2800/3800/4800 boardinit 也是跟 tftpboot 作用一樣
- WIFI 6, 91xx 的 boardinit 會拿生產用的特殊 init script image 檔

環境變數

::

  bootfile   這應該是 kernel image
  image_file 這是 part1 或 part2 裡面的 part.bin 這個檔

- bootfile 這個是遠端 tftp 傳檔變數， boardinit 與 bootp/tftpboot 命令會用
  到這個值，把遠端檔案傳回到 loadaddr 上面。注意的是他並沒有說這是什麼檔，他
  只是傳檔而已，正常在 dhcp server 上設的 tftp 檔，應該是 kernel image 檔。
- image_name 這個是 part1 或 part2 裡面的 part.bin，當去 software.cisco.com
  下載的 tar 檔案解開看，裡面有個 part.bin 檔，這個用 ubifsmount part1 也可以看
  得到。

- 

在 software.cisco.com 下載得到的檔案，其實只有一個 tar 檔，並沒有 image 檔，
除非發生重大問題，且是 Cisco 的直接客戶，才會有 TAC 幫你 load 其他的 image 檔。
除了有隱藏的特殊命令可以讓 developer 透過 Cisco 特別碼進到 Linux shell,
boardinit ，ubi file system 等等都不是一般人拿得到的，所以 bootfile 與
image_name 這兩個環境變數對於一般 end user 設定也幾乎沒有用，執行都會檢查
checksum ，siganature，所以光傳檔是沒用的。

::

  WIFI 6 的 boardinit 執行時會詢問

  Program PHY firmware? [y/N]: y
  Program UBIFS image? [y/N]: y
  Program bootloaders? [y/N]: n   //pay attention: the last option must be “n”

要小心的是 phy firmware, ubifs image 都要換掉，但uboot 這個 bootloader
不要換掉, phy firmware 是 init etherport phy 的，這個在一些錯誤的 firmware
版本上是壞掉的，ubifs 就是 nand flash 上將來要 boot 的 OS 了，所以這也要換
掉。

-

傳檔方式除了 tftpboot, boardinit 網路傳檔還有 X/Y modem, kermit protocol。

::

  uboot>> setenv ipaddr 10.0.0.44
  uboot>> setenv serverip 10.0.0.45
  uboot>> setenv bootfile ap3g3-k9w8-ubifs-17_9_4_27.img
  uboot>> tftpboot

使用 screen 連 ttyUSB0 與 Linux sb 命令

::

  # screen /dev/ttyUSB0
  u-boot>> loady

跳出 screen 執行一個外部 sb 命令(在 lrzsz 套件上)，以2800 的 ubifs image 檔
為例， 並且寫入 part2 這個 ubi volume

::

  Ctrl-a:exec !! sb -T /srv/tftp/ap3g3-k9w8-ubifs-17_9_4_27.img

  u-boot>> loady
  ## Switch baudrate to 9600  9600 bps and press ENTER ...
  ## Ready for binary (ymodem) download to 0x02000000 at 9600 bps...
  CSending: ap3g3-k9w8-ubifs-17_9_4_27.img
  Ymodem sectors/kbytes sent:   0/ 0kRetry 0: NAK on sector
  Retry 0: NAK on sector

或者在另外的 shell 上

::

  # screen -x -r -X exec \!\! sb -T mybin.bin

會用Ymodem protocol 從 serial port 送到 loadaddr 0x02000000。
這跟 tftpboot 傳送的是一樣的，只是如果沒有網路的話，可以用 serial port 傳送
UBI 只能寫入整個 volume

::

  u-boot>> ubi writevol $loadaddr part2 0x3757000

debug
-----

::

  setenv MANUAL_BOOT 1     會自動停在 uboot shell 上
  setenv ENABLE_BREAK 1    允許 ESC 進到 uboot shell
  setenv bootdelay 5       等待五秒

printenv from 2800
------------------

::

  U-Boot 2013.01-g5b3f225 (Jan 19 2018 - 15:21:10) SDK version: 2015_T2.0p10

  Board: Barbados-2K
  SoC:   MV88F6920 Rev A1
         running 2 CPUs
  CPU:   ARM Cortex A9 MPCore (Rev 1) LE
         CPU 0
         CPU    @ 1800 [MHz]
         L2     @ 900 [MHz]
         TClock @ 250 [MHz]
         DDR4    @ 900 [MHz]
         DDR4 32 Bit Width,FastPath Memory Access, DLB Enabled, ECC Disabled
  DRAM:  1 GiB

  RST I2C0
  NAND:  256 MiB
  SF: Detected N25Q32A with page size 64 KiB, total 4 MiB
  PCI-e 1 (IF 0 - bus 0) Root Complex Interface, Detected Link X1, GEN 2.0
  PCI-e 2 (IF 1 - bus 1) Root Complex Interface, Detected Link X1, GEN 2.0

  Map:   Code:                    0x3feda000:0x3ffae3ac
         BSS:                     0x3ffefe60
         Stack:                   0x3f9c9f20
         Heap:                    0x3f9ca000:0x3feda000
         U-Boot Environment:      0x00100000:0x00110000 (SPI)

  Board configuration:
  |  port  | Interface  | PHY address  |
  |--------|------------|--------------|
  | egiga1 |   SGMII    |     0x01     |
  | egiga2 |   SGMII    |     0x00     |
  Net:   , egiga1, egiga2 [PRIME]
  Hit ESC key to stop autoboot: 0

  u-boot>> printenv
  BOOT=part2
  CASset=max
  ENABLE_BREAK=1
  FACTORY_RESET=0
  MALLOC_len=5
  MANUAL_BOOT=0
  MEMORY_DEBUG=0
  MPmode=SMP
  autoload=yes
  baudrate=9600
  bootcmd=nandboot
  bootdelay=3
  cacheShare=no
  disaMvPnp=no
  eeeEnable=no
  enaClockGating=no
  enaCpuStream=no
  enaFPU=yes
  enaMonExt=no
  enaWrAllo=no
  eth1addr=00:50:43:00:28:48
  eth1mtu=1500
  eth2addr=00:50:43:00:88:48
  eth2mtu=1500
  ethact=egiga2
  ethaddr=00:50:43:88:28:48
  ethmtu=1500
  ethprime=egiga2
  fdt_high=0x2000000
  image_name=part.bin
  initrd_high=0xffffffff
  limit_dram_size=yes
  loadaddr=0x02000000
  loads_echo=0
  mtddevname=fs
  mtdids=nand0=armada-nand
  mtdparts=mtdparts=armada-nand:1m(oops),1m(reserved),-(fs)
  nandEcc=nfcConfig=4bitecc
  netretry=yes
  partition=nand0,2
  pcieTune=no
  pexMode=RC
  stderr=serial
  stdin=serial
  stdout=serial
  yuk_ethaddr=00:00:00:EE:51:81

  Environment size: 877/65532 bytes:

printenv from 9105
------------------

::

  BOOT=part2
  ENABLE_BREAK=1
  FACTORY_RESET=0
  LED_BRIGHTNESS=8
  MANUAL_BOOT=0
  MEMORY_DEBUG=0
  PART_BOOTCNT=2
  baudrate=115200
  bootargs=console=ttyS0,115200 activepart=part2 activeboot=0 bootver=0x5e boardid=0x2 forceboot=0 coherent_pool=4M cpuidle_sysfs_switch pci=pcie_bus_safe rootwait crashkernel=128M@0M ttyS0 mtdparts=nand:1m(nvram),5888k(bootfs),-(fs) ubi.mtd=fs
  bootcmd=nandboot
  bootdelay=10
  ckernel=0
  console=ttyS0
  consoledev=ttyS0
  ethact=bcm4908_eth-0
  ethaddr=d4:e8:80:19:50:9c
  fdt_high=0xFFFFFFFFFFFFFFFF
  fdtaddr=1800000
  fdtcontroladdr=4fea7a38
  filesize=e3d712
  gatewayip=100.1.1.1
  image_name=part.bin
  ipaddr=100.1.1.2
  loadaddr=0x10000000
  loglevel=7
  mtddevname=fs
  mtddevnum=2
  mtdids=nand0=nand
  mtdparts=mtdparts=nand:1m(nvram),5888k(bootfs),-(fs)
  netmask=255.255.255.0
  partition=nand0,2
  serverip=100.1.1.3
  stderr=serial
  stdin=serial
  stdout=serial

printenv from 9130
------------------

::

  (BTLDR) # printenv
  BOOT=part1
  FACTORY_RESET=2
  bootcmd=bootipq
  bootdelay=3
  bootfile=part.bin
  bootpart=tftp
  ethact=eth0
  ethaddr=14:16:9d:2a:22:3c
  fdt_high=0x4A400000
  fdtcontroladdr=4a986ef0
  initrd_high=0x4A300000
  ipaddr=192.168.30.132
  machid=8010001
  netmask=255.255.255.0
  qca_tftp=tftpboot 0x54000000 part.bin
  serverip=192.168.30.152
  soc_version_major=2
  soc_version_minor=0
  stderr=serial@78B3000
  stdin=serial@78B3000
  stdout=serial@78B3000

  Environment size: 461/65532 bytes

ALL commands from 3802i
-----------------------

::

  SatR - Sample At Reset sub-system
  active_units- print active units on board
  askenv - get environment variables from stdin
  base - print or set address offset
  bdinfo - print Board Info structure
  boardinit- Downlod and execute board initialization script
  boot - boot default, i.e., run 'bootcmd'
  bootd - boot default, i.e., run 'bootcmd'
  bootelf - Boot from an ELF image in memory
  bootm - boot application image from memory
  bootp - boot image via network using BOOTP/TFTP protocol
  bootvx - Boot vxWorks from an ELF image
  bootz - boot Linux zImage image from memory
  bubt - bubt - Burn an image on the Boot flash device.
  chpart - change active partition
  clear_board_env- Clears board env
  cmp - memory compare
  coninfo - print console devices and information
  cp - memory copy
  crc32 - checksum calculation
  date - get/set/reset date & time
  ddrPhyRead- ddrPhyRead - Read DDR PHY register
  ddrPhyWrite- ddrPhyWrite - Write DDR PHY register
  dhcp - boot image via network using DHCP/TFTP protocol
  dma - dma - Perform DMA using the XOR engine
  dump_board_env- Dump board env
  dump_emserial- Dump EM unique serial number
  echo - echo args to console
  editenv - edit environment variable
  efuse - eFuse manipulation subsystem for secure boot mode
  env - environment handling commands
  exit - exit script
  ext2load- load binary file from a Ext2 filesystem
  ext2ls - list files in a directory (default /)
  ext4load- load binary file from a Ext4 filesystem
  ext4ls - list files in a directory (default /)
  ext4write- create a file in the root directory
  false - do nothing, unsuccessfully
  fatinfo - print information about filesystem
  fatload - load binary file from a dos filesystem
  fatls - list files in a directory (default /)
  fdt - flattened device tree utility commands
  fipsalgval- run algorithm validation on test vector bibnar in memory, default:20 00000 (0x02000000)
  fsinfo - print information about filesystems
  fsload - load binary file from a filesystem image
  go - start application at address 'addr'
  help - print command description/usage
  i2c - I2C sub-system
  iminfo - print header information for application image
  imxtract- extract a part of a multi-image
  init_aquantia_phy-
  init_aquantia_phy -- DEFAULT AQ_FW_LOADADDR=0x4000000
  ir - ir - reading and changing MV internal register values.
  itest - return true/false on integer compare
  ledstate- Set Led State
  loadb - load binary file over serial line (kermit mode)
  loads - load S-Record file over serial line
  loadx - load binary file over serial line (xmodem mode)
  loady - load binary file over serial line (ymodem mode)
  loop - infinite loop on address range
  ls - list files in a directory (default /)
  map - map - Display address decode windows
  md - memory display
  me - me - PCIe master enable
  mm - memory modify (auto-incrementing address)
  mp - mp - map PCIe BAR
  mtdparts- define flash/nand partitions
  mtest - simple RAM read/write test
  mvEthPortCounters- Port counter
  mvEthPortMcastShow- Port multicast counter
  mvEthPortRegs- Neta register values
  mvEthPortRmonCounters- Port RMON counter
  mvEthPortUcastShow- Port unicast counter
  mvEthRegs- Neta register values
  mvNetComplexNssSelect- Neta register values
  mvNetaGmacRegs- Neta register values
  mvNetaPortRegs- Neta register values
  mvNetaPortStatus- Neta register values
  mvsource- mvsource - Burn a script image on flash device.
  mw - memory write (fill)
  nand - NAND sub-system
  nandboot- boot Linux from NAND partition
  nboot - boot from NAND device
  neta_dump- Neta register values
  netboot - boot Linux from network using TFTP/bootp
  nfs - boot image via network using NFS protocol
  nm - memory modify (constant address)
  pci - list and access PCI Configuration Space
  pciePhyRead- phyRead - Read PCI-E Phy register
  pciePhyWrite- pciePhyWrite - Write PCI-E Phy register
  phyRead - phyRead - Read Phy register
  phyWrite- phyWrite - Write Phy register
  phy_fw_down_to_ram- phy_fw_down - Downloads x3220/3310 Ethernet transceiver PHY firmware to ram. Use .hdr file.
  phy_fw_down_to_spi- phy_fw_down - Downloads x3220/3310 Ethernet transceiver PHY firmware to spi. Use .hdr as app and .bin file as slave
  phy_type- phy_type - Return PHY type at port index
  ping - send ICMP ECHO_REQUEST to network host
  printenv- print environment variables
  prog_emblacklist- Program EM blacklist
  prog_emcookie- Download and program EM cookie
  prog_emeeprom- Program EM EEPROM with raw binary data
  prog_emignore- Program EM ignore
  prog_emserial- Program EM unique serial number
  prog_emwhitelist- Program EM whitelist
  prog_flags- Program board env flags
  prog_phyfw- Download and program PHY firmware
  progpid - Program PID cookie
  pxe - commands to get and boot from pxe files
  rcvr - rcvr - Start recovery process (with TFTP server)
  reset - Perform RESET of the CPU
  resetenv- resetenv - Erase environment sector to reset all variables to default.
  run - run commands in an environment variable
  saveenv - save environment variables to persistent storage
  se - se - PCIe Slave enable
  setenv - set environment variables
  sf - SPI flash sub-system
  sg - sg - scanning the PHYs status
  showvar - print local hushshell variables
  sleep - delay execution for some time
  source - run script from memory
  sp - scan and detect all devices on PCI-e interface
  sspi - SPI utility command
  switchCountersRead- switchCntPrint - Read switch port counters.
  switchPhyRegRead- - Read switch register
  switchPhyRegWrite- - Write switch register
  switchRegRead- switchRegRead - Read switch register
  switchRegWrite- switchRegWrite - Write switch register
  sysboot - command to get and boot from syslinux files
  temp - temp - Display the device temperature.
  tempCmd0- tempCmd - This command allocated for monitor extinction
  tempCmd1- tempCmd - This command allocated for monitor extinction
  tempCmd2- tempCmd - This command allocated for monitor extinction
  tempCmd3- tempCmd - This command allocated for monitor extinction
  test - minimal test like /bin/sh
  tftpboot- boot image via network using TFTP protocol
  training- training - prints the results of the DDR3 Training.
  trainingStability- training - prints the results of the DDR3 Training.
  true - do nothing, successfully
  ts_report- ts_report - report touch screen coordinate
  ts_test - ts_test - test touch screen
  ubi - ubi commands
  ubifsload- load file from an UBIFS filesystem
  ubifsls - list files in a directory
  ubifsmount- mount UBIFS volume
  ubifsumount- unmount UBIFS volume
  verify_bl- Cisco Bootloader signature verify
  verify_lx- Cisco Image signature verify
  version - print monitor, compiler and linker version
  whoAmI - - reading CPU ID
  xsmiPhyRead- xsmiPhyRead - Read Phy register through XSMI interface
  xsmiPhyWrite- xsmiPhyWrite - Write Phy register through XSMI interface


