---
approach:
- Technical
authors:
- SAFETAG
material_that_may_be_useful:: |-
- For educational purposes, if no WEP network is available, you can use [this](http://download.aircrack-ng.org/wiki-files/other/test.ivs)
  pre-built airodump-ng capture file and skip the airodump-ng and aireplay-ng packet
  injection steps.
- '  * *Tutorial:* [“Simple WEP Crack”](http://www.aircrack-ng.org/doku.php?id=simple_wep_crack)
  (Aircrack-ng Wiki)'
- '  * *Tutorial:* [“Simple Wep Cracking with a flowchart”](http://www.aircrack-ng.org/doku.php?id=flowchart)
  (Aircrack-ng Wiki)'
- '  * *Documentation:* [“Aircrack-ng”](http://www.aircrack-ng.org/doku.php?id=aircrack-ng)  (Aircrack-ng
  Wiki)'
- '  * *Documentation:* [“Aireplay-ng”](http://www.aircrack-ng.org/doku.php?id=aireplay-ng)
  (Aircrack-ng Wiki)'
- '  * *Documentation:* [“Airodump-ng”](http://www.aircrack-ng.org/doku.php?id=airodump-ng)
  (Aircrack-ng Wiki)'
org_size_under:
- 1000
recommendation: |-
- '**Upgrade to WPA2 oe 3 Encryption**'
- WEP provides no effective protection for a wifi network. Most wifi routers offer
  WPA encryption as an option, and if this is available it should be immediately implemented.
  Some older routers (and wifi devices) do not support WPA. It is highly recommended
  to upgrade immediately to hardware that supports WPA and to eliminate all WEP network
  access. Very few devices still functional do not support WPA2.
remote_options:
- None
skills_required:
- Wireless, Traffic Analysis, Password auditing
summary: |-
- WEP provides no effective protection for a wifi network. Most wifi routers offer
  WPA encryption as an option, and if this is available it should be immediately implemented.
  Some older routers (and wifi devices) do not support WPA. It is highly recommended
  to upgrade immediately to hardware that supports WPA and to eliminate all WEP network
  access.
time_required_minutes:
- 120
title: Wep password cracking
walkthrough: |-
- The auditor can be guaranteed to access a WEP network with sufficient time by cracking
  the WEP key.
- '  * Start the wireless interface in monitor mode on the specific AP channel'
- '  * Use aireplay-ng to do a fake authentication with the access point'
- '  * Start airodump-ng on AP channel with a bssid filter to collect the new unique
  IVs'
- '  * Start aireplay-ng in ARP request replay mode to inject packets'
- '  * Run aircrack-ng to crack key using the IVs collected'
---

#### WEP Password Cracking

##### Summary

WEP provides no effective protection for a wifi network. Most wifi routers offer WPA encryption as an option, and if this is available it should be immediately implemented. Some older routers (and wifi devices) do not support WPA. It is highly recommended to upgrade immediately to hardware that supports WPA and to eliminate all WEP network access.

##### Walkthrough


The auditor can be guaranteed to access a WEP network with sufficient time by cracking the WEP key.

  * Start the wireless interface in monitor mode on the specific AP channel
  * Use aireplay-ng to do a fake authentication with the access point
  * Start airodump-ng on AP channel with a bssid filter to collect the new unique IVs
  * Start aireplay-ng in ARP request replay mode to inject packets
  * Run aircrack-ng to crack key using the IVs collected

##### Material that may be Useful:

For educational purposes, if no WEP network is available, you can use [this](http://download.aircrack-ng.org/wiki-files/other/test.ivs) pre-built airodump-ng capture file and skip the airodump-ng and aireplay-ng packet injection steps.

  * *Tutorial:* [“Simple WEP Crack”](http://www.aircrack-ng.org/doku.php?id=simple_wep_crack) (Aircrack-ng Wiki)
  * *Tutorial:* [“Simple Wep Cracking with a flowchart”](http://www.aircrack-ng.org/doku.php?id=flowchart) (Aircrack-ng Wiki)
  * *Documentation:* [“Aircrack-ng”](http://www.aircrack-ng.org/doku.php?id=aircrack-ng)  (Aircrack-ng Wiki)
  * *Documentation:* [“Aireplay-ng”](http://www.aircrack-ng.org/doku.php?id=aireplay-ng) (Aircrack-ng Wiki)
  * *Documentation:* [“Airodump-ng”](http://www.aircrack-ng.org/doku.php?id=airodump-ng) (Aircrack-ng Wiki)

##### Recommendation

**Upgrade to WPA2 oe 3 Encryption**

WEP provides no effective protection for a wifi network. Most wifi routers offer WPA encryption as an option, and if this is available it should be immediately implemented. Some older routers (and wifi devices) do not support WPA. It is highly recommended to upgrade immediately to hardware that supports WPA and to eliminate all WEP network access. Very few devices still functional do not support WPA2.