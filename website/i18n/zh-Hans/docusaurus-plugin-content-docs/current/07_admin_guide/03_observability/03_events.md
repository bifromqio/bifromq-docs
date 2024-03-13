---
sidebar_position: 3 
title: "Events"
---

BifroMQ在其工作流程中的关键节点生成事件，为用户提供了实现自定义事件收集插件以捕获和处理这些事件的能力。

## 事件收集与使用

在BifroMQ中实现事件收集插件可以收集系统生成的事件，然后在各种业务场景中使用这些事件。虽然BifroMQ没有规定这些事件的具体用途，但常见的应用包括计费、风险管理、实时诊断等。

## 演示和参考实现

为了帮助用户开发自己的事件收集解决方案，BifroMQ提供了DemoPlugin，其中包含[EventLogger](https://github.com/bifromqio/bifromq/blob/main/build/build-plugin-demo/src/main/java/com/baidu/demo/plugin/EventLogger.java)作为EventCollector实现的示例。

## 接口稳定性与实施指导

虽然事件对象是事件收集插件接口的重要组成部分，但由于它们与BifroMQ内部机制紧密相关，其稳定性被认为相对较低。鉴于此，建议插件开发者确保他们的实现与他们基于的接口定义版本保持同步。为了避免兼容性问题，应避免在BifroMQ中跨不同接口版本部署插件。

## 插件开发最佳实践
对于那些有兴趣通过插件开发扩展BifroMQ功能的人，包括事件收集，更多的指导和最佳实践可以在相关[章节](../../06_plugin/5_plugin_practice.md)中找到。