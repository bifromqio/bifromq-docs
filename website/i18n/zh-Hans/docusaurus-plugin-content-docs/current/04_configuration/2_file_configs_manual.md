---
sidebar_position: 2
---

# 配置文件手册

## 简介
本文描述了BifroMQ的配置参数。

### bootstrap
- 类型：Boolean
- 默认值：false
- 描述：如果节点负责集群引导，则该值应设置为true。否则，应设置为false。注意：在集群部署中，必须存在**仅一个**引导节点。

### authProviderFQN
- 类型：String
- 默认值：null
- 描述：指定要通过Pf4j加载的authProvider的名称。如果未配置，则将使用内置的DefaultAuthProvider。

### settingProviderFQN
- 类型：String
- 默认值：null
- 描述：指定要通过Pf4j加载的settingProvider的名称。如果未配置，则将使用内置的DefaultSettingProvider。

### clusterConfig
#### env
- 类型：String
- 默认值：null
- 描述：集群环境。注意：具有不同环境的集群彼此之间相互依赖。此外，集群环境不能为null或空字符串。

#### host
- 类型：String
- 默认值：null
- 描述：主机地址

#### port
- 类型：Integer
- 默认值：0
- 描述：主机端口号。

#### seedEndpoints
- 类型：String
- 默认值：null
- 描述：用于消息扩散的种子节点（ip:port的形式）

#### clusterDomainName
- 类型：String
- 默认值：null
- 描述：代理主机集群的域名。

### mqttServerConfig
#### connTimeoutSec
- 类型：Integer
- 默认值：20
- 描述：从建立TCP连接到完成连接操作的可容忍超时持续时间。如果超出此限制，服务器将主动断开连接。

#### maxConnPerSec
- 类型：Integer
- 默认值：2000
- 描述：每秒接受的Connect操作的最大频率。超出此限制的连接将通过令牌桶受限，并随后将断开连接。

#### maxDisconnPerSec
- 类型：Integer
- 默认值：1000
- 描述：每秒接受的Disconnect操作的最大频率，通过令牌桶控制。

#### maxMsgByteSize
- 类型：Integer
- 默认值：256 * 1024
- 描述：数据包的最大允许大小。

#### maxResendTimes
- 类型：Integer
- 默认值：5
- 描述：具有QoS1和QoS2的消息的最大重发次数。超过此限制后，消息将被丢弃。

#### maxConnBandwidth
- 类型：Integer
- 默认值：512 * 1024
- 描述：单个连接允许的最大带宽，分别计算入站和出站流量。

#### defaultKeepAliveSec
- 类型：Integer
- 默认值：300
- 描述：连接的默认保持活动持续时间。当客户端未主动设置时，使用此值。

#### qos2ConfirmWindowSec
- 类型：Integer
- 默认值：5
- 描述：用于QoS2消息内部缓存messageId的过期时间。

#### bossELGThreads
- 类型：Integer
- 默认值：1
- 描述：Netty中处理连接的线程数。

#### workerELGThreads
- 类型：Integer
- 默认值：可用处理器数量的1/2，最小值为2。
- 描述：处理通道的消息处理线程数。

### tcpListener
#### enable
- 类型：Boolean
- 默认值：true
- 描述：是否在mqtt-server内建立TCP访问能力。

#### host
- 类型：String
- 默认值：0.0.0.0
- 描述：mqtt-server绑定的地址。用于提供外部mqtt访问点。

#### port
- 类型：Integer
- 默认值：1883
- 描述：mqtt-server绑定的端口，用于向外部公开mqtt TCP访问端口。

### tlsListener
#### enable
- 类型：Boolean
- 默认值：false
- 描述：是否在mqtt-server内建立TLS访问能力。

#### host
- 类型：String
- 默认值：0.0.0.0
- 描述：mqtt-server绑定的地址，用于提供外部mqtt访问点。

#### port
- 类型：Integer
- 默认值：1884
- 描述：mqtt-server绑定的端口，用于向外部公开mqtt TLS访问端口。

