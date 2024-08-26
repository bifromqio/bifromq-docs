---
sidebar_position: 4
title: "Resource Throttler"
---

在BifroMQ的多租户架构中，租户共享单个集群实例提供的资源。为了防止任何单个租户过度使用造成对其他租户的影响，需要在全局层面运行时控制每个租户的资源投入。注意，通过资源限制实现租户间负载隔离的前提，业务高峰期集群中有冗余资源。

租户级全局资源限制需要实时监控每个租户的集群资源使用情况，BifroMQ提供了[租户级Metrics](../07_admin_guide/03_observability/metrics/tenantmetrics.md)，用于衡量资源量级和速率，指标类型包括：Gauge、Counter和Summary。

插件的接口在以下Maven模块中定义：

```xml

<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-resource-throttler</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with the latest version number-->
</dependency>
```

BifroMQ一次只允许运行一个Resource Throttler实例。需要在[配置文件](../07_admin_guide/01_configuration/1_config_file_manual.md)中指定实现类的完全限定名（FQN）：

```yaml
resourceThrottlerFQN: "YOUR_SETTING_PROVIDER_CLASS"
```

## 接口方法

```java
public boolean hasResource(String tenantId, TenantResourceType type);
```

此方法在BifroMQ的工作线程被上同步调用，需要确保其实现的高效，以避免影响BifroMQ性能。当方法返回false时将产生限制行为，同时生成一个ResourceThrottling事件，并报告给[Event Collector](2_event_collector.md)。

以下是`TenantResourceType`中定义的资源类型：

| Enum Value                             | Description                                      | Action on Limiting(MQTT3)   | Action on Limiting(MQTT5)                                 |
|----------------------------------------|--------------------------------------------------|-----------------------------|-----------------------------------------------------------|
| `TotalConnections`                     | Total number of connections                      | ConnAck with code(0x03)     | ConnAck with code(0x97)                                   | 
| `TotalSessionMemoryBytes`              | Total session memory usage in bytes              | ConnAck with code(0x03)     | ConnAck with code(0x97)                                   |
| `TotalPersistentSessions`              | Total number of persistent sessions              | Close connection by server  | Disconnect with code(0x97) and close connection by server |
| `TotalPersistentSessionSpaceBytes`     | Total persistent session storage space in bytes  | Close connection by server  | Disconnect with code(0x97) and close connection by server |
| `TotalSharedSubscriptions`             | Total number of shared subscriptions             | SubAck with code(0x80)      | SubAck with code(0x97)                                    |
| `TotalTransientSubscriptions`          | Total number of transient subscriptions          | SubAck with code(0x80)      | SubAck with code(0x97)                                    |
| `TotalPersistentSubscriptions`         | Total number of persistent subscriptions         | SubAck with code(0x80)      | SubAck with code(0x97)                                    |
| `TotalRetainMessageSpaceBytes`         | Total storage space for Retain messages in bytes | Ignore                      | Ignore                                                    |
| `TotalRetainTopics`                    | Total number of Retain topics                    | Ignore                      | Ignore                                                    |
| `TotalConnectPerSecond`                | Total connections per second                     | ConnAck with code(0x03)     | ConnAck with code(0x97)                                   |
| `TotalInboundBytesPerSecond`           | Total inbound bytes per second                   | Slowdown throughput         | Slowdown throughput                                       |
| `TotalTransientSubscribePerSecond`     | Total transient subscribes per second            | SubAck with code(0x80)      | SubAck with code(0x97)                                    |
| `TotalPersistentSubscribePerSecond`    | Total persistent subscribes per second           | SubAck with code(0x80)      | SubAck with code(0x97)                                    |
| `TotalTransientUnsubscribePerSecond`   | Total transient unsubscribes per second          | UnsubAck only               | UnsubAck with code(0x80)                                  |
| `TotalPersistentUnsubscribePerSecond`  | Total persistent unsubscribes per second         | UnsubAck only               | UnsubAck with code(0x80)                                  |
| `TotalTransientFanOutBytesPerSeconds`  | Total transient fan-out bytes per second         | Throttled to one subscriber | Throttled                                                 |
| `TotalPersistentFanOutBytesPerSeconds` | Total persistent fan-out bytes per second        | Throttled to one subscriber | Throttled                                                 |
| `TotalRetainedMessagesPerSeconds`      | Total Retain messages per second                 | Ignore                      | Ignore                                                    |
| `TotalRetainedBytesPerSecond`          | Total bytes for Retain messages per second       | Ignore                      | Ignore                                                    |
| `TotalRetainMatchPerSeconds`           | Total Retain message match requests per second   | SubAck with code(0x80)      | SubAck with code(0x97)                                    |
| `TotalRetainMatchBytesPerSecond`       | Total bytes for Retain match requests per second | SubAck with code(0x80)      | SubAck with code(0x97)                                    |

