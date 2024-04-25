---
sidebar_position: 2
title: "租户级设置(Settings)"
---
租户级设置允许对BifroMQ的功能和性能特性进行详细控制。每个设置都可以按租户进行调整，从而根据每个租户的特定要求和偏好实现定制化行为。这种粒度确保了BifroMQ能够满足各种用例和操作环境的需求。

## 初始值调整

这些设置的初始值可以通过JVM启动参数进行调整。这使得在每个租户的运行时定制之前，可以对系统范围内的默认值进行调整。例如，要默认禁用MQTT版本3.1客户端连接，可以使用参数`-DMQTT3Enabled=false`启动JVM。

## 通过Setting Provider插件进行定制

租户设置的管理责任被转移到业务端实现。通过开发和集成自定义Setting Provider插件来实现对这些设置的定制和运行时调整。这种方法允许企业根据变化的操作条件、监管要求或特定的业务逻辑动态调整设置。

## 支持的设置


| Name                             | Type    | Initial Value | Description                                                      |
|----------------------------------|---------|---------------|------------------------------------------------------------------|
| `MQTT3Enabled`                   | Boolean | true          | Enables or disables MQTT version 3.1 support.                    |
| `MQTT4Enabled`                   | Boolean | true          | Enables or disables MQTT version 3.1.1 support.                  |
| `MQTT5Enabled`                   | Boolean | true          | Enables or disables MQTT version 5.0 support.                    |
| `DebugModeEnabled`               | Boolean | false         | Enables or disables debug mode.                                  |
| `ForceTransient`                 | Boolean | false         | Forces transient mode for connections.                           |
| `ByPassPermCheckError`           | Boolean | true          | Bypasses permission check errors.                                |
| `PayloadFormatValidationEnabled` | Boolean | true          | Enables or disables payload format validation.                   |
| `RetainEnabled`                  | Boolean | true          | Enables or disables message retain feature.                      |
| `WildcardSubscriptionEnabled`    | Boolean | true          | Enables or disables wildcard subscriptions.                      |
| `SubscriptionIdentifierEnabled`  | Boolean | true          | Enables or disables subscription identifiers.                    |
| `SharedSubscriptionEnabled`      | Boolean | true          | Enables or disables shared subscriptions.                        |
| `MaximumQoS`                     | Integer | 2             | Sets the maximum QoS level. Valid values: 0, 1, 2.               |
| `MaxTopicLevelLength`            | Integer | 40            | Maximum length of each topic level.                              |
| `MaxTopicLevels`                 | Integer | 16            | Maximum number of topic levels.                                  |
| `MaxTopicLength`                 | Integer | 255           | Maximum total length of a topic.                                 |
| `MaxTopicAlias`                  | Integer | 10            | Maximum number of topic aliases.                                 |
| `MaxSharedGroupMembers`          | Integer | 200           | Maximum members in a shared subscription group.                  |
| `MaxTopicFiltersPerInbox`        | Integer | 100           | Maximum topic filters per inbox.                                 |
| `MsgPubPerSec`                   | Integer | 200           | Maximum number of messages published per second per connection.  |
| `ReceivingMaximum`               | Integer | 200           | Maximum number of receiving messages per second per connection.  |
| `InBoundBandWidth`               | Long    | 512 * 1024L   | Maximum inbound bandwidth in bytes per connection.               |
| `OutBoundBandWidth`              | Long    | 512 * 1024L   | Maximum outbound bandwidth in bytes per connection.              |
| `MaxUserPayloadBytes`            | Integer | 256 * 1024    | Maximum user payload size in bytes.                              |
| `MaxResendTimes`                 | Integer | 3             | Maximum times a message can be resent when qos is 1 or 2.        |
| `ResendTimeoutSeconds`           | Integer | 10            | Timeout in seconds before a message is considered for resend.    |
| `MaxTopicFiltersPerSub`          | Integer | 10            | Maximum topic filters per subscription.                          |
| `MaxSessionExpirySeconds`        | Integer | 24 * 60 * 60  | Maximum session expiry time in seconds.                          |
| `SessionInboxSize`               | Integer | 1000          | Maximum size of session inbox.                                   |
| `QoS0DropOldest`                 | Boolean | false         | Whether to drop the oldest QoS 0 messages first.                 |
| `RetainMessageMatchLimit`        | Integer | 10            | Limit for retained message matches.                              |