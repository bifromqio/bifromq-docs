---
sidebar_position: 2
title: "发布/订阅"
---

根据MQTT协议，参与发送和接收消息的实体可以分为发布者（Publishers）和订阅者（Subscribers）。基本模型如下所示：

![pub-sub pattern](images/pub-sub-pattern.png)

* **发布消息**：客户端可以通过连接向服务器发布消息。消息基于`主题（topics）`发布，这些主题描述了通信内容，并且是层次化的（例如，`home/bedroom/temperature`）。

  发布消息时，客户端需要指定一个主题，消息Payload包含通信的实际内容。此外，发布者必须为消息指定服务质量（QoS）。BifroMQ支持所有MQTT QoS等级：QoS0、QoS1和QoS2。它们的含义如下：

  | QoS  | 描述                |
      |------|---------------------|
  | QoS0 | 至多一次传输         |
  | QoS1 | 至少一次传输         |
  | QoS2 | 确切一次传输         |

* **订阅主题**：在订阅中，被订阅的主题称为`主题过滤器（topic filter）`。服务器接收来自客户端的订阅请求并记录这些订阅。通常，订阅可以是非通配符订阅或通配符订阅。

    * 对于**非通配符订阅**：客户端订阅特定主题，不使用通配符。例如，如果客户端订阅`home/bedroom/temperature`，它将只匹配主题为`home/bedroom/temperature`的消息。

    * 对于**通配符订阅**：订阅主题包括通配符字符（`+`或`#`）。`+`通配符匹配主题层次结构中的单一层级，而`#`通配符匹配多个层级。以下是使用通配符进行订阅的示例：

      使用`+`通配符：

        * 订阅`sensor/+/temperature`可以匹配诸如`sensor/bedroom/temperature`、`sensor/kitchen/temperature`等主题。
        * 订阅`home/+/light/+`可以匹配诸如`home/livingroom/light/on`、`home/bedroom/light/off`等主题。

      使用`#`通配符：

        * 订阅`home/bedroom/#`可以匹配诸如`home/bedroom/light/on`、`home/bedroom/temperature`及其子主题的主题。
        * 订阅`home/+/#`可以匹配诸如`home/bedroom/light/on`、`home/kitchen/temperature`及其子主题的主题。
        * 订阅`#`可以匹配所有主题。

      请注意，通配符订阅可能会导致订阅大量主题，因此在使用通配符订阅时应仔细考虑性能和资源消耗。

      与发布消息类似，订阅主题时，客户端需要为该主题指定QoS。BifroMQ根据MQTT协议，在转发消息时会取已发布消息的QoS和订阅主题的QoS的最小值，即`Min(PublishQoS, SubscribeQoS)`。这意味着，即使订阅者以QoS2订阅了一个主题，它可能仍然会接收到QoS0的消息。