---
sidebar_position: 2
---

# 配置文件手册
BifroMQ的配置文件是一个YAML文件，位于`conf`目录下的`standalone.yml`。该文件包含了BifroMQ的所有配置参数。在启动BifroMQ时，可以通过命令行参数`-c`或`--config`指定配置文件的路径。如果未指定配置文件路径，则BifroMQ将尝试从`conf`目录下加载`standalone.yml`文件。

完整的配置文件由一组配置对象定义，Top-Level的对象为`StandaloneConfig`。

## StandaloneConfig
| 配置名称                             | 值类型                    | 默认值           | 描述                                                                                                                                                          |
|-------------------------------------|------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bootstrap`                         | Boolean                | false         | 如果节点负责集群引导，则该值应设置为true。否则，应设置为false。注意：在集群部署中，必须存在**有且仅一个**引导节点                                                                                             |
| `authProviderFQN`                    | String                 | null          | 自定义Auth Provider实现的全限定类名，如果未配置，则不进行认证和鉴权                                                                                                                    |
| `resourceThrottlerFQN`               | String                 | null          | 自定义Resource Throttler实现的全限定类名。如果未配置，则不进行资源限制                                                                                                                |
| `settingProviderFQN`                 | String                 | null          | 自定义Setting Provider实现的全限定类名。如果未配置，则将使用Settings中定义的默认初始值                                                                                                     |
| `clusterConfig.env`                  | String                 | "Test"        | 集群环境名称。具有不同环境名的集群节点彼此之间相互隔离。不能为null或空字符串                                                                                                                    |
| `clusterConfig.host`                 | String                 |               | 作为集群节点的通讯地址，如果未配置，则按以下规则确定实际的值：如果mqttServerConfig.tcpListener.host的值不为"0.0.0.0"，使用该值，否则如果配置了rpcServerConfig.host，则使用该值，否则使用从NetworkInterface解析到的SiteLocal地址 |
| `clusterConfig.port`                 | Integer                | 0             | 作为集群节点的通讯端口号，`0`表示自动选择未被使用的端口号。建议为集群`引导角色`的节点配置指定的端口号，以简化配置过程                                                                                               |
| `clusterConfig.seedEndpoints`        | String                 | null          | 联系加入集群的种子节点地址，以`,`分割的`ip:port`地址形式。建议`引导角色`以外的节点配置引导节点地址，以简化配置过程                                                                                            |
| `clusterConfig.clusterDomainName`    | String                 | null          | 集群域名。当集群的节点注册到固定的域名时，此处指定该域名可以进一步简化集群各节点的配置过程，BifroMQ将解析该域名获得加入集群联系节点的地址                                                                                    |
| `mqttServerConfig.connTimeoutSec`    | Integer                | 20            | 从建立TCP连接到完成MQTT连接操作的可容忍超时持续时间。如果超出此限制，服务器将主动断开连接                                                                                                            |
| `mqttServerConfig.maxConnPerSec`     | Integer                | 2000          | 每秒接受的MQTT连接操作的最大速率。超出此限制的连接将通过令牌桶受限，并随后将断开连接                                                                                                                |
| `mqttServerConfig.maxDisconnPerSec`  | Integer                | 1000          | 节点优雅关闭时，每秒最大的断开连接速率                                                                                                                                         |
| `mqttServerConfig.maxMsgByteSize`    | Integer                | 262144        | MQTT数据包的最大允许大小                                                                                                                                              |
| `mqttServerConfig.maxConnBandwidth`  | Integer                | 524288        | 单个连接允许的最大带宽，分别计算入站和出站流量                                                                                                                                     |
| `mqttServerConfig.defaultKeepAliveSec` | Integer                | 300           | 连接的默认保持活动持续时间。当客户端未主动设置时，使用此值                                                                                                                               |
| `mqttServerConfig.bossELGThreads`    | Integer                | 1             | 用于接受TCP连接请求的线程数                                                                                                                                             |
| `mqttServerConfig.workerELGThreads`  | Integer                | max(处理器核数/2，2) | 处理MQTT协议信令的工作线程数                                                                                                                                            |
| `mqttServerConfig.tcpListener.enable` | Boolean                | true          | 是否启用MQTT over TCP的连接方式                                                                                                                                      |
| `mqttServerConfig.tcpListener.host`  | String                 | "0.0.0.0"     | MQTT over TCP连接方式下的通讯地址                                                                                                                                     |
| `mqttServerConfig.tcpListener.port`  | Integer                | 1883          | MQTT over TCP连接方式下的通讯端口                                                                                                                                     |
| `mqttServerConfig.tlsListener.enable` | Boolean                | false         | 是否启用MQTT over TLS的连接方式                                                                                                                                      |
| `mqttServerConfig.tlsListener.host`  | String                 | "0.0.0.0"     | MQTT over TLS连接方式下的通讯地址                                                                                                                                     |
| `mqttServerConfig.tlsListener.port`  | Integer                | 1884          | MQTT over TLS连接方式下的通讯端口                                                                                                                                     |
| `mqttServerConfig.tlsListener.sslConfig` | ServerSSLContextConfig | null          | MQTT over TLS连结方式下SSL的配置。参考ServerSSLContextConfig对象的设置                                                                                                      |
| `mqttServerConfig.wsListener.enable` | Boolean                | true          | MQTT over WebSocket连接方式下的通讯地址                                                                                                                               |
| `mqttServerConfig.wsListener.host`   | String                 | "0.0.0.0"     | MQTT over WebSocket连接方式下的通讯地址                                                                                                                               |
| `mqttServerConfig.wsListener.port`   | Integer                | 8080          | MQTT over WebSocket连接方式下的通讯端口                                                                                                                               |
| `mqttServerConfig.wsListener.wsPath` | String                 | "/mqtt"       | MQTT over WebSocket连接方式下的访问路径                                                                                                                               |
| `mqttServerConfig.wssListener.enable` | Boolean                | false         | 是否启用MQTT over WebSocket Secure的连接方式                                                                                                                         |
| `mqttServerConfig.wssListener.host`  | String                 | "0.0.0.0"     | MQTT over WebSocket Secure连接方式下的通讯地址                                                                                                                        |
| `mqttServerConfig.wssListener.port`  | Integer                | 8443          | MQTT over WebSocket Secure连接方式下的通讯端口                                                                                                                        |
| `mqttServerConfig.wssListener.wsPath`| String                 | "/mqtt"       | MQTT over WebSocket Secure连接方式下的访问路径                                                                                                                        |
| `mqttServerConfig.wssListener.sslConfig` | ServerSSLContextConfig | null          | MQTT over WebSocket Secure连结方式下SSL的配置。参考ServerSSLContextConfig对象的设置                                                                                         |
| `rpcClientConfig.workerThreads`      | Integer                | 处理器核数         | 节点间RPC通信时作为客户端时的工作线程数                                                                                                                                       |
| `rpcClientConfig.sslConfig`          | SSLContextConfig       | null          | 当启用Secure RPC时SSL的配置。参考SSLContextConfig对象的设置                                                                                                                |
| `rpcServerConfig.host`               | String                 |               | 见ClusterConfig.host的规则描述                                                                                                                                    |
| `rpcServerConfig.port`               | Integer                | 0             | 见ClusterConfig.port的规则描述                                                                                                                                    |
| `rpcServerConfig.workerThreads`      | Integer                | 2             | 节点间RPC通信时作为服务端时的工作线程数                                                                                                                                       |
| `rpcServerConfig.sslConfig`          | ServerSSLContextConfig | null          | 当启用Secure RPC时，SSL的配置。参考ServerSSLContextConfig对象的设置                                                                                                         |
| `stateStoreConfig.queryThreads`      | Integer                | min(可用核数/2,2) | 内置的状态存储服务用于执行查询类型请求的线程数                                                                                                                                     |
| `stateStoreConfig.tickerThreads`     | Integer                | min(可用核数/20,1) | 内置的状态存储服务用于执行周期性tick操作的线程数                                                                                                                                  |
| `stateStoreConfig.bgWorkerThreads`   | Integer                | min(可用核数/4,1) | 内置的状态存储服务用于执行后台操作的线程数                                                                                                                                       |
| `stateStoreConfig.distWorkerConfig.queryPipelinePerStore` | Integer                | 1000          | Dist Worker状态存储服务的queryPipeline的数量                                                                                                                          |
| `stateStoreConfig.distWorkerConfig.compactWALThreshold`  | Integer                | 2500          | Dist Worker状态存储服务在执行压缩操作之前的最大日志数                                                                                                                            |
| `stateStoreConfig.distWorkerConfig.dataEngineConfig`     | StorageEngineConfig    |               | Dist Worker状态存储服务的数据存储引擎配置。参考StorageEngineConfig的设置                                                                                                         |
| `stateStoreConfig.distWorkerConfig.walEngineConfig`      | StorageEngineConfig    |               | Dist Worker状态存储服务的WAL存储引擎配置。参考StorageEngineConfig的设置                                                                                                        |
| `stateStoreConfig.distWorkerConfig.balanceConfig`        | BalancerOptions        |               | Dist Worker状态存储服务的Balancer配置。参考BalancerOptions的设置                                                                                                           |
| `inboxStoreConfig.queryPipelinePerStore`                 | Integer                | 100           | Inbox Store状态存储服务的queryPipeline的数量                                                                                                                          |
| `inboxStoreConfig.compactWALThreshold`                   | Integer                | 2500          | Inbox Store状态存储服务在执行压缩操作之前的最大日志数                                                                                                                            |
| `inboxStoreConfig.gcIntervalSeconds`                     | Integer                | 600           | Inbox Store过期Session数据的回收间隔时间（秒）。                                                                                                                           |
| `inboxStoreConfig.dataEngineConfig`                      | StorageEngineConfig    |               | Inbox Store状态存储服务的数据存储引擎配置。参考StorageEngineConfig的设置                                                                                                         |
| `inboxStoreConfig.walEngineConfig`                       | StorageEngineConfig    |               | Inbox Store状态存储服务的WAL存储引擎配置。参考StorageEngineConfig的设置                                                                                                        |
| `inboxStoreConfig.balanceConfig`                         | BalancerOptions        |               | Inbox Store状态存储服务的Balancer配置。参考BalancerOptions的设置                                                                                                           |
| `retainStoreConfig.queryPipelinePerStore`                | Integer                | 100           | Retain Store状态存储服务的queryPipeline的数量                                                                                                                         |
| `retainStoreConfig.compactWALThreshold`                  | Integer                | 2500          | Retain Store状态存储服务在执行压缩操作之前的最大日志数                                                                                                                           |
| `retainStoreConfig.gcIntervalSeconds`                    | Integer                | 600           | Retain Store过期数据的回收间隔时间（秒）。                                                                                                                                 |
| `retainStoreConfig.dataEngineConfig`                     | StorageEngineConfig    |               | Retain Store状态存储服务的数据存储引擎配置。参考StorageEngineConfig的设置                                                                                                        |
| `retainStoreConfig.walEngineConfig`                      | StorageEngineConfig    |               | Retain Store状态存储服务的WAL存储引擎配置。参考StorageEngineConfig的设置                                                                                                       |
| `retainStoreConfig.balanceConfig`                        | BalancerOptions        |               | Retain Store状态存储服务的Balancer配置。参考BalancerOptions的设置                                                                                                          |
| `apiServerConfig.enable`                                 | Boolean                | true          | 是否启用HTTP API访问                                                                                                                                              |
| `apiServerConfig.host`                                   | String                 | null          | HTTP API的访问地址，如果未配置，使用与ClusterConfig.host相同的规则确定                                                                                                            |
| `apiServerConfig.httpPort`                               | Integer                | 8091          | HTTP API的访问端口                                                                                                                                               |
| `apiServerConfig.apiBossThreads`                         | Integer                | 1             | 处理HTTP API TCP连接请求的线程数                                                                                                                                      |
| `apiServerConfig.apiWorkerThreads`                       | Integer                | 2             | 处理HTTP API请求的工作线程数                                                                                                                                          |
| `apiServerConfig.httpsListenerConfig.enable`             | Boolean                | false         | 是否启用HTTPS API访问                                                                                                                                             |
| `apiServerConfig.httpsListenerConfig.host`               | String                 | null          | HTTPS API的访问地址，如果未配置，使用与ClusterConfig.host相同的规则确定                                                                                                           |
| `apiServerConfig.httpsListenerConfig.port`               | Integer                | 8090          | HTTPS API的访问端口                                                                                                                                              |
| `apiServerConfig.httpsListenerConfig.sslConfig`          | ServerSSLContextConfig | null          | HTTPS API的SSL的配置。参考ServerSSLContextConfig对象的设置                                                                                                              |


## SSLContextConfig && ServerSSLContextConfig
SSLContextConfig用于设置客户端SSL连接的配置参数。ServerSSLContextConfig用于设置服务器SSL连接的配置参数。

| 配置名称                             | 值类型                    | 默认值           | 描述                                                                                                                                |
|-------------------------------------|------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `certFile`                          | String                 | null          | 客户端或服务器的公钥证书文件名                                                                                                                   |
| `keyFile`                           | String                 | null          | 客户端或服务器的私钥证书文件名                                                                                                                   |
| `trustCertsFile`                    | String                 | null          | 客户端或服务器的根证书文件名                                                                                                                    |
| `clientAuth`                        | String                 | "OPTIONAL"    | 只对ServerSSLContextConfig有效。服务器是否需要客户端验证。可能的值包括：NONE：不需要验证；OPTIONAL：服务器请求客户端验证，但如果客户端不提供证书，则不会失败；REQUIRE：服务器需要客户端验证，如果客户端不提供证书则会失败 |

## StorageEngineConfig
StorageEngineConfig用于设置内置状态服务的数据引擎和WAL引擎的配置参数

| 配置名称                             | 值类型                 | 描述                                                                                                                                |
|-------------------------------------|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `type`                              | String                | 指定在内置存储服务中使用的数据引擎类型。选项包括：rocksdb：提供持久性功能，可以在重新启动后恢复状态；memory：无持久性，重新启动后数据将丢失 |
| `dataPathRoot`                      | String                | 当type设置为rocksdb时有效。指定存储数据文件的目录。如果配置为绝对路径，将直接加载；如果配置为相对路径，将尝试从由`DATA_DIR`和`user.dir`系统参数指定的目录加载 |
| `compactMinTombstoneKeys`           | Integer               | 当type设置为rocksdb时有效。触发压缩操作的Tombstone key数量                                                                                                                    |
| `compactTombstonePercent`           | Double                | 当type设置为rocksdb时有效。特定Range内已删除的key数超过compactMinTombstoneKeys，并且已删除key占总数的比例超过compactTombstonePercent时，将对此范围执行压缩操作 |
| `asyncWALFlush`                     | Boolean               | 仅适用于WAL引擎，是否启用向磁盘异步FlushWAL的数据                                                                                                           |
| `fsyncWAL`                          | Boolean               | 仅适用于WAL引擎。是否向写入WAL后执行fsync操作，如果此标志为 true，写入速度会较慢。如果此标志为false，且机器崩溃，某些最近的写入可能会丢失                                 |

## BalancerOptions
BalancerOptions用于设置内置状态服务的Balancer的配置参数

| 配置名称                             | 值类型                 | 默认值           | 描述                                                                                                                                |
|-------------------------------------|------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `scheduleIntervalInMs`              | Long                | 5000             | Balancer尝试平衡负载的时间间隔                                                                                                                        |
| `balancers`                   | List of String             |              | 启用的负载均衡器实现的全限定名，可以为不同的内置存储服务设置不同的负载均衡器实现                                                                                                                        |

注：调整StorageEngineConfig和BalancerOptions相关参数需要对BifroMQ的存储引擎实现有深入的了解，不当的配置可能会导致状态存储服务的异常行为。