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



### 内存限制

默认情况下，BifroMQ进程在启动时会基于部署服务器的物理内存自动计算出相应的JVM参数。然而，在容器环境中启动时，会读取宿主机的物理内存，可能导致与Docker或容器内存限制发生冲突，从而引发容器被终止的情况。

为避免此类问题，建议主动限制容器内存使用量，并以环境变量的形式传递给容器运行时，BifroMQ启动是会优先根据MEM_LIMIT计算JVM参数。具体示例如下：

```
docker run -d -m 10G -e MEM_LIMIT='10737418240' --name bifromq -p 1883:1883 bifromq/bifromq:latest
```

***注：MEM_LIMIT单位为bytes***

更进一步，可以主动对JVM堆内存进行配置，并将其直接传递给容器运行时，以供BifroMQ使用。具体示例如下：

```
docker run -d -m 10G -e JVM_HEAP_OPTS='-Xms2G -Xmx4G -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=500m -XX:MaxDirectMemorySize=1G' --name bifromq -p 1883:1883 bifromq/bifromq:latest
```
