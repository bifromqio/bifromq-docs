---
sidebar_position: 3
title: "配置输出"
---

当BifroMQ启动时，它会在信息日志中打印各种配置的值。打印配置信息有助于您了解BifroMQ服务的具体设置，便于故障排除。当在社区寻求帮助时，也建议包括打印出的配置信息。

有关如何查看日志的信息，请参阅：[日志记录](../03_observability/01_logging.md)

## 输出内容
日志中输出的配置信息主要由四个部分组成：

### JVM 参数

JVM参数指的是使用-D参数启动BifroMQ时传递给JVM的参数。输出的示例如下：

```text
15:21:46.890 [main] INFO c.b.b.starter.StandaloneStarter - JVM arguments:
-Xms1045m
-Xmx4096m
-Xlog:gc:file=/usr/share/bifromq-standalone/bin/../logs/gc-%t.log:time,tid,tags:filecount=5,filesize=50m
-DLOG_DIR=/usr/share/bifromq-standalone/bin/../logs
-DCONF_DIR=/usr/share/bifromq-standalone/bin/../conf
-DDATA_DIR=/usr/share/bifromq-standalone/bin/../data
-DBIND_ADDR=127.0.0.1
-Dpf4j.pluginsDir=/usr/share/bifromq-standalone/bin/../plugins
-Dfile.encoding=UTF-8
```

### [Setting](../../06_plugin/4_setting_provider/intro.md)的初始值

有关设置及其初始值的信息，请参阅：[Setting Provider Plugin](../../06_plugin/4_setting_provider/intro.md)。

需要注意的是，这里打印的值代表了BifroMQ启动时设置的初始值。这些值可以在运行时通过您的自定义设置提供者插件进行修改，因此这里打印的值可能不一定是实际的运行时值。输出的示例如下：

```text
15:21:46.890 [main] INFO c.b.b.starter.StandaloneStarter - Settings, which can be modified at runtime, allowing for dynamic adjustment of BifroMQ's service behavior per tenant. See https://bifromq.io/docs/plugin/setting_provider/
15:21:46.890 [main] INFO c.b.b.starter.StandaloneStarter - Following is the initial value of each setting:
15:21:46.913 [main] INFO c.b.b.starter.StandaloneStarter - Setting: DebugModeEnabled=false
15:21:46.913 [main] INFO c.b.b.starter.StandaloneStarter - Setting: MaxTopicLevelLength=40
15:21:46.913 [main] INFO c.b.b.starter.StandaloneStarter - Setting: MaxTopicLevels=16
15:21:46.913 [main] INFO c.b.b.starter.StandaloneStarter - Setting: MaxTopicLength=255
15:21:46.913 [main] INFO c.b.b.starter.StandaloneStarter - Setting: MaxSharedGroupMembers=200
15:21:46.913 [main] INFO c.b.b.starter.StandaloneStarter - Setting: MaxTopicFiltersPerInbox=100
15:21:46.913 [main] INFO c.b.b.starter.StandaloneStarter - Setting: MsgPubPerSec=200
...
```

### BifroMQ[系统属性](./2_bifromq_sys_props.md)

输出的示例如下：

```text
17:21:34.067 [main] INFO  c.b.b.starter.StandaloneStarter - BifroMQ system properties: 
17:21:34.070 [main] INFO  c.b.b.starter.StandaloneStarter - BifroMQSysProp: mqtt_utf8_sanity_check=false
17:21:34.070 [main] INFO  c.b.b.starter.StandaloneStarter - BifroMQSysProp: max_client_id_length=65535
17:21:34.070 [main] INFO  c.b.b.starter.StandaloneStarter - BifroMQSysProp: session_register_num=1000
17:21:34.070 [main] INFO  c.b.b.starter.StandaloneStarter - BifroMQSysProp: data_plane_tolerable_latency_ms=100
17:21:34.070 [main] INFO  c.b.b.starter.StandaloneStarter - BifroMQSysProp: data_plane_burst_latency_ms=1000
17:21:34.070 [main] INFO  c.b.b.starter.StandaloneStarter - BifroMQSysProp: control_plane_tolerant_latency_ms=200
17:21:34.070 [main] INFO  c.b.b.starter.StandaloneStarter - BifroMQSysProp: control_plane_burst_latency_ms=5000
...
```

### BifroMQ Configuration File

配置文件部分会包含整合后完整的配置文件内容，输出的示例如下：

```text
17:21:34.098 [main] INFO  c.b.b.starter.StandaloneStarter - Consolidated Config: 
---
bootstrap: true
clusterConfig:
  env: "Test"
  host: "127.0.0.1"
  port: 0
mqttServerConfig:
  connTimeoutSec: 20
  maxConnPerSec: 2000
  maxDisconnPerSec: 1000
  maxMsgByteSize: 262144
  maxResendTimes: 5
  maxConnBandwidth: 524288
  defaultKeepAliveSec: 300
  qos2ConfirmWindowSec: 5
  bossELGThreads: 1
  workerELGThreads: 4
...
```