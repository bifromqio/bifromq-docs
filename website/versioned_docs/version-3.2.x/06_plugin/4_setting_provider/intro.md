---
id: "intro"
sidebar_position: 0
title: "Setting Provider"
---

BifroMQ defines a category of [Tenant-level Settings](1_tenantsetting.md) that can be modified at runtime, allowing for dynamic adjustment of BifroMQ's service behavior per tenant. The purpose of the Setting Provider Plugin is to supply
custom values for these settings at runtime.

The Plugin's interface is defined in the following Maven module:

```xml

<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-setting-provider</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with latest version number-->
</dependency>
```

BifroMQ allows only a single instance of the Setting Provider to run at a time. You can configure the specific implementation class to be loaded through a configuration file by specifying its fully qualified name (FQN) using the following
key:

```yaml
settingProviderFQN: "YOUR_SETTING_PROVIDER_CLASS"
```

## Initial Values and Validation of Settings

Each Setting has an initial value, for example, MaxTopicLength has an initial value of 255 and is validated to be an integer between 0 and 65535. A Setting’s initial value can be overridden by a System Property of the same name, for
example, adding `-DMaxTopicLength=128` to the JVM launch parameters of BifroMQ. Note that the initial value passed through the System Property must be correctly parsed to the corresponding data type, otherwise, the override will not be
successful.

## Updating Current Value of Setting

BifroMQ updates the current value of a Setting by invoking the SettingProvider Plugin's `provide` method. The signature of the provide method is as follows:

```java
public <R> R provide(Setting setting, String tenantId);
```

This method is called by BifroMQ's thread pool, hence when implementing the Setting Provider Plugin, keep the following in mind:

1. Avoid including heavy business logic within the provide method to ensure it returns quickly, as this can otherwise negatively impact BifroMQ's performance.
2. When it is not possible to quickly determine the value of a Setting, it can return `null`, in which case the Setting will continue to use its current value. This allows for the decision logic for the Setting to be made asynchronous.

## Cache Behavior

The values of Settings for different tenants are cached to reduce the number of calls to the Setting Provider. The following JVM system properties control the caching behavior to balance the immediacy of runtime settings with the load of
requests:

| System Property Name         | Default Value | Description                                                                                                        |
|------------------------------|---------------|--------------------------------------------------------------------------------------------------------------------|
| `setting_provide_init_value` | false         | Determines whether to call `provide` to populate the cache on a cache miss. By default, the initial value is used. |
| `setting_refresh_seconds`    | 5             | The interval, in seconds, between refreshes of a cached setting.                                                   |
| `setting_expire_seconds`     | 300           | The expiration time, in seconds, of a setting in the cache.                                                        |
| `setting_tenant_cache_limit` | 100           | The maximum number of tenants' values that can be cached.                                                          |

**Note:** Enabling `setting_provide_init_value` could potentially block BifroMQ's working threads and cause performance issues if the `provide` method is slow.

## Metrics

Because the `provide` method is frequently called, BifroMQ records and outputs the following metrics to help
plugin implementers observe the performance indicators of the plugin interface methods:

| Metric Name            | Meter Type | Tag(`method`)           | Description                     |
|------------------------|------------|-------------------------|---------------------------------|
| `call.exec.timer`      | TIMER      | SettingProvider/provide | Latency for `provide` call      |
| `call.exec.fail.count` | COUNTER    | SettingProvider/provide | Fail counter for `provide` call |

## Implementation Example

BifroMQ includes a demonstration implementation of a WebHook-based SettingProvider that can be enabled by specifying `settingProviderFQN` as `com.baidu.demo.plugin.DemoSettingProvider` in
the [configuration file](../../07_admin_guide/01_configuration/intro.md). The example implementation uses the JVM startup parameter (`-Dplugin.settingprovider.url`) to specify a webhook callback URL.

When BifroMQ calls the `provide` method, the plugin initiates an HTTP GET request containing the `tenant_id` and `setting_name` headers, corresponding to the two parameters of the `provide` method. The string contained in the response body
is parsed into the corresponding Setting value type as the return value.

Below is a simple Node implementation of a WebhookServer for testing the example plugin, with webhook URLs: `http://<ADDR>:<PORT>/query` and `http://<ADDR>:<PORT>/provide` for querying and setting runtime Settings for a given tenant,
respectively.

```js
const http = require('http');
const url = require('url'); 

const settingMap = {};
const server =

 http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  the pathname = parsedUrl.pathname;

  res.setHeader('Content-Type', 'text/plain');

  if (pathname === '/query') {
    const tenantId = req.headers['tenant_id'];
    the settingName = req.headers['setting_name'];
    const key = `${tenantId}${settingName}`;
    if (key in settingMap) {
      res.end(`${settingMap[key]}`);
    } else {
      res.statusCode = 404;
      res.end("");
    }
  }
  else if (pathname === '/provide') {
    const tenantId = req.headers['tenant_id'];
    the settingName = req.headers['setting_name'];
    const key = `${tenantId}${settingName}`;

    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      settingMap[key] = body;
      res.end('OK');
    });
  }
  else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const args = process.argv.slice(2);
const hostname = args[0] || 'localhost'; 
const port = args[1] || 3000; 

server.listen(port, hostname, () => {
  console.log(`Server listening on port ${server.address().port} at ${server.address().address}`);
});
```