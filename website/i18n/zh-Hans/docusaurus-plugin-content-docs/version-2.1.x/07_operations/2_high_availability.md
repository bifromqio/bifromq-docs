---
sidebar_position: 2
---

# 高可用



## 简介

得益于我们提供的的基于Gossip类协议的去中心化集群构建能力（base-cluster），BifroMQ Standard节点无需额外的服务发现组件来构建集群，
消除了单点故障的运维风险，集群规模能够自由伸缩，保障了集群整体的高可用。

从实现上来说，BifroMQ内部将工作负载进行了拆分，每种负载在逻辑上形成独立子集群，其中存储相关的模块基于Raft算法保证一致性及高可用。



## 如何开启集群高可用

目前BifroMQ StandardCluster采用了将所有负载封装至一个进程的部署模式，各子集群对高可用的要求存在一定的差异性，因此开启BifroMQ集群高可用，需要满足以下几点。



### 集群节点数

对于有状态的分布式存储base-kv来说，集群中超过半数以上节点存活才能保证服务可用，因此**集群部署节点数必须>=3**。



### base-cluster配置

base-cluster相关配置集中在配置文件的clusterConfig部分：

| 参数名称      | 默认值   | 建议值                                                       |
| ------------- | -------- | ------------------------------------------------------------ |
| host          | 空       | 传入集群内可互通的ip地址                                     |
| ip            | 空       | 传入集群内可互通的port                                       |
| seedEndpoints | 不能为空 | 新节点加入集群的请求入口，建议传入集群中所有节点的endpoint列表，或者所有节点的统一proxy地址 |



### base-kv副本数配置

BifroMQ内部的存储分为三部分，分别是MQTT订阅路由、cleanSession=false连接的MQTT消息、retain保留消息，对应BifroMQ中的模块名为：dist-worker、inbox-store、retain-store，各模块分别组成独立的base-kv子集群。

base-kv副本数配置由系统变量传入，达到高可用需要修改如下系统变量：

| 系统变量名称                   | 默认值 | 建议值              |
| ------------------------------ | ------ | ------------------- |
| dist_worker_range_voter_count  | 3      | 至少为3，最好奇数值 |
| inbox_store_range_voter_count  | 1      | 至少为3，最好奇数值 |
| retain_store_range_voter_count | 3      | 至少为3，最好奇数值 |



## 高可用的影响

### cleanSession=false消息吞吐

开启inbox-store多副本存储后，每条离线消息写入都要等待Raft协议完成Leader与多数成员复制完成后才算真正发送成功，同时保存一条消息要实际执行n次写入，因此副本数会影响cleanSession=false消息的响应时延及集群整体的吞吐量。

部署使用时可以根据实际的使用场景进评估，设置合理的副本数，平衡高可用与性能之间的关系。



## 失效场景及恢复分析

以三节点部署BifroMQ，inbox-store配置三副本存储为例。

### 一个节点宕机

#### 影响

根据Raft协议，其余两个副本可以继续正确的工作，若宕机的是leader，则剩余两副本选出新leader后继续工作，不会存在数据丢失。

#### 恢复

重新启动宕机的节点，或者启动一个新的节点，BifroMQ会自动发现新节点并自动将其加入Raft集群形成三副本，恢复高可用性。



### 两个节点宕机

#### 影响

根据Raft协议，其余一个副本无法达成超过半数节点一致性，进而无法正常工作。

#### 恢复

* 重新启动宕机的节点，节点会重载之前已经持久化的副本数据，BifroMQ集群发现新节点并将其加入Raft集群形成三副本，恢复高可用性，数据无丢失。
* 启动两个新节点，BifroMQ会自动发现新节点并自动将其加入Raft集群形成三副本，恢复高可用性。*** 注：若宕机后剩余的节点是follower且未同步到leader最新的进度，此恢复方式会导致一些已经达成Raft一致并写入的数据丢失。***



### 三个节点宕机

与两节点宕机影响及恢复情况类似。



### 自动Recover能力（可选）

Raft协议要求集群必须要超过半数节点存活才能工作，当发生如上所述的两个节点宕机情况发生时，剩余一个副本将无法工作。

BifroMQ提供了一项可配置的能力，可以让集群检测到是否正处于Raft lost majority的情况，并主动缩小Raft config中的Voter列表，使之可以继续工作。

在配置文件新增如下参数，覆盖原有策略：

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

***注：如上节分析，若宕机后剩下的少数副本均属于follower且未同步到leader的最新进度，自动恢复后会存在一定的数据丢失。在开启此功能前，需要评估是否能够接受这种数据丢失。***

















