---
sidebar_position: 2
title: "Configuration file"
---

# Configuration File Manual

## Introduction

This document describes the configuration parameters for BifroMQ.

### bootstrap

- Type: Boolean
- Default value: false
- Description: If the node is responsible for cluster bootstrap, then the value should be set to be true. Otherwise, it 
should be false. NOTE: there must be EXACTLY ONE bootstrap node in cluster deployment.

### authProviderFQN
- Type: String
- Default value: null
- Description: Specifies the name of the authProvider to be loaded via Pf4j. If not configured, the built-in 
DefaultAuthProvider will be used.

### settingProviderFQN
- Type: String
- Default value: null
- Description: Specifies the name of the settingProvider to be loaded via Pf4j. If not configured, the built-in 
DefaultSettingProvider will be used.

## clusterConfig
### env
- Type: String
- Default value: empty
- Description: the cluster environment. Note: clusters with different environment are dependent with each other. Also,
Cluster environment cannot be null or empty string.
### host
- Type: String
- Default value: empty
- Description: The host address
### port
- Type: int
- Default value: 0
- Description: The port of host.
### seedEndpoints
- Type: String
- Default value: null
- Description: The advertised ip:port list in agent cluster.
### clusterDomainName
- Type: String
- Default value: empty
- Description: The domain name of the agent host cluster.
## mqttServerConfig
### connTimeoutSec
- Type: Integer
- Default value: 20
- Description: The tolerable timeout duration from the establishment of the TCP connection to the completion of the 
Connect action. The server will actively disconnect if this limit is exceeded.
### maxConnPerSec
- Type: Integer
- Default value: 2000
- Description: The maximum frequency of Connect actions accepted per second. Connections exceeding this limit are 
restricted through a token bucket and will be disconnected subsequently.
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
- Description: The maximum number of resends for messages with QoS1 and QoS2. The message will be discarded after 
exceeding this limit.
### maxConnBandwidth
- Type: Integer
- Default value: 512 * 1024
- Description: The maximum bandwidth allowed for a single MQTT connection, calculated separately for inbound and 
outbound traffic.
### defaultKeepAliveSec
- Type: Integer
- Default value: 300
- Description: The default keepAlive duration for MQTT connections. This value is used when the client does not actively 
set it.
### qos2ConfirmWindowSec
- Type: Integer
- Default value: 5
- Description: The expiration time for caching messageId internally for QoS2 messages.
### bossELGThreads
- Type: Integer
- Default value: 1
- Description: Number of threads handling connection in Netty.
### workerELGThreads
- Type: Integer
- Default value: 1/2 of the availableProcessors with a minimum of 2.
- Description: Number the threads handling message processing for channels.
### tcpListener
#### enable
- Type: Boolean
- Default value: true
- Description: Whether to build tcp access capability within the mqtt-server.
#### host
- Type: String
- Default value: 0.0.0.0
- Description: The address to which the mqtt-server binds. This is used to provide an external mqtt access point.
#### port
- Type: Integer
- Default value: 1883
- Description: The port to which the mqtt-server binds for exposing the mqtt tcp access port to the outside.
### tlsListener
#### enable
- Type: Boolean
- Default value: false
- Description: Whether to build tls access capability within the mqtt-server.
#### host
- Type: String
- Default value: 0.0.0.0
- Description: The address to which the mqtt-server binds. This is used to provide an external mqtt access point.
#### port
- Type: Integer
- Default value: 1884
- Description: The port to which the mqtt-server binds for exposing the mqtt tls access port to the outside.
#### sslConfig
##### certFile
- Type: String
- Default value: null
- Description: Specifies the file name of the public key certificate used by the server when the mqtt-server module 
provides TLS and WSS capabilities. It will attempt to load from the directory specified by the “CONF_DIR” system 
parameter, or from the current classpath.
##### keyFile
- Type: String
- Default value: null
- Description: Specifies the file name of the private key certificate used by the server when the mqtt-server module 
provides TLS and WSS capabilities. It will attempt to load from the directory specified by the “CONF_DIR” system 
parameter, or from the current classpath.
##### trustCertsFile
- Type: String
- Default value: null
- Description: Specifies the file name of the root certificate used by the server when the mqtt-server module provides 
TLS and WSS capabilities. It will attempt to load from the directory specified by the “CONF_DIR” system parameter, or 
from the current classpath.
##### clientAuth
- Type: String
- Default value: OPTIONAL
- Description: Specifies whether client authentication is required when establishing an SSL connection between the 
mqtt-server and the client. Possible values include:
  * NONE: No verification required
  * OPTIONAL: The server requests client verification but won't fail if the client does not provide a certificate.
  * REQUIRE: The server requires client verification and will fail if the client does not provide a certificate.
