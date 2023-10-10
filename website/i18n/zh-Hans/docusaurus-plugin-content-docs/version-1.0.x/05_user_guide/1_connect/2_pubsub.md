---
sidebar_position: 2
---

# 发布/订阅

根据MQTT协议按照消息发送和接收的角色可以分为发送方（Publisher）和订阅方（Subscriber），其基本模式如下图所示：

![pub-sub-pattern](./images/pub-sub-pattern.png)

* 发布消息。客户端可以通过连接向服务器发布消息。消息以主题（`topic`）为基础进行发布。主题是被订阅者感兴趣的通信内容的一种描述方式, 且具有层次结构（例如`home/bedroom/temperature`）。

  客户端发布消息时需要指定主题，消息体中包含实际通信的内容。除此之外，发送方还需指定该条的QoS（Quality of Service），BifroMQ全量支持MQTT的所有QoS即QoS0/QoS1/QoS2。其具体含义如下：

  | QoS  | 描述 |
    | ---- | ---- |
  | QoS0 | 至多一次传输 |
  | QoS1 | 至少一次传输 |
  | QoS2 | 正好一次传输 |

* 订阅主题。在订阅中，订阅者的主题称为`topicFilter`。服务器端接收客户端发送的订阅请求，并记录该订阅。通常情况下，订阅可以分为非通配订阅（non-wildcard）和通配订阅（wildcard）。

    * 对于非通配订阅：直接订阅特定的主题而不使用通配符，若订阅的主题为`home/bedroom/temperature`，则只能匹配主题为`home/bedroom/temperature`的消息。

    * 对于通配订阅：订阅的主题中包含了通配符（`+`或`#`）。`+` 通配符匹配单级主题层级，`#` 通配符：匹配多级主题层级。下面是一些示例来说明如何使用通配符进行订阅： 

      使用 `+` 通配符：  

      * 订阅主题 `sensor/+/temperature`：匹配 `sensor/bedroom/temperature`、`sensor/kitchen/temperature` 等主题。
      * 订阅主题 `home/+/light/+`：匹配 `home/livingroom/light/on`、`home/bedroom/light/off` 等主题。  

      使用 `#` 通配符：  

      * 订阅主题 `home/bedroom/#`：匹配 `home/bedroom/light/on`、`home/bedroom/temperature` 等主题及其子主题。
      * 订阅主题 `home/+/#`：匹配 `home/bedroom/light/on`、`home/kitchen/temperature` 等主题及其子主题。
      * 订阅主题 `#`：匹配所有主题。  

      需要注意的是，通配符订阅可能会导致订阅的主题数量庞大，因此在使用通配符订阅时，应谨慎考虑性能和资源消耗。  

      除此之外，与发布主题一样，订阅主题时还需要制定该主题的QoS。需要注意的是，BifroMQ在进行消息转发时，根据MQTT协议将取对应发送消息主题的QoS与订阅主题QoS的较小值，
      即：`Min(PublishQoS, SubscribeQoS)`。因此即便订阅方订阅的主题为QoS2，依然有可能收到QoS0的对应消息。
