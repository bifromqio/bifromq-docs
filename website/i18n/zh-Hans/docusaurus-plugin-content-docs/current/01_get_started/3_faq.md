---
sidebar_position: 3 
title: "常见问题"
---

## BifroMQ支持哪些版本的MQTT协议？
BifroMQ全面支持以下MQTT协议版本：v3.1、v3.1.1 和 v5.0。这种多样性确保了BifroMQ能够适应广泛的IoT设备和应用程序，遵循不同的协议标准。此外，BifroMQ允许在运行时动态控制租户级别的协议能力，提供定制的连接选项以满足特定租户的需求。

## BifroMQ的Java版本要求是什么？

BifroMQ的Java版本要求可以分为两个方面：
- **BifroMQ运行环境**: BifroMQ本身需要JDK 17或更高版本才能运行。
- **BifroMQ插件开发**: 对于开发BifroMQ插件，没有强制要求特定的Java语言版本或JDK版本。然而，插件开发者需要确保他们的插件在更高的Java环境中能够正常工作。为了防止兼容性问题，我们建议将插件的运行环境与BifroMQ的保持一致。

## BifroMQ包含内置规则引擎吗？

与提供MQTT协议能力的其他产品或项目不同，BifroMQ的主要目标是作为一个高性能、多租户、分布式中间件，实现标准MQTT协议。"规则引擎"不是MQTT协议规范的一部分，因此不包含在BifroMQ中。BifroMQ更多地关注与上游和下游系统的以标准的方式集成。从这个角度看，"规则引擎"只是与BifroMQ集成的一种功能形式（甚至在不同的规则引擎项目中，还存在功能差异）。我们希望这种需求可以在BifroMQ开发者社区中以开放的方式得到满足。

## 如何使用BifroMQ进行数据集成？

使用BifroMQ进行数据集成的方法在很大程度上取决于您的业务场景：

- **单租户系统**: 对于逻辑上的单租户系统，其他系统可以直接使用MQTT协议与BifroMQ[集成](../05_user_guide/2_integration/intro.md)。例如，可以利用共享订阅并行订阅消息，或MQTT客户端可以直接向BifroMQ发布消息。这种方法完全解耦了上游和下游系统，便于比较不同的MQTT中间件。大多数专有企业应用属于此类。

- **多租户系统**: 对于共享资源架构的多租户业务场景，BifroMQ作为该类系统内的一个子系统，与其他多租户子系统共享同一个租户管理控制面。在这种情况下，系统集成需要采用BifroMQ的插件机制(目前还未开放)。下游系统将在插件级别与BifroMQ有一定程度的耦合，使得实现变得有些复杂。这通常用于构建Serverless云服务的业务场景。

## BifroMQ内置存储引擎主要用于哪些数据持久化？

BifroMQ的内置存储引擎主要用于持久化MQTT协议要求的SessionState（参见： [MQTT v3.1.1 3.1.2.4](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718028)）和Retain消息。这有助于防止Broker重启或崩溃时丢失会话状态。需要注意的是，持久化引擎大多数情况下与消息的QoS没有直接关系。例如，当一个MQTT连接开始一个持久会话时，离线QoS0订阅消息仍将被持久化，直到会话恢复并完成推送。

## 为什么BifroMQ没有管理控制台/UI界面？

BifroMQ强调在各种类型的业务系统中的集成，因此它不在中间件级别定义更高级别的管理模式和概念。然而，BifroMQ确实提供了以下能力用于运行时控制集成和监控：
- **[API](../05_user_guide/3_api/intro.md)**: 代理端控制逻辑，如强制断开连接。
- **[Metrics](../07_admin_guide/03_observability/metrics/intro.md)**: BifroMQ的运行时指标，可以与现有监控系统集成。
- **[EventCollector Plugin](../06_plugin/2_event_collector.md)**: BifroMQ操作过程中产生的各种事件，启用不同的事件溯源业务逻辑，如连接计数、在线/离线事件等。
- **[ResourceThrottler Plugin](../06_plugin/3_resource_throttler.md)**: 用于控制租户级资源使用。
- **[SettingProvider Plugin](../06_plugin/4_setting_provider/intro.md)**: 用于调整租户级运行时设置。

我们也鼓励社区开发者参与满足这些需求，并构建多样化的UI管理界面。

## BifroMQ和IoT Core之间的关系是什么？

IoT Core是百度智能云提供的一套物联网核心套件，支持预付费和按量付费计费模式的公有云服务。BifroMQ和IoT Core有着密切的关系，因为BifroMQ是IoT Core的底层技术。BifroMQ的多租户、高性能和分布式能力为构建大规模的IoT Core设备连接和消息系统提供了强大支持。