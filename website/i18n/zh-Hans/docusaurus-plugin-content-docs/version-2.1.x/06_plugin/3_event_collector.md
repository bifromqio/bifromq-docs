---
sidebar_position: 3
title: "Event Collector"
---
# Event Collector Plugin

Event Collector Plugin 用于收集BifroMQ运行中产生的各类事件，您可以通过事件类型筛选所关注的事件，实现各类业务逻辑，典型的有：用量统计、监控告警等。Plugin的接口定义在以下Maven模块：

```
<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-event-collector</artifactId>
    <version>X.Y.Z</version> <!-- X.Y.Z 需替换成最新版本号-->
</dependency>
```

## Event类型

BifroMQ运行时产生的事件对象的类型都继承自[Event](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-event-collector/src/main/java/com/baidu/bifromq/plugin/eventcollector/Event.java)类。
每个具体事件类都对应一个[EventType](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-event-collector/src/main/java/com/baidu/bifromq/plugin/eventcollector/EventType.java)枚举，可以通过对象上的`type()`获取，方便实现事件过滤逻辑。通过`hlc()`方法可以获取Event对象的时间戳，BifroMQ的时间戳是偏序的，可以反映事件发生的先后顺序。这对于BifroMQ在分布式部署时的事件处理逻辑十分有用。

## Report方法
当事件发生时BifroMQ会回调Plugin的`report()`方法，该方法签名如下：
```java
public void report(Event<?> event);
```
该方法会在BifroMQ的工作线程上被调用，随着负载的增加会产生大量事件，为避免创建大量的事件对象，产生过高的内存开销，传入该方法的event对象在该方法返回后会被重复使用。因此实现Event Collector Plugin需要注意以下两点：
1. 避免在report方法中包含将过重的业务逻辑，保证report方法能快速返回，否则会对BifroMQ的性能产生负面影响
2. 传入的event的所有权(Ownership)并未转移，如果业务逻辑是异步的，需要在report方法返回后如仍然能访问event的内容，需要在返回前使用`clone()`方法创建一个浅拷贝副本