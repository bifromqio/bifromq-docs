---
id: "intro"
sidebar_position: 0
title: "Metrics概述"
---

BifroMQ采用[Micrometer](https://micrometer.io/)作为其Metrics收集框架，类似于其使用SLF4J和Logback进行日志记录。Micrometer在BifroMQ中充当“Metrics的SLF4J”，虽然Micrometer便于收集Metrics，但它并不将用户绑定到特定的Metrics收集后端。相反，用户可以自由选择他们偏好的监控系统，并可以通过BifroMQ的插件机制将Metrics导向该系统。

## 通过DemoPlugin集成Prometheus

BifroMQ通过其捆绑的[DemoPlugin](https://github.com/bifromqio/bifromq/blob/main/build/build-plugin-demo/src/main/java/com/baidu/demo/plugin/DemoPlugin.java)提供了对Prometheus的开箱即用支持，BifroMQ暴露了一个Prometheus采集端点(`http://<BIFROMQ_NODE_HOST>:9090/metrics`)，允许Prometheus直接抓取Metrics。

## 面向多租户的租户级Metrics

BifroMQ引入了一套租户级[Metrics](tenantmetrics.md)。通过收集和聚合，可以实时反映了单个租户的资源使用和活动情况。当与[Resource Throttler](../../../06_plugin/3_resource_throttler.md)结合使用时，租户级Metrics有助于实现有效的负载隔离策略。

## 高级诊断和调优

除了租户级洞察之外，BifroMQ从其各个功能模块收集了广泛的内部Metrics。这些Metrics对于深度系统调优和运行时诊断是不可或缺的。然而，由于这些深度Metrics与BifroMQ的内部机制和架构密切相关，它们可能会在BifroMQ版本之间有所变化，并且不保证在更新中保持一致。因此，为了避免兼容性问题，这些度量并未作为一般用途文档化。

对于深度使用需要深入了解BifroMQ运作机制的客户，[BifroMQ团队](mailto:hello@bifromq.io)提供专业咨询服务。