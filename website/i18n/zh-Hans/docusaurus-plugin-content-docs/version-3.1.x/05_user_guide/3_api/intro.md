---
id: intro
sidebar_position: 0
title: "API概述"
---

BifroMQ内置了API能力，允许执行类似断开客户端连接、查询会话状态、发布消息和管理订阅的操作。利用这些功能，您可以将BifroMQ的管理操作集成到自定义管理工作流中。

## 部署

默认情况下，API服务能力在每个BifroMQ服务节点上自动启用，使用端口8091，参考[配置文件](../../07_admin_guide/01_configuration/1_config_file_manual.md)，了解更多的设置选项。操作请求可以发送到任何节点，确保了默认部署中API能力的高可用性。

![API-Arch.png](images%2FAPI-Arch.png)

上图展示了一个常见的部署场景：利用前置负载均衡器，如：Nginx，分散API请求。
