---
sidebar_position: 2
title: "Auth Provider"
---

# Auth Provider Plugin

Auth Provider插件旨在为BifroMQ运行时提供验证MQTT客户端连接和授权发布/订阅消息主题的能力。该插件的接口定义在以下Maven模块中：
```
<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-auth-provider</artifactId>
    <version>X.Y.Z</version> <!-- X.Y.Z 需替换成最新版本号-->
</dependency>
```

## 身份认证

MQTT客户端连接的认证是在连接阶段进行的。BifroMQ目前支持使用MQTT 3.1和3.1.1协议的客户端认证。该插件的回调接口如下：

```java
CompletableFuture<MQTT3AuthResult> auth(MQTT3AuthData authData);
```

实施者应该确保接口的实现是轻量级和非阻塞的，以避免对BifroMQ的连接性能产生负面影响。
[MQTT3AuthData](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt3_auth_types.proto)
和[MQTT3AuthResult](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt3_auth_types.proto)是Protobuf对象，定义如下：

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
  optional string reason = 2; // 可选描述
}

message MQTT3AuthResult {
  oneof Type{
    Ok ok = 1;
    Reject reject = 2;
  }
}
```

当客户端成功通过身份验证时，BifroMQ期望接口返回一个Ok结构体，包含以下字段：

* tenantId：表示客户端身份所属的租户标识符

* userId：表示客户端的标识符

拒绝（Reject）返回值表示身份验证失败。目前支持三个原因：

* BadPass：表示认证信息不正确。相关行为包括：：
  * MQTT客户端将收到 `0x04 Connection Refused, bad user name or password`。
  * 会产生一个`NOT_AUTHORIZED_CLIENT`事件。

* NotAuthorized：表示客户端身份确认，但不被授权连接，并对应以下行为
  * 应MQTT客户端将收到`0x05 Connection Refused, not authorized`
  * 产生`UNAUTHENTICATED_CLIENT`事件
  
* Error：其他认证过程中发生内部错误，额外错误信息可以通过reason可选字段补充，并对应以下行为
  * 对应MQTT客户端将收到`0x03 Connection Refused, Server unavailable`
  * 产生`AUTH_ERROR`事件，事件中包含reason中的内容

## 行为鉴权

BifroMQ目前支持对客户端操作（如发布、订阅和取消订阅）进行权限检查。插件的回调接口如下：

```java
CompletableFuture<Boolean> check(ClientInfo client,MQTTAction action);
```
实施者应确保接口实现轻量且非阻塞，以避免对BifroMQ的消息性能产生负面影响。

[ClientInfo](https://github.com/bifromqio/bifromq/blob/main/bifromq-common-type/src/main/proto/commontype/ClientInfo.proto)

与[MQTTAction](https://github.com/bifromqio/bifromq/blob/main/bifromq-plugin/bifromq-plugin-auth-provider/src/main/proto/mqtt_actions.proto)是Protobuf对象，定义如下：

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
    string tenantId = 1; // 与auth方法返回Ok结构中的tenantId一致
    string userId = 2; // 与auth方法返回Ok结构中的userId一致
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

check方法以异步方式返回一个布尔值；true表示授予权限，false表示拒绝。如果check方法以异常终止，则最终行为由运行时设置`ByPassPermissionCheck`来控制。默认情况下，该设置为true，这意味着如果check返回异常，BifroMQ将认为权限检查已通过。然而，BifroMQ始终会生成一个`ACCESS_CONTROL_ERROR`事件。

## DevOnly Mode

为了方便开发和测试，当未指定AuthPlugin实现类型时，BifroMQ使用默认的[DevOnlyAuthProvider](https://github.com/bifromqio/bifromq/blob/main/bifromq-server/src/main/java/com/baidu/bifromq/server/service/authprovider/DevOnlyAuthProvider.java)。该默认实现不对客户端进行身份验证或权限检查。

请注意，仅建议在开发和测试环境中使用DevOnly模式。在生产环境中绝不能使用它，因为它缺乏安全措施。
