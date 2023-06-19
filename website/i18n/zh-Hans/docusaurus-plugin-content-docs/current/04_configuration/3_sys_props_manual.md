---
sidebar_position: 3
---


# 系统变量手册

BifroMQ可注入的系统变量介绍。

系统变量主要侧重于性能方面的调优使用，一般情况下使用默认值即可。



## Auth相关

### auth_call_parallelism

- 类型：Integer

- 默认值：4

- 限制：0 ~ 2 * CPU可用核数

- 描述：AuthProviderManager中线程池核心线程数。

### auth_auth_result_cache_limit

- 类型：Long

- 默认值：100,000

- 限制：非负

- 描述：认证结果缓存数量。

### auth_check_result_cache_limit

- 类型：Long

- 默认值：100,000

- 限制：非负

- 描述：鉴权结果缓存数量。

### auth_auth_result_expiry_seconds

- 类型：Long

- 默认值：5

- 限制：非负

- 描述：认证结果缓存时间。

### auth_check_result_expiry_seconds

- 类型：Long

- 默认值：5

- 限制：非负

- 描述：鉴权结果缓存时间。



## 消息分发相关

### dist_client_max_calls_per_queue

- 类型：Integer

- 默认值：1

- 限制：正值

- 描述：消息从内部mqtt-server到dist-server模块转发时，每个CallQueue中未完成的BatchTask数量。值置为1的意思是，每个已经发送的BatchTask在Completed后才会下发下一个BatchTask。

### dist_server_max_calls_per_queue

- 类型：Ingeter

- 默认值：1

- 限制：正值

- 描述：消息从内部dist-server到dist-worker模块转发时，每个CallQueue中未完成的BatchTask数量。值置为1的意思是，每个已经发送的BatchTask在Completed后才会下发下一个BatchTask。

### dist_server_max_topics_in_batch

- 类型：Integer

- 默认值：200

- 限制：正值

- 描述：mqtt-server到dist-server模块转发及dist-server到dist-worker模块转发时，每个BatchTask（<Sender, TopicMessagePacks>）中包含的最大Sender数量。超过此值后会马上将此BatchTask打包准备发送。

### dist_server_max_updates_in_batch

- 类型：Integer

- 默认值：100

- 限制：正值

- 描述：dist-server到dist-worker模块转发SubCall请求时，每个BatchTask中包含的最大SubCall数量。超过此值后会马上将此BatchTask打包准备发送。

### dist_server_dist_worker_call_queues

- 类型：Integer

- 默认值：16

- 限制：正值

- 描述：dist-server到dist-worker模块转发DistRequest时，所有BatchTask所属的CallQueue的数量，影响BatchTask下发的并发度。

### dist_worker_max_inflight_send

- 类型：Integer

- 默认值：2

- 限制：正值

- 描述：消息从内部dist-worker到下游Inbox模块转发时，每个CallQueue中未完成的BatchTask数量。值置为2的意思是，每个CallQueue中最多允许存在2个未完成的BatchTask。

### dist_worker_parallel_fanout_size

- 类型：Integer

- 默认值：5000

- 限制：正值

- 描述：主要针对大规模fanOut模式，消息从内部dist-worker向下游Inbox模块fanOut时，每超过一定的数量的Route会作为一个新的Task分配置线程池，以增大并发度。如fanOut规模为2万时，每条消息的分发任务会被分成四份在线程池中并行执行。

### dist_worker_fanout_parallelism

- 类型：Integer

- 默认值：当前CPU可用核数 / 2，最小为2

- 限制：正值

- 描述：dist_worker_parallel_fanout_size参数中描述的并发fanOut的线程池的大小。

### dist_worker_max_batch_send_messages

- 类型：Integer

- 默认值：10,000

- 限制：正值

- 描述：dist-worker到Inbox模块转发TopicMessagePack时，每个BatchTask中包含的所有TopicMessagePack中最大Message的数量。超过此值后会马上将此BatchTask打包准备发送。

### dist_worker_max_cached_subs_per_traffic

- 类型：Long

- 默认值：100,000

- 限制：正值

- 描述：dist-worker模块中的订阅缓存中，为每个trafficId缓存的Topic及匹配结果的最大值。

### dist_worker_topic_match_expiry_seconds

- 类型：Integer

- 默认值：5

- 限制：正值

- 描述：dist-worker模块中的订阅缓存过期时间。

### dist_worker_match_parallelism

- 类型：Integer

- 默认值：当前CPU可用核数 / 2，最小为2

- 限制：正值

- 描述：dist-worker模块中的订阅缓存执行线程池的核心线程数。



## Dist-worker负载相关

### dist_worker_max_range_load

- 类型：Integer

- 默认值：300,000

- 限制：正值

- 描述：dist-worker模块中的每个KVRange的最大负载规格，用于估算KVRange当前实时负载已占用的百分比。

