---
approach:
- Research, Technical
authors:
- SAFETAG
materials_needed: |-
- '* Access to the network with VOIP active'
- '* Network scanning capabilities.'
org_size_under:
- 100
overview: |-
- '* Determine (via network scanning, site tours, and surveys/interviews) if the organization
  is using VOIP phones (hardware and/or "soft" phone clients)'
- '* Investigate any network hardware to determine current patch level and potential
  vulnerabiltiies'
- '* Research VOIP provider to assess its security (e.g. even on VOIP-to-VOIP calls,
  many providers do not encrypt the traffic across the network)'
remote_options:
- with-support
skills_required:
- Research, Network Scanning
summary: |-
- VoIP technologies are commonly used nowadays as it provides an alternate flexible
  way of communication. With its numerous benefits, from toll-bypass, unified voice
  and data trunking and universally accessible voice-mail and fax-mail services, VoIP
  services has indeed come into its place as one of the most used communication services
  today. However, with the rise of cyber attacks, and the reality that any device
  that connects online can be a potential risk for attacks, VoIP has been on of the
  favorite target of spam, Interruptions, Voice phishing Hacking and privacy loss.
time_required_minutes:
- 30
title: Voip assessment
walkthrough: |-
- See VOIP references.
- 'Wireshark has built in VOIP filtering and call-reconstruction tools: https://wiki.wireshark.org/VoIP_calls
  (test this against a sample capture: https://wiki.wireshark.org/SampleCaptures?action=AttachFile&do=view&target=rtp_example.raw.gz)'
---

#### VoIP Security Assessment

##### Summary
VoIP technologies are commonly used nowadays as it provides an alternate flexible way of communication. With its numerous benefits, from toll-bypass, unified voice and data trunking and universally accessible voice-mail and fax-mail services, VoIP services has indeed come into its place as one of the most used communication services today. However, with the rise of cyber attacks, and the reality that any device that connects online can be a potential risk for attacks, VoIP has been on of the favorite target of spam, Interruptions, Voice phishing Hacking and privacy loss.

##### Overview

* Determine (via network scanning, site tours, and surveys/interviews) if the organization is using VOIP phones (hardware and/or "soft" phone clients)
* Investigate any network hardware to determine current patch level and potential vulnerabiltiies
* Research VOIP provider to assess its security (e.g. even on VOIP-to-VOIP calls, many providers do not encrypt the traffic across the network)

##### Materials Needed

* Access to the network with VOIP active
* Network scanning capabilities.

##### Considerations

##### Walkthrough
See VOIP references.

Wireshark has built in VOIP filtering and call-reconstruction tools: https://wiki.wireshark.org/VoIP_calls (test this against a sample capture: https://wiki.wireshark.org/SampleCaptures?action=AttachFile&do=view&target=rtp_example.raw.gz)

##### Recommendation