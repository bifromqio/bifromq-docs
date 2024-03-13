---
sidebar_position: 1
title: "Docker"
---

## 安装前提

* 已安装 [Docker](https://www.docker.com/)。
* 使用1883端口的权限，并且该端口可用。如果您没有权限，请更改为相应的端口。

## Docker命令

运行以下命令，在容器中以Linux用户 `bifromq` 的身份运行BifroMQ。

```
docker run -d --name bifromq -p 1883:1883 bifromq/bifromq:latest
```

## 内存限制

默认情况下，BifroMQ进程启动时，会根据服务器的物理内存动态计算相关的JVM参数。然而，在容器化环境中启动时，它会内省主机机器的物理内存，可能会与Docker或容器施加的内存限制产生冲突，从而导致容器过早终止。

为了规避此类挑战，建议主动限制容器的内存消耗，并通过环境变量将这些限制传达给容器运行时。在BifroMQ启动时，会优先根据 `MEM_LIMIT` 环境变量计算JVM参数。下面提供了一个具体示例：

```
docker run -d -m 10G -e MEM_LIMIT='10737418240' --name bifromq -p 1883:1883 bifromq/bifromq:latest
```

***注意：MEM_LIMIT的单位是字节。***

进一步地，可以主动配置JVM堆内存，并直接将其传递给容器运行时，供BifroMQ使用。下面提供了一个具体示例：

```
docker run -d -m 10G -e JVM_HEAP_OPTS='-Xms2G -Xmx4G -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=500m -XX:MaxDirectMemorySize=1G' --name bifromq -p 1883:1883 bifromq/bifromq:latest
```