#### sslConfig
##### certFile
- 类型：String
- 默认值：null
- 描述：指定服务器在mqtt-server模块提供TLS和WSS功能时所使用的公钥证书文件名。它将尝试从“CONF_DIR”系统参数指定的目录加载，或者从当前classpath加载。

##### keyFile
- 类型：String
- 默认值：null
- 描述：指定服务器在mqtt-server模块提供TLS和WSS功能时所使用的私钥证书文件名。它将尝试从“CONF_DIR”系统参数指定的目录加载，或者从当前classpath加载。

##### trustCertsFile
- 类型：String
- 默认值：null
- 描述：指定服务器在mqtt-server模块提供TLS和WSS功能时所使用的根证书文件名。它将尝试从“CONF_DIR”系统参数指定的目录加载，或者从当前classpath加载。

##### clientAuth
- 类型：String
- 默认值：OPTIONAL
- 描述：指定在mqtt-server与客户端建立SSL连接时是否需要客户端身份验证。可能的值包括：
* NONE：不需要验证
* OPTIONAL：服务器请求客户端验证，但如果客户端不提供证书，则不会失败。
* REQUIRE：服务器需要客户端验证，如果客户端不提供证书则会失败。

### wsListener
#### enable
- 类型：Boolean
- 默认值：true
- 描述：是否在mqtt-server内建立WebSocket访问能力。

#### host
- 类型：String
- 默认值：0.0.0.0
- 描述：mqtt-server绑定的地址，用于提供外部mqtt访问点。

#### port
- 类型：Integer
- 默认值：8080
- 描述：mqtt-server绑定的端口，用于向外部公开WebSocket访问端口。

#### wsPath
- 类型：String
- 默认值：/mqtt
- 描述：mqtt-server中WebSocket和WSS的访问路径。

### wssListener
#### enable
- 类型：Boolean
- 默认值：false
- 描述：是否在mqtt-server内建立WebSocket Secure (WSS)访问能力。

#### host
- 类型：String
- 默认值：0.0.0.0
- 描述：mqtt-server绑定的地址，用于提供外部mqtt访问点。

#### port
- 类型：Integer
- 默认值：8443
- 描述：mqtt-server绑定的端口，用于向外部公开WebSocket Secure (WSS)访问端口。

#### wsPath
- 类型：String
- 默认值：/mqtt
- 描述：mqtt-server中WebSocket和WSS的访问路径。

#### sslConfig
- 描述：与tlsListener.sslConfig相同。

## rpcClientConfig
### workerThreads
- 类型：Integer
- 默认值：可用处理器核心数的1/8，最小值为2。
- 描述：RPC客户端中线程的数量。

### sslConfig
#### certFile
- 类型：String
- 默认值：null
- 描述：指定用于RPC客户端的公钥证书文件名。

#### keyFile
- 类型：String
- 默认值：null
- 描述：指定用于RPC客户端的私钥证书文件名。

#### trustCertsFile
- 类型：String
- 默认值：null
- 描述：指定用于RPC客户端的根证书文件名。

