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
* 快速开发：提供了插件项目搭建工具，可以快速开始进行插件开发。参见[快速开始插件开发](../plugin_practice/#快速开始插件开发)

## 插件部署

* 插件目录：BifroMQ从其安装目录内的plugins子目录加载插件实现（JAR文件或目录）。
* 类加载器隔离：每个插件使用独立的ClassLoader来隔离其代码与BifroMQ及其他插件。
* BifroMQ为以下常用包提供类加载：
    * `com.baidu.bifromq.type.*`
    * `com.baidu.bifromq.plugin.*`
    * `io.micrometer.core.*`
    * `com.google.protobuf.*`

**注意**：某些插件的依赖可能会使用`Thread.currentThread().getContextClassLoader()`加载class，从而导致`ClassNotFoundException`，为避免这种情况的发生，可以将加载依赖class的逻辑包含在如下try-finally结构中：

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

## 版本兼容性

为了确保最佳兼容性并避免潜在问题，建议将自定义插件与BifroMQ主程序的主版本(major version)一致。

示例：

* 如果BifroMQ的版本为3.x.y，则插件所使用的接口定义模块版本也需为3.x.y。

## 性能考虑

BifroMQ会在工作线程上调用插件接口方法，确保插件接口实现的轻量和非阻塞，避免对性能产生负面影响。

## Metrics和Logging

- 鼓励插件开发者使用BifroMQ日志框架进行插件日志记录，使用同一个`logback.xml`进行日志配置即可。
- BifroMQ在调用插件方法时捕获并记录指标，为调试和性能优化提供宝贵的洞察。


## 配置Demo Plugin的参数
BifroMQ 支持通过环境变量或系统属性配置Demo Plugin的参数，包括Prometheus指标抓取路径和服务器端口。
注意：仅支持配置路径和端口参数。