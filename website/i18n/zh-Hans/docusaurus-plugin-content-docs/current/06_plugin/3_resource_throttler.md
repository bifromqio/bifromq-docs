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

| 枚举值                                       | 描述                    |
|----------------------------------------|-----------------------|
| `TotalConnections`                     | 总连接数                  |
| `TotalSessionMemoryBytes`              | 总会话占用内存字节数            |
| `TotalPersistentSessions`              | 总持久化会话数               |
| `TotalPersistentSessionSpaceBytes`     | 总持久化会话占用存储空间字节数       |
| `TotalSharedSubscriptions`             | 总共享订阅数                |
| `TotalTransientSubscriptions`          | 总非持久化订阅数              |
| `TotalPersistentSubscriptions`         | 总持久化订阅数               |
| `TotalRetainMessageSpaceBytes`         | 总Retain消息占用存储空间字节数    |
| `TotalRetainTopics`                    | 总Retain主题数            |
| `TotalConnectPerSecond`                | 每秒总连接数                |
| `TotalInboundBytesPerSecond`           | 每秒总入向字节数              |
| `TotalTransientSubscribePerSecond`     | 每秒总非持久化订阅数            |
| `TotalPersistentSubscribePerSecond`    | 每秒总持久化订阅数             |
| `TotalTransientUnsubscribePerSecond`   | 每秒总非持久化取消订阅数          |
| `TotalPersistentUnsubscribePerSecond`  | 每秒总持久化取消订阅数           |
| `TotalTransientFanOutBytesPerSeconds`  | 每秒总非持久化扇出字节数          |
| `TotalPersistentFanOutBytesPerSeconds` | 每秒总持久化扇出字节数           |
| `TotalRetainedMessagesPerSeconds`      | 每秒总Retain消息数          |
| `TotalRetainedBytesPerSecond`          | 每秒总Retain字节数          |
| `TotalRetainMatchPerSeconds`           | 每秒总Retain消息匹配请求数      |
| `TotalRetainMatchBytesPerSecond`       | 每秒总Retain匹配请求产生的消息字节数 |

这些枚举值代表了在多租户BifroMQ设置中可以限流的资源类型，不同资源类型触发的限制后会产生不同的限制行为。

## 实现考量点

利用BifroMQ实现多租户服务时有以下几点需要考虑，以有效管理资源使用并确保各租户之间的公平访问：

1. **收集和聚合租户指标**：从BifroMQ收集租户的资源指标，为每个租户构建并维护实时资源使用视图。视图的实时性决定了限流策略的精准性。

2. **制定资源限制策略**：基于实时资源视图，实现租户资源分配决策，并转化为具体的资源限制指令。

3. **实施资源限制**：资源限制指令需要通过`hasResource`方法以非阻塞的方式反馈给BifroMQ。

## 实现范例

BifroMQ包含了一个Resource Throttler的示范实现，可以通过在[配置文件](../07_admin_guide/01_configuration/1_config_file_manual.md)中指定`resourceThrottlerFQN`为`com.baidu.demo.plugin.DemoResourceThrottler`启用。范例实现利用JVM启动参数(-Dplugin.resourcethrottler.url)来指定一个webhook的回调URL。

当BifroMQ调用hasResource方法时，插件会发起一个包含tenant_id和resource_type header的GET请求，对应于hasResource方法的两个调用的参数。请求是异步的，未返回结果前，hasResource始终返回true，确保处理不会因请求而被阻塞。

请求的结果被缓存60秒，并且每秒刷新一次。响应Body内包含的字符串被解析成布尔值，这成为hasResource方法的返回值。

以下是一个演示用webhook服务器实现(基于node.js)，可以用来测试示例插件，webhook的url地址为：`http://<ADDR>:<PORT>/query`，`http://<ADDR>:<PORT>/throttle`和`http://<ADDR>:<PORT>/release`分别用于设置和取消给定租户的限流状态。

```
// 用于保持限流状态的map
const hasResourceMap = {};

// 从命令行参数获取绑定地址和端口
const args = process.argv.slice(2);
const hostname = args[0] || 'localhost'; // 默认绑定到localhost
const port = args[1] || 0; // 默认使用系统分配的临时端口

const server = http.createServer((req, res) => {

const parsedUrl = url.parse(req.url, true); 
const pathname = parsedUrl.pathname;

// 设置基本响应头
res.setHeader('Content-Type', 'text/plain');

// 处理查询接口
if (pathname === '/query') {
    const tenantId = req.headers['tenant_id'];
    const resourceType =

 req.headers['resource_type'];
    const key = `${tenantId}${resourceType}`;

    const exists = key in hasResourceMap ? hasResourceMap[key] : true;
    res.end(`${exists}`);

}
// 处理添加记录接口
else if (pathname === '/throttle') {
    const tenantId = req.headers['tenant_id'];
    const resourceType = req.headers['resource_type'];
    const key = `${tenantId}${resourceType}`;

    // 向Map中添加记录，这里我们以false为例
    hasResourceMap[key] = false;
    res.end('Throttled');

}
else if (pathname === '/release') {
    const tenantId = req.headers['tenant_id'];
    const resourceType = req.headers['resource_type'];
    const key = `${tenantId}${resourceType}`;

    // 从Map中删除记录，作为释放限流的例子
    delete hasResourceMap[key];
    res.end('Released');

}
// 处理无效路径
else {
    res.statusCode = 404;
    res.end('Not Found');
}
});

server.listen(port, hostname, () => {
    console.log(`Server listening on port ${server.address().port} from address ${server.address().address}`);
});
```