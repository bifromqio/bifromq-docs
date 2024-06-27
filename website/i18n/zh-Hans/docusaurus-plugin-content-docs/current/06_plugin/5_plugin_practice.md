---
sidebar_position: 5
title: "Plugin开发实践"
---

本文概述了开发BifroMQ插件时一些基本的实践和注意事项。

## 快速开始插件开发

执行以下 Maven 命令，快速启动 BifroMQ 插件开发：

```bash
mvn archetype:generate \
    -DarchetypeGroupId=com.baidu.bifromq \
    -DarchetypeArtifactId=bifromq-plugin-archetype \
    -DarchetypeVersion=<BIFROMQ_VERSION> \
    -DgroupId=<YOUR_GROUP_ID> \
    -DartifactId=<YOUR_ARTIFACT_ID> \
    -Dversion=<YOUR_PROJECT_VERSION> \
    -DpluginName=<YOUR_PLUGIN_CLASS_NAME> \
    -DpluginContextName=<YOUR_PLUGIN_CONTEXT_CLASS_NAME> \
    -DbifromqVersion=<BIFROMQ_VERSION> \
    -DinteractiveMode=false
```

请将 `<YOUR_GROUP_ID>`、`<YOUR_ARTIFACT_ID>`、`<YOUR_PROJECT_VERSION>`、`<YOUR_PLUGIN_CLASS_NAME>`
和 `<YOUR_PLUGIN_CONTEXT_CLASS_NAME>` 替换为您的具体信息。该命令生成一个准备就绪的、结构清晰的多模块项目，专为 BifroMQ
插件开发而设计。

**重要提示**：原型的版本应为 3.2.0 或更高版本，因为该原型从 3.2.0 版本开始兼容。确保 `<BIFROMQ_VERSION>` 设置正确。

除了插件开发的基础代码框架外，生成的 BifroMQ 插件项目还为您提供以下机制：

* PluginContext：定义插件上下文，方便传递插件运行所需信息。
* 配置文件：使用独立的 config.yaml 文件来配置插件。
* 日志配置：使用独立的 logback.xml 文件来配置插件日志。

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