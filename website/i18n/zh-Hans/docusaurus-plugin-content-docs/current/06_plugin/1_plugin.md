---
sidebar_position: 1
title: "概述"
---

# 插件概述

BifroMQ的plugin机制允许用户将自定义的业务逻辑与BifroMQ在运行时集成。目前BifroMQ定义了3种Plugin接口，用于不同的使用场景：

* Auth Provider: 认证与主题Pub/Sub鉴权逻辑的集成
* Event Collector: 收集运行时事件，实现各类事件驱动的业务逻辑
* Setting Provider: 运行时向BifroMQ提供控制设置项，实现控制面业务逻辑的集成

# Plugin 开发和部署

BifroMQ使用[pf4j](https://pf4j.org)管理插件的运行时生命周期。您可以参考pf4j的文档搭建插件工程，并通过Maven中央仓库获取对应版本的Plugin的接口定义模块作为依赖。BifroMQ启动时会加载安装目录下plugins子目录中的plugin实现(pf4j支持的格式)，每个plugin实现都使用独立的ClassLoader，以下package下的class加载将由bifromq负责:

* `com.baidu.bifromq.*`
* `io.micrometer.core.*`
* `com.google.protobuf.*`
* `org.slf4j.*`

**注意**：插件内部的一些依赖项，例如 KafkaProducer，可以在其实例化期间使用了Java反射。 这个过程可能会使用Thread.currentThread().getContextClassLoader()来加载目标类，这会导致ClassNotFoundException。 对于这种情况，用户应该显式地将上下文类加载器设置为对应的插件类加载器。例如，在AuthPlugin中：
```java
ClassLoader calledLoader = Thread.currentThread().getContextClassLoader());
Thread.currentThread().setContextClassLoader(yourAuthProviderInstance.getClass().getClassLoader());
initKafkaProducer();
Thread.currentThread().setContextClassLoader(calledLoader);
```

# 性能考量

由于BifroMQ的插件接口实现会在连接和消息分发过程中被调用，应尽量保证轻量，否则将造成阻塞，严重影响连接和消息性能。