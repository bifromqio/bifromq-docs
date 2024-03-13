---
sidebar_position: 1
title: Integration SDK
---

The Integration [SDK](https://github.com/bifromqio/bifromq-data-integration) serves as a reference starting point for building customized data integration solutions. Given that the volume of messages forwarded between services can exceed the bandwidth limits of a single MQTT connection, the SDK offers an Integrator object that receives data from BifroMQ via shared subscriptions (`$share/{groupName}/{topicFilter}`) and passes it on to downstream services such as Kafka or MySQL.
Businesses can adjust the number of MQTT client connections based on actual messaging workload and implement the `IProducer` interface to handle logic for forwarding messages to specific downstream systems.

```java
IIntegrator integrator = Integrator.builder()
        .clientNum(5)
        .groupName("g1")
        .topicFilter("test/data/integration")
        .cleanSession(true)
        .userName("dev")
        .password("dev")
        .port(1883)
        .host("BifroMQ host")
        .build();
integrator.onMessageArrive()
          .doOnComplete(IProducer.DUMMY::close)
          .subscribe(IProducer.DUMMY::produce);
```

## Points to Note
* Limitation on the number of members in a shared group. The default limit for the number of members in a shared group within BifroMQ is `200`, and subscriptions exceeding this number will fail. This limit can be adjusted via tenant-level [settings](../../06_plugin/4_setting_provider/intro.md).
* Routing cache limitations. To enhance routing efficiency, BifroMQ caches routing results for message topics. A large number of message topics can lead to premature cache eviction and reduced hit rates. Adjusting relevant [system parameters](../../07_admin_guide/01_configuration/2_bifromq_sys_props.md) can improve cache hit rates.