---
slug: bifromq-tech-architecture 
title: "BifroMQ 技术架构概览"
authors: HaoYu
tags: [BifroMQ,Open Source,MQTT,Serverless,Multi-Tenancy,Technical Architecture]
---

# BifroMQ 技术架构概览

在当今的物联网领域，MQTT 协议已经成为不可或缺的关键要素，为高效、实时的数据传递提供了核心技术支持。然而，目前市场上提供 MQTT 能力的项目主要集中在传统的、现有的 "开箱即用" 物联网设备管理平台上，导致更底层的 MQTT 协议实现缺乏足够的关注和探索。然而，我们深信 MQTT 协议的特性有着更广泛的应用前景，不仅仅局限于物联网领域。正是出于这一信念，经过多年的实践和技术积累我们推出了开源项目 BifroMQ，专注于 MQTT 协议的高效处理，尤其是在面对大规模负载时的卓越表现。

<!--truncate-->
**中立性和可扩展性兼具的 MQTT 协议中间件**

相较于传统的物联网设备管理平台，BifroMQ 在设计上秉承与众不同的理念。我们大胆地抛弃了 "一揽子解决方案" 的传统范式，将注意力集中在高性能 MQTT 协议的需求上。我们坚信 MQTT 的协议特性具有更广泛的应用范式，因此 BifroMQ 致力于充分发挥 MQTT 协议的潜力，尤其是在处理大规模负载时的卓越性能。

相较于在 MQTT 实现中内置与下游系统的集成逻辑 (如：Kafka)，BifroMQ 更倾向于通过符合 MQTT 标准的方式与下游系统 "对接"。例如，通过共享订阅（Shared Subscription）机制，将集成逻辑外置，实现更加解耦的桥接和向异构系统转发消息的能力，同时保持高消息吞吐率。这种设计理念使得 BifroMQ 成为一个高度可定制的中间件，能够轻松适应各类下游系统，满足不同业务场景的需求。

## 构建大规模多租户的 Serverless云服务

BifroMQ 的使命在于构建适用于大规模多租户的 MQTT 消息系统，以支持开展 Serverless 类型云服务的业务特性。这一使命是基于对 MQTT 协议特性的深刻理解和对其更广泛应用的信心所驱动的。与传统的企业级架构不同，Serverless 云服务强调资源按需分配、弹性扩展及高度灵活的服务构建。正因如此，BifroMQ 通过其多租户架构和资源共享机制，为 Serverless 类型的业务提供了 "共享资源、独享体验" 的特性。

## 企业级部署：灵活性与稳健性兼备

虽然 BifroMQ 的目标是构建多租户的 Serverless 云服务，但多租户 + 共享资源本质上是单租户独享资源的抽象。与我们的理念一致，通过核心组件的自由组合和配置，BifroMQ 轻松支持常见的 "Shared Nothing" 企业级集群部署。实际上，这也是 BifroMQ 开源版本的默认部署模式。这种灵活性使得 BifroMQ 能够适应各种规模和需求的系统架构。

## BifroMQ 的架构解析

BifroMQ 的架构设计基于 "第一性原理"，从技术角度分析实现设计目标所需的技术以及如何将这些技术 "有机" 地组合起来，以达到整体优化的效果。因此，仅从项目结构和代码逻辑很难全面地理解其内涵。下面将从三个主要角度对 BifroMQ 的整体架构进行高层次的描述。

### 基于去中心化集群管理的模块化架构

**首先**，抛开 MQTT 协议本身的实现逻辑，BifroMQ 的各个功能服务模块构建在一套去中心化的底层集群构建能力（base-cluster）之上，如下图所示：

![BifroMQ 去中心化集群的模块化架构](images/2023-09-06-bifromq-architecture-overview/bifromq-architecture-1.png)
<p class="text-gray-400 text-center">去中心化集群的模块化架构</p>

base-cluster 构建的集群逻辑上分为两层：Underlay Cluster 和 Overlay Cluster。Underlay Cluster 被称为 "Host" Cluster，每个 Host 在 BifroMQ 中对应着运行在操作系统上的一个服务进程（Process）。Host Cluster 采用 Gossip 类的协议（SWIM Protocol）实现了 Host 成员服务（Membership），并为 Overlay Cluster 提供了 Host 地址的抽象。Overlay Cluster 被称为 "Agent" Cluster，它在 Host 地址的基础上提供了 Agent 级别的地址抽象（Agent Address）。在 BifroMQ 中，Agent 对应着实现具体功能的逻辑服务（Service）。这些逻辑服务（通过 base-rpc 框架统一实现）包括了客户端和服务端两种角色的模块，利用 Agent Cluster 的能力来实现服务的注册和发现。

