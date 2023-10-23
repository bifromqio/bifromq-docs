---
sidebar_position: 1
---

# 连接到 BifroMQ

BifroMQ 是一个标准的 MQTT 消息中间件，你可以使用支持 MQTT 3.1/3.1.1 的任何 Client 进行连接。

## 连接地址

使用启动服务对应的 IP 或域名，默认端口及用途如下。

端口|用途
---|---
IP或域名:1883|TCP连接
IP或域名:1884|TLS连接
IP或域名:80/mqtt|WS连接
IP或域名:443/mqtt|WSS连接

## 鉴权

默认情况下未开启鉴权，可将用户名密码留空进行连接。如需认证鉴权，请参考[认证鉴权插件](../../06_plugin/2_auth_provider.md)。
