---
sidebar_position: 5
title: "Plugin Practice and Notice"
---
# BifroMQ 中的插件实践和注意事项
BifroMQ是一个强大的消息传递系统，允许自身与自定义服务之间进行无缝通信。在使用BifroMQ插件时，遵循最佳实践并注意一些考虑事项，以确保顺利集成和调试。
本文概述了开发BifroMQ插件时的一些基本实践和注意事项。
## 设置插件的完全限定名（FQN）
在开发 BifroMQ 插件时，需要在`standalone.yml`配置文件中设置插件的完全限定名（FQN）。FQN能唯一标识插件，并帮助BifroMQ有效地加载和管理插件。
FQN应该在配置的根级别进行设置。
示例：
```yaml
authProviderFQN: com.example.plugin.MyPlugin
```
在此示例中，插件的FQN为`com.example.plugin.MyPlugin`。开发者应确保FQN准确地表示插件的包和类名。
## 充分利用Java 远程调试功能
Java远程调试允许开发人员从集成开发环境（IDE）远程调试自定义插件。BifroMQ支持远程调试，可以通过环境变量`JVM_DEBUG`来启用。
同时，还可以通过环境变量`JAVA_DEBUG_PORT`指定远程调试端口，默认端口为8008。
在 Linux Shell 中的示例：
```shell
export JVM_DEBUG=true
export JAVA_DEBUG_PORT=8009
```
确保正确配置调试端口，并避免端口冲突。开发者可以使用该端口连接IDE（如[IntelliJ](https://www.jetbrains.com/help/idea/tutorial-remote-debug.html) 
或 [Eclipse](https://www.eclipse.org/community/eclipse_newsletter/2017/june/article1.php)）以进行远程调试。
## 注意 Java 类加载
在开发插件时，Java类加载非常重要，特别是如果插件依赖外部库或模块。确保在插件初始化和其他阶段正确处理类加载器。

例如，`KafkaProducer`可能依赖的类使用了`ContextClassLoader`对其进行初始化。如果当前的`ContextClassLoader`指向`AppClassLoader`，
可能会导致`ClassNotFoundException`。BifroMQ 在插件初始化阶段包含了一些场景，但开发人员在其他阶段应该保持警惕，以避免潜在的类加载问题。
## 正确组织插件目录
在开发插件时，请确保插件目录中没有无关的jar文件。PF4J（用于 Java 的插件框架）会递归检查插件目录中的jar文件，无关的jar可能导致PF4J验证错误。

保持插件目录的整洁，只包含必要的jar文件，确保插件加载顺利，避免任何冲突或验证问题。