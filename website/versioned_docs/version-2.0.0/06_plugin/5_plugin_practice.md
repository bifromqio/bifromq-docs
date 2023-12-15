---
sidebar_position: 5
title: "BifroMQ Plugin Practice and Notice"
---
# Plugin Practice and Notice in BifroMQ
BifroMQ is a powerful messaging system that allows seamless communication between itself and customized services. 
When working with BifroMQ plugins, it's essential to follow best practices and be aware of certain considerations 
to ensure smooth integration and debugging. This article outlines some essential practices and notices when developing 
BifroMQ plugins.

## Setting the Plugin's FQN (Fully Qualified Name)
When developing a BifroMQ plugin, it's essential to set its Fully Qualified Name (FQN) in the `standalone.yml`
configuration file. The FQN uniquely identifies the plugin and helps BifroMQ to load and manage the plugin effectively.
The FQN should be set at the root level of the configuration.
Example:
```yaml
authProviderFQN: com.example.plugin.MyPlugin
```
In this example, the FQN for the plugin is `com.example.plugin.MyPlugin`. 
Ensure that the FQN accurately represents the plugin's package and class name.

Especially, in the current implementation of BifroMQ, the [authProvider](2_auth_provider.md) 
and [settingProvider](4_setting_provider.md) need to specify FQN (Fully Qualified Name). However, 
for [eventCollector](3_event_collector.md), it is not required to do so, and multiple implementations 
of eventCollector are allowed.
## Fully Utilize Java Remote Debugging with BifroMQ
Java Remote Debugging allows developers to debug customized plugins remotely from an IDE. 
BifroMQ supports remote debugging, which can be enabled through environment variable `JVM_DEBUG`. Also, one can specify
remote debugging port through environment variable `JAVA_DEBUG_PORT`. If it is not specified, the default one is 8008.
Example in Linux Shell:
```shell
export JVM_DEBUG=true
export JAVA_DEBUG_PORT=8009
```
Make sure to configure the debugging port correctly and there is no port conflict. And one can use it to connect 
the IDE (e.g., [IntelliJ](https://www.jetbrains.com/help/idea/tutorial-remote-debug.html) 
or [Eclipse](https://www.eclipse.org/community/eclipse_newsletter/2017/june/article1.php)) for remote debugging.

Environment variable `DEBUG_SUSPEND_FLAG` option defines whether the JVM should suspend and wait for a debugger to 
attach or not. If developers want to JVM to suspend, `export DEBUG_SUSPEND_FLAG=y`.
## Pay Attention to Java ClassLoading
Java ClassLoading is crucial when developing plugins, especially if the plugins rely on external libraries or modules. 
Ensure proper handling of ClassLoaders during plugin initialization and other phases.

For example, `KafkaProducer` might depend on some classes that use `ContextClassLoader` during initialization. If the 
current contextClassLoader points to `AppClassLoader`, it may cause `ClassNotFoundException`.
BifroMQ has covered some cases during plugin construction phase, but developers should be vigilant in other 
phases to avoid potential ClassLoading issues. The initialization of dependencies involved in the above scenario can 
be performed as follows:
```java
class MyAuthProvider {  
    public void method() {
        try {
            ClassLoader originalLoader = Thread.currentThread().getContextClassLoader();
            ClassLoader targetLoader = this.getClass().getClassLoader();
            Thread.currentThread().setContextClassLoader(targetLoader);
            // Initialize dependencies here  
            dependenciesInit();
        }finally {
            Thread.currentThread().setContextClassLoader(originalLoader);
        }
    }  
}
```
## Organize Plugin Directory Correctly
When developing plugins, ensure that there are no unrelated jar files in the plugin directory. 
PF4J (Plugin Framework for Java) recursively checks jar files in the plugin directory, and unrelated jars 
may cause PF4J validation errors.

Keeping the plugin directory clean and containing only the necessary jar files ensures smooth plugin loading and 
avoids any conflicts or validation issues.
