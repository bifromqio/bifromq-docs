---
id: "intro"
sidebar_position: 0
title: "Setting Provider"
---

BifroMQ定义了一类租户级[设置](1_tenantsetting.md)(Settings)，允许在运行时修改，从而实现根据租户动态调整BifroMQ的服务行为。Setting Provider Plugin的目的是在运行时为这些设置提供自定义值。

插件的接口定义在以下Maven模块中：

```xml

<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-setting-provider</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with the latest version number-->
</dependency>
```

BifroMQ只允许运行一个Setting Provider实例。需要在配置文件指定要加载的具体实现类的完全限定名（FQN）：

```yaml
settingProviderFQN: "YOUR_SETTING_PROVIDER_CLASS"
```

## 设置的初始值和验证

每个设置都有一个初始值，例如，MaxTopicLength的初始值为255，并验证为介于0和65535之间的整数。可以通过与同名的系统属性覆盖设置的初始值，例如，在BifroMQ的JVM启动参数中添加`-DMaxTopicLength=128`。请注意，通过系统属性传递的初始值必须正确解析为相应的数据类型，否则覆盖将不会成功。

## 更新设置的当前值

BifroMQ通过调用SettingProvider插件的`provide`方法来更新设置的当前值。provide方法的签名如下：

```java
public <R> R provide(Setting setting, String tenantId);
```

此方法将由BifroMQ的工作线程调用，因此在实现Setting Provider Plugin时需要牢记以下两点：

1. 避免在provide方法中包含繁重的业务逻辑，以确保它能够快速返回，否则会对BifroMQ的性能产生负面影响。
2. 当无法快速确定设置的值时，可以返回`null`，此时设置将继续使用其当前值。这允许对设置的决策逻辑进行异步处理。

## Metrics

因为`provide`方法会被频繁调用，BifroMQ记录并输出以下指标，以帮助插件实现者观察插件接口方法的性能指标：

| Metric Name            | Meter Type | Tag(`method`)           | Description                     |
|------------------------|------------|-------------------------|---------------------------------|
| `call.exec.timer`      | TIMER      | SettingProvider/provide | Latency for `provide` call      |
| `call.exec.fail.count` | COUNTER    | SettingProvider/provide | Fail counter for `provide` call |
