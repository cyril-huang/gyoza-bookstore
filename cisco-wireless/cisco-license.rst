Cisco Wireless Controller (WLC)
===============================

There is actually a Cisco virtual WLC (vWLC) based on ME and it can also be
downloaded from softwre.cisco.com. Use qemu to run this on x86 machine

License of Cisco
----------------

- RTU: Right to Use license scheme is an honor-based model for licensing.
  Licenses are not tied to an unique device identifier (UDI), product ID,
  or serial number. It's just an EULA (end user license agreement) not an
  enforced license to activate software.
- Evaluation license: a period license for customer to evaluate software.
- Permanent licenses are valid for the life of the device on which it is
  installed.  Some examples of permanent licenses are IOS Technology Packages
  (IPB, UC, SEC, DATA),
- Feature Licenses: for additional features such as SSL VPN, booster
  performance etc.  Those advanced features require license to run.
- Smart license: new license model, before smart license, the licensing was
  perpetual and related to the WLC, now the licenses are subscription-based
  and associated to the APs. in order to connect any access points to the
  controller, Cisco DNA licenses are required. Don't go to Smart license.

License of different WLC
------------------------

- Aireos based vWLC. - Licensing is honour based. Will start in a 60
  day “trial” mode but uses RTU (Right-to-use) licensing and can be enabled
  to work permanently. Just use license command to accept the activation.
  Even other virtual router/switch such as c8000v is the same.
- Traditional standalone WLC 2500,3500,5500,8500, the same as vWLC that it
  honor based and RTU license. As long as you have hardware, you can play.
  There is default number of AP the controller can support. Diffferent WLC
  is with different number of AP, however, all are over 50. If you just setup
  a home network. You won't need to buy license.
- New standalone 9800 -The new Cisco WLC (both physical and virtual)  which
  will replace Aireos. The 9800 is stand alone WLC. It's still operatable
  without license but need DNA license purchase for connecting AP, need to
  be confirmed. :-(
- Mobility Express and EWC- Integrated controller on specific AP models such
  as AIREOS 18xx,28xx,38xx,48xx,91xx, EWC is just new replacement for newer
  91xx AX aps. No license command required.

All tradition license types (evaluation, RTU, permanent) perform and behave the
same; it’s just a matter of differentiating how the license was turned on.
Evaluation license is turned on when customer accepts EULA. After the evaluation
license period is over, the license automatically turns into RTU.

Permanent license is when factory or customer installs the PAK. 

AIREOS vWLC is honour based. as in you can activate the vWLC without any
licence keys.  its literally a page that asks you how many licences you
"have" and an add button. once you "activate" it the licence does not expire.

Recommend version

- Recommend the 16.9.x train for 9800 if supporting 3700/3800 and 16.12.x for 9120/9130 aps.
- Recommend 8.5.x for Aireos unless there is a specific feature you need in 8.10.x
- Remember if using Aireos VWLC you must change the AP to Flex mode or it won’t bring its radios 

There may be different from the ME/EWC or standalone WLC but almost the same.
SO... Just downlaod AIREOS vWLC and play. :-)

activate the evaluation

::

  (Cisco Controller) license activate evaluation ap-count eval
  (Cisco Controller) license add ap-count 100
  (Cisco Controller) show license summary
  (Cisco Controller) show auth-list

RTU move to other license

::

  # license right-to-use move "license name"
