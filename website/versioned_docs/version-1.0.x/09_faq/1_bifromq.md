---
sidebar_position: 1
---

# BifroMQ Usage and Integration

## What are the Java version requirements for BifroMQ?

The Java version requirements for BifroMQ can be divided into two aspects:

- **BifroMQ runtime environment**: BifroMQ itself requires JDK 17 or higher for operation.
- **BifroMQ plugin development**: For developing BifroMQ plugins, there's no enforced requirement for a specific Java language version or JDK version. However, plugin developers need to ensure their plugins function properly in higher Java environments. To prevent compatibility issues, we suggest keeping the plugin's runtime environment consistent with BifroMQ's.

## Does BifroMQ include a built-in rule engine?

Unlike other products or projects providing MQTT protocol capabilities, BifroMQ's primary aim is to serve as a high-performance, multi-tenant, distributed middleware implementing the standard MQTT protocol. "Rule engines" are not part of the MQTT protocol specification and hence are not included in BifroMQ. 
BifroMQ focuses more on standard integrations with upstream and downstream systems. From this perspective, "rule engines" are just one form of functionality to integrate with BifroMQ (and even among different rule engine projects, there are functional differences). We hope this demand can be satisfied in an open manner within the BifroMQ developer community.

## How to use BifroMQ for data integration?

The approach to using BifroMQ for data integration largely depends on your business scenarios:

- **Single-tenant systems**: For logically single-tenant systems, other systems can directly use the MQTT protocol to integrate with BifroMQ. For instance, shared subscriptions can be utilized to subscribe to messages in parallel, or MQTT Client can be used to directly publish messages to BifroMQ. This method completely decouples upstream and downstream systems and facilitates comparisons among different MQTT middlewares. Most proprietary enterprise applications fall into this category.

- **Multi-tenant systems**: For multi-tenant business scenarios, BifroMQ serves as a subsystem within the multi-tenant business system. In this case, system integration needs to employ BifroMQ's plugin mechanism. Downstream systems will have a certain degree of coupling with BifroMQ at the plugin level, making implementation somewhat complex. This is typically used in business support or cloud service scenarios.

## What data persistence is BifroMQ's built-in storage engine primarily used for?

BifroMQ's built-in storage engine is mainly used for the persistence of SessionState (see: [MQTT v3.1.1 3.1.2.4](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718028)) required by the MQTT protocol to be persistent (CleanSession=false) and Retain Topic messages. This helps prevent loss of session state during a broker restart or crash. It's noteworthy that the persistence engine is not directly related to the message's QoS in most cases. For instance, when an MQTT connection starts a persistent session, offline QoS0 subscription messages will still be persisted until the session is restored and pushing is completed.

## Why doesn't BifroMQ have a management console/UI interface?

BifroMQ emphasizes integration within various types of business systems, thus it doesn't define higher-level management modes and concepts at the middleware level. However, BifroMQ does provide the following capabilities for runtime control integration and monitoring:

- **[API](../05_user_guide/3_API/1_api.md)**: Broker-side control logic, such as forcing disconnection (to be released).
- **[Metrics](../07_operations/4_logs_observable.md)**: Runtime metrics of BifroMQ, which can be integrated with existing monitoring systems.
- **[EventCollectorPlugin](../06_plugin/3_event_collector.md)**: Various events produced during BifroMQ operation, enabling different Event Sourcing business logic, such as connection counting, online/offline events, etc.
- **[SettingProviderPlugin](../06_plugin/3_event_collector.md)**: Used to adjust runtime settings at the tenant level.

We also encourage community developers to participate in satisfying these needs and build diverse UI management interfaces.

## What's the relationship between BifroMQ and IoT Core?

IoT Core, an Internet of Things core suite, is a public cloud service by Baidu Intelligent Cloud that supports prepaid and pay-as-you-go billing. BifroMQ and IoT Core share a close relationship, as BifroMQ is the underlying technology for IoT Core. The multi-tenant, high-performance, and distributed capabilities of BifroMQ provide robust support for building large-scale IoT Core device connections and messaging systems.