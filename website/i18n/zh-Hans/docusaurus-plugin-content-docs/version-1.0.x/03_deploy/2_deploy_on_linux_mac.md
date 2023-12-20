---
sidebar_position: 1
---

# 在 Linux 或者 macOS 部署

## 前提条件

* 安装 JDK 17+ 环境
* 在 [bifromq_release](https://github.com/bifromqio/bifromq/releases) 获取 BifroMQ 的最新版本

## Linux或者macOS

运行以下命令即可运行 BifroMQ。

```
tar -zxvf bifromq-*-standalone.tar.gz --strip-components 1  -C /usr/share/bifromq/
cd bifromq && ./bin/standalone.sh start
```
