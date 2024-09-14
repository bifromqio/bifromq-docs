---
sidebar_position: 1
title: "Deploy StandardCluster"
---

## Prerequisites

* Ensure you have JDK 17 or higher installed.
* Download the latest BifroMQ [release](https://github.com/bifromqio/bifromq/releases).

## Installation Steps

This section illustrates the deployment process for a 3-node cluster. Similar to [deployment on Linux](../02_installation/2_linux.md), you need to extract the downloaded tar file first.

### Configurations

A configuration file is provided by default with the following settings:

```yaml
# To bootstrap cluster, at least one node must set bootstrap to true or alternatively configuring RangeBootstrapBalancer in StateStoreConfig
bootstrap: true

mqttServerConfig:
  tcpListener:
    port: 1883

# BifroMQ Cluster Configuration
clusterConfig:
  # Cluster environment, cluster members under same environment can communicate with each other
  env: "Test"
  # Host address to bind for inter-member communication. If left blank, a site-local address will be used if available
  host:
  # Port for listening to cluster membership-related messages. If left blank, the operating system will automatically choose an available port.
  # For seed nodes, it is recommended to specify an explicit port number to simplify the cluster building process.
  port:
  # Optional DNS domain name used to achieve cluster member address discovery, can be used in K8S environment deployment
  clusterDomainName:
  # Comma-separated list of <ADDRESS>:<PORT> for joining the cluster
  seedEndpoints:
```

**Note**: In addition to the `clusterConfig.port`, BifroMQ uses dedicated ports for inter-cluster RPC communication, such as `RPCServerConfig.port`. If these ports are not explicitly set in the configuration file, they will be randomly selected, which may cause communication failures in environments with firewalls. In such cases, please refer to the [full configuration file](../07_admin_guide/01_configuration/1_config_file_manual.md) to specify these ports explicitly and adjust your firewall rules accordingly.

### Setting Seed Nodes

Before setting up the cluster, you need to specify seedPoints in a comma-separated format of `<ADDRESS>:<PORT>`, for example:

```yaml
clusterConfig.seedEndpoints: ${NODE1_ADDR}:${PORT},${NODE2_ADDR}:${PORT},${NODE3_ADDR}:${PORT}
```
For detailed configuration information, refer to the BifroMQ Configuration [Documentation](../07_admin_guide/01_configuration/1_config_file_manual.md).

### Start Node
Run following command to start standalone node:
```shell
./bin/standalone.sh start
```
It's suggested to start the 'bootstrap' node first.

### Cluster Status Check

After running the script, the nodes will form a cluster and generate the `AgentHost joined seedEndpoint: ${seedEndpoints}` logs on their respective machines.

You can also use various system-level [metrics](../07_admin_guide/03_observability/metrics/intro.md) to monitor the cluster's health and performance.