---
sidebar_position: 2
title: "Auth Provider"
---

The Auth Provider plugin enhances BifroMQ by integrating authentication and authorization functionalities for MQTT clients and Pub/Sub operations. The plugin's interface is detailed in the following Maven module:

```xml

<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-auth-provider</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with the latest version number-->
</dependency>
```

BifroMQ operates with only one instance of the Auth Provider at any given time. The specific class to be loaded can be configured in [configuration file](../07_admin_guide/01_configuration/1_config_file_manual.md) by specifying its Fully
Qualified Name (FQN):

```yaml
authProviderFQN: "YOUR_AUTH_PROVIDER_CLASS"
```

## Authentication

During the connection phase, BifroMQ invokes the Auth Provider Plugin's interface methods to authenticate MQTT client connections across versions 3.1, 3.1.1, and 5.0:

```java
// Authenticate MQTT 3.1 and 3.1.1 clients
CompletableFuture<MQTT3AuthResult> auth(MQTT3AuthData authData);

// Authenticate MQTT 5.0 clients
CompletableFuture<MQTT5AuthResult> auth(MQTT5AuthData authData);

// Enhanced authentication for MQTT 5.0 clients
CompletableFuture<MQTT5ExtendedAuthResult> extendedAuth(MQTT5ExtendedAuthData authData); 
```

It's crucial to ensure that the implementations of these interface methods are efficient and non-blocking to avoid negatively impacting connection performance. For MQTT 5.0, BifroMQ supports two methods of authentication: Basic and
Extended. The Basic authentication provides compatibility with MQTT 3 behavior by default.

Protobuf objects are utilized for the parameters and return types of these interface methods.

#### [MQTT3AuthData](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt3_auth_types.proto)

```protobuf
message MQTT3AuthData{
  bool isMQIsdp = 1; // true indicates the client is using MQTT 3.1
  optional string username = 2; // username specified by the client in Connect
  optional bytes password = 3; // password specified by the client in Connect
  optional bytes cert = 4; // TLS certificate used by the client in Base64 encoding
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

Successful authentication returns an Ok structure with tenantId, userId, and optionally additional metadata in attrs, which is copied to ClientInfo. A Reject return indicates failure due to incorrect authentication info (BadPass),
unauthorized access (NotAuthorized), or internal errors (Error), with detailed explanations in optional fields.

## Authorization

BifroMQ checks permissions for Publish, Subscribe, and Unsubscribe actions via:

```java
CompletableFuture<CheckResult> checkPermission(ClientInfo client, MQTTAction action);
```

Ensuring the `checkPermission` method's implementation is efficient and non-blocking is critical to prevent any negative impact on messaging performance. The method leverages ClientInfo with metadata returned from authentication, enabling
JWT-like authentication and authorization mechanisms. Additionally, the permission check method is not differentiated by the client's MQTT protocol version. However, for clients using MQTT 5.0, the MQTTAction object will contain
UserProperties from the Control Packets.

In cases of authorization failure for MQTT 5.0 clients, UserProperties included in the result are relayed back to the client within the corresponding MQTT Control Packets' UserProperties, aiding in problem diagnosis.

The checkPermission method's parameters and return type are also defined by Protobuf.

#### [ClientInfo](https://github.com/bifromqio/bifromq/blob/main/bifromq-common-type/src/main/proto/commontype/ClientInfo.proto)

```protobuf
message ClientInfo{
  string tenantId = 1;
  string type = 2; // the type of the calling client, e.g. "mqtt"  
  map<string, string> metadata = 3; // the metadata of the client
}
```

BifroMQ will include the following predefined metadata in the `metadata` property of the `ClientInfo` object:

| Key           | Description                                        | Possible Values                                      |
|---------------|----------------------------------------------------|------------------------------------------------------|
| `ver`         | MQTT protocol version                              | `"3"` (MQTT 3.1), `"4"` (MQTT 3.1.1), `"5"` (MQTT 5) |
| `userId`      | User ID                                            | User-defined string                                  |
| `clientId`    | Client ID                                          | User-defined string                                  |
| `channelId`   | Channel ID                                         | System-generated unique identifier                   |
| `address`     | Client address                                     | IP address or hostname of the client                 |
| `broker`      | Broker the client is connected to                  | Broker identifier                                    |
| `sessionType` | Type of session                                    | `"t"` (Transient), `"p"` (Persistent)                |
| `respInfo`    | Response information for MQTT 5.0 request/response | User-defined string                                  |

These metadata fields will not be overwritten by attributes (attrs) passed in the authentication result.

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

Because the two methods of the AuthProvider Plugin are frequently called during connection authentication and the process of handling message publication and subscription forwarding, BifroMQ records and outputs the following metrics to help
plugin implementers observe the performance indicators of the plugin interface methods:

| Metric Name            | Meter Type | Tag(`method`)        | Description                             |
|------------------------|------------|----------------------|-----------------------------------------|
| `call.exec.timer`      | TIMER      | AuthProvider/auth    | Latency for `auth` call                 |
| `call.exec.fail.count` | COUNTER    | AuthProvider/auth    | Fail counter for `auth` call            |
| `call.exec.timer`      | TIMER      | AuthProvider/extAuth | Latency for `extendedAuth` call         |
| `call.exec.fail.count` | COUNTER    | AuthProvider/extAuth | Fail counter for `extendedAuth` call    |
| `call.exec.timer`      | TIMER      | AuthProvider/check   | Latency for `checkPermission` call      |
| `call.exec.fail.count` | COUNTER    | AuthProvider/check   | Fail counter for `checkPermission` call |

## DevOnly Mode

By default, when no AuthPlugin type is specified, BifroMQ loads the [DevOnlyAuthProvider](https://github.com/bifromqio/bifromq/blob/main/bifromq-server/src/main/java/com/baidu/bifromq/server/service/authprovider/DevOnlyAuthProvider.java),
bypassing client authentication and permission checks. This mode is strictly for development and testing purposes due to its lack of security.

## Implementation Example

BifroMQ includes a demonstration implementation of a WebHook-based AuthProvider that can be enabled by specifying `authProviderFQN` as `com.baidu.demo.plugin.DemoAuthProvider` in
the [configuration file](../07_admin_guide/01_configuration/1_config_file_manual.md). The example implementation uses the JVM startup parameter (`-Dplugin.authprovider.url`) to specify a webhook callback URL.

When BifroMQ triggers the auth method, the plugin initializes an HTTP POST request. Within this request, we transform the protobuf message `MQTT3AuthData` into JSON format to serve as its body. The content of the response body is then interpreted and converted into the appropriate `MQTT3AuthResult` value type.

Below is a simple Node implementation of a WebhookServer for testing the example plugin, with webhook URLs: `http://<ADDR>:<PORT>/auth`, `http://<ADDR>:<PORT>/check` and `http://<ADDR>:<PORT>/register` for authentication, checking pub/sub permission and registering users' information,
respectively.


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

In this example, we simply convert the registered password to Base64 format for storage. Please choose a more secure and reliable method for handling it in actual usage.