### dist_worker_split_key_threshold

- 类型：Double

- 默认值：0.7

- 限制：大于等于0，小于1

- 描述：dist-worker模块中的KVRange用于判断是否可以进行Split的负载阈值，若当前实时负载占用已超过threshold，则估算出对应的SplitKey。

### dist_worker_load_tracking_seconds

- 类型：Integer

- 默认值：5

- 限制：正值

- 描述：dist-worker模块中记录KVRange的负载时的跟踪时间窗口大小。

### dist_worker_replica_voter_count

- 类型：Integer

- 默认值：3

- 限制：正值

- 描述：dist-worker模块中KVRange的内置Raft组件voter数量，设置为3的意思是最多会有3个，只在集群部署时有效。

### dist_worker_replica_learner_count

- 类型：Integer

- 默认值：3

- 限制：正值

- 描述：dist-worker模块中KVRange的内置Raft组件learner数量，设置为3的意思是最多会有3个，只在集群部署时有效。

### dist_worker_recovery_timeout_millis

- 类型：Long

- 默认值：10,000

- 限制：正值

- 描述：dist-worker模块内置的KVStore Balance Controller在进行调度判定时，失活的节点在此参数定义的时间后即被认定为Dead节点，只在集群部署时有效。



## Inbox模块相关

### inbox_inbox_groups

- 类型：Integer

- 默认值：100

- 限制：正值

- 描述：mqtt-server模块中的cleansessoin=false的连接，在与inbox-server模块进行交互时，根据inboxId被归属与不同的InboxGroupKey，用于将相关RPC请求hash到具体的相关服务节点，主要在集群部署时生效。

### inbox_fetch_pipeline_creation_rate_limit

- 类型：Double

- 默认值：5000

- 限制：非负

- 描述：Inbox-server模块中产生fetch pipeline的速率，防止在inbox-store模块hash拓扑发生变化后，瞬间产生大量的pipeline重定向，主要在集群部署时生效。

### inbox_max_inboxes_per_insert

- 类型：Integer

- 默认值：500

- 限制：正值

- 描述：Inbox-server到Inbox-store模块写入MessagePack时，每个BatchTask中包含的最大MessagePack的数量。超过此值后会马上将此BatchTask打包准备发送。

### inbox_max_inboxes_per_commit

- 类型：Integer

- 默认值：500

- 限制：正值

- 描述：Inbox-server到Inbox-store模块转发Commit请求时，每个BatchTask中包含的最大请求的数量。超过此值后会马上将此BatchTask打包准备发送。

### inbox_max_inboxes_per_create

- 类型：Integer

- 默认值：500

- 限制：正值

- 描述：Inbox-server到Inbox-store模块转发Create请求时，每个BatchTask中包含的最大请求的数量。超过此值后会马上将此BatchTask打包准备发送。

### inbox_max_inboxes_per_touch

- 类型：Integer

- 默认值：500

- 限制：正值

- 描述：Inbox-server到Inbox-store模块转发Touch请求时，每个BatchTask中包含的最大InboxId的数量。超过此值后会马上将此BatchTask打包准备发送。

### inbox_max_inboxes_per_fetch

- 类型：Integer

- 默认值：500

- 限制：正值

- 描述：Inbox-server到Inbox-store模块转发Fetch请求时，每个BatchTask中包含的最大InboxId的数量。超过此值后会马上将此BatchTask打包准备发送。

### inbox_max_inboxes_per_check

- 类型：Integer

- 默认值：500

- 限制：正值

- 描述：Inbox-server到Inbox-store模块转发Check请求时，每个BatchTask中包含的最大InboxId的数量。超过此值后会马上将此BatchTask打包准备发送。

### inbox_max_bytes_per_insert

- 类型：Integer

- 默认值：1Mb

- 限制：非负

- 描述：Inbox-server到Inbox-store模块写入MessagePack时，每个BatchTask中包含的最大MessagePack的payload大小总和。超过此值后会马上将此BatchTask打包准备发送。

### inbox_fetch_queues_per_range

- 类型：Integer

- 默认值：1 ~ CPU可用核数 / 4

- 限制：正值

- 描述：Inbox-server向Inbox-store模块执行Fetch消息请求时，每个KVRange上的BatchTask所属的CallQueue的数量，影响BatchTask下发的并发度。

### inbox_check_queues_per_range

- 类型：Integer

- 默认值：1

- 限制：正值

- 描述：Inbox-server向Inbox-store模块执行Check请求时，每个KVRange上的BatchTask所属的CallQueue的数量，影响BatchTask下发的并发度。

### mqtt_inboxgroups_per_server

- 类型：Integer

- 默认值：4

- 限制：正值

- 描述：mqtt-server模块中的cleansessoin=true的连接，根据inboxId被归属与不同的InboxGroupKey，用于将相关RPC请求hash到具体的相关服务节点，主要在集群部署时生效。