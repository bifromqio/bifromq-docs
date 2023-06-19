---
sidebar_position: 3
title: "System Variables"
---

# System Variables Manual

An introduction to the injectable system variables in BifroMQ.

System variables primarily focus on performance tuning. Usually, the - default values are sufficient for most cases.



## Authentication Related

### auth_call_parallelism

- Type: Integer

- Default Value: 4

- Limits: 0 to 2 times the number of available CPU cores

- Description: The number of core threads in the thread pool within AuthProviderManager.

### auth_auth_result_cache_limit

- Type: Long

- Default Value: 100,000

- Limits: Non-negative

- Description: The number of authentication results to be cached.

### auth_check_result_cache_limit

- Type: Long

- Default Value: 100,000

- Limits: Non-negative

- Description: The number of authorization results to be cached.

### auth_auth_result_expiry_seconds

- Type: Long

- Default Value: 5

- Limits: Non-negative

- Description: The time in seconds that authentication results are cached.

### auth_check_result_expiry_seconds

- Type: Long

- Default Value: 5

- Limits: Non-negative

- Description: The time in seconds that authorization results are cached.



## Message Distribution Related

### dist_client_max_calls_per_queue

- Type: Integer

- Default Value: 1

- Limits: Positive value

- Description: The number of unfinished BatchTasks in each CallQueue while forwarding messages from the internal mqtt-server to the dist-server module. Setting the value to 1 means that a new BatchTask is dispatched only after the previous one is completed.

### dist_server_max_calls_per_queue

- Type: Integer

- Default Value: 1

- Limits: Positive value

- Description: The number of unfinished BatchTasks in each CallQueue while forwarding messages from the internal dist-server to the dist-worker module. Setting the value to 1 means that a new BatchTask is dispatched only after the previous one is completed.

### dist_server_max_topics_in_batch

- Type: Integer

- Default Value: 200

- Limits: Positive value

- Description: The maximum number of Senders included in each BatchTask (<Sender, TopicMessagePacks>) while forwarding messages from the mqtt-server to the dist-server module and from the dist-server to the dist-worker module. Exceeding this value will trigger the BatchTask to be packaged and sent immediately.

### dist_server_max_updates_in_batch

- Type: Integer

- Default Value: 100

- Limits: Positive value

- Description: The maximum number of SubCalls included in each BatchTask while forwarding SubCall requests from the dist-server to the dist-worker module. Exceeding this value will trigger the BatchTask to be packaged and sent immediately.

### dist_server_dist_worker_call_queues

- Type: Integer

- Default Value: 16

- Limits: Positive value

- Description: The number of CallQueues to which all BatchTasks belong when forwarding DistRequests from dist-server to dist-worker, affecting the concurrency of BatchTask dispatch.

### dist_worker_max_inflight_send

- Type: Integer

- Default Value: 2

- Limits: Positive value

- Description: The number of unfinished BatchTasks in each CallQueue while forwarding messages from the internal dist-worker to the downstream Inbox module. Setting this value to 2 means that each CallQueue can have at most 2 unfinished BatchTasks.

### dist_worker_parallel_fanout_size

- Type: Integer

- Default Value: 5000

- Limits: Positive value

- Description: Used primarily for large-scale fan-out scenarios. When the dist-worker module performs fan-out to the downstream Inbox module, every time a certain number of Routes is exceeded, it is allocated as a new Task in the thread pool to increase concurrency. For example, if the fan-out scale is 20,000, each message distribution task will be divided into four parts and executed in parallel in the thread pool.

### dist_worker_fanout_parallelism

- Type: Integer

- Default Value: Number of available CPU cores / 2, with a minimum of 2

- Constraint: Must be positive

- Description: The size of the thread pool for the concurrent fanOut described in the dist_worker_parallel_fanout_size parameter.

### dist_worker_max_batch_send_messages

- Type: Integer

- Default Value: 10,000

- Constraint: Must be positive

- Description: The maximum number of messages in all TopicMessagePacks contained in each BatchTask when forwarding from dist-worker to the Inbox module. Once this value is exceeded, the BatchTask is immediately packaged for sending.

### dist_worker_max_cached_subs_per_traffic

- Type: Long

- Default Value: 100,000

- Constraint: Must be positive

- Description: The maximum number of Topics and their matching results that can be cached per trafficId in the subscription cache within the dist-worker module.

### dist_worker_topic_match_expiry_seconds

- Type: Integer

- Default Value: 5

- Constraint: Must be positive

- Description: The expiration time for subscription cache in the dist-worker module, measured in seconds.

### dist_worker_match_parallelism

- Type: Integer

- Default Value: Number of available CPU cores / 2, with a minimum of 2

- Constraint: Must be positive

- Description: The number of core threads in the thread pool for processing subscription cache in the dist-worker module.

## Dist-worker Load Related

### dist_worker_max_range_load

- Type: Integer

- Default Value: 300,000

- Constraint: Must be positive

- Description: The maximum load specification for each KVRange in the dist-worker module, used to estimate the percentage of current real-time load.

### dist_worker_split_key_threshold

- Type: Double

- Default Value: 0.7

- Constraint: Must be greater than or equal to 0 and less than 1

