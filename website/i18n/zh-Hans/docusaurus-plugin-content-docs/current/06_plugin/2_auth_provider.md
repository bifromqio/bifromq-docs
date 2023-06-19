---
sidebar_position: 2
title: "Auth Provider Plugin"
---

# Auth Provider Plugin

Auth Provider Plugin 用于向BifroMQ的运行时提供MQTT连接客户端身份认证与Pub/Sub消息主题鉴权的能力。Plugin的接口定义在以下Maven模块：

```
<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-auth-provider</artifactId>
    <version>X.Y.Z</version>
</dependency>
```

## 身份认证

MQTT连接客户端的身份认证发生在Connect阶段，BifroMQ目前支持对使用MQTT 3.1和3.1.1协议的客户端的身份认证，plugin的回调接口如下：

```java
 CompletableFuture<MQTT3AuthResult> auth(MQTT3AuthData authData);
```

实现方应尽可能保证接口实现的轻量和非阻塞，以免对BifroMQ的连接性能产生负面影响。
[MQTT3AuthData]((https://github.com/baidu/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt3_auth_types.proto))
与[MQTT3AuthResult]((https://github.com/baidu/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt3_auth_types.proto))是Protobuf对象，如下：

#### MQTT3AuthData

```protobuf
message MQTT3AuthData{
  bool isMQIsdp = 1; // true 表示客户端使用MQTT 3.1 
  optional string username = 2; // 客户端在Connect中指定的username
  optional bytes password = 3; // 客户端在Connect中指定的password
  optional bytes cert = 4; // 客户端使用的TLS连接证书
  optional string clientId = 5; // 客户端在Connect中指定的client identifier
  string remoteAddr = 6; // 客户端的源地址
  uint32 remotePort = 7; // 客户端的端口
  string channelId = 8; // 本次连接的全局唯一标识
}
```

#### MQTT3AuthResult

```protobuf
message Ok{
  string trafficId = 1;
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

当客户端身份认证通过时，BifroMQ期待接口返回Ok结构，结构包含的字段含义如下：

* trafficId: 客户端身份所属的租户标识
* userId：客户端对应的身份表示

接口返回Reject表示认证不通过，目前支持3种原因：

* BadPass：表示身份信息认证不通过，并对应以下行为
  * 对应MQTT客户端将收到`0x04 Connection Refused, bad user name or password`
  * 产生`NOT_AUTHORIZED_CLIENT`事件
* NotAuthorized：表示客户端身份确认，但不被授权连接，并对应以下行为
  * 应MQTT客户端将收到`0x05 Connection Refused, not authorized`
  * 产生`UNAUTHENTICATED_CLIENT`事件
* Error：其他认证过程中发生内部错误，额外错误信息可以通过reason可选字段补充，并对应以下行为
  * 对应MQTT客户端将收到`0x03 Connection Refused, Server unavailable`
  * 产生`AUTH_ERROR`事件，事件中包含reason中的内容

## 行为鉴权

BifroMQ目前支持对客户端的Publish, Subscribe, Unsubscribe的行为进行权限检查，plugin的回调接口如下：

```java
CompletableFuture<Boolean> check(ClientInfo client,MQTTAction action);
```

实现方应尽可能保证接口实现的轻量和非阻塞，以免对BifroMQ的消息性能产生负面影响。
[ClientInfo](https://github.com/baidu/bifromq/blob/main/bifromq-common-type/src/main/proto/commontype/ClientInfo.proto)
与[MQTTAction](https://github.com/baidu/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt_actions.proto)是Protobuf对象，定义如下：

#### ClientInfo

```protobuf
message MQTT3ClientInfo{
  bool isMQIsdp = 1; // true 表示客户端使用MQTT 3.1 
  string clientId = 2; // 客户端指定的clientId
  string ip = 3; // 客户端的源IP地址
  uint32 port = 4; // 客户端的端口
  string channelId = 5; // 客户端连接的全局唯一标识
}

message SysClientInfo{
  string type = 1;
}

message ClientInfo{
  string trafficId = 1; // 与auth方法返回Ok结构中的trafficId一致
  string userId = 2; // // 与auth方法返回Ok结构中的userId一致
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

check方法异步返回boolean值，true表示允许，false表示不允许。当check方法异常结束时，最终的结果由运行时Setting：ByPassPermissionCheck控制对应的行为，默认为true，表示当check返回异常时BifroMQ认为权限检查通过，但BifroMQ始终会产生`ACCESS_CONTROL_ERROR`事件。

## DevOnly Mode
为方便开发测试，当不指定加载在的AuthPlugin实现类型时，BifroMQ使用默认的[DevOnlyAuthProvider](https://github.com/baidu/bifromq/blob/main/bifromq-plugin-helper/bifromq-plugin-auth-provider-helper/src/main/java/com/baidu/bifromq/plugin/authprovider/DevOnlyAuthProvider.java)
，具体逻辑请参考源码