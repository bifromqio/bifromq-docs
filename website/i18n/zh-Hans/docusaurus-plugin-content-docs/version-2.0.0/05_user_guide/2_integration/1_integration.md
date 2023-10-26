---
title: 数据集成
sidebar_position: 1
---

# 数据集成

## 基本概念

用户除了使用传统的设备接收来自BifroMQ的消息与事件之外，还可以采用SDK的方式进行服务间数据的接入与集成。集成方式如下图所示：

![integration](./images/integration.png)

集成方通过共享订阅的方式（`$share/{groupName}/topicFilter`）接收来自BifroMQ的数据，并将数据传递给下游例如Kafka或者MySQL。由于服务间集成数据量较大，
因此对于单个MQTT连接而言负载较大，带宽存在上限。采用共享订阅的方式正好利用了其负载均衡的特点，且随着业务的发展可以灵活地增减相应MQTT Client数量。

因此，对于接入方而言需要根据自身的业务来估算数据量的大小以及所对应的带宽资源，从而估算出所需要的MQTT Client数量。
例如来自BifroMQ的消息频率为10MB/s，单个Client的带宽为512KB/s，则至少需要20个Client。

对于SDK而言，其中已经封装了MQTT Client，用户在使用时需要指定对应的Client数量以及共享订阅的共享组，主题和是否为`cleanSession`，并实现MQTT Client接收到数据之后的业务。
[Demo SDK](https://github.com/Gujiawei-Edinburgh/Data-Integration)，根据上图所示进行了实现，给出了示例。
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
由于`IIntegrator`封装了MQTT Client，因此需要给定对应的连接信息。
为了保证消息的传输质量，`IIntegrator`默认使用`QoS = 1`的方式进行传输，即：至少一次。因此对于下游服务而言可能存在消息的重复。
MQTT相关参数可以参考[MQTT协议](..%2F..%2F21_mqtt%2F1_mqtt.md)，共享订阅的相关信息可以参考[共享订阅](..%2F1_connect%2F1_connect.md)。

对于接入者而言，可以实现`IProducer`接口，从而实现具体的业务逻辑。示例中给出了`IProducer.DUMMY`，即打印收到的消息。

## 使用注意点
* 共享组的限制。目前BifroMQ支持的最大的共享组容量默认为200，集成方可以使用[setting_provider](..%2F..%2F06_plugin%2F4_setting_provider.md)来修改相关限制。若集成方期望的客户端数量超过限制，则会导致超出部分订阅失败。
* 集成方topicFilter的选择。根据MQTT协议，订阅分为非通配订阅和通配订阅。以下根据BifroMQ的实现，对于非通配订阅和通配订阅两种场景进行论述：
    * 非通配订阅：集成方与上游的发送方的主题保持一致，在BifroMQ中对应的路由信息以一条entry被缓存起来，因此这类场景下缓存命中率较高。
    * 通配订阅：上游发送方均使用相同的主题，该场景与非通配订阅类似，具有较高的缓存命中率。若上游发送方使用不同的主题，例如`test/data/{clientId}`，
      则会导致（1）BifroMQ中缓存大量的entry，甚至超出缓存的大小限制；（2）若此时共享组也较大，则会导致对于一个主题的路由查询时延增大，
      对于大量不同的主题，则会导致大量的主题无法命中路由缓存，导致整体性能的裂化和OOM。因此对于问题（1）可以调整缓存的大小（``SysProp: DIST_MAX_CACHED_SUBS_PER_TRAFFIC``）
      提升缓存命中率；对于问题（2）可以增加缓存的过期时间（`expireAfterAccess`）来提高命中率。