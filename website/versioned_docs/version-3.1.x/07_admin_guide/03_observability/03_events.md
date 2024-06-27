---
sidebar_position: 3 
title: "Events"
---

BifroMQ generates events at crucial junctures in its workflow, providing users with the ability to implement custom event collector plugins to capture and process these events.

## Event Collection and Usage

The implementation of an event collector plugin in BifroMQ enables the gathering of system-generated events, which can then be utilized across various business scenarios. While BifroMQ does not dictate specific uses for these events, common applications include billing, risk management, real-time diagnostics and more. 

## Demonstration and Reference Implementation

To assist users in developing their own event collection solutions, BifroMQ offers the DemoPlugin, which includes the [EventLogger](https://github.com/bifromqio/bifromq/blob/main/build/build-plugin-demo/src/main/java/com/baidu/demo/plugin/EventLogger.java) as an example of an EventCollector implementation. 

## Interface Stability and Implementation Guidance

Although event objects form a crucial part of the Event Collector Plugin interface, their stability is considered to be relatively low due to their close association with BifroMQ's internal mechanisms. Given this, it is advisable for plugin developers to ensure their implementations remain in sync with the version of the interface definition they are based on. To prevent compatibility issues, deploying plugins across different interface versions within BifroMQ should be avoided.

## Plugin Development Best Practices
For those interested in extending BifroMQ's capabilities through plugin development, including event collection, further guidance and best practices can be found in the relevant [sections](../../06_plugin/5_plugin_practice.md). 