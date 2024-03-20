---
sidebar_position: 3
title: "Event Collector"
---

The Event Collector plugin is designed to capture a variety of events that occur during the running of BifroMQ. The interface for this plugin is defined in the following Maven module:

```xml

<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-event-collector</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with the latest version number-->
</dependency>
```

Upon startup, BifroMQ scans the plugins directory and loads all available EventCollector implementations. It is recommended that each EventCollector focuses only on a simple specific task by utilizing the EventType feature to filter out
events that are not relevant to their intended purpose.

## Event Types

The types of event objects generated during BifroMQ's runtime all inherit from
the [Event](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-event-collector/src/main/java/com/baidu/bifromq/plugin/eventcollector/Event.java) class. Each specific event class corresponds to
an [EventType](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-event-collector/src/main/java/com/baidu/bifromq/plugin/eventcollector/EventType.java) enumeration, which can be accessed through the type() method
on the object. This facilitates the implementation of event filtering logic. The hlc() method allows for retrieving an event object's timestamp. BifroMQ's timestamps are partially ordered, reflecting the sequence in which related events
occur. This feature is particularly useful for handling events in BifroMQ's distributed deployments.

## Interface Method

When an event is generated, BifroMQ invokes the `report()` method on all loaded EventCollectors. The method signature is as follows:

```java
public void report(Event<?> event);
```

This method is called on BifroMQ's worker thread. As the load increases, a large number of events will be generated. To avoid the creation of a multitude of event objects and excessive memory overhead, the event object passed into this
method will be reused after the method returns. Therefore, when implementing the Event Collector plugin, it's important to consider the following:

* Avoid including complex business logic within the report method to ensure it returns quickly; otherwise, it may negatively impact BifroMQ's performance.
* The ownership of the passed-in event object does not transfer. If the business logic is asynchronous and there's a need to access the content of the event after the report method returns, you should create a shallow copy of the object
  using the `clone()` method before returning.

## Metrics

Because the `report` method is frequently called, BifroMQ records and outputs the following metrics to help
plugin implementers observe the performance indicators of the plugin interface methods:

| Metric Name       | Meter Type | Tag(`method`)         | Description             |
|-------------------|------------|-----------------------|-------------------------|
| `call.exec.timer` | TIMER      | EventCollector/report | Latency for `report` call |