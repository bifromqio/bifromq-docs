---
sidebar_position: 3
title: "Event Collector"
---

Event Collector插件用于收集BifroMQ执行过程中发生的各种事件。插件的接口在以下Maven模块中定义：

```
<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-event-collector</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with the latest version number-->
</dependency>
```

启动时，BifroMQ会扫描plugins目录并加载所有可用的EventCollector实现。建议每个EventCollector专注于单一的特定任务，利用EventType功能来过滤掉与它们的目的不相关的事件。

## 事件类型

BifroMQ运行时生成的事件对象类型都继承自[Event](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-event-collector/src/main/java/com/baidu/bifromq/plugin/eventcollector/Event.java)
类。每个特定的事件类对应一个[EventType](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-event-collector/src/main/java/com/baidu/bifromq/plugin/eventcollector/EventType.java)枚举，可以通过对象上的type()
方法访问，以便于实现事件过滤逻辑。hlc()方法允许检索事件对象的时间戳。BifroMQ的时间戳是偏序的，反映了相关事件发生的顺序。这对于在BifroMQ的分布式部署中处理事件特别有用。

## 接口方法

当事件生成时，BifroMQ调用所有已加载EventCollector的report()方法。方法签名如下：

```java
public void report(Event<?> event);
```

此方法在BifroMQ的工作线程上调用。随着负载的增加，将生成大量事件。为了避免创建大量的事件对象和过多的内存开销，传入此方法的事件对象将在方法返回后被重用。因此，在实现事件收集插件时，需要考虑以下几点：
避免在report方法内包含复杂的业务逻辑，以确保其快速返回；否则，可能会对BifroMQ的性能产生负面影响。
传入的事件对象的所有权不会转移。如果业务逻辑是异步的，并且需要在report方法返回后访问事件的内容，可以在方法返回前使用clone()方法创建对象的浅拷贝。

## Metrics

因为`report`方法会被频繁调用，BifroMQ记录并输出以下指标，以帮助插件实现者观察插件接口方法的性能指标：

| Metric Name | Meter Type | Tag(`method`)         | Description |
|-------------------|------------|-----------------------|---------------------------|
| `call.exec.timer` | TIMER | EventCollector/report | Latency for `report` call |