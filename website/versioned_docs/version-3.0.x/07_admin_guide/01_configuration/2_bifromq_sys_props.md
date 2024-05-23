---
sidebar_position: 2 
title: "System Properties"
---

Before adjusting system properties in BifroMQ, it's necessary to have a thorough understanding of its internal mechanisms, as inappropriate modifications can lead to unexpected behavior. Additionally, these system properties are closely linked with BifroMQ's internal implementation and may not be compatible across different versions. System properties can be set via JVM startup parameters, allowing for flexible customization of BifroMQ's behavior.
For example, setting `-Dmqtt_utf8_sanity_check=false` disables the check for MQTT protocol-defined UTF8 string formats.

Below is a table listing the system properties supported by the current version:

| Property Key                                | Default Value                                      | Description                                                                            |
|---------------------------------------------|----------------------------------------------------|----------------------------------------------------------------------------------------|
| `ingress_slowdown_direct_memory_usage`      | 0.8                                                | Threshold for slowing down ingress traffic based on direct memory usage.               |
| `mqtt_utf8_sanity_check`                    | false                                              | Enables/disables UTF8 sanity checks according to MQTT-1.5.3.                           |
| `max_mqtt3_client_id_length`                | 65535                                              | Maximum client ID length for MQTT 3 clients.                                           |
| `max_mqtt5_client_id_length`                | 65535                                              | Maximum client ID length for MQTT 5 clients.                                           |
| `session_register_num`                      | 1000                                               | Number of concurrent session registers.                                                |
| `data_plane_tolerable_latency_ms`           | 1000L                                              | Tolerable latency in milliseconds for the data plane.                                  |
| `data_plane_burst_latency_ms`               | 5000L                                              | Burst latency in milliseconds for the data plane.                                      |
| `control_plane_tolerable_latency_ms`        | 2000L                                              | Tolerable latency in milliseconds for the control plane.                               |
| `control_plane_burst_latency_ms`            | 5000L                                              | Burst latency in milliseconds for the control plane.                                   |
| `dist_server_dist_worker_call_queues`       | CPU cores                                          | Number of dist worker call queues.                                                     |
| `dist_worker_fanout_parallelism`            | Max(2, CPU cores)                                  | Parallelism level for fanout operations.                                               |
| `dist_worker_max_cached_subs_per_tenant`    | 200_000L                                           | Maximum cached subscriptions per tenant.                                               |
| `dist_worker_topic_match_expiry_seconds`    | 5                                                  | Expiry time in seconds for topic matches.                                              |
| `dist_worker_match_parallelism`             | Max(2, CPU cores / 2)                              | Parallelism level for match operations.                                                |
| `dist_worker_fanout_split_threshold`        | 100000                                             | Threshold for splitting fanout operations when fanout split hinter enabled.            |
| `dist_worker_split_max_cpu_usage`           | 0.8                                                | Maximum CPU usage threshold for splitting operations when fanout split hinter enabled. |
| `dist_worker_load_estimation_window_seconds`| 5L                                                 | Time window in seconds for load estimation when fanout split hinter enabled.           |
| `dist_worker_split_io_nanos_limit`          | 30_000L                                            | Nanoseconds limit for I/O operations during split when fanout split hinter enabled.    |
| `dist_worker_split_max_io_density`          | 100                                                | Maximum I/O density for split operations when fanout split hinter enabled.             |
| `dist_worker_range_voter_count`             | 3                                                  | Number of voters for range decisions.                                                  |
| `dist_worker_recovery_timeout_millis`       | 10000L                                             | Timeout in milliseconds for worker recovery when recovery balancer enabled.            |
| `inbox_deliverers`                          | 100                                                | Number of inbox deliverers.                                                            |
| `inbox_fetch_queues_per_range`              | Max(1, CPU cores / 4)                              | Number of fetch queues per range.                                                      |
| `inbox_check_queues_per_range`              | 1                                                  | Number of check queues per range.                                                      |
| `inbox_store_load_estimation_window_seconds`| 5L                                                 | Time window in seconds for load estimation in inbox store.                             |
| `inbox_store_range_split_max_cpu_usage`     | 0.8                                                | Maximum CPU usage threshold for range split in inbox store.                            |
| `inbox_store_range_split_io_nanos_limit`    | 30_000                                             | Nanoseconds limit for I/O operations during range split in inbox store.                       |
| `inbox_store_range_split_max_io_density`    | 100                                                | Maximum I/O density for range split operations in inbox store.                                |
| `inbox_store_range_voter_count`             | 1                                                  | Number of voters for range decisions in inbox store.                                          |
| `inbox_store_recovery_timeout_millis`       | 10000L                                             | Timeout in milliseconds for inbox store recovery.                                             |
| `mqtt_deliverers_per_server`                | CPU cores                                          | Number of MQTT deliverers per server.                                                         |
| `retain_store_range_split_max_cpu_usage`    | 0.8                                                | Maximum CPU usage threshold for range split in retain store.                                  |
| `retain_store_range_split_io_nanos_limit`   | 30_000L                                            | Nanoseconds limit for I/O operations during range split in retain store.                      |
| `retain_store_range_split_max_io_density`   | 100                                                | Maximum I/O density for range split operations in retain store.                               |
| `retain_store_range_voter_count`            | 3                                                  | Number of voters for range decisions in retain store.                                         |
| `retain_store_load_est_window_seconds`      | 5L                                                 | Time window in seconds for load estimation in retain store.                                   |
| `retain_store_recovery_timeout_millis`      | 10000L                                             | Timeout in milliseconds for retain store recovery.                                            |