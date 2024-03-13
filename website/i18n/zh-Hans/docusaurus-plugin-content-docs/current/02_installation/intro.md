---
id: intro
sidebar_position: 0
title: "安装概述"
---

## 安装前提

BifroMQ的运行需要 **Java 17** 或更高版本。在继续进行BifroMQ安装之前，请确保您的Java运行环境已更新，以满足这些要求。

## 安装目录结构

安装完成后，BifroMQ会按照以下目录结构组织其文件：

| 目录       | 描述                                                         |
|-----------|--------------------------------------------------------------|
| `bin`     | 用于启动和管理BifroMQ的可执行脚本。                           |
| `conf`    | 用于自定义BifroMQ操作的配置文件。                             |
| `lib`     | 运行BifroMQ的程序库文件。                                     |
| `plugins` | 以 [pf4j](https://pf4j.org) 兼容格式的BifroMQ插件。           |
| `data`    | 用户的持久化数据。                                           |
| `logs`    | 日志文件。                                                   |

## 运行BifroMQ

BifroMQ的启动脚本识别几个环境变量，允许自定义和优化其运行环境：

| 环境变量          | 描述                                                                                     |
|-------------------|------------------------------------------------------------------------------------------|
| `LOG_DIR`         | 指定BifroMQ应该存储其日志文件的目录。如果未设置，默认为 `./logs`。                        |
| `DATA_DIR`        | 确定存储BifroMQ数据的目录。如果未设置，默认为 `./data`。                                  |
| `JAVA_HOME`       | 指定BifroMQ应使用的Java运行时环境（JRE）的路径。                                          |
| `MEM_LIMIT`       | 限制BifroMQ可以使用的最大内存量。                                                         |
| `JVM_PERF_OPTS`   | 用于调优运行BifroMQ的JVM实例的自定义JVM性能选项。                                         |
| `JVM_GC_OPTS`     | 优化BifroMQ内存管理的垃圾收集（GC）选项。                                                 |
| `JVM_HEAP_OPTS`   | 指定JVM堆大小和其他直接影响BifroMQ性能的内存设置。                                        |
| `EXTRA_JVM_OPTS`  | 用户可能希望传递的其他JVM选项，以自定义BifroMQ运行环境。                                  |
| `JVM_DEBUG`       | 启用JVM的调试选项，对于开发和故障排除很有用。                                             |
| `JAVA_DEBUG_PORT` | 当启用 `JVM_DEBUG` 时，设置JVM调试器附加的端口。                                          |