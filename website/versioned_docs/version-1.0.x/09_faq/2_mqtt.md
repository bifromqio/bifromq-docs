---
sidebar_position: 2
---

# Utilizing MQTT Protocol

## Why use MQTT protocol for IoT? What are the advantages compared to HTTP protocol?

IoT devices typically need to send and receive small data packets, such as sensor readings, device status, etc. MQTT (Message Queuing Telemetry Transport) is a lightweight communication protocol based on the publish/subscribe pattern, designed specifically for low-bandwidth and unreliable network environments, making it ideal for IoT applications.

Compared to the HTTP protocol, MQTT has the following advantages:

- More lightweight: Compared to the bulky protocol header of HTTP, the MQTT protocol is very streamlined, with a smaller message body than HTTP, which can reduce network transmission burden.
- Lower power consumption: The low power consumption feature of the MQTT protocol makes it very suitable for IoT devices, such as sensors, smart homes, and other devices, which usually have very limited battery life.
- More efficient: The MQTT protocol uses a push method to deliver messages, which can greatly reduce communication overhead between clients and servers. At the same time, the QoS mechanism of the MQTT protocol can also ensure the reliable transmission of messages, making communication more stable and efficient.
- More scalable: The MQTT protocol uses the publish/subscribe pattern of topics, making the system more scalable and able to quickly adapt to new devices and application scenarios. In contrast, the HTTP protocol requires the deployment of RESTful interfaces on the server side, limiting the scalability of the system.

In summary, the MQTT protocol is suitable for IoT devices that require low power consumption, small data packets, and efficient transmission, while the HTTP protocol is suitable for application scenarios that require a large amount of data transmission and more complex request/response.

## How to deal with abnormal disconnection between the client and the server?
Considering that IoT devices often work in unstable network environments, the MQTT protocol and common open-source client implementations have corresponding designs and processing for unexpected disconnections.

Please set up automatic reconnection for the client, and if the client is also responsible for subscribing to topics, you also need to set up automatic re-subscription after reconnection.

If you do not want to lose important messages during the disconnection period, you can set the cleanSession setting in the subscription setting to False. However, please use this setting carefully and set the topicfilter reasonably, separating important messages from a large number of ordinary messages, and only using them for the most necessary message subscriptions. A large number of unreasonable use of the cleanSession False setting will bring serious performance pressure and greater message loss risks.

If there is an unexpectedly high frequency of disconnections that do not meet expectations, please check the network link from the client to the server.

## Why are messages lost and the subscribed message recipient did not receive the message sent successfully?
There are many possibilities for message loss:

- Unstable network causing packet loss: Depending on the specific network environment of the IoT device, different degrees of packet loss may occur. If you need to ensure that the message arrives, you can use the qos 1 setting to send and subscribe to messages. This setting will also consume more performance.
- Subscriber disconnection: If a topic is not subscribed, the message will be directly discarded.
- Single connection sending and receiving message exceeds the limit: By default, a single client has a limit of 200 messages per second and 512MB bandwidth. If it is a sender, messages that exceed this limit will fail to send, and if it is a subscriber that exceeds it, messages under the cleanSession True setting will be discarded.
- The message sending frequency is too high, causing downstream overflow: subscription overflow under cleanSession True, rule engine downstream overflow, inbox message cache overflow under cleanSession False, etc. You can reasonably split the topic to reduce the message frequency received by each subscriber, or use shared subscriptions.
- Insufficient resources: If the memory or CPU resources deployed by the BifroMQ service are insufficient to support the business scale, this situation may also occur, and the business scale needs to be evaluated and expanded reasonably.

## Is the message order received by the subscriber consistent with the sending order?
According to the MQTT protocol, we guarantee the message order.

In particular, under QoS 0, the messages sent by a single sender must arrive in the order they were sent. Under QoS 1, because there is a situation of resending messages, there may be occasional disorder, but after resending messages, according to the protocol, the messages after the resend messages will be sent in order again, ensuring that there is at least one subsequence in the message sequence received by the client that is completely ordered.

# Why does the connection-disconnection-reconnection-disconnection situation occur repeatedly?
Generally, it is due to mutual kicking. The ClientID must be unique, otherwise, the conflicting device that has already been connected will be disconnected. If both devices have set up automatic reconnection, then they will kick each other repeatedly, causing this problem.


