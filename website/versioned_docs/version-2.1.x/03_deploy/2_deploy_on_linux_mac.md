---
sidebar_position: 2
---

# Deploy on Linux or Mac

## Prerequisites

* JDK 17+ environment installed
* Obtain the latest version of BifroMQ from [bifromq_release](https://github.com/bifromqio/bifromq/releases)

## Linux or macOS

Execute the following commands to run BifroMQ.

```
tar -zxvf bifromq-*-standalone.tar.gz --strip-components 1  -C /usr/share/bifromq/
cd /usr/share/bifromq && ./bin/standalone.sh start
```