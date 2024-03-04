---
sidebar_position: 1
---
# Topic Filters Design

Topic Filters in MQTT are a mechanism used for subscribing to topics, allowing clients to receive messages from topics they are interested in. When selecting and designing Topic Filters, the following are some recommendations:

- Appropriate Granularity: The granularity of the Topic Filter should match the requirements of the application. If the granularity is too coarse, the client may receive a large number of unnecessary messages, thus increasing network traffic and resource consumption. On the other hand, if the granularity is too fine, the client may not receive the messages it is interested in, affecting the normal operation of the application. It is important to choose granularity according to the actual circumstances.

- Consider Using Wildcards: Topic Filters support the use of wildcards, including single-level and multi-level wildcards. The single-level wildcard "+" is used to match any character in a single level, while the multi-level wildcard "#" is used to match characters in any number of levels. When designing Topic Filters, consider using wildcards to simplify filtering rules and expand the filtering range.

- Avoid Using the "#" Wildcard Whenever Possible: Although the multi-level wildcard "#" can match characters across any number of levels, it can also potentially lead to security issues. If the "#" wildcard is used to subscribe to highly sensitive topics, it might result in unauthorized clients receiving sensitive information. Therefore, it is best to avoid using the "#" wildcard when designing Topic Filters.

- Consider Topic Naming Conventions: To ensure the readability and usability of Topics, it’s a good practice to adopt a naming convention for Topics. Topic naming conventions can specify formats, conventions, and rules for naming topics, making topics easier to manage and use.

- Consider the Hierarchical Structure of Topics: The hierarchical structure of Topics can impact the design and usage of Topic Filters. When designing the hierarchy of Topics, consider categorizing Topics by functionality, region, device, etc. This enables more refined Topic Filters and a more flexible Topic subscription mechanism.

In summary, the selection and design of Topic Filters should take into account the requirements and scenarios of the application and adhere to suitable conventions and best practices.
