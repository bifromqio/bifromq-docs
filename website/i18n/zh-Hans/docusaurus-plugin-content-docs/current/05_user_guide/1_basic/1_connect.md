---
sidebar_position: 1
title: "连接至BifroMQ"
---

BifroMQ是一款标准的MQTT消息中间件，支持使用任何兼容MQTT 3.1、3.1.1或5.0版本的客户端进行连接。

## 连接地址
使用已启动服务的IP地址或域名。下面是默认端口及其用途：

| 端口                     | 说明           |
|-------------------------|----------------|
| IP或域名:1883           | TCP连接        |
| IP或域名:1884           | TLS连接        |
| IP或域名:80/mqtt        | WS连接（WebSocket）|
| IP或域名:443/mqtt       | WSS连接（安全WebSocket）|

## 认证

默认情况下，不启用认证。您可以在不提供用户名和密码的情况下连接。如果您需要认证，请参考[Auth Provider Plugin](../../06_plugin/1_auth_provider.md)。
