uboot commands
==============

Linux boot loader

新名詞在 embedded Linux

- mtd memory technology device 就是一般的 flash, nand ram.
- ubi unsorted block image 針對 mtd 特性做的短小 volume/block 與檔案系統。
- fdt flatted device tree

傳統的 device 是沒有跟系統自動交談能力，這種像 PCI bus 上的 device，電路比較
複雜，昂貴等等，用在特定使用的機器上沒有必要，像 I2c SPI 等這些傳統慢速 device
，需要一個個去 initialize ，因此板子上對所有 device 是定死的，某家公司的板子，
出什麼樣子，就照那個樣子去工作就是，因此 board device tree 是針對某個特定板子
device 在什麼位址，需要一開始設定什麼值等等寫成個 profile 類似的資料結構。

語法與慣例在 https://elinux.org/Device_Tree_Usage

info
----

version
mfgenv      manufacture env
meminfo
mtdparts
fdt addr    fdt control address, 藏有 header, fdt
nand info
md 1fe8fc9

network:
--------
setenv ipaddr 192.168.2.2
setenv serverip 192.168.2.1
setenv gatewayip 10.1.1.1
ping 192.168.2.1
setenv tftpdir
tftp ${loadaddr} xxxxx.bin
saveenv

boot command:
-------------
boot 
netboot
nandboot
tftpboot
boardinit bundle-axel-SS-8_10_130_0.img

storage:
--------

chpart nand0,1 - change active partition

mtdparts
ubi part fs
ubi info

保護 flash read/write 的命令
flinfo
protect

debug
-----
setenv MANUAL_BOOT 1
setenv ENABLE_BREAK 1
setenv bootdelay 5

printenv from AP
----------------
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
tftpdir=/private/tftpboot/

printenv
--------
BTLDR) # printenv
BOOT=part1
FACTORY_RESET=2
bootcmd=bootipq
bootdelay=3
ethact=eth0
ethaddr=00:00:00:00:00:xx
fdtcontroladdr=4a989ec0
gatewayip=10.13.50.1
ipaddr=10.13.50.24
machid=8010001
netmask=255.255.255.0
serverip=10.8.8.2
soc_version_major=2
soc_version_minor=0
stderr=serial@78B3000
stdin=serial@78B3000
stdout=serial@78B3000
Environment size: 354/65532 bytes

(BTLDR) # printshenv
BAUDRATE=9600
BOOT=part1
ENABLE_BREAK=1
FACTORY_RESET=0
INIT_CAPWAP_DEBUG=0
KDUMP=0
LED_BRIGHTNESS=8
MANUAL_BOOT=0
MEMORY_DEBUG=0

ALL commands from 3802i
-----------------------
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
