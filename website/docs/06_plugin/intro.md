---
id: intro
sidebar_position: 0
title: "Plugin Overview"
---

The plugin mechanism is a primary way for BifroMQ to deeply integrate with business systems. Currently, BifroMQ exposes four types of plugin extension interfaces to cater to different usage scenarios:

* **[Auth Provider](1_auth_provider.md)**: Integrates authentication and topic Pub/Sub authorization logic.
* **[Event Collector](2_event_collector.md)**: Collects runtime events to implement various event-driven business logic.
* **[Resource Throttler](3_resource_throttler.md)**: Dynamically controls resource usage at the tenant level.
* **[Setting Provider](4_setting_provider/intro.md)**: Dynamically adjusts tenant-specific MQTT protocol settings.

## Plugin Development

* Project Organization: A pf4j project can contain multiple plugin implementations.
* Singleton Plugins: Extensions of AuthProvider, Resource Throttler, and Setting Provider types are singletons at runtime. The specific type to be loaded needs to be specified through a configuration file.
* Multiple Instance Plugins: EventCollector allows for multiple different types of instances to exist, with interface methods of these EventCollector instances being called back simultaneously.

## Plugin Deployment

* Plugin Directory: BifroMQ loads plugin implementations (JAR files or directories) from the plugins subdirectory within its installation directory.
* Classloader Isolation: Each plugin uses an independent ClassLoader to isolate its code from BifroMQ and other plugins.
* BifroMQ provides class loading for the following commonly used packages:
    * `com.baidu.bifromq.*`
    * `io.micrometer.core.*`
    * `com.google.protobuf.*`
    * `org.slf4j.*`

**Note**: Some dependencies inside a plugin, such as `KafkaProducer`, may use Java Reflection during instantiation. This process might use `Thread.currentThread().getContextClassLoader()` to load target classes, which could lead to
a `ClassNotFoundException`.
For such cases, it's necessary to explicitly set the context class loader to the corresponding plugin class loader. For example:

```java
ClassLoader contextLoader = Thread.currentThread().getContextClassLoader();
Thread.currentThread().setContextClassLoader(YOUR_PLUGIN_INSTANCE.getClass().getClassLoader());
try{
        // YOUR CODE TO INITIATE KAFKA PRODUCER;
}
finally{
        Thread.currentThread().setContextClassLoader(contextLoader);
}
```

## Version Compatibility

To ensure optimal compatibility and avoid potential issues, it is advised to deploy your custom plugin with the main version of the BifroMQ main program aligned.

Example:

* If BifroMQ's version is 3.x.y, then the version of the plugin interface definition modules used should also be 3.x.y.

## Performance Considerations

BifroMQ calls plugin interface methods on worker threads. Ensure plugin interface implementations are lightweight and non-blocking to avoid negatively impacting performance.