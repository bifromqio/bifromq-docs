---
sidebar_position: 3
title: "共享订阅"
---

MQTT共享订阅是MQTT 5.0版本协议中的一个特性，它允许多个订阅者公平地从同一主题接收消息，BifroMQ支持MQTT 3.1和3.1.1版本下使用共享订阅。

![shared-subscription](images/shared-subscription.png)

要开始共享订阅，需要使用`$share/{groupName}/{topicFilter}`格式的订阅主题。`{groupName}`指的是共享订阅的组名，如图中的`group1`所示。
当不同的订阅者选择使用相同的topicFilter和groupName订阅时，他们加入同一个共享组。每当发布者发送消息时，BifroMQ会将这条消息转发给组内的一个订阅者。

### 共享策略

共享策略指向共享组内的成员转发消息时如何确定哪一个成员负责接收该消息，MQTT协议在这方面没有明确规定，结合共享订阅的使用场景，BifroMQ提供两种策略实现：

1. **随机选择（`$share/{groupName}/topicFilter`）**：使用`$share`作为共享订阅的前缀，适用于消息处理逻辑无顺序性要求的应用。

2. **有序绑定（`$oshare/{groupName}/topicFilter`）**：使用`$oshare`作为共享订阅的前缀，这种模式将来自同一客户端连接和同一主题的消息按发布顺序转发给同一个订阅者，适用于消息有顺序性要求的应用。

**注意**：共享策略与共享组名的组合是唯一的，即使用`$share`和`$oshare`创建相同组名的共享订阅，实际上会创建组名相同但共享策略不同的两个共享订阅组。