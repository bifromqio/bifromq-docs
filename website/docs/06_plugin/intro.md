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
* Quick Start：We provide a plugin project scaffolding tool, allowing you to start plugin development quickly. See [Start a BifroMQ Plugin Project Quickly](../plugin_practice/#start-a-bifromq-plugin-project-quickly)

## Plugin Deployment

* Plugin Directory: BifroMQ loads plugin implementations (JAR files or directories) from the plugins subdirectory within its installation directory.
* Classloader Isolation: Each plugin uses an independent ClassLoader to isolate its code from BifroMQ and other plugins.
* BifroMQ provides class loading for the following commonly used packages:
    * `com.baidu.bifromq.type.*`
    * `com.baidu.bifromq.plugin.*`
    * `io.micrometer.core.*`
    * `com.google.protobuf.*`

**Note**: Some 3rd party dependencies used in a plugin may use the `Thread.currentThread().getContextClassLoader()` to load classes, which can result in a `ClassNotFoundException`. To prevent this, you can include the logic for loading dependency classes within the following try-finally structure:

```java
public pluginMethod() {
    ClassLoader contextLoader = Thread.currentThread().getContextClassLoader();
    // using PluginClassLoader for context class loader 
    Thread.currentThread().setContextClassLoader(this.getClass().getClassLoader());
    try {
        // loading 3rd party dependencies
    } finally {
        Thread.currentThread().setContextClassLoader(contextLoader);
    }
}
```

## Version Compatibility

To ensure optimal compatibility and avoid potential issues, it is advised to deploy your custom plugin with the main version of the BifroMQ main program aligned.

Example:

* If BifroMQ's version is 3.x.y, then the version of the plugin interface definition modules used should also be 3.x.y.

## Performance Considerations

BifroMQ calls plugin interface methods on worker threads. Ensure plugin interface implementations are lightweight and non-blocking to avoid negatively impacting performance.

## Configuring Parameters in Demo Plugin
BifroMQ supports configuring demo plugin parameters, which are the Prometheus metrics scraping path and Prometheus
server port, via environment variables or system properties.