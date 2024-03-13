---
id: intro
sidebar_position: 0
title: "BifroMQ 集群概述"
---

BifroMQ 采用去中心化的集群方式，其中 MQTT 协议的工作负载分布在独立的子集群中，每个子集群负责特定的功能。这种设计建立在两层集群结构之上：底层集群 (Underlay Cluster) 和上层集群 (Overlay Cluster)，以提高可扩展性和容错性。

## 底层集群

底层集群是 BifroMQ 集群系统的主干。该层通过消除单点故障并保持准确及时的集群拓扑一致性来确保高可用性。

#### 主要功能:

- **去中心化构建**: 无需依赖传统注册中心即可进行集群形成，从而降低运营风险。
- **故障检测和自动剔除**: 通过主动故障检测和快速成员信息同步来增强集群可靠性。
- **脑裂恢复**: 包含从网络分区中恢复的机制，以维护集群完整性和一致性。

## 上层集群

上层集群（也称为代理集群）建立在底层集群之上，专注于特定的功能服务，利用底层集群进行成员管理和节点间通信。简化了部署和运维流程，可以自动形成集群来支持无状态 RPC 服务和构建于分布式 KV 存储引擎上的状态服务。

## 部署模型
BifroMQ 引入了两种不同的部署模型来满足各种运维需求和工作负载场景：

### Standard Cluster

[StandardCluster](../04_cluster/1_standardcluster.md) 将所有功能模块集成在一个进程中，类似于“共享式”架构，简化了配置和部署。虽然这种模型简化了扩展，但它对不同模块之间资源分配的 “微调” 能力有限。

### IndependentWorkload Cluster

IndependentWorkloadCluster 模型允许将每个模块作为一个独立的进程进行部署。这提供了更大的灵活性、精确的资源管理以及更动态地适应业务需求的能力，从而促进从标准集群到更细粒度的部署方法的平滑过渡。
![IndependentWorkloadCluster](images/IndependentWorkload.png)
注意: 有关 IndependentWorkloadCluster 的信息将在以后的版本中提供。