---
sidebar_position: 4
title: "Resource Throttler Plugin"
---

In BifroMQ's multi-tenant architecture, tenants share resources provided by a single cluster instance. To prevent resource overuse by any single tenant, it's essential to control each tenant's global resource usage in real time. Please note
that the premise for achieving resource non-contestation through tenant-level resource restrictions is the availability of surplus resources in the cluster during peak business times. Issues related to dynamic scaling based on business size
are beyond the scope of this topic.

Tenant-level global resource restrictions require real-time monitoring of each tenant's cluster resource usage, achieved through [Tenant-level Metrics](../07_admin_guide/03_observability/metrics/tenantmetrics.md). These metrics include Gauge,
Counter, and Summary indicators for measuring resources in terms of magnitude and rate.

The Plugin's interface is defined in the following Maven module:

```
<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-resource-throttler</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with the latest version number-->
</dependency>
```

BifroMQ allows only a single instance of the Resource Throttler to run at a time. You can configure the specific implementation class to be loaded through a configuration file by specifying its fully qualified name (FQN) using the following key:
```yaml
resourceThrottlerFQN: "YOUR_SETTING_PROVIDER_CLASS"
```


## Plugin Interface

The ResourceThrottlingPlugin interface is straightforward with one method. Implementations must be non-blocking and low-latency to avoid impacting BifroMQ performance. Given that this method is invoked frequently while managing traffic from
specific tenants, exceeding resource limits (when the method returns false) triggers a predefined denial action. Additionally, a ResourceThrottling event is generated and reported to the [Event Collector Plugin](2_event_collector.md).

```java
public boolean hasResource(String tenantId, ResourceType type);
```

Here's a table documenting the `TenantResourceType` enum values from the Java code provided:

| Enum Value                             | Description                               |
|----------------------------------------|-------------------------------------------|
| `TotalConnections`                     | Total number of connections               |
| `TotalSessionMemoryBytes`              | Total session memory in bytes             |
| `TotalPersistentSessions`              | Total number of persistent sessions       |
| `TotalPersistentSessionSpaceBytes`     | Total persistent session space in bytes   |
| `TotalSharedSubscriptions`             | Total number of shared subscriptions      |
| `TotalTransientSubscriptions`          | Total number of transient subscriptions   |
| `TotalPersistentSubscriptions`         | Total number of persistent subscriptions  |
| `TotalRetainMessageSpaceBytes`         | Total retain message space in bytes       |
| `TotalRetainTopics`                    | Total number of retain topics             |
| `TotalConnectPerSecond`                | Total connections per second              |
| `TotalInboundBytesPerSecond`           | Total inbound bytes per second            |
| `TotalTransientSubscribePerSecond`     | Total transient subscribes per second     |
| `TotalPersistentSubscribePerSecond`    | Total persistent subscribes per second    |
| `TotalTransientUnsubscribePerSecond`   | Total transient unsubscribes per second   |
| `TotalPersistentUnsubscribePerSecond`  | Total persistent unsubscribes per second  |
| `TotalTransientFanOutBytesPerSeconds`  | Total transient fan out bytes per second  |
| `TotalPersistentFanOutBytesPerSeconds` | Total persistent fan out bytes per second |
| `TotalRetainedMessagesPerSeconds`      | Total retained messages per second        |
| `TotalRetainedBytesPerSecond`          | Total retained bytes per second           |
| `TotalRetainMatchPerSeconds`           | Total retain matches per second           |
| `TotalRetainMatchBytesPerSecond`       | Total retain match bytes per second       |

These enum values represent the types of resources that can be throttled in a multi-tenant BifroMQ setup, helping to manage and limit the usage of cluster resources effectively.

## Implementation Considerations

Multi-tenant service implementers need to address several key considerations to effectively manage resource usage and ensure fair access across tenants. These include:

1. **Collection and Aggregation of Tenant Metrics:** Develop a system for collecting tenant-specific metrics to form a real-time resource view for each tenant. This involves tracking various metrics such as connection counts, memory usage,
   message rates, and more. The challenge lies in aggregating these metrics efficiently and updating the per-tenant resource view in real time, providing a clear picture of each tenant's current resource consumption.

2. **Resource Limitation Decision Making:** Based on the real-time resource view, implement a decision-making process to determine when a tenant's resource usage exceeds set limits. This process should consider historical data, current
   usage trends, and predefined thresholds to make informed decisions about resource restrictions. The goal is to preemptively identify and mitigate potential resource contention before it impacts the system's performance or fairness.

3. **Non-blocking Decision Implementation in Plugin Interface:** Once a decision to limit a tenant's resources is made, it must be applied immediately and without blocking system operations. This requires the resource throttling decision to
   be reflected in the plugin interface's return values in a non-blocking manner. Implementing an efficient, asynchronous mechanism to communicate these decisions to the BifroMQ system ensures that resource limits are enforced in real time,
   preventing any tenant from monopolizing shared resources.

## Bundled Demo Implementation

BifroMQ includes a bundled demonstration of the ResourceThrottlerPlugin, which operates via a webhook mechanism. This demo plugin can be activated within the BifroMQ configuration file by uncommenting the following line: #
resourceThrottlerFQN: "com.baidu.demo.plugin.DemoResourceThrottler". This implementation leverages a JVM startup argument (-Dplugin.resourcethrottler.url) to specify a callback URL for the webhook.

When the hasResource method is invoked, it initiates a GET request that includes tenant_id and resource_type as headers, corresponding to the parameters of the hasResource method call. If the GET request has not returned a response,
hasResource will consistently return true, ensuring that processing is not blocked by the request.

The results of the GET request are cached for 60 seconds and are refreshed at a frequency of once per second. The return value of the GET request is parsed into a boolean value, which becomes the return value of the hasResource method.

The following is a sample webhook server implementation in Node.js, which can be used to test the bundled demo plugin by specifying additional JVM startup arguments when starting
BifroMQ: `-Dplugin.resourcethrottler.url=http://<ADDR>:<PORT>/query`

```
// map for keeping throttling state
const hasResourceMap = {};

// Get the bound address and port from command line arguments
const args = process.argv.slice(2);
const hostname = args[0] || 'localhost'; // Default binding to localhost
const port = args[1] || 0; // Default to using a system-assigned temporary port

const server = http.createServer((req, res) => {

const parsedUrl = url.parse(req.url, true); 
const pathname = parsedUrl.pathname;

// Set basic response headers
res.setHeader('Content-Type', 'text/plain');

// Handle query interface
if (pathname === '/query') {
    const tenantId = req.headers['tenant_id'];
    const resourceType = req.headers['resource_type'];
    const key = `${tenantId}${resourceType}`;

    const exists = key in hasResourceMap ? hasResourceMap[key] : true;
    res.end(`${exists}`);

}
// Handle adding record interface
else if (pathname === '/throttle') {
    const tenantId = req.headers['tenant_id'];
    const resourceType = req.headers['resource_type'];
    const key = `${tenantId}${resourceType}`;

    // Add record to Map, here we record false as an example
    hasResourceMap[key] = false;
    res.end('Throttled');

}
else if (pathname === '/release') {
    const tenantId = req.headers['tenant_id'];
    const resourceType = req.headers['resource_type'];
    const key = `${tenantId}${resourceType}`;

    // Remove the record from Map, as an example of releasing the throttle
    delete hasResourceMap[key];
    res.end('Released');

}
// Handle invalid paths
else {
    res.statusCode = 404;
    res.end('Not Found');
}
});

server.listen(port, hostname, () => {
    console.log(`Server listening on port ${server.address().port} from address ${server.address().address}`);
});
```


