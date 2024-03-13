---
id: intro
sidebar_position: 0
title: "User Guide Overview"
---

BifroMQ is a sophisticated, Java-based MQTT broker that excels in providing high-performance, distributed messaging capabilities. With its native support for multi-tenancy, BifroMQ stands out as a versatile tool for integrating MQTT
functionalities into a wide range of business systems, particularly those geared towards large-scale IoT device communications and messaging infrastructures.

#### Key Features and Considerations:

1. **Integration Flexibility with Multi-Tenancy Support**: BifroMQ is designed to seamlessly integrate with various business systems that require MQTT capabilities. A fundamental aspect of BifroMQ is its native support for multi-tenancy,
   which allows different tenants (clients or customer organizations) to operate in isolated environments within the same broker instance. Understanding the concept of **tenants** and BifroMQ's approach to multi-tenancy is crucial when
   planning your integration strategy.

2. **Tenant Identification and Namespace Isolation**: In BifroMQ, tenants are uniquely identified by a ***tenantId*** and are defined as "namespaces". This design ensures that all MQTT connections and sessions are associated with a specific
   tenant namespace. MQTT connections within the same tenant namespace can publish and subscribe to messages amongst each other, while connections across different tenant namespaces remain isolated, enhancing security and data privacy.

3. **Tenant Lifecycle Management by Integrators**: Unlike some systems that manage tenant lifecycles internally, BifroMQ delegates the definition and management of tenants to the integrating business. This is achieved by implementing
   an [Auth Provider Plugin](../06_plugin/1_auth_provider.md), where the business specifies the ***tenantId*** for each connection during the authentication process. This model supports a wide range of business scenarios,
   including the use of a single, "global" tenant namespace for businesses not requiring multi-tenancy features.

4. **Resource and Load Isolation per Tenant**: Beyond logical isolation of MQTT sessions and message publication/subscription, BifroMQ uses tenant spaces as boundaries for resource and load isolation. This capability is facilitated
   by [Tenant Metrics](../07_admin_guide/03_observability/metrics/tenantmetrics.md) and the [Resource Throttler Plugin](../06_plugin/3_resource_throttler.md), ensuring efficient resource utilization and system stability.

5. **Optimized Tenant Capability with Minimal Resource Overhead**: BifroMQ is specifically designed for multi-tenancy, yet the multi-tenant capability incurs a certain level of resource overhead. However, this overhead does not need to be a concern in the vast majority of multi-tenant business scenarios. It is important to note, though, that scaling the BifroMQ cluster horizontally cannot achieve an infinite increase in the number of tenants served simultaneously within the cluster. Therefore, when designing multi-tenant business, one should avoid mapping BifroMQ tenants to overly granular entities, such as "one tenant per connection".