### wsListener
#### enable
- Type: Boolean
- Default value: true
- Description: Whether to build ws access capability within the mqtt-server.
#### host
- Type: String
- Default value: 0.0.0.0
- Description: The address to which the mqtt-server binds. This is used to provide an external mqtt access point.
#### port
- Type: Integer
- Default value: 8080
- Description: The port to which the mqtt-server binds for exposing the mqtt websocket access port to the outside.
#### wsPath
- Type: String
- Default value: /mqtt
- Description: The access path for ws and wss in the mqtt-server.
### wssListener
#### enable
- Type: Boolean
- Default value: false
- Description: Whether to build wss access capability within the mqtt-server.
#### host
- Type: String
- Default value: 0.0.0.0
- Description: The address to which the mqtt-server binds. This is used to provide an external mqtt access point.
#### port
- Type: Integer
- Default value: 8443
- Description: Whether to build wss access capability within the mqtt-server.
#### wsPath
- Type: String
- Default value: /mqtt
- Description: The access path for ws and wss in the mqtt-server.
#### sslConfig
- Description: The same with tlsListener.sslConfig.
## rpcClientConfig
### workerThreads
- Type: Integer
- Default value: 1/8 of the available processor cores with a minimum of 2.
- Description: The number of threads in rpc clients.
### sslConfig
#### certFile
- Type: String
- Default value: null
- Description: Specifies the file name of the public key certificate.
#### keyFile
- Type: String
- Default value: null
- Description: Specifies the file name of the private key certificate.
#### trustCertsFile
- Type: String
- Default value: null
- Description: Specifies the file name of the root certificate.
## rpcServerConfig
### host
- Type: String
- Default value: The same with mqtt server host address.
- Description: The host for RPC server.
### port
- Type: Integer
- Default value: 0
- Description: The port for RPC server.
### workerThreads
- Type: Integer
- Default value: 1/4 of the available processor cores with a minimum of 2.
- Description: The number of threads in rpc server.
### sslConfig
- Description: It shares the same fields and meaning with tlsListener.sslConfig.
## baseKVRpcServerConfig
- Description: It shares the same fields and meaning with rpcServerConfig.
## stateStoreConfig
### queryThreads
- Type: Integer
- Default Value: 1/3 of available processors with a minimum of 2
- Description: The number of core and maximum threads in the thread pool used for executing query-type requests in the 
BaseKV storage of dist-worker, inbox-store, and retain-store modules.
### tickerThreads
- Type: Integer
- Default Value: 1/20 of available processors with a minimum of 1
- Description: The number of core and maximum threads in the thread pool used for executing periodic tick actions within 
the BaseKV storage of dist-worker, inbox-store, and retain-store modules.
### bgWorkerThreads
- Type: Integer
- Default Value: 1/4 of available processors with a minimum of 1
- Description: The number of core and maximum threads in the thread pool used for executing background actions.
### distWorkerConfig
#### queryPipelinePerStore
- Type: Integer
- Default Value: 1000
- Description: The number of query pipelines per BaseKV store.
#### compactWALThreshold
- Type: Integer
- Default Value: 2000
- Description: The max number of logs before compaction
#### dataEngineConfig
##### type
- Type: String
- Default Value: rocksdb
- Description: Specifies the type of data engine used for BaseKV storage in the dist-worker module. Options include:
  * rocksDB: Provides persistence capabilities; can recover state after a restart.
  * memory: No persistence; data is lost after a restart.
##### gcIntervalInSec
- Type: Integer
- Default value: 300
- Description: Specifies the interval (in seconds) at which the data engine in the dist-worker module's BaseKV 
performs garbage collection.
##### dataPathRoot
- Type: String
- Default value: null
- Description: Effective when the type is set to rocksDB. Specifies the directory where the dist-worker module's 
dataEngine stores data files. If configured as an absolute path, it will load directly; if a relative path, it will 
attempt to load from the directories specified by the “DATA_DIR” and “user.dir” system parameters.
##### compactMinTombstoneKeys
- Type: Integer
- Default Value: 200,000
- Description: Effective when 'type' is set to rocksDB.
##### compactTombstonePercent
- Type: Double
- Default Value: 0.3
- Description: Effective when 'type' is set to rocksDB. When the number of keys deleted in a particular Range in the 
rocksDB used by dataEngine exceeds compactMinTombstoneKeys, and the proportion of deleted keys exceeds 
compactTombstonePercent of the total, a compact operation is executed on this Range space.
##### asyncWALFlush
- Type: Boolean
- Default Value: false
- Description: It only works for WAL engine and the logs will be flushed asynchronously.
##### fsyncWAL
- Type: Boolean
- Default Value: false
- Description: It only works for WAL engine. If this flag is true, writes will be slower. If this flag is false, and 
the machine crashes, some recent writes may be lost.
#### walEngineConfig
- Description: Similar to data engine. For rocksdb configuration, the default compactMinTombstoneKeys is 10,000.
#### balanceConfig
#### scheduleIntervalInMs
- Type: Long
- Default Value: 5000
- Description: Scheduling interval for BaseKV range balancers.
#### balancers
- Type: List of String
- Default Value: com.baidu.bifromq.dist.worker.balance.ReplicaCntBalancerFactory
- Description: BaseKV range balancers FQNs.
### inboxStoreConfig
#### purgeDelaySeconds
- Type: Integer
- Default Value: 180
- Description: Puring some delay for expired inboxes.
#### queryPipelinePerStore
- Type: Integer
- Default Value: 100
- Description: The number of query pipelines per BaseKV store.
#### other fields
- Description: Other fields are the same meaning with dist workers'.
### retainStoreConfig
- Description: The fields are the same meaning with dist workers'.
## apiServerConfig
### enable
- Type: Boolean
- Default Value: true
- Description: Whether to build http access capability within the api-service.
### host
- Type: String
- Default value: The same with mqtt server host address.
- Description: The host for api-service.
### httpPort
- Type: Integer
- Default value: 8091
- Description: The http port for api-service.
### apiBossThreads
- Type: Integer
- Default value: 1
- Description: Number of threads handling connection in Netty.
### apiWorkerThreads
- Type: Integer
- Default value: 2
- Description: Number the threads handling message processing for channels.
### httpsListenerConfig
#### enable
- Type: Boolean
- Default Value: false
- Description: Whether to build https access capability within the api-service.
#### host
- Type: String
- Default value: The same with mqtt server host address.
- Description: The host for api-service.
#### port
- Type: Integer
- Default value: 8090
- Description: The http port for api-service.
#### sslConfig
- Description: It shares the same fields and meaning with tlsListener.sslConfig.
