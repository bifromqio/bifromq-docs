---
sidebar_position: 2
title: "Auth Provider"
---

Auth Provider插件为BifroMQ添加了MQTT客户端和Pub/Sub操作的认证与授权功能。
插件接口定义在以下Maven模块中：

```
<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-auth-provider</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with the latest version number-->
</dependency>
```

BifroMQ一次只允许运行一个Auth Provider实例。需要通过[配置文件](../07_admin_guide/01_configuration/1_config_file_manual.md)指定实现类的完全限定名（FQN）：

```yaml
authProviderFQN: "YOUR_AUTH_PROVIDER_CLASS"
```

## 认证

在连接阶段，BifroMQ会回调Auth Provider Plugin的接口方法对3.1、3.1.1和5.0版本的MQTT客户端连接进行认证：

```java
// Authenticate MQTT 3.1 and 3.1.1 clients
CompletableFuture<MQTT3AuthResult> auth(MQTT3AuthData authData);

// Authenticate MQTT 5.0 clients
CompletableFuture<MQTT5AuthResult> auth(MQTT5AuthData authData);

// Enhanced authentication for MQTT 5.0 clients
CompletableFuture<MQTT5ExtendedAuthResult> extendedAuth(MQTT5ExtendedAuthData authData); 
```

务必确保接口方法实现的高效和非阻塞，避免对连接性能造成负面影响。针对MQTT 5.0，BifroMQ支持两种认证方法：Basic和Extended。Basic认证提供兼容MQTT3的默认行为。

接口方法的参数和返回类型使用Protobuf对象。

#### [MQTT3AuthData](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt3_auth_types.proto)

```protobuf
message MQTT3AuthData{
  bool isMQIsdp = 1; // true indicates the client is using MQTT 3.1
  optional string username = 2; // username specified by the client in Connect
  optional bytes password = 3; // password specified by the client in Connect
  optional bytes cert = 4; // TLS certificate used by the client
  optional string clientId = 5; // client identifier specified by the client in Connect
  string remoteAddr = 6; // source address of the client
  uint32 remotePort = 7; // port of the client
  string channelId = 8; // globally unique identifier for this connection
}
```

#### [MQTT3AuthResult](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt3_auth_types.proto)

```protobuf
message Ok{
  string tenantId = 1;
  string userId = 2;
  map<string, string> attrs = 3; // additional attributes filled by auth provider plugin which will be copied to ClientInfo
}

message Reject{
  enum Code {
    BadPass = 0;
    NotAuthorized = 1;
    Error = 2;
  }
  Code code = 1;
  optional string tenantId = 2; // optional if tenant can be determined
  optional string userId = 3; // optional if user can be determined
  optional string reason = 4; // optional description}

  message MQTT3AuthResult {
    oneof Type{
      Ok ok = 1;
      Reject reject = 2;
    }
  }
```

#### [MQTT5AuthData](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt5_auth_types.proto) and [MQTT5ExtendedAuthData](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt5_auth_types.proto)

```protobuf
message MQTT5AuthData{
  optional string username = 1;
  optional bytes password = 2;
  optional bytes cert = 3;
  optional string clientId = 4;
  string remoteAddr = 5;
  uint32 remotePort = 6;
  string channelId = 7;
  bool responseInfo = 8; // for MQTT5 request/response use case
  commontype.UserProperties userProps = 9;
}

message MQTT5ExtendedAuthData{
  message Initial{
    MQTT5AuthData basic = 1;
    string authMethod = 2;
    bytes authData = 3;
  }
  message Auth{
    string authMethod = 1;
    bytes authData = 2;
    commontype.UserProperties userProps = 3;
    bool isReAuth = 4;
  }
  oneof Type{
    Initial initial = 1;
    Auth auth = 2;
  }
}
```

#### [MQTT5AuthResult](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt5_auth_types.proto) and [MQTT5ExtendedAuthResult](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt5_auth_types.proto)

