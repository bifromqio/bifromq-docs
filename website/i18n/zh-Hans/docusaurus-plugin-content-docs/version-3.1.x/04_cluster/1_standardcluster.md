---
sidebar_position: 1
title: "部署StandardCluster"
---

## 部署前提

* 确保已安装 JDK 17 或更高版本。
* 下载最新版本的 BifroMQ 发布包 [release](https://github.com/bifromqio/bifromq/releases).

## 安装步骤

本节演示 3 节点集群的部署过程。类似于 Linux 上的部署 [Linux 上的部署](../02_installation/2_linux.md), 您首先需要解压下载的压缩包。

### 配置
默认情况下提供了一个配置文件，其中包含以下设置：

```yaml
# The cluster requires exactly one bootstrap node
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

### 设置种子节点

在设置集群之前，您需要以逗号分隔的 `<ADDRESS>:<PORT>`格式指定种子节点，例如:

```yaml
clusterConfig.seedEndpoints: ${NODE1_ADDR}:${PORT},${NODE2_ADDR}:${PORT},${NODE3_ADDR}:${PORT}
```
有关详细的配置信息，请参阅 BifroMQ [配置文档](../07_admin_guide/01_configuration/1_config_file_manual.md).

### 设置引导节点
使用以下命令启动引导节点：
```shell
./bin/standalone.sh start
```
这将创建集群运行所需的重要持久化元数据。

### 设置非引导节点
对于非引导节点，必须将引导配置设置为 **`false`** 以防止它们生成不一致的元数据。
运行脚本`./bin/standalone.sh start`启动非引导节点。

### 检查集群状态

运行脚本后，节点将形成集群并在各自的机器上生成 `AgentHost joined seedEndpoint: ${seedEndpoints}`日志。

您还可以使用各种系统级[Metrics](../07_admin_guide/03_observability/metrics/intro.md)来监控集群的健康状况和性能。