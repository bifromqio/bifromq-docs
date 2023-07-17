---
sidebar_position: 1
---

# 使用 Docker 部署

## 前提条件

* 已安装 [Docker](https://www.docker.com/)
* 有对应端口使用权限且端口空闲，如无权限请更换端口

## Docker 命令

运行以下命令，会将 BifroMQ 以 linux 用户 `bifromq` 在容器中以 `standalone` 模式运行。

```
docker run -d --name bifromq -p 1883:1883 bifromq/bifromq:latest
```