```protobuf
message Success{
  string tenantId = 1;
  string userId = 2;
  map<string, string> attrs = 3; // additional attributes filled by auth provider plugin which will be copied to ClientInfo
  optional string ResponseInfo = 4; // for mqtt5 request/response use case
  commontype.UserProperties userProps = 5; // user properties return back via mqtt5 connack
}

message Failed{
  enum Code {
    BadPass = 0;
    NotAuthorized = 1;
    Banned = 2;
    BadAuthMethod = 3;
    Error = 4;
  }
  Code code = 1;
  optional string tenantId = 2; // optional if tenant can be determined
  optional string userId = 3; // optional if user can be determined
  optional string reason = 4; // optional description
  commontype.UserProperties userProps = 5; // user properties return back via mqtt5 connack
}

message Continue{
  bytes authData = 1;
  optional string tenantId = 2; // optional if tenant can be determined
  optional string userId = 3; // optional if user can be determined
  optional string reason = 4;
  commontype.UserProperties userProps = 5;
}

message MQTT5AuthResult {
  oneof Type{
    Success success = 1;
    Failed failed = 2;
  }
}

message MQTT5ExtendedAuthResult {
  oneof Type{
    Success success = 1;
    Continue continue = 2;
    Failed failed = 3;
  }
}
```

认证成功需返回一个Ok结构，包含tenantId、userId和额外的元数据attrs，元数据(如果有的话)将被复制到ClientInfo中；返回Reject表示不通过，结合Code字段表示失败原因认证信息不正确（BadPass）、未授权访问（NotAuthorized）或内部错误（Error），详细信息在可选字段中说明。

## 鉴权

BifroMQ通过以下接口方法检查发布、订阅和取消订阅操作的权限：

```java
CompletableFuture<CheckResult> checkPermission(ClientInfo client, MQTTAction action);
```

确保`checkPermission`方法实现的高效和非阻塞，避免对消息性能产生负面影响。方法传入的ClientInfo对象包含认证返回的元数据，利用它可以实现类似JWT的认证和鉴权机制。此外，权限检查方法不按客户端使用的MQTT协议版本区分。但对于使用MQTT
5.0连接的客户端，MQTTAction对象会包含Control Packets中的UserProperties。

在MQTT 5.0客户端授权失败的情况下，返回结果中包含的UserProperties将被回传给客户端，包含在相应的MQTT Control Packets的UserProperties中，有助于问题诊断。

`checkPermission`方法的参数和返回类型也由Protobuf定义。

#### [ClientInfo](https://github.com/bifromqio/bifromq/blob/main/bifromq-common-type/src/main/proto/commontype/ClientInfo.proto)

```protobuf
message ClientInfo{
  string tenantId = 1;
  string type = 2; // the type of the calling client, e.g. "mqtt"  
  map<string, string> metadata = 3; // the metadata of the client
}
```

BifroMQ会在`ClientInfo`对象的metadata属性中包含以下预定义的元数据：

| Key           | Description                                        | Possible Values                                      |
|---------------|----------------------------------------------------|------------------------------------------------------|
| `ver`         | MQTT protocol version                              | `"3"` (MQTT 3.1), `"4"` (MQTT 3.1.1), `"5"` (MQTT 5) |
| `userId`      | User ID                                            | User-defined string                                  |
| `clientId`    | Client ID                                          | User-defined string                                  |
| `channelId`   | Channel ID                                         | System-generated unique identifier                   |
| `address`     | Client address                                     | IP address or hostname of the client                 |
| `broker`      | Broker the client is connected to                  | Broker server identifier                             |
| `sessionType` | Type of session                                    | `"t"` (Transient), `"p"` (Persistent)                |
| `respInfo`    | Response information for MQTT 5.0 request/response | User-defined string                                  |

这些元数据字段不会被认证结果中传递的属性（attrs）覆盖。

#### [MQTTAction](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt_actions.proto)

```protobuf
message PubAction {
  string topic = 1;
  commontype.QoS qos = 2;
  bool isRetained = 3;
  commontype.UserProperties userProps = 4;
}

message SubAction {
  string topicFilter = 1;
  commontype.QoS qos = 2;
  commontype.UserProperties userProps = 5;
}

message UnsubAction {
  string topicFilter = 1;
  commontype.UserProperties userProps = 2;
}

message MQTTAction {
  oneof Type{
    PubAction pub = 1;
    SubAction sub = 2;
    UnsubAction unsub = 3;
  }
}
```

#### [CheckResult](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt_actions.proto)

```protobuf
message Granted{
  commontype.UserProperties userProps = 1; // user properties return back via mqtt5 pubAck/pubRel
}

message Denied{
  optional string reason = 1;
  commontype.UserProperties userProps = 2; // user properties return back via mqtt5 pubAck/pubRel or disconnect in case QoS0
}

message Error{
  optional string reason = 1;
  commontype.UserProperties userProps = 2; // user properties return back via mqtt5 pubAck/pubRel or disconnect in case QoS0
}

message CheckResult {
  oneof Type{
    Granted granted = 1;
    Denied denied = 2;
    Error error = 3;
  }
}
```

