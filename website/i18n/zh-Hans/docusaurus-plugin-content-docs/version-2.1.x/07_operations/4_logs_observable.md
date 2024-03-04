---
sidebar_position: 4
---

# 日志和可观察性

## 日志

BifroMQ基于标准的slf4j接口产出日志，日志内容分为TRACE、DEBUG、INFO、WARN、ERROR五个等级的内容，您可通过修改配置文件自行决定打印其中任意日志内容。

### 配置文件

日志配置文件名称为logback.xml，位置位于：

| 安装方式   | 文件位置                            |
| :--------- | ----------------------------------- |
| 压缩包解压 | ./conf/logback.xml                  |
| Docker容器 | /usr/share/bifromq/conf/logback.xml |

日志配置文件为标准的logback配置方式，此处不再进行详细介绍，您可自行修改配置。

需要额外关注的是：自带的logback配置文件，会根据系统参数中的“LOG_DIR”及“user.dir”设置日志文件所在目录。



## Event事件收集

BifroMQ在运行过程中，会将内部一些关键运行节点的实时执行信息提炼为Event，统一通过 EventCollectorManager 写出。

Event类型大致分为：

* MQTT协议相关Event，如连接、断连、订阅、推送消息等。
* 告警类型相关Event，如违反协议行为、内部错误、容量超限等。

Event写出的目的地，为启动时通过pf4j加载的IEventCollector扩展点的实现。

您可参考[DemoEventLogger](https://github.com/bifromqio/bifromq/blob/main/build/build-plugin-demo/src/main/java/com/baidu/demo/plugin/EventLogger.java) 来实现自己的EventCollector，用来获取BifroMQ提供的丰富的运行时事件。



## Metrics

BifroMQ内置了丰富的基于Micrometer的Metrics系统指标来帮助使用者了解当前服务实时状态，监测系统健康度和定位系统的性能问题。

您可以通过集成至prometheus的方式将Metrics进行输出，也可以选择通过Micrometer支持的其余方式进行输出。

### Prometheus集成方式

BifroMQ本身没有默认内置Micrometer向Prometheus输出的组件，您可以创建由pf4j框架加载的Plugin，在Plugin中实现Micrometer向Prometheus的推送或者拉取。

您下载的压缩包解压得到的./plugins/demo-plugin-1.0.0-SNAPSHOT.jar已经提供了Endpoint供Prometheus进行Metrics的拉取：`http://127.0.0.1:9090/metrics`

也可以参考[DemoPlugin](https://github.com/bifromqio/bifromq/blob/main/build/build-plugin-demo/src/main/java/com/baidu/demo/plugin/DemoPlugin.java) 来实现自己的Plugin。