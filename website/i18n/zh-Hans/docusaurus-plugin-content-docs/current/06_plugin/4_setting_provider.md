---
sidebar_position: 4
title: "Setting Provider Plugin"
---

# Setting Provider Plugin

BifroMQ定义了一类可以运行时变更的设置项([Setting](https://github.com/baidu/bifromq/blob/main/bifromq-plugin/bifromq-plugin-setting-provider/src/main/java/com/baidu/bifromq/plugin/settingprovider/ISettingProvider.java))
，可以用于在运行时动态调整BifroMQ的服务行为。Setting Provider Plugin的作用即是为这些设置项提供运行时的自定义的值，使用场景包括：租户级别/连接级别的功能启停，参数变更等。

## Setting的初始值和校验
每个Setting都有初始值，如：MaxTopicLength的初始值为255，校验规则为0 < MaxTopicLength < 65535的整数。Setting的初始值可以使用同名的System Property覆盖，如：BifroMQ的JVM启动参数增加`-DMaxTopicLength=128`。注意，通过System Property传入的初始值必须能够被正确解析成对应的数据类型，否则将覆盖不成功。

## Setting的分类(ClientClassifier)
BifroMQ对Setting的值做按Client分类后缓存在内存中，每个Setting都关联一个ClientClassifier，可以通过Setting的`setClientClassifier`方法设置新的分类逻辑。ClassClassifier只有一个`classify`方法，签名如下：
```java
public String classify(ClientInfo clientInfo);
```
默认的分类逻辑为`clientInfo -> ""`即不对Setting的值做分类(所有的客户端共享同一个设置值)。通过调整分类规则可以实现对Setting值的分级管理如：系统级、租户级、连接级。

## 更新Setting的当前值
BifroMQ通过回调SettingProvider Plugin的`provide`方法更新Setting的当前值。provide方法的签名如下：
```java
public <R> R provide(Setting setting, ClientInfo clientInfo);
```
该方法会被BifroMQ的工作线程调用，因此实现Setting Provider Plugin需要注意以下两点：
1. 避免在provide方法中包含将过重的业务逻辑，保证方法能快速返回，否则会对BifroMQ的性能产生负面影响
2. 当不能快速决定Setting的值时，可以返回`null`，此时Setting将仍然使用当前的值，此种情况可以将Setting的决定逻辑变为异步