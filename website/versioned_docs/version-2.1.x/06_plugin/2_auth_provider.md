---
sidebar_position: 2
title: "Auth Provider"
---

# Auth Provider Plugin

The Auth Provider plugin is designed to provide BifroMQ runtime with the capability to authenticate MQTT client connections and authorize Pub/Sub message topics. The interface for the plugin is defined in the following Maven module:

```
<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-auth-provider</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with the latest version number-->
</dependency>
```

## Authentication

The authentication of MQTT client connections takes place during the Connect phase. BifroMQ currently supports authentication for clients using the MQTT 3.1 and 3.1.1 protocols. The plugin’s callback interface is as follows:

```java
CompletableFuture<MQTT3AuthResult> auth(MQTT3AuthData authData);
```

Implementers should ensure that the interface implementation is lightweight and non-blocking to avoid negatively affecting the connection performance of BifroMQ.
[MQTT3AuthData](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt3_auth_types.proto)
and [MQTT3AuthResult](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt3_auth_types.proto) are Protobuf objects, defined as follows:

#### MQTT3AuthData

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

#### MQTT3AuthResult

```protobuf
message Ok{
  string tenantId = 1;
  string userId = 2;
}

message Reject{
  enum Code {
    BadPass = 0;
    NotAuthorized = 1;
    Error = 2;
  }
  Code code = 1;
  optional string reason = 2; // optional description
}

message MQTT3AuthResult {
  oneof Type{
    Ok ok = 1;
    Reject reject = 2;
  }
}
```

When the client is authenticated successfully, BifroMQ expects the interface to return an Ok structure, with the following fields:

* tenantId: Tenant identifier to which the client's identity belongs
* userId: Identifier representing the client

A Reject return value indicates that the authentication failed. There are currently three supported reasons:

* BadPass: Indicates that authentication information is incorrect. The associated behavior includes:
    * The MQTT client will receive `0x04 Connection Refused, bad user name or password`
    * A `NOT_AUTHORIZED_CLIENT` event is generated
* NotAuthorized: Indicates that the client is identified, but not authorized to connect. The associated behavior includes:
    * The MQTT client will receive `0x05 Connection Refused, not authorized`
    * A `UNAUTHENTICATED_CLIENT` event is generated
* Error: Other internal errors occurring during the authentication process. Additional error information can be provided through the optional reason field. The associated behavior includes:
    * The MQTT client will receive `0x03 Connection Refused, Server unavailable`
    * An `AUTH_ERROR` event is generated, containing the content within the reason field

## Authorization

BifroMQ currently supports permission checks for client actions such as Publish, Subscribe, and Unsubscribe. The plugin’s callback interface is as follows:

```java
CompletableFuture<Boolean> check(ClientInfo client,MQTTAction action);
```

Implementers should ensure that the interface implementation is lightweight and non-blocking to avoid negatively affecting BifroMQ’s messaging performance.
[ClientInfo](https://github.com/bifromqio/bifromq/blob/main/bifromq-common-type/src/main/proto/commontype/ClientInfo.proto)
and [MQTTAction](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt_actions.proto) are Protobuf objects, defined as follows:

#### ClientInfo

```protobuf
message MQTT3ClientInfo{
  bool isMQIsdp = 1; // true indicates the client is using MQTT 3.1
  string clientId = 2; // clientId specified by the client
  string ip = 3; // source IP address of the client
  uint32 port = 4; // port of the client
  string channelId = 5; // globally unique identifier for the client connection
}

message SysClientInfo{
  string type = 1;
}

message ClientInfo{
  string tenantId = 1; // consistent with the tenantId in the Ok structure returned by the auth method
  string userId = 2; // consistent with the userId in the Ok structure returned by the auth method
  oneof client_type{
    SysClientInfo sysClientInfo = 3;
    MQTT3ClientInfo mqtt3ClientInfo = 4;
  }
}
```

#### MQTTAction

```protobuf
message PubAction {
  string topic = 1;
  commontype.QoS qos = 2;
  bool isRetained = 3;
}

message SubAction {
  string topicFilter = 1;
  commontype.QoS qos = 2;
}

message UnsubAction {
  string topicFilter = 1;
}

message MQTTAction {
  oneof Type{
    PubAction pub = 1;
    SubAction sub = 2;
    UnsubAction unsub = 3;
  }
}
```

The check method returns a boolean value asynchronously; true indicates permission granted, while false indicates denied. If the check method terminates with an exception, the final behavior is controlled by the runtime
setting `ByPassPermissionCheck`. By default, this setting is true, which means that if check returns an exception, BifroMQ considers the permission check to be passed. However, BifroMQ will always generate an `ACCESS_CONTROL_ERROR` event.

## DevOnly Mode

For ease of development and testing, when an AuthPlugin implementation type is not specified, BifroMQ uses the
default [DevOnlyAuthProvider](https://github.com/bifromqio/bifromq/blob/main/bifromq-server/src/main/java/com/baidu/bifromq/server/service/authprovider/DevOnlyAuthProvider.java). This default implementation does not authenticate the client or
check permissions.

Note that the DevOnly Mode is only recommended for development and testing environments. It should never be used in a production environment, as it lacks security measures.
   
