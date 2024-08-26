---
sidebar_position: 4
title: "Resource Throttler"
---

In BifroMQ's multi-tenant architecture, tenants share resources provided by a single cluster instance. To prevent any single tenant from overusing resources and impacting others, it is crucial to control each tenant's resource usage
globally at runtime. It is important to note that the ability to achieve load isolation among tenants through resource limitations presupposes the availability of surplus resources in the cluster during peak business periods.

Tenant-level global resource limitations require real-time monitoring of each tenant's cluster resource usage. BifroMQ provides [Tenant-level Metrics](../07_admin_guide/03_observability/metrics/tenantmetrics.md) for measuring resources in
terms of quantity and rate, including Gauge, Counter, and Summary metrics.

The interface for the plugin is defined in the following Maven module:

```xml

<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-resource-throttler</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with the latest version number-->
</dependency>
```

BifroMQ allows only one instance of the Resource Throttler to run at a time. The specific implementation class to be loaded must be specified in the [configuration file](../07_admin_guide/01_configuration/1_config_file_manual.md) by its
Fully Qualified Name (FQN):

```yaml
resourceThrottlerFQN: "YOUR_SETTING_PROVIDER_CLASS"
```

## Interface Method

```java
public boolean hasResource(String tenantId, TenantResourceType type);
```

This method is called synchronously on BifroMQ's worker thread and must be implemented efficiently to avoid impacting BifroMQ performance. A return value of false triggers a limiting action, and a ResourceThrottling event is generated and
reported to the [Event Collector](2_event_collector.md).

Here are the resource types defined in `TenantResourceType`:

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

These enum values represent the types of resources that can be throttled in a multi-tenant BifroMQ setup, with different resource types triggering different limiting actions.

## Metrics

Because the `hasResource` method is frequently called, BifroMQ records and outputs the following metrics to help
plugin implementers observe the performance indicators of the plugin interface methods:

| Metric Name            | Meter Type | Tag(`method`)                 | Description                         |
|------------------------|------------|-------------------------------|-------------------------------------|
| `call.exec.timer`      | TIMER      | ResourceThrottler/hasResource | Latency for `hasResource` call      |
| `call.exec.fail.count` | COUNTER    | ResourceThrottler/hasResource | Fail counter for `hasResource` call |

## Implementation Considerations

Implementing multi-tenant services with BifroMQ involves several key considerations for effectively managing resource usage and ensuring fair access across tenants:

1. **Collection and Aggregation of Tenant Metrics**: Collect resource metrics from BifroMQ for each tenant to build and maintain a real-time view of resource usage. The real-time nature of this view determines the precision of throttling
   strategies.

2. **Resource Limitation Strategy**: Based on the real-time resource view, implement decision-making for tenant resource allocation and translate these into specific resource limitation instructions.

3. **Implementing Resource Limitations**: Resource limitation instructions need to be fed back to BifroMQ through the `hasResource` method in a non-blocking manner.

## Example Implementation

BifroMQ includes an example implementation of the Resource Throttler, which can be enabled by specifying `resourceThrottlerFQN` as `com.baidu.demo.plugin.DemoResourceThrottler` in
the [configuration file](../07_admin_guide/01_configuration/intro.md). The example uses a JVM startup argument (`-Dplugin.resourcethrottler.url`) to specify a callback URL for a webhook.

When BifroMQ calls the hasResource method, the plugin initiates a GET request that includes tenant_id and resource_type headers, corresponding to the two parameters of the hasResource method call. The request is asynchronous, and
hasResource always returns true before a response is received, ensuring processing is not blocked by the request.

The result of the request is cached for 60 seconds and refreshed every second. The response body's string is parsed into a boolean value, which becomes the return value of the hasResource method.

Below is a demonstration webhook server implementation (based on Node.js) that can be used to test the example plugin. The webhook URL address is `http://<ADDR>:<PORT>/query`. Two additional urls `http://<ADDR>:<PORT>/throttle`,
and `http://<ADDR>:<PORT>/release` are for setting and cancelling the throttling state for a given tenant, respectively.

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
    the resourceType = req.headers['resource_type'];
    const key = `${tenantId}${resourceType}`;

    hasResourceMap[key] = false;
    res.end('Throttled');

}
else if (pathname === '/release') {
    the tenantId = req.headers['tenant_id'];
    the resourceType = req.headers['resource_type'];
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