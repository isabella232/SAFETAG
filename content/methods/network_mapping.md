---
title: Network Mapping
activities: ''
approaches: ''
authors:
  - SAFETAG
guiding_questions: >+

  * What operating systems, and services being hosted or used by an
  organization? Are any hosts running unusual, custom, or outdated operating
  systems and services?

  * Are there unexpected/unusual devices or services on the network?

  * What is the topology of the network? What are the routers and modems 

  managing it?

  * What services (e.g. dropbox, web-mail, etc.) are running on the network that
  have not been mentioned by the organizational staff?

  * What network assets does an attacker have access to once they have gained
  access to the internal network?



info_provided: []
info_required: []
operational_security: ''
outputs: |2

    * The reach of and security protections in place on any wireless networks
    * A list of hosts, servers, and other network hardware on LAN
    * The operating systems and services on each host.
    * Services used by the host as identified by decrypted wireless network traffic.
    * Possible vulnerable services and practices.[^vulnerability_analysis]
purpose: >
  Mapping an organization's network exposes the multitude of devices connected
  to it -- including mostly forgotten servers -- and provides the baseline for
  later work on device assessment and vulnerability research.


  This process also reveals outside service usage (such as google services,
  dropbox, or others) which serve -- intentionally or not -- as shadow
  infrastructure for the organization. In combination with beacon research from
  the *Monitor Open Wireless Traffic* exercise, many devices can be associated
  with users.
preparation: ''
resources: |+
  <div class="greybox">

    * *Guide:* ["10 Techniques for Blindly Mapping Internal Networks"](https://www.netspi.com/blog/entryid/135/10-techniques-for-blindly-mapping-internal-networks)

    * *Resource List:* [Wireless Access Guides & Resources](#wireless-access-guides-resources) (SAFETAG)

    * *Resource List:* [nmap Scanning Resources](#nmap-scanning) (SAFETAG)

    * *Resource List:* [System Vulnerability Scanning Resources](#system-vulnerability-scanning) (SAFETAG)

summary: >

  This component allows the auditor to identify security issues with the host's
  network and map the devices on a host's network, the services that are being
  used by those devices, and any protections in place.
the_flow_of_information: |
  ![Network Mapping Information Flow](images/info_flows/network_mapping.svg)
---

