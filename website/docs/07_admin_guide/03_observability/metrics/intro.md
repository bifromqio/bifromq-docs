---
id: "intro"
sidebar_position: 0
title: "Overview"
---

BifroMQ adopts [Micrometer](https://micrometer.io/) as its metric collection framework, analogous to its use of SLF4J and Logback for logging.Micrometer serves as the "SLF4J for metrics" within BifroMQ, offering a high-level facade over the instrumentation clients
for numerous monitoring systems. Importantly, while Micrometer facilitates the collection of metrics, it doesn't bind users to a particular metrics backend. Instead, users are free to select their preferred monitoring system and can direct
metrics to it using BifroMQ's plugin mechanism.

## Prometheus Integration via DemoPlugin

BifroMQ includes out-of-the-box support for Prometheus through its bundled [DemoPlugin](https://github.com/bifromqio/bifromq/blob/main/build/build-plugin-demo/src/main/java/com/baidu/demo/plugin/DemoPlugin.java), BifroMQ exposes a
Prometheus endpoint(`http://<BIFROMQ_NODE_HOST>:9090/metrics`, checkout the source for customizing the behaviors), enabling direct scraping of metrics by Prometheus.

## Tenant-Level Metrics for Multi-Tenancy
BifroMQ introduces a set of tenant-level [metrics](tenantmetrics.md). These metrics allow for the collection and aggregation of data that reflects the resource usage and activity of individual tenants in near real-time. When used in conjunction with the Resource Throttler plugin, tenant-level metrics facilitate effective load management and resource allocation strategies.

## Deep Metrics for Advanced Diagnostics and Tuning

Beyond tenant-level insights, BifroMQ collects a wide array of internal metrics from its various functional modules. These metrics are indispensable for deep system tuning and runtime diagnostics. However, due to their close ties with BifroMQ's internal mechanisms and architecture, these deep metrics may vary between BifroMQ versions and are not guaranteed to remain consistent across updates. As such, while invaluable for advanced users seeking to maximize their broker's efficiency, these metrics are not documented for general use to avoid compatibility concerns.

For customers deeply integrating BifroMQ into their systems and requiring advanced insights into its operation, the [BifroMQ team](mailto:hello@bifromq.io) offers professional consulting services. These services aim to bridge the gap between BifroMQ's comprehensive metrics collection capabilities and the specific needs of its users, ensuring that every deployment can be finely tuned and expertly monitored, regardless of its scale or complexity.