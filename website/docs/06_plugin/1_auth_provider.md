---
sidebar_position: 2
title: "Auth Provider"
---

# Auth Provider Plugin

The Auth Provider plugin adds authentication and authorization for MQTT clients and Pub/Sub actions to BifroMQ. 

The Plugin's interface is defined in the following Maven module:

```
<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-auth-provider</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with the latest version number-->
</dependency>
```

BifroMQ allows only a single instance of the Auth Provider to run at a time. You can configure the specific implementation class to be loaded through a configuration file by specifying its fully qualified name (FQN) using the following key:
```yaml
authProviderFQN: "YOUR_AUTH_PROVIDER_CLASS"
```


## Authentication

During the Connect phase, BifroMQ authenticates MQTT client connections for versions 3.1, 3.1.1, and 5.0. The plugin interface for authentication includes:

```java
// Authenticate MQTT 3.1 and 3.1.1 clients
CompletableFuture<MQTT3AuthResult> auth(MQTT3AuthData authData);

// Authenticate MQTT 5.0 clients
CompletableFuture<MQTT5AuthResult> auth(MQTT5AuthData authData);

// Enhanced authentication for MQTT 5.0 clients
CompletableFuture<MQTT5ExtendedAuthResult> extendedAuth(MQTT5ExtendedAuthData authData); 
```

The Auth Provider plugin requires efficient, non-blocking implementations for MQTT client authentication. BifroMQ supports two authentication methods for MQTT 5.0: basic and extended. If you don't implement basic mode for MQTT 5.0, the
plugin will default to using the authentication mechanisms for MQTT 3.1 and 3.1.1. However, extended mode authentication will not be available in this scenario.

Protobuf objects are used for interface methods’ arguments and return types.

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

Successful authentication returns an Ok structure with tenantId, userId, and optionally additional metadata in attrs, which is copied to ClientInfo. A Reject return indicates failure due to incorrect authentication
info (BadPass), unauthorized access (NotAuthorized), or internal errors (Error), detailed in optional fields.

## Authorization

BifroMQ checks permissions for Publish, Subscribe, and Unsubscribe actions with:

```java
CompletableFuture<CheckResult> checkPermission(ClientInfo client, MQTTAction action);
```

The `checkPermission` method efficiently processes authorization without blocking to ensure high performance. Importantly, it leverages ClientInfo received from successful authentication, including metadata that can be utilized for JWT-like
authentication and authorization mechanisms. This metadata, which contains authorization information similar to JWT claims, allows for flexible and secure access control strategies.

Moreover, the permission check method is agnostic to the MQTT client protocol version, ensuring consistent authorization enforcement across different MQTT versions.

For MQTT 5.0 clients, MQTTAction transparently passes UserProperties from the client's Control Packets. This feature enables the implementation of more sophisticated and custom authorization logic by allowing access to additional
client-provided information.

In cases where authorization fails for MQTT 5.0 clients, UserProperties included in the return result are relayed back to the client within the corresponding MQTT Control Packets' UserProperties. This capability facilitates problem
diagnosis by providing clients with feedback on the reason for authorization failure.

Implementers are encouraged to make the check method's implementation lightweight and non-blocking to avoid negatively impacting BifroMQ’s messaging performance. The arguments and return type are defined as Protobuf objects as well.

#### [ClientInfo](https://github.com/bifromqio/bifromq/blob/main/bifromq-common-type/src/main/proto/commontype/ClientInfo.proto)

```protobuf
message ClientInfo{
  string tenantId = 1;
  string type = 2; // the type of the calling client, e.g. "mqtt"  
  map<string, string> metadata = 3; // the metadata of the client
}
```

The predefined metadata in the `ClientInfo` object is crucial for understanding the context of each MQTT client connection. These constants help in identifying the protocol version, client and user IDs, and other details about the
connection. Here's a table summarizing these predefined metadata keys and their meanings:

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

These metadata fields are set automatically and provide essential information about the client and its connection. They are not overwritten by attributes (`attrs`) passed through from the authentication result.

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

## DevOnly Mode

The [DevOnlyAuthProvider](https://github.com/bifromqio/bifromq/blob/main/bifromq-server/src/main/java/com/baidu/bifromq/server/service/authprovider/DevOnlyAuthProvider.java) is used by default for development and testing when no AuthPlugin
type is specified. It bypasses client authentication and permission checks. DevOnly Mode is strictly for non-production environments due to its lack of security.