---
sidebar_position: 1
title: Integration SDK
---
[Integration SDK](https://github.com/bifromqio/bifromq-data-integration)，可以作为构建定制化数据集成解决方案的参考起点。由于服务间集中转发的消息吞吐量可能很大，超出单个MQTT连接的带宽限制。SDK提供的Integrator对象通过共享订阅（`$share/{groupName}/topicFilter`）从BifroMQ接收数据，并将数据传递给下游服务，如Kafka或MySQL。
因此，业务方可以根据业务压力调整MQTT客户端连接的数量，实现`IProducer`接口来实现向具体的下游系统转发消息的逻辑。

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

## 注意事项
* 共享组成员数的限制。BifroMQ中共享组成员数默认限制`200`个，超出数量的订阅将失败。这个限制是租户级的[配置项](../../06_plugin/4_setting_provider/intro.md)。
* 路由缓存限制。为了提升路由效率，BifroMQ会缓存消息主题(topic)的路由结果，大量消息主题会导致缓存被提前驱逐，命中率下降，通过调整相应的[系统参数](../../07_admin_guide/01_configuration/2_bifromq_sys_props.md)可以提升缓存命中率。