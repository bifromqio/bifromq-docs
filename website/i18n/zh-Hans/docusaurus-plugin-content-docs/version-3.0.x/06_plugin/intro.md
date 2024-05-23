---
id: intro
sidebar_position: 0
title: "插件能力概述"
---

插件机制是BifroMQ与业务系统深度集成的主要方式。目前，BifroMQ开放了4种类型的插件扩展接口，满足不同的使用场景：

* **[Auth Provider](1_auth_provider.md)**：集成认证和主题发布/订阅授权逻辑。
* **[Event Collector](2_event_collector.md)**：收集运行时事件以实现各种事件驱动的业务逻辑。
* **[Resource Throttler](3_resource_throttler.md)**：在租户级别使用动态控制资源使用。
* **[Setting Provider](4_setting_provider/intro.md)**：动态调整租户的MQTT协议相关设置。

## 插件开发

* 项目组织：一个pf4j项目可以包含多个插件实现。
* 单例插件：AuthProvider、Resource Throttler和Setting Provider类型的扩展在运行时是单例的。需要通过配置文件指定要加载的具体类型。
* 多例插件：EventCollector允许多个不同类型的实例存在，这些EventCollector实例的接口方法将同时被回调。

## 插件部署

* 插件目录：BifroMQ从其安装目录内的plugins子目录加载插件实现（JAR文件或目录）。
* 类加载器隔离：每个插件使用独立的ClassLoader来隔离其代码与BifroMQ及其他插件。
* BifroMQ为以下常用包提供类加载：
    * `com.baidu.bifromq.*`
    * `io.micrometer.core.*`
    * `com.google.protobuf.*`
    * `org.slf4j.*`

**注意**：插件内的一些依赖，例如`KafkaProducer`，可能会在实例化过程中使用Java反射。这一过程可能使用`Thread.currentThread().getContextClassLoader()`来加载目标类，这将导致抛出`ClassNotFoundException`异常。
对于这种情况，需要应显式地将上下文类加载器设置为相应的插件类加载器。例如：

```java
ClassLoader contextLoader = Thread.currentThread().getContextClassLoader();
Thread.

currentThread().

setContextClassLoader(YOUR_PLUGIN_INSTANCE.getClass().

getClassLoader());
        try{
        // 初始化KAFKA生产者的代码;
        }
        finally{
        Thread.

currentThread().

setContextClassLoader(contextLoader);
}
```

## 版本兼容性

为了确保最佳兼容性并避免潜在问题，建议将自定义插件与BifroMQ主程序的主版本(major version)一致。

示例：

* 如果BifroMQ的版本为3.x.y，则插件所使用的接口定义模块版本也需为3.x.y。

## 性能考虑

BifroMQ会在工作线程上调用插件接口方法，确保插件接口实现的轻量和非阻塞，避免对性能产生负面影响。

## Metrics和Logging

- 鼓励插件开发者使用BifroMQ日志框架进行插件日志记录，使用同一个`logback.xml`进行日志配置即可。
- BifroMQ在调用插件方法时捕获并记录指标，为调试和性能优化提供宝贵的洞察。