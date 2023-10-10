---
sidebar_position: 2
title: "Configuration file"
---

# Configuration File Manual

## Introduction

This document describes the configuration parameters for BifroMQ.

### host

- Type: String

- Default value: 0.0.0.0

- Description: The address to which the mqtt-server binds. This is used to provide an external mqtt access point.

### tcpPort

- Type: int

- Default value: 1883

- Description: The port to which the mqtt-server binds for exposing the mqtt tcp access port to the outside.

### tlsPort

- Type: int

- Default value: 1884

- Description: The port to which the mqtt-server binds for exposing the mqtt tls access port to the outside.

### wsPort

- Type: int

- Default value: 80

- Description: The port to which the mqtt-server binds for exposing the mqtt websocket access port to the outside.

### wssPort

- Type: int

- Default value: 1883

- Description: The port to which the mqtt-server binds for exposing the mqtt websocket security access port to the outside.

### wsPath

- Type: String

- Default value: /mqtt

- Description: The access path for ws and wss in the mqtt-server.

### tcpEnabled

- Type: Boolean

- Default value: true

- Description: Whether to build tcp access capability within the mqtt-server.

### tlsEnabled

- Type: Boolean

- Default value: false

- Description: Whether to build tls access capability within the mqtt-server.

### wsEnabled

- Type: Boolean

- Default value: false

- Description: Whether to build ws access capability within the mqtt-server.

### wssEnabled

- Type: Boolean

- Default value: false

- Description: Whether to build wss access capability within the mqtt-server.

### connTimeoutSec

- Type: Integer

- Default value: 20

- Description: The tolerable timeout duration from the establishment of the TCP connection to the completion of the Connect action. The server will actively disconnect if this limit is exceeded.

### maxConnPerSec

- Type: Integer

- Default value: 1000

- Description: The maximum frequency of Connect actions accepted per second. Connections exceeding this limit are restricted through a token bucket and will be disconnected subsequently.

### maxDisconnPerSec

- Type: Integer

- Default value: 1000

- Description: The maximum frequency of Disconnect actions accepted per second, controlled through a token bucket.

### maxMsgByteSize

- Type: Integer

- Default value: 256 * 1024

- Description: The maximum allowed size for an mqtt packet.

### maxResendTimes

- Type: Integer

- Default value: 5

- Description: The maximum number of resends for messages with QoS1 and QoS2. The message will be discarded after exceeding this limit.

### maxConnBandwidth

- Type: Integer

- Default value: 512 * 1024

- Description: The maximum bandwidth allowed for a single MQTT connection, calculated separately for inbound and outbound traffic.

### defaultKeepAliveSec

- Type: Integer

- Default value: 300

- Description: The default keepAlive duration for MQTT connections. This value is used when the client does not actively set it.

### qos2ConfirmWindowSec

- Type: Integer

- Default value: 5

- Description: The expiration time for caching messageId internally for QoS2 messages.

### authProviderFQN

- Type: String
- Default value: Null
- Description: Specifies the name of the authProvider to be loaded via Pf4j. If not configured, the built-in DefaultAuthProvider will be used.

### settingProviderFQN

- Type: String
- Default value: Null
- Description: Specifies the name of the settingProvider to be loaded via Pf4j. If not configured, the built-in DefaultSettingProvider will be used.

### eventCollectorReportBufferSize

- Type: Integer
- Default value: 8192
- Description: Specifies the ring buffer size in the internal EventCollectorManager's Disruptor.

### settingProviderProvideBufferSize

- Type: Integer
- Default value: 2048
- Description: Specifies the ring buffer size in the internal SettingProviderManager's Disruptor.

### brokerSSLCtxConfig.type

- Type: String
- Default value: server
- Description: This is a fixed value and does not need to be modified.

### brokerSSLCtxConfig.clientAuth

- Type: String
- Default value: OPTIONAL
- Description: Specifies whether client authentication is required when establishing an SSL connection between the mqtt-server and the client. Possible values include:
  * NONE: No verification required
  * OPTIONAL: The server requests client verification but won't fail if the client does not provide a certificate.
  * REQUIRE: The server requires client verification and will fail if the client does not provide a certificate.

### brokerSSLCtxConfig.certFile

- Type: String
- Default value: Null
- Description: Specifies the file name of the public key certificate used by the server when the mqtt-server module provides TLS and WSS capabilities. It will attempt to load from the directory specified by the “CONF_DIR” system parameter, or from the current classpath.

### brokerSSLCtxConfig.keyFile

- Type: String
- Default value: Null
- Description: Specifies the file name of the private key certificate used by the server when the mqtt-server module provides TLS and WSS capabilities. It will attempt to load from the directory specified by the “CONF_DIR” system parameter, or from the current classpath.

### brokerSSLCtxConfig.trustCertsFile

- Type: String
- Default value: Null
- Description: Specifies the file name of the root certificate used by the server when the mqtt-server module provides TLS and WSS capabilities. It will attempt to load from the directory specified by the “CONF_DIR” system parameter, or from the current classpath.

### distWorkerConfig.dataEngineConfig.type

- Type: String
- Default value: Null
- Description: Specifies the type of data engine used for BaseKV storage in the dist-worker module. Options include:
  * rocksDB: Provides persistence capabilities; can recover state after a restart.
  * memory: No persistence; data is lost after a restart.

### distWorkerConfig.dataEngineConfig.gcIntervalInSec

- Type: Integer
- Default value: 300
- Description: Specifies the interval (in seconds) at which the data engine in the dist-worker module's BaseKV performs garbage collection.

