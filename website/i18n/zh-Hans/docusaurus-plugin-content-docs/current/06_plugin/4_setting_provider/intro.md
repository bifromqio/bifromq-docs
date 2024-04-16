---
id: "intro"
sidebar_position: 0
title: "Setting Provider"
---

BifroMQ定义了一类租户级[设置](1_tenantsetting.md)(Settings)，允许在运行时修改，从而实现针对单个租户动态调整BifroMQ的服务行为。Setting Provider Plugin的目的是在运行时为这些设置提供自定义值。

插件的接口定义在以下Maven模块中：

```xml

<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-setting-provider</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with the latest version number-->
</dependency>
```

BifroMQ只允许运行一个Setting Provider实例。需要在配置文件指定要加载的具体实现类的完全限定名（FQN）：

```yaml
settingProviderFQN: "YOUR_SETTING_PROVIDER_CLASS"
```

## 设置的初始值和验证

每个设置都有一个初始值，例如，MaxTopicLength的初始值为255，并验证为介于0和65535之间的整数。可以通过与同名的系统属性覆盖设置的初始值，例如，在BifroMQ的JVM启动参数中添加`-DMaxTopicLength=128`。请注意，通过系统属性传递的初始值必须正确解析为相应的数据类型，否则覆盖将不会成功。

## 更新设置的当前值

BifroMQ通过调用SettingProvider插件的`provide`方法来更新设置的当前值。provide方法的签名如下：

```java
public <R> R provide(Setting setting, String tenantId);
```

此方法将由BifroMQ的线程池调用，因此在实现Setting Provider Plugin时需要牢记以下两点：

1. 避免在provide方法中包含繁重的业务逻辑，以确保它能够快速返回，否则会对BifroMQ的性能产生负面影响。
2. 当无法快速确定设置的值时，可以返回`null`，此时设置将继续使用其当前值。插件实现可以将多个Setting的请求聚合后异步处理。

## 缓存行为

不同Tenant的Setting值会被缓存，以减少对Setting Provider的调用次数。以下JVM系统属性用于控制缓存的行为，已达到运行时设置的即时性与请求负载的平衡：

| System Property Name         | Default Value | Description                                                                                                        |
|------------------------------|---------------|--------------------------------------------------------------------------------------------------------------------|
| `setting_provide_init_value` | false         | Determines whether to call `provide` to populate the cache on a cache miss. By default, the initial value is used. |
| `setting_refresh_seconds`    | 5             | The interval, in seconds, between refreshes of a cached setting.                                                   |
| `setting_expire_seconds`     | 300           | The expiration time, in seconds, of a setting in the cache.                                                        |
| `setting_tenant_cache_limit` | 100           | The maximum number of tenants' values that can be cached.                                                          |

**注意:** 如果 `provide` 方法执行缓慢，启用 `setting_provide_init_value` 可能会阻塞 BifroMQ 的工作线程并导致性能问题。

## Metrics

BifroMQ记录并输出以下指标，以帮助插件实现者观察插件接口方法的性能指标：

| Metric Name            | Meter Type | Tag(`method`)           | Description                     |
|------------------------|------------|-------------------------|---------------------------------|
| `call.exec.timer`      | TIMER      | SettingProvider/provide | Latency for `provide` call      |
| `call.exec.fail.count` | COUNTER    | SettingProvider/provide | Fail counter for `provide` call |

## 实现范例

BifroMQ包含了一个基于WebHook的SettingProvider的示范实现，可以通过在[配置文件](../../07_admin_guide/01_configuration/1_config_file_manual.md)中指定`settingProviderFQN`为`com.baidu.demo.plugin.DemoSettingProvider`启用。范例实现利用JVM启动参数(
`-Dplugin.settingprovider.url`)来指定一个webhook的回调URL。

当BifroMQ调用`provide`方法时，插件会发起一个包含tenant_id和setting_name header的HTTP GET请求，对应于`provide`方法的两个调用的参数。响应Body内包含的字符串被解析成对应的Setting值类型作为返回值。

以下是一个Node实现的简单的WebhookServer用于测试示例插件，webhook的url地址为：`http://<ADDR>:<PORT>/query`，`http://<ADDR>:<PORT>/provide`分别用于查询和设置给定租户的运行时Setting。

```js
const http = require('http');
const url = require('url'); 

const settingMap = {};
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Content-Type', 'text/plain');

  if (pathname === '/query') {
    const tenantId = req.headers['tenant_id'];
    const settingName = req.headers['setting_name'];
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
    const settingName = req.headers['setting_name'];
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