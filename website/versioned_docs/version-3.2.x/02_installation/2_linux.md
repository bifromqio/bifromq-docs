---
sidebar_position: 2 
title: "Linux"
---

## Prerequisites

* JDK 17+
* Latest version BifroMQ [Releases](https://github.com/bifromqio/bifromq/releases)

## Shell Commands

```
tar -zxvf bifromq-*-standalone.tar.gz --strip-components 1  -C /usr/share/bifromq/
cd /usr/share/bifromq && ./bin/standalone.sh start
```