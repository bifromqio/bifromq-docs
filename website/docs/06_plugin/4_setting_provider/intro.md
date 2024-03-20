---
id: "intro"
sidebar_position: 0
title: "Setting Provider"
---

BifroMQ defines a category of [Tenant-level Settings](1_tenantsetting.md) that can be modified at runtime, allowing for dynamic adjustment of BifroMQ's service behavior per tenant. The purpose of the Setting Provider Plugin is to supply
custom values for these settings at runtime.

The Plugin's interface is defined in the following Maven module:

```xml

<dependency>
    <groupId>com.baidu.bifromq</groupId>
    <artifactId>bifromq-plugin-setting-provider</artifactId>
    <version>X.Y.Z</version> <!--replace X.Y.Z with latest version number-->
</dependency>
```

BifroMQ allows only a single instance of the Setting Provider to run at a time. You can configure the specific implementation class to be loaded through a configuration file by specifying its fully qualified name (FQN) using the following
key:

```yaml
settingProviderFQN: "YOUR_SETTING_PROVIDER_CLASS"
```

## Initial Values and Validation of Settings

Each Setting has an initial value, for example, MaxTopicLength has an initial value of 255 and is validated to be an integer between 0 and 65535. A Setting’s initial value can be overridden by a System Property of the same name, for
example, adding `-DMaxTopicLength=128` to the JVM launch parameters of BifroMQ. Note that the initial value passed through the System Property must be correctly parsed to the corresponding data type, otherwise, the override will not be
successful.

## Updating Current Value of Setting

BifroMQ updates the current value of a Setting by invoking the SettingProvider Plugin's `provide` method. The signature of the provide method is as follows:

```java
public <R> R provide(Setting setting, String tenantId);
```

This method will be called by BifroMQ's worker threads, so it is essential to bear in mind the following two points when implementing the Setting Provider Plugin:

1. Avoid including heavy business logic within the provide method to ensure it returns quickly, as this can otherwise negatively impact BifroMQ's performance.
2. When it is not possible to quickly determine the value of a Setting, it can return `null`, in which case the Setting will continue to use its current value. This allows for the decision logic for the Setting to be made asynchronous.

## Metrics

Because the `provide` method is frequently called, BifroMQ records and outputs the following metrics to help
plugin implementers observe the performance indicators of the plugin interface methods:

| Metric Name            | Meter Type | Tag(`method`)           | Description                     |
|------------------------|------------|-------------------------|---------------------------------|
| `call.exec.timer`      | TIMER      | SettingProvider/provide | Latency for `provide` call      |
| `call.exec.fail.count` | COUNTER    | SettingProvider/provide | Fail counter for `provide` call |
