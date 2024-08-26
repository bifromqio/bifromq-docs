---
sidebar_position: 2
title: "高可用性"
---

# 高可用性

BifroMQ 通过其基于 Gossip 协议的去中心化集群构建能力（base-cluster）来实现高可用性。这种架构不需要额外的服务发现组件来建立集群，从而降低了与单点故障相关的运营风险。结果是一个能够灵活扩展并在集群所有节点中保持高可用性的系统。

在内部，BifroMQ 将工作负载分解，并将其组织成逻辑上独立的子集群。每种类型的负载由一个独立的子集群管理，与存储相关的模块使用 Raft 算法来确保一致性和高可用性。

## 如何在集群中启用高可用性

BifroMQ StandardCluster 采用将所有工作负载封装在单个进程中的部署模型。由于不同的子集群对高可用性的要求不同，在 BifroMQ 集群中启用高可用性需要满足以下条件。

### 集群节点数量

对于集群中的有状态分布式存储引擎 base-kv，只有当集群中超过半数的节点存活时，才能保证服务的可用性。因此，**集群必须至少包含 3 个节点** 以确保高可用性。

### 集群配置

与 base-cluster 相关的配置集中在配置文件的 "clusterConfig" 部分：

| 参数名称            | 默认值   | 推荐值                                                                                                   |
|-------------------|---------|-----------------------------------------------------------------------------------------------------------|
| env               | Test    | ***Prod*** 或 ***Test*** 以隔离集群，确保一个集群中的节点不会意外加入另一个集群。                               |
| host              | 未设置    | 集群内各节点必须可以相互访问的 IP 地址。                                                                    |
| port              | 未设置    | 集群内各节点必须可以相互访问的端口。                                                                        |
| clusterDomainName | 未设置    | 集群节点注册的域名。                                                                                        |
| seedEndpoints     | 不为空   | 集群中已有节点的列表。                                                                                      |

### 副本数量配置

BifroMQ 利用 base-kv 来支持三种原生的 MQTT 负载类型：

- MQTT 动态订阅 (DistWorker)
- MQTT 离线消息 (InboxStore)
- MQTT 保留消息 (RetainStore)

base-kv 模块使用 Raft 协议来确保分片副本的一致性和高可用性。要实现高可用性，您需要修改以下系统变量：

| 系统变量名称                     | 默认值 | 推荐值                              |
|--------------------------------|-------|--------------------------------------|
| dist_worker_range_voter_count  | 3     | 至少 3，最好为奇数。                 |
| inbox_store_range_voter_count  | 1     | 至少 3，最好为奇数。                 |
| retain_store_range_voter_count | 3     | 至少 3，最好为奇数。                 |

### StoreBalancer 配置

BifroMQ 的 base-kv 模块以去中心化的方式实现持久化服务集群的自动管理，包括初始化、分片、负载均衡和恢复等功能。目前内置的 StoreBalancer 包括：

- **RangeBootstrapBalancer**：初始化集群（与配置文件中的 ***bootstrap*** 设置效果相同）。
- **RedundantEpochRemovalBalancer**：清理冗余的 Range。
- **RangeLeaderBalancer**：在集群中均衡分布分片的 Leader。
- **ReplicaCntBalancer**：根据配置的设置，在集群中均衡分片的副本数量（包括 Voter 和 Learner）。
- **RangeSplitBalancer**：根据预定义的负载策略分片。
- **UnreachableReplicaRemovalBalancer**：清理不可达的分片副本。
- ~~**RecoveryBalancer**：自版本 3.3.0 起已废弃，不再使用。~~

内置的 Balancer 适用于大多数使用场景。然而，对于更复杂的操作场景和 SLA 要求，用户可以根据需要定制 StoreBalancer，前提是对 base-kv 架构有深入了解。BifroMQ 团队还提供该领域的专业咨询服务。

## 性能影响

默认情况下，启用多个副本会产生以下性能影响：

- **DistWorker**：默认优化为读性能，最多 3 个 Voter 副本；其余副本为 Learner。随着节点数量的增加，订阅路由性能可以水平扩展。
- **InboxStore**：配置为通过分片平衡读写性能。由于写性能受到 Voter 副本数量的显著影响，默认配置使用单个副本。用户可以根据需要调整此设置以增强可用性。
- **RetainStore**：默认优化为读性能，最多 3 个 Voter 副本；其余副本为 Learner。随着节点数量的增加，Retained消息匹配性能可以水平扩展。