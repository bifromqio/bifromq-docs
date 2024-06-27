---
sidebar_position: 2
title: "Pub/Sub"
---

According to the MQTT protocol, entities involved in sending and receiving messages can be categorized as Publishers and Subscribers. The basic model is depicted below:

![pub-sub-pattern](images/pub-sub-pattern.png)

* **Publishing Messages**: Clients can publish messages to the server through a connection. Messages are published based on `topics`, which describe the content of the communication and are hierarchical in nature (
  e.g., `home/bedroom/temperature`).

  When publishing a message, clients need to specify a topic, and the message payload contains the actual content of the communication. Additionally, the publisher must specify the Quality of Service (QoS) for the message. BifroMQ supports
  all MQTT QoS levels: QoS0, QoS1, and QoS2. Their meanings are as follows:

  | QoS  | Description       |
  |------|-------------------|
  | QoS0 | At most once delivery |
  | QoS1 | At least once delivery |
  | QoS2 | Exactly once delivery |

* **Subscribing to Topics**: In subscription, the subscribed topics are called `topicFilter`. The server receives subscription requests from clients and records these subscriptions. Generally, subscriptions can be either non-wildcard
  subscriptions or wildcard subscriptions.

    * For **non-wildcard subscriptions**: Clients subscribe to a specific topic without using wildcards. For example, if a client subscribes to `home/bedroom/temperature`, it will only match messages with the
      topic `home/bedroom/temperature`.

    * For **wildcard subscriptions**: The subscription topic includes wildcard characters (`+` or `#`). The `+` wildcard matches a single level in the topic hierarchy, while the `#` wildcard matches multiple levels. Below are examples of
      how to use wildcards for subscriptions:

      Using the `+` wildcard:

        * Subscribing to `sensor/+/temperature` matches topics like `sensor/bedroom/temperature`, `sensor/kitchen/temperature`, etc.
        * Subscribing to `home/+/light/+` matches topics like `home/livingroom/light/on`, `home/bedroom/light/off`, etc.

      Using the `#` wildcard:

        * Subscribing to `home/bedroom/#` matches topics like `home/bedroom/light/on`, `home/bedroom/temperature`, and their subtopics.
        * Subscribing to `home/+/#` matches topics like `home/bedroom/light/on`, `home/kitchen/temperature`, and their subtopics.
        * Subscribing to `#` matches all topics.

      Note that wildcard subscriptions can result in a large number of topics being subscribed to, so performance and resource consumption should be carefully considered when using wildcard subscriptions.

      Similar to publishing messages, when subscribing to topics, the client needs to specify the QoS for that topic. BifroMQ, according to the MQTT protocol, will take the minimum of the QoS of the published message and the subscribed
      topic when forwarding messages, i.e., `Min(PublishQoS, SubscribeQoS)`. This means that even if the subscriber has subscribed to a topic with QoS2, it might still receive messages with QoS0.



