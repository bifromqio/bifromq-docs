---
sidebar_position: 3
---

# 共享订阅
MQTT共享订阅（Shared Subscription）是MQTT协议的一个特性，它允许多个订阅者（Subscribers）共享同一个主题，并以一种公平的方式接收消息。以下为共享订阅的基本模式：

![shared-subscription](./images/shared-subscription.png)

共享订阅的订阅形式需满足`$share/{groupName}/topic`，其中`{groupName}`为共享组，图例中为`group1`，当多个订阅者订阅相同的主题时，会加入同一个共享组中，当有来自发送方的消息时，首先会找到共享组，然后以一种公平的方式（BifroMQ实现时采用随机选取组中的某一个订阅者）进行消息的推送。这样做有以下好处：

* 负载均衡：MQTT共享订阅允许多个订阅者共享同一个主题，以一种公平的方式接收消息。当有消息发布到订阅主题时，MQTT代理服务器会选择一个订阅者来接收该消息，而不是将消息传递给所有订阅者。这样可以实现负载均衡，确保消息在订阅者之间平均分配，避免某个订阅者处理过多的消息负载。

* 灵活性和扩展性：使用共享订阅，可以轻松地添加或删除订阅者，而无需修改发布者或其他订阅者的逻辑。这提供了灵活性和扩展性，使系统能够适应动态变化的订阅者数量。

* 节省网络带宽：共享订阅可以减少网络带宽的使用。在普通的订阅模式下，每个订阅者都会收到相同的消息副本，导致网络带宽的浪费。而在共享订阅中，消息只会发送给一个订阅者，有效地减少了消息在网络上的传输量，从而节省了带宽资源。


