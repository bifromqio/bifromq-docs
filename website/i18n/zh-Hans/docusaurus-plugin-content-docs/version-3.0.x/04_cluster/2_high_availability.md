---
sidebar_position: 2
title: "高可用部署"
---

BifroMQ内置了基于Gossip协议的去中心化集群构建能力（base-cluster），无需额外的服务发现组件即可建立集群。这消除了与单点故障相关的操作风险，并实现了集群的灵活可伸缩性，确保了整个系统的高可用性。

从实现角度看，BifroMQ内部将工作负载分解，为每种类型的负载形成逻辑上独立的子集群。具体来说，与存储相关的模块利用Raft算法保证一致性和高可用性。

## 如何在集群中启用高可用性

当前，BifroMQ StandardCluster采用的部署模型将所有工作负载封装在单个进程中。由于不同子集群对高可用性的需求各不相同，启用BifroMQ集群的高可用性需要满足以下条件。

### 集群节点数量

对于集群中的有状态分布式存储base-kv，只有当集群中超过一半的节点存活时，才能确保服务的可用性。因此，**集群部署必须具有大于或等于3的节点数量**。

### base-cluster的配置

与base-cluster相关的配置集中在配置文件的"clusterConfig"部分：

| 参数名称          | 默认值      | 推荐值                                       |
|---------------|----------|-------------------------------------------|
| host          | Null     | 集群内相互可访问的IP地址。                            |
| ip            | Null     | 集群内相互可访问的端口。                              |
| seedEndpoints | Not Null | 加入集群新节点的请求入口。推荐输入集群所有节点的端点列表或所有节点的统一代理地址。 |

### base-kv副本数的配置

BifroMQ的内部存储被分为三部分：MQTT订阅路由数据、带有`cleanSession=false`的MQTT消息数据和保留消息数据。在BifroMQ中，相应的模块名称分别是：`dist-worker`，`inbox-store`，以及`retain-store`。每个模块形成一个独立的base-kv子集群。

通过系统变量可以调整个存储模块的副本数。以下是默认设置：

| 系统变量名称                         | 默认值 | 推荐值        |
|--------------------------------|-----|------------|
| dist_worker_range_voter_count  | 3   | 至少3，最好是奇数。 |
| inbox_store_range_voter_count  | 1   | 至少3，最好是奇数。 |
| retain_store_range_voter_count | 3   | 至少3，最好是奇数。 |

## 高可用性的影响

### 带有`cleanSession=false`的消息吞吐量

启用inbox-store中的多个副本后，每个离线消息写操作必须等待Raft协议完成Leader和大多数成员之间的复制后，才被视为真正成功。此外，保存消息需要根据副本数量实际执行多次写操作。因此，副本数量将影响带有`cleanSession=false`的消息的响应延迟和集群的整体吞吐量。

在部署时，建议根据实际使用场景评估并设置合理的副本数量，以在高可用性和性能之间找到平衡。

## 故障场景及恢复分析

以BifroMQ的三节点部署和inbox-store配置为三重复制为例。

### 一个节点故障

#### 影响

根据Raft协议，剩余的两个副本可以正确地继续工作。如果崩溃的节点是领导者，剩余的两个副本将选举一个新的领导者并继续操作，确保没有数据丢失。

#### 恢复

重启崩溃的节点或启动一个新节点将被BifroMQ自动发现，并自动添加到Raft集群中，形成三重副本以恢复高可用性。

### 两个节点故障

#### 影响

根据Raft协议，剩余的单个副本不能在超过半数的节点中达成共识，因此无法正常运行。

#### 恢复

* 重启崩溃的节点，节点将重新加载之前持久化的副本数据。BifroMQ集群发现新节点并自动将其添加到Raft集群中，形成三重副本以恢复高可用性，没有数据丢失。
* 启动两个新节点将被BifroMQ自动发现，并将它们自动添加到Raft集群中，形成三重副本以恢复高可用性。
  ***注意：如果崩溃后剩余的节点是追随者并且没有同步到领导者的最新进度，这种恢复方法可能会导致一些已经达成Raft共识并写入的数据丢失。***

### 三个节点故障

与两个节点崩溃的影响和恢复场景相似。

### 自动恢复能力（可选）

Raft协议要求集群中超过一半的节点必须存活才能操作。在上述描述的两个节点崩溃的场景中，剩余的单个副本将无法正常工作。

BifroMQ提供了一种可配置的能力，允许集群检测是否处于Raft失去多数情况并主动减少Raft配置中的Voter列表，使其能够继续功能。

将以下参数添加到配置文件中以覆盖现有策略：

```
stateStoreConfig:
  inboxStoreConfig:
    balanceConfig:
      balancers:
        - com.baidu.bifromq.inbox.store.balance.ReplicaCntBalancerFactory
        - com.baidu.bifromq.inbox.store.balance.RangeSplitBalancerFactory
        - com.baidu.bifromq.inbox.store.balance.RangeLeaderBalancerFactory
        - com.baidu.bifromq.inbox.store.balance.RecoveryBalancerFactory
  distWorkerConfig:
    balanceConfig:
      balancers:
        - com.baidu.bifromq.dist.worker.balance.ReplicaCntBalancerFactory
        - com.baidu.bifromq.dist.worker.balance.RecoveryBalancerFactory
  retainStoreConfig:
    balanceConfig:
      balancers:
        - com.baidu.bifromq.retain.store.balance.ReplicaCntBalancerFactory
        - com.baidu.bifromq.retain.store.balance.RecoveryBalancerFactory
```

***注意：如前一节分析的，如果崩溃后剩余的少数副本处于follower角色并且没有同步到leader的最新进度，在自动恢复后会有一些数据丢失。在启用此功能之前，应进行评估以确定是否可以接受此类数据丢失。***