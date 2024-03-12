---
sidebar_position: 3
title: "Shared Subscriptions"
---

MQTT Shared Subscriptions are a feature within the MQTT protocol that lets multiple subscribers receive messages from the same topic fairly.

![shared-subscription](images/shared-subscription.png)

To start a shared subscription, you use the `$share/{groupName}/topicFilter` format. `{groupName}` refers to the name of the group sharing the subscription, as shown in the diagram with `group1`.

When different subscribers choose to subscribe using the same topicFilter and groupName, they join a shared group. Whenever a publisher sends a message, BifroMQ figures out which shared group it's for and then gives the message to one of the subscribers in that group. This way of doing things has several benefits:

* **Fair Message Sharing**: It ensures messages are spread out evenly among subscribers of a shared topic. The broker sends the message to just one subscriber at a time, making sure no one gets too many messages all at once.

* **Easy Changes**: With shared subscriptions, adding or removing subscribers is simple and doesn’t require changing how everything else works. This makes it easy for the system to handle more or fewer subscribers as needed.

* **Less Network Use**: This setup uses less network bandwidth because, unlike other methods where each subscriber gets the same message, here only one subscriber gets the message. This cuts down on the amount of data being sent over the network.

### Special Ways to Handle Message Order

BifroMQ offers special types of shared subscriptions for different needs, especially when it comes to the order of messages:

1. **Random Subscriber Selection (`$share/{groupName}/topicFilter`)**: For applications where messages do not possess inherent order, BifroMQ defaults to a random subscriber selection mechanism for distributing messages. This mode is initiated using the `$share` prefix, catering to applications where message sequencing relative to each other is not critical.

2. **Ordered Processing (`$oshare/{groupName}/topicFilter`)**: In scenarios where messages bear a sequence, especially those published by the same client connection to a specific topic. BifroMQ introduces the `$oshare` prefix for shared subscriptions to ensure messages with inherent order are processed sequentially by the same subscriber. This approach guarantees that messages from the same client connection and topic are distributed to and handled by one subscriber in the order they were published.