## Metrics

因为AuthProvider插件的两个方法在连接认证以及处理消息发布和订阅转发的过程中会被频繁调用，BifroMQ记录并输出以下指标，以帮助插件实现者观察插件接口方法的性能指标：
| Metric Name | Meter Type | Tag(`method`)        | Description |
|------------------------|------------|----------------------|-----------------------------------------|
| `call.exec.timer`      | TIMER | AuthProvider/auth | Latency for `auth` call |
| `call.exec.fail.count` | COUNTER | AuthProvider/auth | Fail counter for `auth` call |
| `call.exec.timer`      | TIMER | AuthProvider/extAuth | Latency for `extendedAuth` call |
| `call.exec.fail.count` | COUNTER | AuthProvider/extAuth | Fail counter for `extendedAuth` call |
| `call.exec.timer`      | TIMER | AuthProvider/check | Latency for `checkPermission` call |
| `call.exec.fail.count` | COUNTER | AuthProvider/check | Fail counter for `checkPermission` call |

## DevOnly Mode

当未指定AuthPlugin类型时，BifroMQ会默认加载[DevOnlyAuthProvider](https://github.com/bifromqio/bifromq/blob/main/bifromq-server/src/main/java/com/baidu/bifromq/server/service/authprovider/DevOnlyAuthProvider.java)
。DevOnlyAuthProvider会绕过了客户端认证和权限检查，因此仅用于测试和开发的目的。

## 实现范例

BifroMQ包含了一个基于WebHook的AuthProvider的示范实现，可以通过在[配置文件](../07_admin_guide/01_configuration/1_config_file_manual.md)中指定`authProviderFQN`为`com.baidu.demo.plugin.DemoAuthProvider`启用。范例实现利用JVM启动参数(
`-Dplugin.authprovider.url`)来指定一个webhook的回调URL。

当BifroMQ调用`auth`方法时，插件会发起一个HTTP POST请求，在这个请求中，我们将其body设置为`MQTT3AuthData`的JSON格式。响应Body内包含的字符串被解析成对应的`MQTT3AuthResult`值类型作为返回值。

以下是一个Node实现的简单的WebhookServer用于测试示例插件，webhook的url地址为：`http://<ADDR>:<PORT>/auth`，`http://<ADDR>:<PORT>/check`，`http://<ADDR>:<PORT>/register`分别用于用户身份认证、sub/pub权限许可认证、注册用户信息。

```js
const http = require('http');
const url = require('url'); 

const authMap = {};
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  res.setHeader('Content-Type', 'text/plain');

  if (pathname === '/auth') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      let data = {}
      try {
        data = JSON.parse(body);
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
      }
      if (data.username && data.password) {
        const user = authMap[data.username];
        if (user && user.password === data.password) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ "ok": { "tenantId": user.tenantId, "userId": data.username} }));
        } else {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ "reject": "NotAuthorized" }));
        }
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing username or password');
      }
    });
  } else if (pathname === '/check') {
    if (!req.method === 'POST') {
      res.writeHead(404);
    }
    const tenantId = req.headers['tenant_id'];
    const userId = req.headers['user_id'];
    if (tenantId && userId) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      if (userId in authMap) {
        res.end("true");
      } else {
        res.end("false");
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end("Missing user_id or tenant_id");
    }
  } else if (pathname === '/register') {
    const tenantId = req.headers['tenant_id'];
    const userId = req.headers['user_id'];
    const password = req.headers['password'];

    if (tenantId && userId && password) {
      if (!authMap[userId]) {
        authMap[userId] = {
          password: btoa(password),
          tenantId: tenantId
        };
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("User registered successfully");
      } else {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end("User already exists");
      }
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end("Missing user_id, password or tenant_id");
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const args = process.argv.slice(2);
const hostname = args[0] || 'localhost';
const port = args[1] || 3000;

server.listen(port, hostname, () => {
  console.log(`Server listening on port ${server.address().port}`);
});

```

请注意，这个示例里我们只是简单的将注册的密码转换为Base64格式进行存储，在实际使用时请选择更为安全稳妥的处理方式。