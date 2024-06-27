---
sidebar_position: 1 
title: "Tenant-level Metrics"
---

Below is a comprehensive table of BifroMQ's tenant metrics, including their MetricName (as recognized within Micrometer), the type of meter used, and a brief description of each metric's purpose.
It's important to note that the final naming convention of metrics as stored in the collection backend may vary depending on the specific collector used. For detailed mapping relationships, refer to the official Micrometer documentation.

| Metric Name                    | Meter Type           | Description                                          |
|--------------------------------|----------------------|------------------------------------------------------|
| `mqtt.connection.num.gauge`    | GAUGE                | Current number of MQTT connections.                  |
| `mqtt.auth.failure.count`      | COUNTER              | the counter of authentication failures.              |
| `mqtt.connect.count`           | COUNTER              | The counter of MQTT connect.                         |
| `mqtt.disconnect.count`        | COUNTER              | the counter of MQTT disconnect.                      |
| `mqtt.session.mem.gauge`       | GAUGE                | Memory usage by MQTT sessions.                       |
| `mqtt.psession.space.gauge`    | GAUGE                | Storage space used by persistent MQTT sessions.      |
| `mqtt.psession.live.num.gauge` | GAUGE                | Number of live persistent MQTT sessions.             |
| `mqtt.psession.num.gauge`      | GAUGE                | Total number of persistent MQTT sessions.            |
| `mqtt.ingress.bytes`           | DISTRIBUTION_SUMMARY | Bytes received by the broker.                        |
| `mqtt.egress.bytes`            | DISTRIBUTION_SUMMARY | Bytes sent from the broker.                          |
| `mqtt.channel.latency`         | TIMER                | Latency of network channels.                         |
| `mqtt.ingress.qos0.bytes`      | DISTRIBUTION_SUMMARY | Bytes received for QoS 0 messages.                   |
| `mqtt.qos0.dist.bytes`         | DISTRIBUTION_SUMMARY | Distribution of QoS 0 message bytes.                 |
| `mqtt.ingress.qos1.bytes`      | DISTRIBUTION_SUMMARY | Bytes received for QoS 1 messages.                   |
| `mqtt.qos1.dist.bytes`         | DISTRIBUTION_SUMMARY | Distribution of QoS 1 message bytes.                 |
| `mqtt.ingress.qos2.bytes`      | DISTRIBUTION_SUMMARY | Bytes received for QoS 2 messages.                   |
| `mqtt.qos2.dist.bytes`         | DISTRIBUTION_SUMMARY | Distribution of QoS 2 message bytes.                 |
| `mqtt.egress.qos0.bytes`       | DISTRIBUTION_SUMMARY | Bytes sent from broker for QoS 0 messages.           |
| `mqtt.egress.qos1.bytes`       | DISTRIBUTION_SUMMARY | Bytes sent from broker for QoS 1 messages.           |
| `mqtt.deliver.qos1.bytes`      | DISTRIBUTION_SUMMARY | Bytes delivered for QoS 1 messages.                  |
| `mqtt.egress.qos2.bytes`       | DISTRIBUTION_SUMMARY | Bytes sent from broker for QoS 2 messages.           |
| `mqtt.deliver.qos2.bytes`      | DISTRIBUTION_SUMMARY | Bytes delivered for QoS 2 messages.                  |
| `mqtt.in.qos0.latency`         | TIMER                | Internal latency for QoS 0 message processing.       |
| `mqtt.in.qos1.latency`         | TIMER                | Internal latency for QoS 1 message processing.       |
| `mqtt.ex.qos1.latency`         | TIMER                | External latency for QoS 1 message delivery.         |
| `mqtt.in.qos2.latency`         | TIMER                | Internal latency for QoS 2 message processing.       |
| `mqtt.ex.qos2.latency`         | TIMER                | External latency for QoS 2 message delivery.         |
| `mqtt.tfanout.bytes`           | DISTRIBUTION_SUMMARY | Bytes fanned out for transient messages.             |
| `mqtt.pfanout.bytes`           | DISTRIBUTION_SUMMARY | Bytes fanned out for persistent messages.            |
| `mqtt.route.space.gauge`       | GAUGE                | Space used for message routing.                      |
| `mqtt.shared.sub.num.gauge`    | GAUGE                | Number of shared subscriptions.                      |
| `mqtt.tsub.count`              | COUNTER              | Count of transient subscriptions.                    |
| `mqtt.tsub.latency`            | TIMER                | Latency in handling transient subscriptions.         |
| `mqtt.psub.count`              | COUNTER              | Count of persistent subscriptions.                   |
| `mqtt.psub.latency`            | TIMER                | Latency in handling persistent subscriptions.        |
| `mqtt.tunsub.count`            | COUNTER              | Count of transient unsubscriptions.                  |
| `mqtt.tunsub.latency`          | TIMER                | Latency in handling transient unsubscriptions.       |
| `mqtt.punsub.count`            | COUNTER              | Count of persistent unsubscriptions.                 |
| `mqtt.punsub.latency`          | TIMER                | Latency in handling persistent unsubscriptions.      |
| `mqtt.tsub.num.gauge`          | GAUGE                | Number of transient subscriptions currently active.  |
| `mqtt.psub.num.gauge`          | GAUGE                | Number of persistent subscriptions currently active. |
| `mqtt.ingress.retain.bytes`    | DISTRIBUTION_SUMMARY | Bytes received for retained messages.                |
| `mqtt.retained.bytes`          | DISTRIBUTION_SUMMARY | Total bytes of retained messages stored.             |
| `mqtt.retained.num.gauge`      | GAUGE                | Number of retained messages stored.                  |
| `mqtt.retain.match.count`      | COUNTER              | Count of retained message matches.                   |
| `mqtt.retain.matched.bytes`    | DISTRIBUTION_SUMMARY | Bytes of retained messages delivered after matching. |
| `mqtt.retain.space.gauge`      | GAUGE                | Space used for storing retained messages.            |

* **Internal** latency measures the time between the broker receiving a message and the broker sending the message to subscribing clients.
* **External** latency measures the time between the broker sending the message to subscribing clients and the broker got the acknowledgement from clients, so it's only applied to QoS1 messages(when PubAck received) and QoS2 messages(when
  PubComp received).