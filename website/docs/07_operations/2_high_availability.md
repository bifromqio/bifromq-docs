---
sidebar_position: 2
---

# High Availability

## Overview

Due to the decentralized cluster-building capability provided by the Gossip-based protocol (base-cluster) we offer, BifroMQ Standard nodes do not require additional service discovery components to establish a cluster. This eliminates operational risks associated with single points of failure and enables the flexible scalability of the cluster, ensuring high availability across the entire system.

From an implementation perspective, BifroMQ internally decomposes the workload, forming logically independent subclusters for each type of load. Specifically, modules related to storage leverage the Raft algorithm to guarantee consistency and high availability.


## How to Enable High Availability in a Cluster

Currently, the BifroMQ StandardCluster employs a deployment model that encapsulates all workloads within a single process. As different subclusters have varying requirements for high availability, enabling high availability in the BifroMQ cluster necessitates meeting the following conditions.


### Cluster Node Count

For the stateful distributed storage, base-kv, in a cluster, the availability of the service is ensured only if more than half of the nodes in the cluster are alive. Therefore, **the cluster deployment must have a node count greater than or equal to 3**.


### Configuration of base-cluster

The configurations related to base-cluster are centralized in the "clusterConfig" section of the configuration file:

| Parameter Name | Default Value | Recommended Value                                                       |
| ------------- | -------- | ------------------------------------------------------------ |
| host          | Null   | Input the IP addresses that are mutually accessible within the cluster. |
| ip            | Null   | Input the ports that are mutually accessible within the cluster. |
| seedEndpoints | Not Null | Entrance for the request of a new node joining the cluster. It is recommended to input the list of endpoints for all nodes in the cluster or a unified proxy address for all nodes. |



### Configuration of base-kv Replica Count

BifroMQ's internal storage is divided into three parts: MQTT subscription routes, MQTT messages from connections with `cleanSession=false`, and retained messages. The corresponding module names in BifroMQ are: `dist-worker` for MQTT subscription routes, `inbox-store` for MQTT messages with `cleanSession=false` connections, and `retain-store` for retained messages. Each module forms an independent base-kv subcluster.

The configuration for the number of replicas in base-kv is passed through system variables. To achieve high availability, the following system variables need to be modified:

| System Variable Name           | Default Value | Recommended Value                     |
| ------------------------------ | ------------- | ------------------------------------- |
| dist_worker_range_voter_count  | 3             | At least 3, preferably an odd number. |
| inbox_store_range_voter_count  | 1             | At least 3, preferably an odd number. |
| retain_store_range_voter_count | 3             | At least 3, preferably an odd number. |



## Impact of High Availability

### Throughput of Messages with `cleanSession=false`

After enabling multiple replicas in inbox-store, each offline message write operation must wait for the Raft protocol to complete the replication between the Leader and the majority of members before it is considered truly successful. Additionally, saving a message requires actual execution of the write operation multiple times, depending on the number of replicas. Therefore, the number of replicas will impact the response latency of messages with `cleanSession=false` and the overall throughput of the cluster.

During deployment, it is advisable to assess and set a reasonable number of replicas based on the actual usage scenario, striking a balance between high availability and performance.



## Analysis of Failure Scenarios and Recovery

Taking a three-node deployment of BifroMQ with inbox-store configured for triple replication as an example.

### One Node Failure

#### Impact

According to the Raft protocol, the remaining two replicas can continue to function correctly. If the crashed node is the leader, the remaining two replicas will elect a new leader and continue to operate, ensuring no data loss.

#### Recovery

Restarting the crashed node or starting a new node will be automatically discovered by BifroMQ, and it will be automatically added to the Raft cluster, forming a triple replica to restore high availability.



### Two Node Failure

#### Impact

According to the Raft protocol, the remaining single replica cannot achieve a consensus among more than half of the nodes, and therefore, it cannot operate normally.

#### Recovery

* When restarting the crashed node, the node will reload the previously persisted replica data. BifroMQ cluster discovers the new node and automatically adds it to the Raft cluster, forming a triple replica to restore high availability, with no data loss.
* Starting two new nodes will be automatically discovered by BifroMQ, and it will add them to the Raft cluster automatically, forming a triple replica to restore high availability. ***Note: If the remaining nodes after a crash are followers and have not synchronized to the latest progress of the leader, this recovery method may result in the loss of some data that has already achieved Raft consensus and been written.***



### Three Node Failure

Similar to the impact and recovery scenarios with two nodes crashing.



### Automatic Recovery Capability (Optional)

The Raft protocol requires that more than half of the nodes in the cluster must be alive for the system to operate. In the scenario where two nodes crash, as described above, the remaining single replica will be unable to function.

BifroMQ provides a configurable capability that allows the cluster to detect whether it is in a Raft lost majority situation and proactively reduce the Voter list in the Raft configuration, enabling it to continue functioning.

Add the following parameters to the configuration file to override the existing policy:

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

***Note: As analyzed in the previous section, if the remaining minority replicas after a crash are followers and have not synchronized to the latest progress of the leader, there will be some data loss after automatic recovery. Before enabling this feature, an assessment should be conducted to determine whether this type of data loss is acceptable.***

