这种架构带来的好处包括：

1. 逻辑服务与服务所在进程解耦，使得根据部署场景可以更加灵活地封装和组合。
2. 逻辑服务的 "服务发现" 不依赖传统意义上的注册中心或名字服务，从而消除了单点故障的运维风险，使得集群规模能够自由伸缩。

### 模块化的负载隔离与协作

**接下来**，我们从协议实现的角度描述 BifroMQ 的结构。在从构建 Serverless 云服务的角度出发进行架构设计时，需要从负载隔离和管理的角度考虑功能实现的合理性，也就是负载的多租户化。我们将 MQTT 协议的工作负载进行了拆分，使得每种负载都能以独立子集群的形式存在，而这些子集群通过协作构建了完整的 MQTT 能力。下面是 BifroMQ 中 MQTT 负载相关的模块：

* bifromq-mqtt：负责处理 MQTT 协议的长连接负载

* bifromq-dist：负责维护 MQTT 订阅状态的高可靠存取和大规模消息路由

* bifromq-inbox：负责 CleanSession=false 模式下订阅方会话消息的高可靠存取

* bifromq-retain：负责 Retain 消息的高可靠存取

这些模块之间的协作关系如下图所示：

![BifroMQ 各模块协作关系 1](images/2023-09-06-bifromq-architecture-overview/bifromq-architecture-2-1.png)

![BifroMQ 各模块协作关系 2](images/2023-09-06-bifromq-architecture-overview/bifromq-architecture-2-2.png)
<p class="text-gray-400 text-center">各模块协作关系</p>

值得一提的是，bifromq-dist、bifromq-inbox 和 bifromq-retain 模块都充分利用了 base-kv 的能力，实现了对关键负载的分布式强一致性持久化。在 Serverless 云服务的运维场景中，这点对保证 SLA 尤为重要。

### 中立性：面向标准与可扩展的集成

前文提到，BifroMQ 的定位是实现 MQTT 标准的中间件，更加强调中立性和被集成性。与其他包含 MQTT 能力的 "一揽子物联网平台" 项目并不处于同一层上。

因此，判断 "BifroMQ 是否具备某种功能或未来是否会支持某种功能" 的标准非常简单：凡是 MQTT 协议定义的能力都属于 bifromq 项目需要支持的范畴，而一切超出 MQTT 协议定义的功能，我们更倾向于以独立组件或服务的方式存在，并通过符合 MQTT 标准的方式与 BifroMQ 集成。这种方法有助于构建更大规模的云服务并促进相关技术的成熟。

当然，BifroMQ 的被集成性还体现在作为中间件本身与各种业务系统的集成上，主要包括三种机制：Plugin、API 和 Metrics：

![典型场景集成架构](images/2023-09-06-bifromq-architecture-overview/bifromq-architecture-3.png)
<p class="text-gray-400 text-center">典型场景集成架构</p>

* Plugin 机制是实现业务逻辑集成的主要方式。bifromq 目前定义了以下 plugin 接口模块：
  * bifromq-plugin-auth-provider：实现客户端认证和基于消息主题的 Pub/Sub 鉴权逻辑
  * bifromq-plugin-event-collector：实现由各类 MQTT 相关事件触发的业务逻辑
  * bifromq-plugin-setting-provider：实现租户级运行时设置变更管理逻辑

* 这些接口的参考实现可以在 BifroMQ-Inside 项目中找到。

* API 机制（即将推出）提供了 BifroMQ 的运行时 HTTP 管理接口，实现服务端订阅管理和断开连接等基本管理操作。

* Metrics 机制通过使用 micrometer 库实现了指标的定义和采样，但没有限定收集端的类型，从而使业务集成方能够自定义（可以参考项目中的 build-plugin-demo 模块）。

### 总结

综上是对 BifroMQ 技术架构的整体介绍。请期待我们将在接下来发布的一系列专题文章中，深入探讨 BifroMQ 的各个组件和设计原则。同时，欢迎您加入 BifroMQ 开发者交流群，向我们反馈关于文章内容的意见和建议。您可以 [通过电子邮件](mailto:hello@bifromq.io) 向我们发送您的微信 ID，以及为什么您对 BifroMQ 感兴趣的更多信息（我们很乐意听到），我们将尽快邀请您加入我们的群组。如有 BifroMQ 合作需求，请填写[问卷](https://iwenjuan.baidu.com/?code=5x2ip1)，我们会尽快与您联系。

最后，为了帮助大家更好地了解 BifroMQ 的技术架构，我们将于** 9 月 21 日（周四）**举办一场 BifroMQ 线上直播公开课，欢迎各位关注 BifroMQ 开发者交流群内信息，提前锁定直播地址，与广大同行交流学习！
