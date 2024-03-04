---
sidebar_position: 21
---

# Deploy BifroMQ Cluster

## Prerequisites

* Ensure you have a JDK 17+ environment installed.
* Obtain the latest version of BifroMQ from [GitHub](https://github.com/bifromqio/bifromq).

## Installation Steps
In this section, we'll illustrate the deployment of a 3-node cluster. Being Similar with [deploying in Linux](2_deploy_on_linux_mac.md), 
you can extract the downloaded tar file first.

### Configurations
By default, a configuration file is provided with the following settings:
```yaml
bootstrap: true

mqttServerConfig:
  tcpListener:
    port: 1883

# config for building BifroMQ cluster
clusterConfig:
  # The environment of the cluster, cluster member under same env can communicate with each other
  env: "Test"
  # The host address to bind for inter-member communication. If left blank, a site-local address will be used if available
  host:
  # This is the port for listening to cluster membership-related messages. If left blank, the operating system will help 
  # find an available one automatically.
  # For seed nodes, it is recommended to specify an explicit port number to simplify the cluster building process.
  port:
  # Optionally using DNS to achieve cluster member address discovery, it can be used in K8S env deployment
  clusterDomainName:
  # comma separated list of <ADDRESS>:<PORT> for joining the cluster
  seedEndpoints:
```
Before setting up the cluster, you need specify `seedPoints` in format of comma separated list of `<ADDRESS>:<PORT>`, 
e.g. `clusterConfig.port: ${PORT} clusterConfig.seedEndpoints: N1:${PORT},N2:${PORT},N3:${PORT}`.
For detailed configuration information, please check [here](..%2F04_configuration%2F2_file_configs_manual.md).
### Setup Leader Node
Run the script `./bin/standalone.sh start` to start the leader node.
### Setup follower Nodes
* For followers, set `bootstrap` configuration to `false`. 
* Run the script `./bin/standalone.sh start` to start the followers.
### Cluster Deploying Check
After running the script, the nodes will form a cluster and generate the `AgentHost joined 
seedEndpoint: ${seedEndpoints}` logs on their respective machines.
### Deploy Convention
Configurations may vary between different versions. While deploying BifroMQ, you can use previous configurations to set 
it up, and it won't interrupt the running of BifroMQ. However, please note that these configurations may not take an effect.

Additionally, at the start of the info log, the complete configurations will be printed.
