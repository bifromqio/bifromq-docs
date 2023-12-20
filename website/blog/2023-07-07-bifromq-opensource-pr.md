---
slug: news-bifromq-opensource
title: "BifroMQ officially open source : high-performance multi-tenant MQTT Broker"
authors: HaoYu
tags: [BifroMQ,Open Source,MQTT,Serverless,Multi-Tenancy]
---
#  BifroMQ officially open source : high-performance multi-tenant MQTT Broker

BifroMQ is a high-performance distributed MQTT messaging middleware that seamlessly integrates native multi-tenancy support. It is designed to facilitate the construction of large-scale Internet of Things (IoT) device connections and messaging systems.

<!--truncate-->

<div align="center">
    <img src="https://images.unsplash.com/photo-1562575214-ffefa379432a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="BifroMQ" width="60%" />
    <br />
    <br />
</div>

Serving as the foundational middleware for Baidu AI Cloud [IoT Core](https://cloud.baidu.com/product/iot.html), BifroMQ plays a critical role in supporting large-scale device connections and message transmissions within Baidu's IoT technology stack. With the BifroMQ-based public cloud cluster service, Baidu AI Cloud IoT Core Suite has already served thousands of enterprise developers, connected billions of devices, and handled massive message throughput. This is attributed to BifroMQ’s standalone and horizontally scalable design, enabling it to effectively manage crucial MQTT workloads, including connection and messaging loads.

After years of technological accumulation and refinement by Baidu AI Cloud IoT team, BifroMQ now fully supports MQTT 3.1/3.1.1, including connectivity via TCP, TLS, WS, and WSS, and is also on the verge of supporting MQTT 5.0. This endows BifroMQ with significant advantages in compatibility and standard implementation.

To propel the remarkable development of the Internet industry and foster the growth of BifroMQ, Baidu is officially open-sourcing BifroMQ from today!

## Why is it called BifroMQ?

The name BifroMQ is inspired by `Bifröst` from Norse mythology - a rainbow bridge connecting the human world Midgard and the realm of the gods Asgard, serving as a sturdy and flexible conduit between the two worlds. Similarly, BifroMQ aims to be a hub connecting various systems or applications, enabling communication between them through message passing. This mirrors the role of MQTT middleware in distributed systems, which involves handling and forwarding messages.

Moreover, BifroMQ’s exceptional performance in stability and reliability, along with its advantages in scalability and adaptability, closely resemble the sturdiness and flexibility of `Bifröst`. Hence, we named the MQTT middleware `BifroMQ` to symbolize its role as a solid yet adaptable bridge connecting different systems or applications.

## BifroMQ Architecture and Performance

BifroMQ is an open-source MQTT Broker built on the concept of Serverless. Its design philosophy is "shared resources, exclusive experience," focusing on solving workload isolation and supply-demand balance in multi-tenant environments. It employs a load-independent sub-cluster design, effectively handling connection sessions, message forwarding, and message storage workloads. The sub-clusters are highly available, support horizontal scaling, and can adeptly cater to multi-tenant scenarios. To overcome the issue of routing table sizes potentially exceeding single-machine memory, we employed an innovative design that allows the routing table storage to scale across multiple machines. Additionally, BifroMQ includes an optimized distributed storage engine, eliminating the dependence on third-party storage middleware and ensuring stable performance.

Furthermore, BifroMQ supports Independent Workload Cluster, Standard Cluster, and Standalone deployment modes, and allows customization through plugins to meet various business requirements.

In terms of performance, BifroMQ has undergone rigorous testing, demonstrating formidable processing capabilities and low latency. In a standard testing environment dealing with a large volume of concurrent message publishing, BifroMQ maintained extremely low message latency and relatively low CPU usage. Compared to other open-source MQTT messaging middlewares, BifroMQ excels in latency and performance stability.

## BifroMQ Use Cases

BifroMQ can be widely employed in various IoT scenarios, including but not limited to smart homes, industrial IoT,

connected vehicles, and smart cities. It offers reliable, high-performance messaging services, supporting large-scale device connections and message processing. For instance, in the smart home sector, BifroMQ enables the integration of tens of millions of home devices and supports remote control, status synchronization, and data reporting. In the industrial IoT domain, it facilitates real-time data collection and processing from a vast number of sensors and devices. In the connected vehicles segment, BifroMQ can handle communication between vehicles as well as between vehicles and infrastructure. In smart city applications, it assists in managing and optimizing urban resources such as traffic, energy, and security for enhanced public services.

## Future Prospects

BifroMQ is highly valued at Baidu and will receive Baidu's full support and extensive resource investments. Moving forward, BifroMQ will continue to improve its support for MQTT 5, enhance performance optimization, enrich functionalities, and constantly expand its applications in the IoT domain. Additionally, we will uphold the principle of technological neutrality, further strengthening BifroMQ’s integration capabilities, enabling it to more effortlessly collaborate with various systems and applications. Furthermore, BifroMQ will cooperate with more open-source projects and standardization organizations in the future to collectively advance the development of IoT technologies and contribute to the global IoT industry's evolution.

Lastly, as an open-source project, BifroMQ warmly welcomes developers and enterprises to actively participate in project development and enhancement. To facilitate this, we have provided an abundance of resources such as documentation, tutorials, Q&A, and code contributions on the BifroMQ official website ([https://bifromq.io/](https://bifromq.io/)) and the GitHub community platform ([https://github.com/bifromqio/bifromq](https://github.com/bifromqio/bifromq)). 

Additionally, you can also join our Discord group.
<a href="https://discord.gg/Pfs3QRadRB"><img src="https://img.shields.io/discord/1115542029531885599?logo=discord&logoColor=white" alt="BifroMQ Discord server" /></a>
