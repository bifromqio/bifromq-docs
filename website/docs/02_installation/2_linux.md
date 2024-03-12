---
sidebar_position: 2 
title: "Linux"
---

## Prerequisites

* JDK 17+ environment installed
* Obtain the latest version of BifroMQ from BifroMQ [Releases](https://github.com/bifromqio/bifromq/releases)

## On Linux or other Unix-based systems

Execute the following commands to run BifroMQ.

```
tar -zxvf bifromq-*-standalone.tar.gz --strip-components 1  -C /usr/share/bifromq/
cd /usr/share/bifromq && ./bin/standalone.sh start
```