---
sidebar_position: 1
---

# BifroMQ 的使用与集成

## BifroMQ 对于 Java 版本的需求是什么？

对于 BifroMQ 的 Java 版本需求，我们可以将其分为两个部分：

- **BifroMQ 运行环境**：BifroMQ 本身的运行需要 JDK 17 或更高版本。
- **BifroMQ 插件开发**：在开发 BifroMQ 插件时，我们并不强制要求特定的 Java 语言版本和 JDK 版本。但是，插件开发者需要注意确保其插件在高版本的 Java 环境中能够正常运行。为了避免兼容性问题，我们建议插件的运行环境与 BifroMQ 的运行环境保持一致。

## BifroMQ 是否内置了规则引擎功能？

不同于其他提供 MQTT 协议能力的产品或项目，BifroMQ 的明确定位是作为一个实现了标准 MQTT 协议、具有多租户架构和高性能的分布式中间件。"规则引擎"并不属于 MQTT 协议规范的内容，因此不会作为 BifroMQ 的一部分出现。
BifroMQ 更专注于以标准的方式实现上下游系统的集成。从这个角度来看，"规则引擎"只是与 BifroMQ "集成"的一种功能形态（而且不同规则引擎项目之间也存在功能差别）。我们更希望这部分需求能以开放的方式，在 BifroMQ 的开发社区内得到满足。

## 如何使用 BifroMQ 进行数据集成？

使用 BifroMQ 进行数据集成的方式主要取决于您的业务场景：

- **单租户系统**：对于逻辑上的单租户系统，其他系统可以直接使用 MQTT 协议与 BifroMQ 集成。例如，可以使用共享订阅来并行订阅消息，或者使用 MQTT Client 直接向 BifroMQ 发布消息。这种方式可以实现上下游系统的完全解耦，并且也便于进行不同 MQTT 中间件的替换比较。一般的企业自用应用系统属于此类。

- **多租户系统**：对于多租户业务场景，BifroMQ 将作为整个多租户业务系统的一个子系统。在这种情况下，系统集成需要使用 BifroMQ 的插件机制。下游系统与 BifroMQ 在插件层面会有一定的耦合，因此实现起来相对复杂。一般用于对外提供业务支持或云服务等场景。

## BifroMQ 的内置存储引擎主要用于哪些数据的持久化？

BifroMQ 的内置存储引擎主要用于 MQTT 协议定义的需要持久化（CleanSession=false）的 SessionState（详见：[MQTT v3.1.1 3.1.2.4](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718028)）和 Retain Topic 的消息。这样可以避免在 Broker 重启或宕机时造成会话状态丢失。
值得注意的是，持久化引擎在绝大多数情况下与消息的 QoS 没有直接关系，例如：当 MQTT 连接开启持久会话时，离线阶段收到的 QoS0 订阅消息仍然会被持久化，直到会话恢复时完成推送。

## BifroMQ 为什么没有管理控制台/ UI 界面？

BifroMQ 更注重在各种类型的业务系统中的集成性，因此在中间件层面并未定义更上层的管理模式和概念。然而，BifroMQ 提供了以下能力，可以实现运行时的控制面集成和监控：

- **[API](../05_user_guide/3_API/1_api.md)**：Broker 侧的控制逻辑，如强制断开连接等（待开放）。
- **[Metrics](../07_operations/4_logs_observable.md)**：BifroMQ 的运行时指标，可以与已有的监控系统集成。
- **[EventCollectorPlugin](../06_plugin/3_event_collector.md)**：BifroMQ 运行中产生的各类事件，可以实现各类 Event Sourcing 的业务逻辑，如连接数统计，上下线事件等。
- **[SettingProviderPlugin](../06_plugin/3_event_collector.md)**：用于实现租户级运行时设置的调整。

我们同样鼓励社区开发者用户能参与满足这方面的需求，封装出多样化的 UI 管理界面。

## BifroMQ 与 IoT Core 之间的关系是什么？

物联网核心套件 IoT Core 是百度智能云的一个公有云服务，支持预付费和按需计费。
BifroMQ 与 IoT Core 的关系非常紧密，因为 BifroMQ 是 IoT Core 的底层基础技术。BifroMQ 的多租户、高性能、分布式的能力，为构建大规模的 IoT Core 设备连接和消息系统提供了强大的支持。