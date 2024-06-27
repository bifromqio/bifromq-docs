---
sidebar_position: 3
title: "MQTT Parameter Selection"
---

MQTT is a lightweight messaging protocol that is extensively used in various fields such as the Internet of Things (IoT), sensor networks, and mobile applications. When establishing a connection using MQTT, choosing parameters wisely can
enhance communication efficiency and reliability.

## Client ID

The Client ID serves as a unique identifier for an MQTT connection. Within IoT Core, different instances are isolated; therefore, in reality, a combination of CoreID + ClientID uniquely identifies a client connection.

If multiple clients attempt to connect to an MQTT server using the same Client ID, only the most recent connection will be maintained while the others will be forcibly disconnected.

It is crucial that the Client ID be unique and easily identifiable when using MQTT connections. A common practice is to use a fixed prefix combined with a randomly generated UUID as the Client ID. The prefix can be used to signify the
identity or group of the client, while the UUID ensures uniqueness.

## QoS Levels

Quality of Service (QoS) levels in MQTT are parameters that ensure reliable message delivery. MQTT defines three QoS levels: 0, 1, and 2.

- QoS 0 represents "At Most Once" delivery. Messages are sent without any acknowledgment of receipt.
- QoS 1 represents "At Least Once" delivery. Messages are acknowledged by the receiver. If acknowledgment is not received within a certain time frame, the message will be resent. This guarantees message delivery but may result in duplicate
  messages.
- QoS 2 represents "Exactly Once" delivery, ensuring that the message will be delivered exactly once.

Selecting a higher QoS level can improve the reliability of message delivery, but at the same time, it increases communication latency and bandwidth consumption and demands more server resources.

For scenarios where occasional loss of a few messages is tolerable, it is advisable to use QoS level 0. Otherwise, QoS level 1 can be used, keeping in mind to allocate necessary resources during deployment.

## Clean Session Flag

The clean session flag in MQTT determines whether the connection state between the client and MQTT server should be preserved.

When the clean session is set to True, the MQTT server will clear all messages previously published by the client and also erase connection state information related to that client. Conversely, setting it to False will prompt the MQTT
server to retain connection state information so that the client can receive messages published during its absence.

By default, it is recommended to opt for a connection setting where clean session is set to True. In this setting, message delivery is faster, and the server resources required are significantly reduced. It is highly advisable to set the
clean session to True for subscriptions with high frequency and a large number of messages.

If it is critical that messages under certain topics are not lost when the subscriber is offline, clean session can be set to False. However, it is important to note that this setting requires significantly higher server performance
compared to when clean session is set to True. Additionally, due to intermediate message caching, there is an increased risk of message delivery delays and message overflow.

> As a general rule, opt for clean session set to True and only use clean session set to False when absolutely necessary.
> Aim to minimize the message volume when using clean session set to False, as this will result in better performance and lower risks.