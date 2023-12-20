---
sidebar_position: 4
---

# Logs and Observable
## Logging

BifroMQ generates logs based on the standard slf4j interface. Log content is categorized into five levels: TRACE, DEBUG, INFO, WARN, and ERROR. You can choose to print any of these log levels by modifying the configuration file.

### Configuration File

The log configuration file is named logback.xml and is located at:

| Installation Method | File Location                      |
| :------------------ | ---------------------------------- |
| Unzipping Archive   | ./conf/logback.xml                 |
| Docker Container    | /usr/share/bifromq/conf/logback.xml|

The log configuration file uses the standard logback configuration method. Detailed explanations are not provided here, but you can modify the configuration according to your needs.

One thing to note is that the provided logback configuration file will set the log file directory based on the system parameters "LOG_DIR" and "user.dir".



## Event Collection

During its operation, BifroMQ extracts real-time execution information from some internal key operational points and formulates them into Events. These are written out uniformly through the EventCollectorManager.

The types of Events can be broadly divided into:

* Events related to the MQTT protocol, such as connection, disconnection, subscription, message pushing, etc.
* Events related to alarm types, such as protocol violations, internal errors, capacity exceeding limits, etc.

The destination for writing out Events is the implementation of the IEventCollector extension point, loaded at startup through pf4j.

You can refer to [DemoEventLogger](https://github.com/bifromqio/bifromq/blob/main/build/build-plugin-demo/src/main/java/com/baidu/demo/plugin/EventLogger.java) to implement your own EventCollector to collect the rich runtime events provided by BifroMQ.



## Metrics

BifroMQ has an integrated wealth of Metrics system indicators based on Micrometer to help users understand the real-time status of the service, monitor system health, and identify system performance issues.

You can output Metrics by integrating them into Prometheus or opt to output them through other methods supported by Micrometer.

### Prometheus Integration Method

BifroMQ does not include a built-in component for Micrometer to output to Prometheus by default. You can create a plugin loaded by the pf4j framework and implement Micrometer's push or pull mechanism to Prometheus within the plugin.

The archive you downloaded and unzipped comes with ./plugins/demo-plugin-1.0.0-SNAPSHOT.jar, which provides an Endpoint for Prometheus to pull Metrics: `http://127.0.0.1:9090/metrics`.

You can also refer to [DemoPlugin](https://github.com/bifromqio/bifromq/blob/main/build/build-plugin-demo/src/main/java/com/baidu/demo/plugin/DemoPlugin.java) to implement your own Plugin.