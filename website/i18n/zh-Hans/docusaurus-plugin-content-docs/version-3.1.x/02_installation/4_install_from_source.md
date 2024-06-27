---
sidebar_position: 4
title: "源码安装"
---

## 安装前提

* 运行环境已安装
  * Java17或更高版本
  * Maven 3.5.0或更高版本

## 构建

克隆仓库到本地工作区

```
cd <YOUR_WORKSPACE>
git clone https://github.com/bifromqio/bifromq bifromq
```
切换目录到项目根文件夹并执行以下命令来构建整个项目

```
cd bifromq
mvn wrapper:wrapper
./mvnw -U clean package
```

构建的输出是两个 tar.gz 文件和一个 zip 文件，位于 /build/build-bifromq-starters/target/ 下

* bifromq-xxx-all.tar.gz // 适用于 linux 和 mac os 的标准集群部署 tar.gz
* bifromq-xxx-standalone.tar.gz // 适用于 linux 和 mac os 的独立部署 tar.gz
* bifromq-xxx-windows-standalone.zip // 适用于 windows 的独立部署 zip