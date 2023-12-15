---
sidebar_position: 1
---

# API Service

## Introduction

The API Service plays a vital role in managing devices and ensuring optimal performance. It enables users to perform
administrative operations via a set of APIs. These operations include proxy publishing, subscribing, unsubscribing from
messages, and device kicking. Additionally, users can use an API to clear unnecessary inbox messages, thereby improving
overall system performance. In order to maintain the performance of the system when dealing with CleanSession=false, it 
is crucial to clear any offline messages that are no longer in use and lingering in the system.

Swagger yaml can be found [here](https://bifromq-api.gz.bcebos.com/BifroMQ-API.yaml).

## Deployment
The API service is seamlessly integrated into the BifroMQ instance. Once BifroMQ is configured and operational, you gain
immediate access to its APIs. This means that within the BifroMQ cluster, an API service cluster is automatically 
established. The diagram below provides a visual representation of this architecture.

![API-Arch.png](images%2FAPI-Arch.png)

One can set up load balancer, e.g. Nginx, in front the API cluster to balance the load.

## List of APIs

### Subscription(`/sub`)

#### Description

Users can call `/sub` to do proxy subscription. There are 3 types inboxes in subscription, i.e. cleanSession = true,
cleanSession = false and external inbox.

Each inbox type behaves slightly differently. The first two inboxes are internal to BifroMQ, while the third is external
for customized business purpose.

#### Key Parameters

* `tenant_id`: the tenantId for the user.
* `topic_filter`: the topicFilter that the user wants to subscribe.
* `sub_qos`: the subscription QoS for the topicFilter.
* `inbox_id`: the inbox that the user wants to do proxy subscription.
* `subbroker_id`: inbox types, i.e. cleanSession = true, cleanSession = false and external ones.
* `deliverer_key`: the key for message delivery that is mandatory for external inboxes.

**Note**: 
* The value of `inbox_id` depends on whether the session is set to `cleanSession = true` or `cleanSession = false`. In 
the case of `cleanSession = true`, the `inbox_id` is assigned by BifroMQ, which corresponds to the `userSessionId` in the 
`ClientConnected` event. However, for `cleanSession = false`, it is the clientId that is assigned by the users.
* Subscriptions with `cleanSession = true` behavior align with the standard MQTT protocol.
* The integration between BifroMQ and external inboxes is a feature that will be introduced in future releases. 
Please stay tuned for updates.

#### Return Value

If subscription successes, it will return requested QoS. In case of failure, the returned QoS will be `128`.

#### Notes

* For external inboxes, the API service records only the topic filters of interest in BifroMQ. Each external inbox must
  maintain its list of interesting topicFilters.
* The `deliverer_key` parameter is mandatory for external inboxes. Inboxes sharing the same `deliverer_key` will use the
  same RPC channel for message delivery, so users should manage this key carefully.
* For cleanSession = false inboxes, they may not be connected to BifroMQ at the moment, so the subscription only deals
  with recording topicFilters. If there are any retained messages, they will not be pushed. However, for cleanSession =
  true inboxes, retained messages will be pushed to corresponding devices.

### Unsubscription(`/unsub`)

#### Description

The Unsubscription API allows users to unsubscribe from a specific topicFilter. Similar to the subscription process,
external inboxes are responsible for managing their list of interested topicFilters, and users should manage the
`deliverer_key` for external inboxes effectively.

#### Key Parameters

* `tenant_id`: the tenantId for the user.
* `topic_filter`: the topicFilter that the user wants to unsubscribe.
* `inbox_id`: the inbox that the user wants to do proxy unsubscription.
* `subbroker_id`: inbox types, i.e. cleanSession = true, cleanSession = false and external ones.
* `deliverer_key`: the key for message delivery that is mandatory for external inboxes.

#### Return Value

If unsubscription successes, it will return `200` status code. Otherwise, it will return `NOT_FOUND` for failed
subscription or `FORBIDDEN` for topicFilter checking failure.

### Publishing(`/pub`)

#### Description

The Publishing API, denoted as `/pub`, allows users to publish a message to a specified topic. It also supports retained
messages.

#### Key Parameters

* `tenant_id`: the tenantId for the user.
* `topic`: the topic of the message.
* `client_type`: the client type for publisher.
* `pub_qos`: QoS of the message to be distributed.
* `retain`: If the message needs to be retained, make it to be true.

#### Note

During the publishing phase, a parameter called `pub_qos` is used to denote the publisher's desired Quality of Service
(QoS). It's important to note that this parameter doesn't dictate the QoS for message delivery between the publisher and
BifroMQ since the HTTP protocol lacks native QoS support. If the API service were to forcibly downgrade QoS to
`AT_MOST_ONCE`, it could indirectly impact the QoS between BifroMQ and subscribers. Therefore, the API service retains
the QoS information. Additionally, it's the responsibility of the user, specifically the publisher, to manage the actual
QoS between themselves and BifroMQ.

### Kill(`/kill`)

#### Description

Sometimes users need to disconnect the other device with the same clientId. Therefore, one can call the API to do the
job.

#### Key Parameters

* `tenant_id`: the tenantId for the user.
* `user_id`: the user id of the MQTT client connection to be disconnected.
* `client_type`: the client type for the active kicker.

### Manually Expire Inboxes(/expireinbox)

#### Description

This endpoint is used to clean the inbox information stored for connections with cleanSession=false. It includes both
metadata and MQTT messages stored in the inbox, actively reducing resource usage for expired connections.

#### Key Parameters

* `tenant_id`: the tenantId for the user.
* `expiry_seconds`: Time limit for expiration. Inboxes that have been inactive for more than this duration will be
  cleaned.

#### Note
Setting expiry_seconds to 0 will clean all inboxes under the specified tenant, including those still
online. Connections will be disconnected due to the loss of metadata. It is crucial to set this parameter appropriately.