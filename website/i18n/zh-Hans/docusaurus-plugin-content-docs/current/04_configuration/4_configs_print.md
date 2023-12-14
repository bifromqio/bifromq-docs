---
sidebar_position: 4
---


# 配置打印

BifroMQ启动时，会在info日志中打印当前各项配置的值。打印配置信息有助于您掌握BifroMQ服务的具体情况，方便排查问题。也建议您在社区寻求帮助时，附带上打印出来的配置信息。

关于如何查看日志可以参考：[日志和可观察性](../07_operations/4_logs_observable.md)


## 打印内容

在日志中打印出来的配置信息包括总共四部分：

### JVM参数

JVM参数是指在启动BifroMQ时，通过`-D`参数传递给JVM的参数。打印示例如下：

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
### Setting初始值
关于Setting及其初始值的介绍可以参考：[Setting Provider Plugin](../06_plugin/4_setting_provider.md)。

需要注意的是，这里打印的是Setting在BifroMQ启动时的初始值，它可以通过您自定义的Setting Provider Plugin在运行时进行修改，故这里打印出的值不一定是运行时的实际值。打印示例如下：

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

### BifroMQProps

BifroMQProps是可以通过System Property传递进来的BifroMQ的一些配置项。打印示例如下：

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

### BifroMQ配置文件

BifroMQ的配置文件是指在`conf/standalone.yml`配置文件中指定的系统参数。相关信息可参考：[配置简介](1_configs_introduction.md)。
打印示例如下：

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