---
id: intro
sidebar_position: 0
title: "Plugin Overview"
---

BifroMQ's plugin mechanism allows users to integrate custom business logic with BifroMQ at runtime. Currently, BifroMQ defines 4 types of plugin extension interfaces, catering to different use cases:

* **Auth Provider**: Integration of authentication and topic Pub/Sub authorization logic.
* **Event Collector**: Collection of runtime events to implement various event-driven business logic.
* **Resource Throttler**: Throttling resource usage at tenant-level.
* **Setting Provider**: Provision of control settings to BifroMQ at runtime, enabling the integration of control-plane business logic.

## Plugin Development
* Multiple Plugin Types: A single pf4j project can implement extension interfaces defined by multiple plugin type API modules. Alternatively, separate pf4j projects can be created for different plugin types.
* Singleton Implementations: Extensions of AuthProvider, Resource Throttler, and Setting Provider types are singletons at runtime. The specific type to be loaded needs to be specified through a configuration file.
* Event Collectors: BifroMQ allows loading multiple different EventCollector implementations. Different EventCollector implementations will be called back simultaneously. It is recommended that EventCollector implementations use EventType to filter out events of interest.

## Plugin Deployment
* Plugin Directory: BifroMQ loads plugin implementations (JAR files or directories) from the plugins subdirectory within its installation directory.
* Classloader Isolation: Each plugin uses an independent ClassLoader to isolate its code from BifroMQ and other plugins.
* BifroMQ provides class loading for following commonly used packages:
  * `com.baidu.bifromq.*` 
  * `io.micrometer.core.*`
  * `com.google.protobuf.*`
  * `org.slf4j.*`

**Note**: Some dependencies inside plugin, e.g. `KafkaProducer`, may use Java Reflection during its instantiation. This process may use `Thread.currentThread().getContextClassLoader()` to load target classes, which will cause `ClassNotFoundException`.
    For this kind of scenario, user should explicitly set context class loader to corresponding plugin class loader. For example, in AuthPlugin:
```java
ClassLoader calledLoader = Thread.currentThread().getContextClassLoader());
Thread.currentThread().setContextClassLoader(yourAuthProviderInstance.getClass().getClassLoader());
try{
    // YOUR CODE TO INIT KAFKA PRODUCER;
}
finally{
        Thread.currentThread().setContextClassLoader(calledLoader);
}
```

## Version Compatibility
To ensure optimal compatibility and avoid potential issues, it is strongly recommended to deploy your custom plugin with the same major version as the BifroMQ main program you are using. For example, if you are using BifroMQ version 3.x.y, deploy your plugin with the 3.x.y version of the plugin interface definition modules.

Example:
* If you're using BifroMQ version 3.x.y, deploy your plugin with the version 3.x.y of the plugin interface definition modules.

## Performance Considerations

As BifroMQ’s plugin interface implementations are called during the connection and message distribution processes, it’s crucial to ensure they are lightweight in order to avoid bottlenecks. Failure to do so may significantly impede connection and message performance.