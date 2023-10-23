---
sidebar_position: 1
title: "Overview"
---

# Overview

BifroMQ's plugin mechanism allows users to integrate custom business logic with BifroMQ at runtime. Currently, BifroMQ defines 3 types of Plugin interfaces, catering to different use cases:

* Auth Provider: Integration of authentication and topic Pub/Sub authorization logic.
* Event Collector: Collection of runtime events to implement various event-driven business logic.
* Setting Provider: Provision of control settings to BifroMQ at runtime, enabling the integration of control-plane business logic.

# Plugin Development and Deployment

BifroMQ utilizes [pf4j](https://pf4j.org) for managing the runtime lifecycle of plugins. You can refer to `pf4j` documentation to set up a plugin project, and obtain the corresponding version of Plugin interface definition modules as dependencies through the Maven Central Repository. Upon startup, BifroMQ loads plugin implementations (in `pf4j` supported formats) from the 'plugins' subdirectory within the installation directory. Each plugin implementation uses an independent ClassLoader, and BifroMQ provides class loading for classes under the following packages:

* `com.baidu.bifromq.*`
* `io.micrometer.core.*`
* `com.google.protobuf.*`
* `org.slf4j.*`

**Note**: Some dependencies inside plugin, e.g. `KafkaProducer`, may use Java Reflection during its instantiation. This process may use `Thread.currentThread().getContextClassLoader()` to load target classes, which will cause `ClassNotFoundException`. 
For this kind of scenario, user should explicitly set context class loader to corresponding plugin class loader. For example, in AuthPlugin:
```java
ClassLoader calledLoader = Thread.currentThread().getContextClassLoader());
Thread.currentThread().setContextClassLoader(yourAuthProviderInstance.getClass().getClassLoader());
initKafkaProducer();
Thread.currentThread().setContextClassLoader(calledLoader);
```

# Performance Considerations

As BifroMQ’s plugin interface implementations are called during the connection and message distribution processes, it’s crucial to ensure they are lightweight in order to avoid bottlenecks. Failure to do so may significantly impede connection and message performance.