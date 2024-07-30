---
slug: news-bifromq-opensource
title: BifroMQ 正式开源：高性能多租户 MQTT 消息中间件
authors: HaoYu
tags: [BifroMQ,Open Source,MQTT,Serverless,Multi-Tenancy]
---

# BifroMQ 正式开源：高性能多租户 MQTT 消息中间件

BifroMQ 是一个高性能的分布式 MQTT 消息中间件，无缝集成了原生的多租户支持。它旨在支持构建大规模的物联网设备链接和消息系统。

<!--truncate-->

作为百度智能云天工 AIoT [物联网核心套件](https://cloud.baidu.com/product/iot.html)的基础底层中间件，BifroMQ 在百度的物联网技术栈中，扮演着支撑大规模设备连接和消息传输的关键角色。基于 BifroMQ 公有云集群服务中，百度智能云物联网核心套件已经服务了数千名企业开发者，连接了亿级设备，并处理了海量消息吞吐。这得益于 BifroMQ 的独立且可横向扩展的设计，它能够有效处理 MQTT 的关键负载，包括连接负载和消息负载。


经过百度智能云物联网团队多年的技术积累和沉淀，BifroMQ 已经完整支持了 MQTT 3.1/3.1.1，包括通过 TCP、TLS、WS、WSS 方式使用 MQTT，另外也即将支持 MQTT 5.0。这使得 BifroMQ 在兼容性和标准实现上具有显著优势。

为了推动互联网产业的卓越发展，也为了 BifroMQ 自身的成长，今日起，百度正式对外开源 BifroMQ！


## 为什么叫做 BifroMQ

BifroMQ 的名称灵感来自于北欧神话中的 `Bifröst` - 一座彩虹之桥，联接着人类的世界 Midgard 和神祇居住的世界 Asgard，是两个世界间的坚实而灵活的通道。BifroMQ 同样旨在成为连接各种系统或应用的枢纽，通过消息传递实现它们之间的交流。这与 MQTT 中间件在分布式系统中扮演的角色，即处理和转发消息，极为相似。

此外，BifroMQ 在稳定性和可靠性方面的卓越表现及其在可扩展性和适应性上的优势，都与 `Bifröst` 的坚固性和灵活性有着极大的共通之处。因此，我们将MQTT 中间件取名为 `BifroMQ`，意寓其作为连接不同系统或应用的桥梁，坚固而灵活。

## BifroMQ 架构及性能

BifroMQ 是一款以 Serverless 为理念的 MQTT Broker 开源实现。它的设计理念是"共享资源，独享体验"，重点解决多租户环境下的 MQTT 工作负载隔离和供需均衡。它采用了负载独立子集群设计，可以高效处理连接会话、消息转发和消息存储等工作负载。各子集群具备高可用性，支持横向扩展，并能灵活应对多租户场景。为克服路由表规模可能超过单机内存的问题，我们采用创新设计使路由表存储可扩展至多台机器。同时，BifroMQ 内置了优化的分布式存储引擎，无需依赖第三方存储中间件，保证了性能稳定。

此外，BifroMQ 支持 Independent Workload Cluster、Standard Cluster 和 Standalone 三种部署模式，并允许通过插件进行定制，以满足不同业务需求。

在性能方面，BifroMQ 经过严格的测试，展现出强大的处理能力和低时延。在一个标准的测试环境中，处理大量并发消息发布时，BifroMQ 保持了极低的消息时延及较低的 CPU 使用率。同时，与同类开源 MQTT 消息中间件相比，BifroMQ 在时延和性能稳定性方面表现出色。

## BifroMQ 适用场景

BifroMQ 可以广泛应用于各种物联网场景，包括但不限于智能家居、工业物联网、车联网和智能城市等多种领域。它能够为这些应用提供可靠、高性能的消息传输服务，支撑大规模设备连接和消息处理。例如，在智能家居领域，通过 BifroMQ，可以接入数千万家居设备，并可以实现远程控制、状态同步和数据上报等功能；在工业物联网领域，它可以支持大量传感器和设备进行实时数据收集和处理；对于车联网，BifroMQ 可以处理车辆之间以及车辆与基础设施之间的通信；在智能城市应用中，它能够协助管理和优化城市资源，如交通、能源和安全等。以更好的产品服务客服

## 未来展望

BifroMQ 在百度受到高度重视，也将得到百度的全力支持和广泛的资源投入。未来，BifroMQ 将继续完善对 MQTT 5 的支持，加强性能优化，丰富功能，并不断拓展在物联网领域的应用。同时，我们将继续秉持技术中立理念，进一步强化 BifroMQ 的「被集成」能力，使其能够更加轻松地与各种系统和应用协同工作。此外，BifroMQ 未来将会与更多的开源项目和标准化组织合作，共同推动物联网技术的发展，为全球物联网产业的升级迭代贡献力量。

最后，作为一个开源项目，BifroMQ 非常欢迎各位开发者和企业深度参与项目开发和改进。为此，我们在BifroMQ官网（[https://bifromq.io/](https://bifromq.io/)）和GitHub社区平台（[https://github.com/bifromqio/bifromq](https://github.com/bifromqio/bifromq)）， **为开发者提供了丰富的文档、教程、问题解答和代码贡献** 等资源。同时，您可以 [通过电子邮件](mailto:hello@bifromq.io) 向我们发送您的微信 ID，以及为什么您对 BifroMQ 感兴趣的更多信息（我们很乐意听到），我们将尽快邀请您加入我们的群组。

或加入我们的 Discord 群组：<a href="https://discord.gg/Pfs3QRadRB"><img src="https://img.shields.io/discord/1115542029531885599?logo=discord&logoColor=white" alt="BifroMQ Discord server" /></a>
