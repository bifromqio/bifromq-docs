---
sidebar_position: 5
title: "Plugin开发实践"
---

本文概述了开发BifroMQ插件时一些基本的实践和注意事项。

## BifroMQ的远程调试

Java远程调试允许开发人员从IDE远程调试定制化插件。BifroMQ支持远程调试，可以通过环境变量JVM_DEBUG来启用。同时，还可以通过环境变量JAVA_DEBUG_PORT指定远程调试端口。如果没有指定，那么默认端口为8008。Linux Shell示例：

```shell
export JVM_DEBUG=true
export JAVA_DEBUG_PORT=8009
export DEBUG_SUSPEND_FLAG=n
```

确保正确配置调试端口，并且没有端口冲突。使用IDE（例如，IntelliJ或Eclipse）进行远程调试。
设置`DEBUG_SUSPEND_FLAG=y`，可以帮助调试插件的初始化过程。

## 注意Java类加载

BifroMQ会为每个插件使用单独的ClassLoader从插件的classpath中加载使用到的类，所以请确保插件的打包中包含所有用到的依赖（除了BifroMQ[提供](intro.md#插件部署)的以外）。
某些第三方类库可能其他方式加载类，导致类加载失败。大部分情况可以通过替换Thread ContextLoader的方式解决：

```java
class MyPlugin {
    public void pluginMethod() {
        ClassLoader originalLoader = Thread.currentThread().getContextClassLoader();
        try {
            Thread.currentThread().setContextClassLoader(this.getClass().getClassLoader());
            // Initialize dependencies here  
            dependenciesInit();
        } finally {
            Thread.currentThread().setContextClassLoader(originalLoader);
        }
    }
}
```

## 正确组织插件目录

开发插件时，请确保插件目录中没有无关的jar文件。[pf4j](https://pf4j.org)会递归检查插件目录中的jar文件，无关的jars可能导致PF4J验证错误。