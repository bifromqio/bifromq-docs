---
id: "intro"
sidebar_position: 0
title: "数据集成概览"
---

BifroMQ更专注被深度集成的能力，为各类消息通讯类系统提供MQTT的基础能力，本章主要介绍BifroMQ建议的数据集成方法。

## 理解与BifroMQ的数据集成

与BifroMQ的数据集成涉及消息在BifroMQ和外部系统之间的双向流动，包括数据库、基于规则的消息转发系统、其他消息中间件或另一个MQTT Broker。这种集成包括几个关键方面：

- **协议转换**
- **服务质量匹配**
- **消息路由**
- **流量控制**
- **监控**
- **可扩展性考虑**

### 常用模式

常见的架构模式是在MQTT Broker中内置下游系统客户端。这种方法使用特定的通信机制和映射逻辑来实现协议转换，将MQTT协议实现和与异构系统的集成视为一个统一整体，提供开箱即用的集成功能。

![常用方法](./images/commonapproach.jpg)

### 非耦合模式

与常见做法相反，BifroMQ建议数据集成采用非耦合的方法：集成逻辑直接利用MQTT协议作为客户端从BifroMQ中订阅消息，这种架构模式使得集成模块可以在不同MQTT Broker之间复用，因此BifroMQ项目本身并不内置开箱即用的数据集成功能。

![bifromq方法](./images/bifromqapproach.jpg)

## 消息流集成方向

集成逻辑与BifroMQ之间有两个消息流动的方向：

### 1. 从BifroMQ到外部系统

BifroMQ推荐使用[共享订阅](../1_basic/3_shared_sub.md)功能，以平衡发送到下游系统的消息负载，利用MQTT的QoS能力进行语义消息转发。为此，BifroMQ在MQTT 3.1、3.1.1版本下同样支持共享订阅。

### 2. 从外部系统到BifroMQ

外部系统可以使用MQTT客户端或[HTTP Restful API](../../05_user_guide/3_api/intro.md)向BifroMQ发布消息。

## 实现方面的注意事项

在与BifroMQ集成数据时，请考虑以下几点：

1. **带宽限制**：BifroMQ默认每个MQTT连接的带宽限制为512kb/s，可以通过租户[设置](../../06_plugin/4_setting_provider/1_tenantsetting.md)调整。

2. **流量控制**：使用MQTT作为转发协议天然提供了流量控制。下游系统必须具有足够的资源接收转发的消息，以避免因背压导致的消息丢失。

3. **监控**：得益于MQTT协议的使用，BifroMQ提供的监控指标可以在消息转发阶段直接复用，简化了集成监控过程。

## 入门参考

此[项目](https://github.com/bifromqio/bifromq-data-integration)展示了本指南中讨论的概念，可以作为类似项目的参考。
