---
sidebar_position: 2 
title: "系统属性"
---

在BifroMQ中调整系统属性前，需要对其内部机制有深入理解，不恰当的修改可能会引发非预期的行为。除此以外，这些系统属性与BifroMQ的内部实现紧密关联，可能会出现在不同版本中不兼容的情况。系统属性可以通过JVM启动参数进行设置，从而灵活地定制BifroMQ的行为。
例如，通过设置`-Dmqtt_utf8_sanity_check=false`来禁用MQTT协议定义的UTF8字符串格式检查。

下面表列出了当前版本支持的系统属性: 

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