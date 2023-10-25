---
sidebar_position: 21
---

# 部署 BifroMQ 集群

## 前提条件
* 确保您已安装 JDK 17+ 环境。
* 从[GitHub](https://github.com/baidu/bifromq)获取BifroMQ的最新版本。

## 安装步骤
在本节中，我们将演示部署3节点的BifroMQ集群。与在Linux中部署类似，您可以首先解压已下载的tar文件。

## 配置
默认情况下，提供了一个配置文件，其中包含以下设置：
```yaml
bootstrap: true

mqttServerConfig:
  tcpListener:
    port: 1883

# 构建BifroMQ集群配置
clusterConfig:
  # 集群环境, 集群成员在相同环境下可以互通
  env: "Test"
  # 集群内部节点的主机地址，如果未填写，则会获取该节点的地址。
  host:
  # 用于集群内部节点信息的发送的端口号。如果未填写，则系统会找到一个未占用的端口号进行使用。
  # 对于种子节点，推荐指定端口号来简化构建集群的过程
  port:
  # 使用DNS发现集群地址信息, 该配置适用于K8S环境下的部署
  clusterDomainName:
  # 逗号分割的<ADDRESS>:<PORT>列表，用于加入集群
  seedEndpoints:
```
在设置集群之前，您需要以逗号分隔的`<ADDRESS>:<PORT>`格式指定`seedPoints`，例如`clusterConfig.port: ${PORT} 
clusterConfig.seedEndpoints: N1:${PORT},N2:${PORT},N3:${PORT}`。有关详细的配置信息，请查看[此处](..%2F04_configuration%2F2_file_configs_manual.md)。
## 设置Leader节点
运行脚本`./bin/standalone.sh start`来启动leader节点。
## 设置Follower节点
* 对于跟随者，将`bootstrap`配置设置为`fals`。
* 运行脚本`./bin/standalone.sh start`来启动follower节点。
## 检查集群部署
运行完follower的启动脚本后，节点将形成一个集群，并在各自的机器上生成以下日志：`AgentHost joined seedEndpoint: ${seedEndpoints}`。