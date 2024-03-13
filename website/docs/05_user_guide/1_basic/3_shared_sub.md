---
sidebar_position: 3
title: "Shared Subscriptions"
---

MQTT Shared Subscriptions are a feature of the MQTT protocol that enables multiple subscribers to receive messages from the same topic in a fair manner.

To initiate a shared subscription, you should subscribe to a topic using the `$share/{groupName}/{topicFilter}` format. `{groupName}` refers to the name of the group sharing the subscription, as demonstrated with `group1` in the diagram.
When subscribers choose to subscribe using the same topicFilter and groupName, they become part of the same shared group. Whenever a publisher sends a message, BifroMQ determines which subscriber in the group receives the message based on the defined sharing strategy.

### Sharing Strategies

Sharing strategies define the method used to decide which subscriber within the shared group receives the message when it is sent. The MQTT protocol does not explicitly detail these strategies, but based on the use cases for shared subscriptions, BifroMQ implements two strategies:

1. **Random Selection (`$share/{groupName}/topicFilter`)**: Utilizing the `$share` prefix for shared subscriptions, this strategy is ideal for applications where the order of message processing is not crucial.

2. **Ordered Binding (`$oshare/{groupName}/topicFilter`)**: By employing the `$oshare` prefix for shared subscriptions, this strategy ensures messages from the same client connection and topic are forwarded in the order they were published to the same subscriber. This is suitable for scenarios where the sequence of messages is important.

**Note**: The combination of a sharing strategy and group name creates a unique identifier, meaning that shared subscriptions with the same group name but different prefixes (`$share` and `$oshare`) will establish separate shared groups, each with its own sharing strategy.