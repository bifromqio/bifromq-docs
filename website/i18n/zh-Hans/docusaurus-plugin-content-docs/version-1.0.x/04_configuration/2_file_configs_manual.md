---
sidebar_position: 2
---

# 配置文件手册

## 简介

BifroMQ 配置文件参数介绍。

### host

- 类型：String

- 默认值：0.0.0.0

- 描述：mqtt-server绑定的地址，用于对外提供mqtt接入点。

### tcpPort

- 类型：int

- 默认值：1883

- 描述：mqtt-server绑定的端口，用于对外暴露mqtt tcp接入端口。

### tlsPort

- 类型：int

- 默认值：1884

- 描述：mqtt-server绑定的端口，用于对外暴露mqtt tls接入端口。

### wsPort

- 类型：int

- 默认值：80

- 描述：mqtt-server绑定的端口，用于对外暴露mqtt websocket接入端口。

### wssPort

- 类型：int

- 默认值：1883

- 描述：mqtt-server绑定的端口，用于对外暴露mqtt websocket security接入端口。

### wsPath

- 类型：String

- 默认值：/mqtt

- 描述：mqtt-server中ws及wss接入路径。

### tcpEnabled

- 类型：Boolean

- 默认值：true

- 描述：是否在mqtt-server中构建tcp接入能力。

### tlsEnabled

- 类型：Boolean

- 默认值：false

- 描述：是否在mqtt-server中构建tls接入能力。

### wsEnabled

- 类型：Boolean

- 默认值：false

- 描述：是否在mqtt-server中构建ws接入能力。

### wssEnabled

- 类型：Boolean

- 默认值：false

- 描述：是否在mqtt-server中构建wss接入能力。

### connTimeoutSec

- 类型：Integer

- 默认值：20

- 描述：从TCP连接建立，到Connect动作完成，能够容忍的超时时间。超过限制后，服务端会主动断开此次连接。

### maxConnPerSec

- 类型：Integer

- 默认值：1000

- 描述：每秒接受的最大Connect频率，通过令牌桶进行限制，超限的连接会在后续进行断开。

### maxDisconnPerSec

- 类型：Integer

- 默认值：1000

- 描述：每秒接受的最大DisConnect频率，通过令牌桶进行限制。

### maxMsgByteSize

- 类型：Integer

- 默认值：256 * 1024

- 描述：允许的最大mqtt packet大小。

### maxResendTimes

- 类型：Integer

- 默认值：5

- 描述：QoS1及QoS2消息的最大重发次数，超过后会丢弃。

### maxConnBandwidth

- 类型：Integer

- 默认值：512 * 1024

- 描述：单个MQTT连接允许的最大带宽，入向和出向独立计算。

### defaultKeepAliveSec

- 类型：Integer

- 默认值：300

- 描述：默认的MQTT连接keepAlive时长，client未主动设置时采用此值。

### qos2ConfirmWindowSec

- 类型：Integer

- 默认值：5

- 描述：内部为QoS2消息缓存messageId的过期时间。

### authProviderFQN

- 类型：String

- 默认值：Null

- 描述：通过Pf4j加载生效的authProvider的名称，如果未配置，采用内置DefaultAuthProvider。

### settingProviderFQN

- 类型：String

- 默认值：Null

- 描述：通过Pf4j加载生效的settingProviderFQN的名称，如果未配置，采用内置DefaultSettingProvider。

### eventCollectorReportBufferSize

- 类型：Integer

- 默认值：8192

- 描述：内部EventCollectorManager中Disruptor的ringBufferSize。

### settingProviderProvideBufferSize

- 类型：Integer

- 默认值：2048

- 描述：内部SettingProviderManager中Disruptor的ringBufferSize。

### brokerSSLCtxConfig.type

- 类型：String

- 默认值：server

- 描述：固定值，无需修改。

### brokerSSLCtxConfig.clientAuth

- 类型：String

- 默认值：OPTIONAL

- 描述：用于设定在mqtt-server与client建立ssl连接时，是否需要验证客户端身份。可选值如下：

* NONE：无需验证
* OPTIONAL：服务端会请求验证客户端身份，如果客户端不提供证书也不会失败。
* REQUIRE：服务端要求验证客户端身份，如果客户端不提供会失败。

### brokerSSLCtxConfig.certFile

- 类型：String

- 默认值：Null

- 描述：mqtt-server模块在对外提供tls及wss接入能力时，服务端所用证书公钥文件名称。会尝试从系统参数“CONF_DIR”指定的目录下加载，或者从当前classpath下加载。

### brokerSSLCtxConfig.keyFile

- 类型：String

- 默认值：Null

- 描述：mqtt-server模块在对外提供tls及wss接入能力时，服务端所用证书私钥文件名称。会尝试从系统参数“CONF_DIR”指定的目录下加载，或者从当前classpath下加载。

### brokerSSLCtxConfig.trustCertsFile

- 类型：String

- 默认值：Null

- 描述：mqtt-server模块在对外提供tls及wss接入能力时，服务端所用根证书文件名称。会尝试从系统参数“CONF_DIR”指定的目录下加载，或者从当前classpath下加载。

### distWorkerConfig.dataEngineConfig.type

- 类型：String

- 默认值：Null

- 描述：dist-worker模块中的BaseKV存储使用的dataEngine类型，可选：

* rocksDB：具有持久化能力，重启后可恢复状态。
* memory：无持久化能力，重启数据丢失。

