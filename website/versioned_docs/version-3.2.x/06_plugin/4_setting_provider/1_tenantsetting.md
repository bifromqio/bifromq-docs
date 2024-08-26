---
sidebar_position: 2
title: "Tenant-level Settings"
---

Tenant-level settings allow for detailed control of BifroMQ's functionality and performance characteristics. Each setting can be adjusted per tenant, enabling customized behavior according to the specific requirements and preferences of
each
tenant. This granularity ensures that BifroMQ can cater to a wide variety of use cases and operational environments.

## Initial Value Adjustment

Initial values for these settings can be adjusted through JVM startup parameters. This allows for system-wide default adjustments before runtime customization per tenant. For example, to disable MQTT version 3.1 client connections by
default, you can start the JVM with the parameter `-DMQTT3Enabled=false`. This level of control provides the flexibility to optimize the broker's behavior based on the deployment context and operational requirements.

## Customization through Setting Provider Plugins

The management responsibility of tenant settings is inverted, meaning it is implemented by the business side. Customization and runtime adjustment of these settings are achieved through the development and integration of custom Setting
Provider plugins. This approach allows businesses to dynamically adjust settings in response to changing operational conditions, regulatory requirements, or specific business logic, enhancing the adaptability and scalability of BifroMQ
deployments.

## Supported Settings

| Name                             | Type    | Initial Value | Description                                                     |
|----------------------------------|---------|---------------|-----------------------------------------------------------------|
| `MQTT3Enabled`                   | Boolean | true          | Enables or disables MQTT version 3.1 support.                   |
| `MQTT4Enabled`                   | Boolean | true          | Enables or disables MQTT version 3.1.1 support.                 |
| `MQTT5Enabled`                   | Boolean | true          | Enables or disables MQTT version 5.0 support.                   |
| `DebugModeEnabled`               | Boolean | false         | Enables or disables debug mode.                                 |
| `ForceTransient`                 | Boolean | false         | Forces transient mode for connections.                          |
| `ByPassPermCheckError`           | Boolean | true          | Bypasses permission check errors.                               |
| `PayloadFormatValidationEnabled` | Boolean | true          | Enables or disables payload format validation.                  |
| `RetainEnabled`                  | Boolean | true          | Enables or disables message retain feature.                     |
| `WildcardSubscriptionEnabled`    | Boolean | true          | Enables or disables wildcard subscriptions.                     |
| `SubscriptionIdentifierEnabled`  | Boolean | true          | Enables or disables subscription identifiers.                   |
| `SharedSubscriptionEnabled`      | Boolean | true          | Enables or disables shared subscriptions.                       |
| `MaximumQoS`                     | Integer | 2             | Sets the maximum QoS level. Valid values: 0, 1, 2.              |
| `MaxTopicLevelLength`            | Integer | 40            | Maximum length of each topic level.                             |
| `MaxTopicLevels`                 | Integer | 16            | Maximum number of topic levels.                                 |
| `MaxTopicLength`                 | Integer | 255           | Maximum total length of a topic.                                |
| `MaxTopicAlias`                  | Integer | 10            | Maximum number of topic aliases.                                |
| `MaxSharedGroupMembers`          | Integer | 200           | Maximum members in a shared subscription group.                 |
| `MaxTopicFiltersPerInbox`        | Integer | 100           | Maximum topic filters per inbox.                                |
| `MsgPubPerSec`                   | Integer | 200           | Maximum number of messages published per second per connection. |
| `ReceivingMaximum`               | Integer | 200           | Maximum number of receiving messages per second per connection. |
| `InBoundBandWidth`               | Long    | 512 * 1024L   | Maximum inbound bandwidth in bytes per connection.              |
| `OutBoundBandWidth`              | Long    | 512 * 1024L   | Maximum outbound bandwidth in bytes per connection.             |
| `MaxUserPayloadBytes`            | Integer | 256 * 1024    | Maximum user payload size in bytes.                             |
| `MaxResendTimes`                 | Integer | 3             | Maximum times a message can be resent when qos is 1 or 2.       |
| `ResendTimeoutSeconds`           | Integer | 10            | Timeout in seconds before a message is considered for resend.   |
| `MaxTopicFiltersPerSub`          | Integer | 10            | Maximum topic filters per subscription.                         |
| `MaxSessionExpirySeconds`        | Integer | 24 * 60 * 60  | Maximum session expiry time in seconds.                         |
| `SessionInboxSize`               | Integer | 1000          | Maximum size of session inbox.                                  |
| `QoS0DropOldest`                 | Boolean | false         | Whether to drop the oldest QoS 0 messages first.                |
| `RetainMessageMatchLimit`        | Integer | 10            | Limit for retained message matches.                             |