## rpcServerConfig
### host
- 类型：String
- 默认值：与mqtt-server主机地址相同。
- 描述：rpc-server的主机地址。
### port
- 类型：Integer
- 默认值：0
- 描述：rpc-server的端口。
### workerThreads
- 类型：Integer
- 默认值：可用处理器核心数的1/4，最小值为2。
- 描述：rpc-server中线程的数量。
### sslConfig
- 描述：与`tlsListener.sslConfig`具有相同的字段和含义。
## baseKVRpcServerConfig
- 描述：与`rpcServerConfig`具有相同的字段和含义。
## stateStoreConfig
### queryThreads
- 类型：Integer
- 默认值：可用处理器的1/3，最小值为2。
- 描述：用于执行BaseKV存储的dist-worker、inbox-store和retain-store模块中的查询类型请求的核心线程和最大线程数。
### tickerThreads
- 类型：Integer
- 默认值：可用处理器的1/20，最小值为1。
- 描述：用于执行dist-worker、inbox-store和retain-store模块中的BaseKV存储周期性tick操作的核心线程和最大线程数。
### bgWorkerThreads
- 类型：Integer
- 默认值：可用处理器的1/4，最小值为1。
- 描述：用于执行后台操作的核心线程和最大线程数。
### distWorkerConfig
#### queryPipelinePerStore
- 类型：Integer
- 默认值：1000
- 描述：每个`BaseKV store`中queryPipeline的数量。
#### compactWALThreshold
- 类型：Integer
- 默认值：2000
- 描述：在执行压缩操作之前的最大日志数。
#### dataEngineConfig
##### type
- 类型：String
- 默认值：rocksdb
- 描述：指定在 dist-worker模块的BaseKV存储中使用的数据引擎类型。选项包括：
* rocksDB：提供持久性功能，可以在重新启动后恢复状态。
* memory：无持久性，重新启动后数据将丢失。
##### gcIntervalInSec
- 类型：Integer
- 默认值：300
- 描述：指定dist-worker模块中BaseKV的数据引擎执行垃圾回收的间隔（以秒为单位）。
##### dataPathRoot
- 类型：String
- 默认值：null
- 描述：当类型设置为`rocksDB`时有效。指定dist-worker模块的dataEngine存储数据文件的目录。如果配置为绝对路径，将直接加载；如果配置为相对路径，将尝试从由`DATA_DIR`和`user.dir`系统参数指定的目录加载。
##### compactMinTombstoneKeys
- 类型：String
- 默认值：200,000
- 描述：当`type`设置为`rocksDB`时有效。
##### compactTombstonePercent
- 类型：Double
- 默认值：0.3
- 描述：当`type`设置为`rocksDB`时有效。当数据引擎使用的rocksDB中特定范围内已删除的密钥数超过`compactMinTombstoneKeys`，并且已删除密钥占总数的比例超过`compactTombstonePercent`时，将对此范围执行压缩操作。
##### asyncWALFlush
- 类型：Boolean
- 默认值：false
- 描述：仅适用于WAL引擎，日志将以异步方式刷新。
##### fsyncWAL
- 类型：Boolean
- 默认值：false
- 描述：仅适用于WAL引擎。如果此标志为 true，写入速度会较慢。如果此标志为false，且机器崩溃，某些最近的写入可能会丢失。
#### walEngineConfig
- 描述：类似于数据引擎。对于rocksdb配置，`compactMinTombstoneKeys`的默认值为 10,000。
#### balanceConfig
##### scheduleIntervalInMs
- 类型：Long
- 默认值：5,000
- 描述：BaseKV 范围平衡器的调度间隔。
##### balancers
- 类型：List of String
- 默认值：com.baidu.bifromq.dist.worker.balance.ReplicaCntBalancerFactory
- 描述：BaseKV Range Balancers的FQNs。
### inboxStoreConfig
#### purgeDelaySeconds
- 类型：Integer
- 默认值：180
- 描述：为过期的inbox提供一些延迟。
#### queryPipelinePerStore
- 类型：Integer
- 默认值：100
- 描述：每个`BaseKV store`中queryPipeline的数量。
#### 其他字段
- 描述：其他字段具有与dist workers相同的含义。
### retainStoreConfig
- 描述：字段与dist workers具有相同的含义。
## apiServerConfig
### enable
- 类型：Boolean
- 默认值：true
- 描述：是否在api-service中构建HTTP访问功能。
### host
- 类型：String
- 默认值：与mqtt-server主机地址相同。
- 描述：api-service的主机地址。
### httpPort
- 类型：整数
- 默认值：8091
- 描述：api-service的HTTP端口。
### apiBossThreads
- 类型：Integer
- 默认值：1
- 描述：Netty中处理连接的线程数。
### apiWorkerThreads
- 类型：Integer
- 默认值：2
- 描述：处理消息处理通道的线程数。
### httpsListenerConfig
#### enable
- 类型：Boolean
- 默认值：false
- 描述：是否在api-service中构建HTTPS访问功能。
#### host
- 类型：String
- 默认值：与mqtt-server主机地址相同。
- 描述：api-service的主机地址。
#### port
- 类型：Integer
- 默认值：8090
- 描述：api-service的HTTPS端口。
#### sslConfig
- 描述：与 `tlsListener.sslConfig` 具有相同的字段和含义。