### distWorkerConfig.dataEngineConfig.gcIntervalInSec

- 类型：Integer

- 默认值：300

- 描述：dist-worker模块中的BaseKV使用的dataEngine进行GC的间隔。

### distWorkerConfig.dataEngineConfig.dataPathRoot

- 类型：String

- 默认值：Null

- 描述：type指定rocksDB时生效。dist-worker模块中dataEngine存储数据文件的目录，若配置为绝对路径则直接加载，若为相对路径则会依次尝试在系统参数“DATA_DIR”及“user.dir”对应的目录下加载。

### distWorkerConfig.dataEngineConfig.compactMinTombstoneKeys

- 类型：Integer

- 默认值：50,000

- 描述：type指定rocksDB时生效。

### distWorkerConfig.dataEngineConfig.compactTombstonePercent

- 类型：Double

- 默认值：0.3

- 描述：type指定rocksDB时生效。当dataEngine所用的rocksDB中某个Range删除超过compactMinTombstoneKeys数量的keys，并且已删除的keys数量占总数的比例超过compactTombstonePercent时，对这个Range空间执行compact操作。

### distWorkerConfig.walEngineConfig.type

- 类型：String

- 默认值：Null

- 描述：dist-worker模块中的BaseKV存储使用的walEngine类型，可选：

* rocksDB：具有持久化能力，重启后可恢复状态。
* memory：无持久化能力，重启数据丢失。

### distWorkerConfig.walEngineConfig.gcIntervalInSec

- 类型：Integer

- 默认值：300

- 描述：dist-worker模块中的BaseKV使用的walEngine进行GC的间隔。

### distWorkerConfig.walEngineConfig.dataPathRoot

- 类型：String

- 默认值：Null

- 描述：type指定rocksDB时生效。dist-worker模块中walEngine存储数据文件的目录，若配置为绝对路径则直接加载，若为相对路径则会依次尝试在系统参数“DATA_DIR”及“user.dir”对应的目录下加载。

### distWorkerConfig.walEngineConfig.compactMinTombstoneKeys

- 类型：Integer

- 默认值：50,000

- 描述：type指定rocksDB时生效。

### distWorkerConfig.walEngineConfig.compactTombstonePercent

- 类型：Double

- 默认值：0.3

- 描述：type指定rocksDB时生效。当walEngine所用的rocksDB中某个Range删除超过compactMinTombstoneKeys数量的keys，并且已删除的keys数量占总数的比例超过compactTombstonePercent时，对这个Range空间执行compact操作。

### distWorkerConfig.distWorkerClientConfig.execPipelinePerServer

- 类型：Integer

- 默认值：5

- 描述：dist-server跟dist-worker之间，预先建立好的exec请求pipeline的数量。

### distWorkerConfig.distWorkerClientConfig.queryPipelinePerServer

- 类型：Integer

- 默认值：5

- 描述：dist-server跟dist-worker之间，预先建立好的query请求pipeline的数量。

### inboxStoreConfig.dataEngineConfig.*

描述：结构同distWorkerConfig.dataEngineConfig，不再赘述。

### inboxStoreConfig.walEngineConfig.*

描述：结构同distWorkerConfig.walEngineConfig，不再赘述。

### inboxStoreConfig.inboxStoreClientConfig.*

描述：结构同distWorkerConfig.distWorkerClientConfig，不再赘述。

### retainStoreConfig.dataEngineConfig.*

描述：结构同distWorkerConfig.dataEngineConfig，不再赘述。

### retainStoreConfig.walEngineConfig.*

描述：结构同distWorkerConfig.walEngineConfig，不再赘述。

### retainStoreConfig.inboxStoreClientConfig.*

描述：结构同distWorkerConfig.distWorkerClientConfig，不再赘述。

### executorConfig.mqttWorkerThreads

- 类型：Integer

- 默认值：当前CPU可用核数

- 描述：mqtt-server中构建netty server时的workerGroup的大小。

### executorConfig.ioClientParallelism

- 类型：Integer

- 默认值：当前CPU可用核数 / 3，最小为2

- 描述：请求dist-worker、inbox-store、retain-store中BaseKV存储中的数据时，请求端的执行线程池核心线程数和最大线程数。

### executorConfig.ioServerParallelism

- 类型：Integer

- 默认值：当前CPU可用核数 / 3，最小为2

- 描述：内部dist-server、inbox-server、retain-server模块中服务端执行线程池的核心线程数和最大线程数。

### executorConfig.queryThreads

- 类型：Integer

- 默认值：当前CPU可用核数 / 4，最小为2

- 描述：dist-worker、inbox-store、retain-store中的BaseKV存储执行query类型请求所用线程池的核心线程数和最大线程数。

### executorConfig.mutationThreads

- 类型：Integer

- 默认值：3

- 描述：dist-worker、inbox-store、retain-store中的BaseKV存储内部所用的异步回调线程池的核心线程数和最大线程数。

### executorConfig.tickerThreads

- 类型：Integer

- 默认值：当前CPU可用核数 / 20，最小为1

- 描述：dist-worker、inbox-store、retain-store中的BaseKV存储内部执行定时tick动作所用线程池的核心线程数和最大线程数。

### executorConfig.bgWorkerThreads

- 类型：Integer

- 默认值：当前CPU可用核数 / 20，最小为1

- 描述：dist-worker、inbox-store、retain-store中的BaseKV存储内部执行background动作所用线程池的核心线程数和最大线程数。



