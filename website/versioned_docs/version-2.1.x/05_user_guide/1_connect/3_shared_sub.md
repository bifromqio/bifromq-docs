---
sidebar_position: 3
---

# Shared Subscriptions
MQTT Shared Subscriptions is a feature of the MQTT protocol that allows multiple subscribers to share the same topic and receive messages in a fair manner. Below is the basic pattern for shared subscriptions:

![shared-subscription](./images/shared-subscription.png)

The subscription pattern for shared subscriptions must follow the format `$share/{groupName}/topicFilter`, where `{groupName}` represents the shared group. In the diagram above, it is `group1`. When multiple subscribers subscribe to the same topicFilter with same group name, they will join the same shared group. When there is a message from the publisher, BifroMQ first locates the shared group and then distributes the message to one of the subscribers within the group in a fair manner (in BifroMQ's implementation, a subscriber is randomly chosen from the group). This approach has several benefits:

* **Load Balancing**: MQTT shared subscriptions allow multiple subscribers to share the same topic and receive messages fairly. When a message is published to a subscribed topic, the MQTT broker server will choose one subscriber to receive the message instead of sending the message to all subscribers. This achieves load balancing, ensuring that messages are evenly distributed among subscribers and preventing any single subscriber from being overwhelmed with too many messages.

* **Flexibility and Scalability**: By using shared subscriptions, subscribers can be easily added or removed without changing the logic of the publisher or other subscribers. This offers flexibility and scalability, enables the system to adapt to the dynamically changing number of subscribers.

* **Saving Network Bandwidth**: Shared subscriptions can reduce the use of network bandwidth. In conventional subscription models, each subscriber receives the same message copy, leading to a waste of network bandwidth. In shared subscriptions, the message is only sent to one subscriber, effectively reducing the volume of message transmissions over the network, and thus saving bandwidth resources.