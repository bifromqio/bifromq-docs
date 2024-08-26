---
sidebar_position: 2
title: "High Availability"
---

# High Availability

BifroMQ is designed to deliver high availability by leveraging a decentralized cluster-building capability provided by its Gossip-based protocol (base-cluster). This architecture eliminates the need for additional service discovery components to establish a cluster, thereby reducing the operational risks associated with single points of failure. The result is a system that can scale flexibly and maintain high availability across all nodes in the cluster.

Internally, BifroMQ decomposes workloads and organizes them into logically independent subclusters. Each type of load is managed by a separate subcluster, and modules related to storage use the Raft algorithm to ensure consistency and high availability.

## How to Enable High Availability in a Cluster

The BifroMQ StandardCluster employs a deployment model where all workloads are encapsulated within a single process. Given that different subclusters have varying requirements for high availability, enabling high availability in a BifroMQ cluster requires the following conditions to be met.

### Cluster Node Count

For the stateful distributed storage engine, base-kv, within a cluster, service availability is guaranteed only if more than half of the nodes in the cluster are alive. Therefore, **the cluster must have a minimum of 3 nodes** to ensure high availability.

### Clustering Configuration

The configurations related to base-cluster are centralized in the "clusterConfig" section of the configuration file:

| Parameter Name    | Default Value | Recommended Value                                                                                               |
|-------------------|---------------|-----------------------------------------------------------------------------------------------------------------|
| env               | Test          | ***Prod*** or ***Test*** to isolate clusters, ensuring nodes from one cluster do not accidentally join another. |
| host              | Not Set       | The IP addresses that must be accessible by all nodes within the cluster.                                       |
| port              | Not Set       | The ports that are mutually accessible within the cluster.                                                      |
| clusterDomainName | Not Set       | The domain name registered for cluster nodes.                                                                   |
| seedEndpoints     | Not Null      | A list of existing nodes in the cluster.                                                                        |

### Configuration of Replica Count

BifroMQ leverages base-kv to support three native MQTT load types:

- MQTT Dynamic Subscriptions (DistWorker)
- MQTT Offline Messages (InboxStore)
- MQTT Retained Messages (RetainStore)

The base-kv module uses the Raft protocol to ensure consistency and high availability of shard replicas. To achieve high availability, you must modify the following system variables:

| System Variable Name           | Default Value | Recommended Value                     |
|--------------------------------|---------------|---------------------------------------|
| dist_worker_range_voter_count  | 3             | At least 3, preferably an odd number. |
| inbox_store_range_voter_count  | 1             | At least 3, preferably an odd number. |
| retain_store_range_voter_count | 3             | At least 3, preferably an odd number. |

### Configuration of StoreBalancers

BifroMQ's base-kv module implements decentralized management of the persistent service cluster, including capabilities such as initialization, sharding, load balancing, and recovery. The following StoreBalancers are built-in by default:

- **RangeBootstrapBalancer**: Initializes the cluster (same effect as the ***bootstrap*** setting in the config file).
- **RedundantEpochRemovalBalancer**: Cleans up redundant ranges.
- **RangeLeaderBalancer**: Balances the distribution of shard leaders across the cluster.
- **ReplicaCntBalancer**: Balances the number of shard replicas (both Voter and Learner) across the cluster based on the configured settings.
- **RangeSplitBalancer**: Splits shards according to predefined load strategies.
- **UnreachableReplicaRemovalBalancer**: Removes unreachable shard replicas.
- ~~**RecoveryBalancer**: Deprecated since version 3.3.0 and no longer in use.~~

The built-in Balancers are suitable for most use cases. However, for more complex operational scenarios and SLA requirements, users can customize StoreBalancers according to their needs, provided they have a deep understanding of the base-kv architecture. The BifroMQ team also offers professional consulting services in this area.

## Performance Impact

Enabling multiple replicas has the following performance impacts by default:

- **DistWorker**: Optimized for read performance by default, with a maximum of 3 Voter replicas; the remaining replicas are Learners. As the number of nodes increases, subscription routing performance can scale horizontally.
- **InboxStore**: Configured to balance read and write performance through sharding. Since write performance is significantly affected by the number of Voter replicas, the default configuration uses a single replica. Users can adjust the number of Voter replicas in this setting to enhance availability as needed.
- **RetainStore**: Optimized for read performance by default, with a maximum of 3 Voter replicas; the remaining replicas are Learners. As the number of nodes increases, retained message matching performance can scale horizontally.