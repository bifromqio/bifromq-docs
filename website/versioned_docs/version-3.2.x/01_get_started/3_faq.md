---
sidebar_position: 3 
title: "Frequently Asked Questions"
---

## What versions of the MQTT protocol are supported by BifroMQ?
BifroMQ provides comprehensive support for the following MQTT protocol versions: v3.1, v3.1.1, and v5.0. This versatility ensures that BifroMQ can accommodate a wide range of IoT devices and applications, adhering to different protocol standards. Additionally, BifroMQ allows for dynamic control of protocol capabilities at the tenant level during runtime, offering tailored connectivity options to meet specific tenant requirements.

## What are the Java version requirements for BifroMQ?

The Java version requirements for BifroMQ can be divided into two aspects:

- **BifroMQ runtime environment**: BifroMQ itself requires JDK 17 or higher for operation.
- **BifroMQ plugin development**: For developing BifroMQ plugins, there's no enforced requirement for a specific Java language version or JDK version. However, plugin developers need to ensure their plugins function properly in higher Java environments. To prevent compatibility issues, we suggest keeping the plugin's runtime environment consistent with BifroMQ's.

## Does BifroMQ include a built-in rule engine?

Unlike other products or projects providing MQTT protocol capabilities, BifroMQ's primary aim is to serve as a high-performance, multi-tenant, distributed middleware implementing the standard MQTT protocol. "Rule engines" are not part of the MQTT protocol specification and hence are not included in BifroMQ. 
BifroMQ focuses more on standard integrations with upstream and downstream systems. From this perspective, "rule engines" are just one form of functionality to integrate with BifroMQ (and even among different rule engine projects, there are functional differences). We hope this demand can be satisfied in an open manner within the BifroMQ developer community.

## How to use BifroMQ for data integration?

The approach to using BifroMQ for data integration largely depends on your business scenarios:

- **Single-tenant systems**: For logically single-tenant systems, other systems can directly use the MQTT protocol to [integrate with BifroMQ](../05_user_guide/2_integration/intro.md). For instance, shared subscriptions can be utilized to subscribe to messages in parallel, or MQTT Client can be used to directly publish messages to BifroMQ. This method completely decouples upstream and downstream systems and facilitates comparisons among different MQTT middlewares. Most proprietary enterprise applications fall into this category.

- **Multi-tenant systems**: In a multi-tenant business scenario with a shared resource architecture, BifroMQ serves as a subsystem within such systems, sharing a single tenant management control plane with other multi-tenant subsystems. Under these circumstances, system integration requires the adoption of BifroMQ's plugin mechanism (will be available in future release). Downstream systems will be somewhat coupled with BifroMQ at the plugin level, making implementation somewhat complex. This is typically used in business scenarios for building Serverless cloud services.

## What data persistence is BifroMQ's built-in storage engine primarily used for?

BifroMQ's built-in storage engine is mainly used for the persistence of SessionState (see: [MQTT v3.1.1 3.1.2.4](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718028)) required by the MQTT protocol to be persistent and Retain Topic messages. This helps prevent loss of session state during a broker restart or crash. It's noteworthy that the persistence engine is not directly related to the message's QoS in most cases. For instance, when an MQTT connection starts a persistent session, offline QoS0 subscription messages will still be persisted until the session is restored and pushing is completed.

## Why doesn't BifroMQ have a management console/UI interface?

BifroMQ emphasizes integration within various types of business systems, thus it doesn't define higher-level management modes and concepts at the middleware level. However, BifroMQ does provide the following capabilities for runtime control integration and monitoring:

- **[API](../05_user_guide/3_api/intro.md)**: Broker-side control logic, such as forcing disconnection.
- **[Metrics](../07_admin_guide/03_observability/metrics/intro.md)**: Runtime metrics of BifroMQ, which can be integrated with existing monitoring systems.
- **[EventCollector Plugin](../06_plugin/2_event_collector.md)**: Various events produced during BifroMQ operation, enabling different Event Sourcing business logic, such as connection counting, online/offline events, etc.
- **[ResourceThrottler Plugin](../06_plugin/3_resource_throttler.md)**: Used to control tenant-level resource usage.
- **[SettingProvider Plugin](../06_plugin/4_setting_provider/intro.md)**: Used to adjust runtime settings at the tenant level.

We also encourage community developers to participate in satisfying these needs and build diverse UI management interfaces.

## What's the relationship between BifroMQ and IoT Core?

IoT Core, an Internet of Things core suite, is a public cloud service by Baidu Intelligent Cloud that supports prepaid and pay-as-you-go billing. BifroMQ and IoT Core share a close relationship, as BifroMQ is the underlying technology for IoT Core. The multi-tenant, high-performance, and distributed capabilities of BifroMQ provide robust support for building large-scale IoT Core device connections and messaging systems.