### distWorkerConfig.dataEngineConfig.dataPathRoot

- Type: String
- Default value: Null
- Description: Effective when the type is set to rocksDB. Specifies the directory where the dist-worker module's dataEngine stores data files. If configured as an absolute path, it will load directly; if a relative path, it will attempt to load from the directories specified by the “DATA_DIR” and “user.dir” system parameters.

### distWorkerConfig.dataEngineConfig.compactMinTombstoneKeys

- Type: Integer

- Default Value: 50,000

- Description: Effective when 'type' is set to rocksDB.

### distWorkerConfig.dataEngineConfig.compactTombstonePercent

- Type: Double

- Default Value: 0.3

- Description: Effective when 'type' is set to rocksDB. When the number of keys deleted in a particular Range in the rocksDB used by dataEngine exceeds compactMinTombstoneKeys, and the proportion of deleted keys exceeds compactTombstonePercent of the total, a compact operation is executed on this Range space.

### distWorkerConfig.walEngineConfig.type

- Type: String

- Default Value: Null

- Description: The type of walEngine used by BaseKV storage in the dist-worker module. Options are:

  * rocksDB: Has persistence capability, can recover state after restarting.
  * memory: Lacks persistence capability, data is lost upon restart.

### distWorkerConfig.walEngineConfig.gcIntervalInSec

- Type: Integer

- Default Value: 300

- Description: Interval in seconds at which the walEngine used by BaseKV in the dist-worker module performs garbage collection (GC).

### distWorkerConfig.walEngineConfig.dataPathRoot

- Type: String

- Default Value: Null

- Description: Effective when 'type' is set to rocksDB. The directory where walEngine in the dist-worker module stores data files. If set to an absolute path, it is loaded directly; if set to a relative path, the system will attempt to load it from the directories specified by “DATA_DIR” and “user.dir”.

### distWorkerConfig.walEngineConfig.compactMinTombstoneKeys

- Type: Integer

- Default Value: 50,000

- Description: Effective when 'type' is set to rocksDB.

### distWorkerConfig.walEngineConfig.compactTombstonePercent

- Type: Double

- Default Value: 0.3

- Description: Effective when 'type' is set to rocksDB. When the number of keys deleted in a particular Range in the rocksDB used by walEngine exceeds compactMinTombstoneKeys, and the proportion of deleted keys exceeds compactTombstonePercent of the total, a compact operation is executed on this Range space.

### distWorkerConfig.distWorkerClientConfig.execPipelinePerServer

- Type: Integer

- Default Value: 5

- Description: Number of execution request pipelines that are pre-established between dist-server and dist-worker.

### distWorkerConfig.distWorkerClientConfig.queryPipelinePerServer

- Type: Integer

- Default Value: 5

- Description: Number of query request pipelines that are pre-established between dist-server and dist-worker.

### inboxStoreConfig.dataEngineConfig.*

Description: Structure is the same as distWorkerConfig.dataEngineConfig, details are not repeated.

### inboxStoreConfig.walEngineConfig.*

Description: Structure is the same as distWorkerConfig.walEngineConfig, details are not repeated.

### inboxStoreConfig.inboxStoreClientConfig.*

Description: Structure is the same as distWorkerConfig.distWorkerClientConfig, details are not repeated.

### retainStoreConfig.dataEngineConfig.*

Description: Structure is the same as distWorkerConfig.dataEngineConfig, details are not repeated.

### retainStoreConfig.walEngineConfig.*

Description: Structure is the same as distWorkerConfig.walEngineConfig, details are not repeated.

### retainStoreConfig.inboxStoreClientConfig.*

Description: Structure is the same as distWorkerConfig.distWorkerClientConfig, details are not repeated.

### executorConfig.mqttWorkerThreads

- Type: Integer

- Default Value: Number of available CPU cores

- Description: The size of the workerGroup when constructing the netty server in the mqtt-server.

### executorConfig.ioClientParallelism

- Type: Integer

- Default Value: Number of available CPU cores / 3, with a minimum of 2

- Description: The number of core and maximum threads in the client-side execution thread pool when requesting data from BaseKV storage in dist-worker, inbox-store, and retain-store modules.

### executorConfig.ioServerParallelism

- Type: Integer

- Default Value: Number of available CPU cores / 3, with a minimum of 2

- Description: The number of core and maximum threads in the server-side execution thread pool within the internal dist-server, inbox-server, and retain-server modules.

### executorConfig.queryThreads

- Type: Integer

- Default Value: Number of available CPU cores / 4, with a minimum of 2

- Description: The number of core and maximum threads in the thread pool used for executing query-type requests in the BaseKV storage of dist-worker, inbox-store, and retain-store modules.

### executorConfig.mutationThreads

- Type: Integer

- Default Value: 3

- Description: The number of core and maximum threads in the internal asynchronous callback thread pool within the BaseKV storage of dist-worker, inbox-store, and retain-store modules.

### executorConfig.tickerThreads

- Type: Integer

- Default Value: Number of available CPU cores / 20, with a minimum of 1

- Description: The number of core and maximum threads in the thread pool used for executing periodic tick actions within the BaseKV storage of dist-worker, inbox-store, and retain-store modules.

### executorConfig.bgWorkerThreads

- Type: Integer

- Default Value: Number of available CPU cores / 20, with a minimum of 1

- Description: The number of core and maximum threads in the thread pool used for executing background actions within the BaseKV storage of dist-worker, inbox-store, and retain-store modules.

