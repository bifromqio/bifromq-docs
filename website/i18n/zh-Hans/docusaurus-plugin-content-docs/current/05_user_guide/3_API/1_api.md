---
sidebar_position: 1
---

# API服务
## 简介
本文档介绍了BifroMQ提供的API服务，这些服务允许用户通过HTTP RESTful接口执行一系列操作，包括断开连接、查询会话状态、发布消息以及管理会话订阅等。这些功能支持用户通过BifroMQ管理控制台或命令行界面（CLI）等工具进行高效的管理和控制。

## 服务部署
在默认配置下，每个BifroMQ服务节点均自动启用API服务功能，意味着向任意节点发起请求均可实现相同的操作目标，从而保证了API服务在默认部署状态下的高可用性。

![API-Arch.png](images%2FAPI-Arch.png)

用户可以使用前置的负载均衡软件。例如Nginx来访问API服务。