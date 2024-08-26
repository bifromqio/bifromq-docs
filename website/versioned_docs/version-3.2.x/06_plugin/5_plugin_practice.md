---
sidebar_position: 5
title: "Plugin Practice and Notice"
---

This article outlines some practices and considerations when developing BifroMQ plugins.

## Start a BifroMQ Plugin Project Quickly

To jump start your BifroMQ plugin development, execute the following Maven command:

```
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

Replace `<YOUR_GROUP_ID>`, `<YOUR_ARTIFACT_ID>`, `<YOUR_PROJECT_VERSION>`, `<YOUR_PLUGIN_CLASS_NAME>`,
and `< YOUR_PLUGIN_CONTEXT_CLASS_NAME>` with your specific details. This command generates a ready-to-build multi-module
project structured for BifroMQ plugin development.

**Important Note**: The archetype version should be 3.2.0 or higher as the archetype is compatible starting from version
3.2.0. Ensure that `<BIFROMQ_VERSION>` is set accordingly.

In addition to the foundational code framework for plugin development, the generated BifroMQ plugin project also includes the following features:

* PluginContext: Defines the plugin context to facilitate the transfer of necessary runtime information.
* Configuration File: Uses a standalone config.yaml file for plugin configuration.
* Logging Configuration: Uses a standalone logback.xml file for plugin logging configuration.

## Remote Debugging with BifroMQ

BifroMQ supports remote debugging, which can be activated through the `JVM_DEBUG` environment variable. Additionally, the remote debugging port can be specified through the `JAVA_DEBUG_PORT` environment variable. If not specified, the
default port is 8008. Before starting the BifroMQ process, specify these environment variables using shell:

```shell
export JVM_DEBUG=true
export JAVA_DEBUG_PORT=8008
export DEBUG_SUSPEND_FLAG=n
```

Ensure the debugging port is correctly configured to avoid port conflicts. Remote debugging can be performed using an IDE (for example, IntelliJ or Eclipse). Setting DEBUG_SUSPEND_FLAG=y can assist in debugging the plugin's initialization
process.

## Pay Attention to Java ClassLoading

BifroMQ uses separate ClassLoaders for each plugin to load classes from the plugin's classpath. Therefore, ensure your plugin's packaging includes all dependencies used (except those [provided](intro.md#plugin-deployment) by BifroMQ). Some
third-party libraries might load classes in other ways, leading to class loading failures. Most situations can be resolved by swapping the Thread ContextLoader:

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

## Properly Organize the Plugin Directory

When developing plugins, ensure there are no unrelated jar files in the plugin directory. [pf4j](https://pf4j.org) recursively checks jar files in the plugin directory, and unrelated jars may lead to PF4J validation errors. Keeping the
plugin directory clean and containing only necessary jar files ensures smooth plugin loading and prevents conflicts or validation issues.

## Metrics and Logging

- Plugin developers are encouraged to utilize the BifroMQ logging framework for plugin logging, making use of the same `logback.xml` for logger configuration.
- BifroMQ captures and records metrics during invocations of plugin methods, offering useful insights for debugging and performance optimization.