---
sidebar_position: 2
title: "Linux"
---

## 安装前提

* 运行环境已安装Java17或更高版本
* 获取BifroMQ最新[发布版](https://github.com/bifromqio/bifromq/releases)

## 执行命令

```
tar -zxvf bifromq-*-standalone.tar.gz --strip-components 1  -C /usr/share/bifromq/
cd /usr/share/bifromq && ./bin/standalone.sh start
```