这些枚举值代表了在多租户BifroMQ设置中可以限流的资源类型，不同资源类型触发的限制后会产生不同的限制行为。

## Metrics

因为`hasResource`方法会被频繁调用，BifroMQ记录并输出以下指标，以帮助插件实现者观察插件接口方法的性能指标：

| Metric Name            | Meter Type | Tag(`method`)                 | Description                         |
|------------------------|------------|-------------------------------|-------------------------------------|
| `call.exec.timer`      | TIMER      | ResourceThrottler/hasResource | Latency for `hasResource` call      |
| `call.exec.fail.count` | COUNTER    | ResourceThrottler/hasResource | Fail counter for `hasResource` call |

## 实现考量点

利用BifroMQ实现多租户服务时有以下几点需要考虑，以有效管理资源使用并确保各租户之间的公平访问：

1. **收集和聚合租户指标**：从BifroMQ收集租户的资源指标，为每个租户构建并维护实时资源使用视图。视图的实时性决定了限流策略的精准性。

2. **制定资源限制策略**：基于实时资源视图，实现租户资源分配决策，并转化为具体的资源限制指令。

3. **实施资源限制**：资源限制指令需要通过`hasResource`方法以非阻塞的方式反馈给BifroMQ。

## 实现范例

BifroMQ包含了一个Resource Throttler的示范实现，可以通过在[配置文件](../07_admin_guide/01_configuration/1_config_file_manual.md)中指定`resourceThrottlerFQN`为`com.baidu.demo.plugin.DemoResourceThrottler`启用。范例实现利用JVM启动参数(`
-Dplugin.resourcethrottler.url`)来指定一个webhook的回调URL。

当BifroMQ调用hasResource方法时，插件会发起一个包含tenant_id和resource_type header的GET请求，对应于hasResource方法的两个调用的参数。请求是异步的，未返回结果前，hasResource始终返回true，确保处理不会因请求而被阻塞。

请求的结果被缓存60秒，并且每秒刷新一次。响应Body内包含的字符串被解析成布尔值，这成为hasResource方法的返回值。

以下是一个演示用webhook服务器实现(基于node.js)，可以用来测试示例插件，webhook的url地址为：`http://<ADDR>:<PORT>/query`，`http://<ADDR>:<PORT>/throttle`和`http://<ADDR>:<PORT>/release`分别用于设置和取消给定租户的限流状态。

```js
const hasResourceMap = {};

const args = process.argv.slice(2);
const hostname = args[0] || 'localhost'; 
const port = args[1] || 3000; 

const server = http.createServer((req, res) => {
const parsedUrl = url.parse(req.url, true); 
const pathname = parsedUrl.pathname;
res.setHeader('Content-Type', 'text/plain');

if (pathname === '/query') {
    const tenantId = req.headers['tenant_id'];
    const resourceType = req.headers['resource_type'];
    const key = `${tenantId}${resourceType}`;
    const exists = key in hasResourceMap ? hasResourceMap[key] : true;
    res.end(`${exists}`);
}
else if (pathname === '/throttle') {
    const tenantId = req.headers['tenant_id'];
    const resourceType = req.headers['resource_type'];
    const key = `${tenantId}${resourceType}`;
    hasResourceMap[key] = false;
    res.end('Throttled');
}
else if (pathname === '/release') {
    const tenantId = req.headers['tenant_id'];
    const resourceType = req.headers['resource_type'];
    const key = `${tenantId}${resourceType}`;
    delete hasResourceMap[key];
    res.end('Released');
}
else {
    res.statusCode = 404;
    res.end('Not Found');
}
});

server.listen(port, hostname, () => {
    console.log(`Server listening on port ${server.address().port} from address ${server.address().address}`);
});
```