- Description: The load threshold within KVRange in the dist-worker module used to determine if a split can be performed. If the current real-time load exceeds the threshold, the corresponding SplitKey is calculated.

### dist_worker_load_tracking_seconds

- Type: Integer

- Default Value: 5

- Constraint: Must be positive

- Description: The tracking time window size, in seconds, used in the dist-worker module for recording KVRange load.

### dist_worker_replica_voter_count

- Type: Integer

- Default Value: 3

- Constraint: Must be positive

- Description: The number of voters in the built-in Raft component of KVRange in the dist-worker module. Setting it to 3 means that there can be up to 3 voters. This is only effective in cluster deployment.

### dist_worker_replica_learner_count

- Type: Integer

- Default Value: 3

- Constraint: Must be positive

- Description: The number of learners in the built-in Raft component of KVRange in the dist-worker module. Setting it to 3 means that there can be up to 3 learners. This is only effective in cluster deployment.

### dist_worker_recovery_timeout_millis

- Type: Long

- Default Value: 10,000

- Constraint: Must be positive

- Description: The time, in milliseconds, after which the built-in KVStore Balance Controller in the dist-worker module will consider inactive nodes as dead during scheduling decisions. This is only effective in cluster deployment.

## Inbox Module Related

### inbox_inbox_groups

- Type: Integer

- Default Value: 100

- Constraints: Positive value

- Description: In the mqtt-server module, for connections with cleansession set to false, during interaction with the inbox-server module, they are assigned to different InboxGroupKeys based on inboxId. This is used to hash related RPC requests to specific service nodes, primarily effective in clustered deployments.

### inbox_fetch_pipeline_creation_rate_limit

- Type: Double

- Default Value: 5000

- Constraints: Non-negative value

- Description: This represents the rate at which the fetch pipelines are created in the Inbox-server module. It prevents the generation of a large number of pipeline redirects in an instant when the hash topology in the inbox-store module changes. This is mainly effective in clustered deployments.

### inbox_max_inboxes_per_insert

- Type: Integer

- Default Value: 500

- Constraints: Positive value

- Description: When writing MessagePacks from the Inbox-server to the Inbox-store module, this denotes the maximum number of MessagePacks contained in each BatchTask. Once this value is exceeded, the BatchTask is immediately prepared for sending.

### inbox_max_inboxes_per_commit

- Type: Integer

- Default Value: 500

- Constraints: Positive value

- Description: When forwarding Commit requests from the Inbox-server to the Inbox-store module, this denotes the maximum number of requests contained in each BatchTask. Once this value is exceeded, the BatchTask is immediately prepared for sending.

### inbox_max_inboxes_per_create

- Type: Integer

- Default Value: 500

- Constraints: Positive value

- Description: When forwarding Create requests from the Inbox-server to the Inbox-store module, this denotes the maximum number of requests contained in each BatchTask. Once this value is exceeded, the BatchTask is immediately prepared for sending.

### inbox_max_inboxes_per_touch

- Type: Integer

- Default Value: 500

- Constraints: Positive value

- Description: When forwarding Touch requests from the Inbox-server to the Inbox-store module, this denotes the maximum number of InboxIds contained in each BatchTask. Once this value is exceeded, the BatchTask is immediately prepared for sending.

### inbox_max_inboxes_per_fetch

- Type: Integer

- Default Value: 500

- Constraints: Positive value

- Description: When forwarding Fetch requests from the Inbox-server to the Inbox-store module, this denotes the maximum number of InboxIds contained in each BatchTask. Once this value is exceeded, the BatchTask is immediately prepared for sending.

### inbox_max_inboxes_per_check

- Type: Integer

- Default Value: 500

- Constraints: Positive value

- Description: When forwarding Check requests from the Inbox-server to the Inbox-store module, this denotes the maximum number of InboxIds contained in each BatchTask. Once this value is exceeded, the BatchTask is immediately prepared for sending.

### inbox_max_bytes_per_insert

- Type: Integer

- Default Value: 1Mb

- Constraints: Non-negative value

- Description: When writing MessagePacks from the Inbox-server to the Inbox-store module, this represents the maximum combined payload size of MessagePacks contained in each BatchTask. Once this value is exceeded, the BatchTask is immediately prepared for sending.

### inbox_fetch_queues_per_range

- Type: Integer

- Default Value: 1 to (Number of available CPU cores / 4)

- Constraints: Positive value

- Description: When executing Fetch message requests from the Inbox-server to the Inbox-store module, this specifies the number of CallQueues that each BatchTask belongs to for each KVRange, affecting the concurrency of BatchTask distribution.

### inbox_check_queues_per_range

- Type: Integer

- Default Value: 1

- Constraints: Positive value

- Description: When executing Check requests from the Inbox-server to the Inbox-store module, this specifies the number of CallQueues that each BatchTask belongs to for each KVRange, affecting the concurrency of BatchTask distribution.

### mqtt_inboxgroups_per_server

- Type: Integer

- Default Value: 4

- Constraints: Positive value

- Description: In the mqtt-server module, for connections with cleansession set to true, they are assigned to different InboxGroupKeys based on inboxId. This is used to hash related RPC requests to specific service nodes, primarily effective in clustered deployments.