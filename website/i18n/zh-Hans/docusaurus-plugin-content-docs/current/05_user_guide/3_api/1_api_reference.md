---
sidebar_position: 1 
title: API Reference
---

## API Endpoints

### 1. Publish a message to given topic

- **URL**: `/pub`
- **Method**: `POST`
- **Headers**:
    - `req_id` (optional): Optional caller-provided request ID. Integer (int64).
    - `tenant_id` (required): The tenant ID. String.
    - `topic` (required): The message topic. String.
    - `qos` (required): QoS of the message to be retained. String.
    - `expiry_seconds` (optional): The message expiry seconds. String.
    - `client_type` (required): The publisher type. String.
    - `client_meta_*`: The metadata header about the publisher, must start with `client_meta_`. String.
- **Request Body**: Message payload will be treated as binary.
- **Responses**:
    - `200`: Success.

### 2. Retain a message to given topic/Clear retained message for given topic

- **URL**: `/retain`
- **Method**: `POST`
- **Headers**:
    - `req_id` (optional): Optional caller-provided request ID. Integer (int64).
    - `tenant_id` (required): The tenant ID. String.
    - `topic` (required): The message topic. String.
    - `qos` (required): QoS of the message to be retained. String.
    - `expiry_seconds` (optional): The message expiry seconds. String.
    - `client_type` (required): The publisher type. String.
    - `client_meta_*`: The metadata header about the publisher, must start with `client_meta_`. String.
- **Request Body**: Message payload will be treated as binary or zero-bytes for clearing retained message.
- **Responses**:
    - `200`: Success.

### 3. Get session information of given user and client id

- **URL**: `/session`
- **Method**: `GET`
- **Headers**:
    - `req_id` (optional): Optional caller-provided request ID. Integer (int64).
    - `tenant_id` (required): The ID of the tenant. String.
    - `user_id` (required): The ID of the user who established the session. String.
    - `client_id` (required): The client ID of the MQTT session. String.
- **Responses**:
    - `200`: Success.
    - `404`: No session found for the given user and client ID.

### 4. Expire inactive persistent session using given expiry time

- **URL**: `/session`
- **Method**: `DELETE`
- **Headers**:
    - `req_id` (optional): Optional caller-provided request ID. Integer (int64).
    - `tenant_id` (required): The ID of the tenant. String.
    - `expiry_seconds` (optional): The overridden session expiry seconds. String.
- **Responses**:
    - `200`: Success.
#### Note
Setting expiry_seconds to 0 will clean all inboxes under the specified tenant, including those still
online. Connections will be disconnected due to the loss of metadata. It is crucial to set this parameter appropriately.


### 5. Disconnect a MQTT client connection

This API endpoint facilitates the disconnection of MQTT client connections based on various identifiers, such as tenant, user, or specific client.

- **URL**: `/kill`
- **Method**: `DELETE`
- **Headers**:
  - `req_id` (optional): Optional caller-provided request ID. Integer (int64).
  - `tenant_id` (required): The ID of the tenant. String. This is mandatory for identifying the scope of connections to disconnect.
  - `user_id` (optional): The ID of the user who established the session. String. If provided alongside tenant_id, all connections associated with this user_id within the tenant will be disconnected.
  - `client_id` (optional): The client ID of the MQTT session. String. If provided alongside tenant_id and user_id, the specific connection identified by client_id will be disconnected.
  - `client_type` (required): The kicker type. String.
  - `client_meta_*`: The metadata header about the kicker, must start with `client_meta_`. String.
- **Responses**:
  - `200`: Success.
  - `404`: Not Found.
#### Note
1. Disconnect a Specific Client Connection:
  - Identifiers Required: tenant_id, user_id, and client_id.
  - Behavior: Disconnects the specific connection uniquely identified by the combination of tenant_id, user_id, and client_id.
2. Disconnect All Connections for a User:
  - Identifiers Required: tenant_id and user_id.
  - Behavior: Disconnects all connections created by the specified user_id under the provided tenant_id. This includes all connections associated with different client_ids for the given user.
3. Disconnect All Connections for a Tenant:
  - Identifier Required: tenant_id.
  - Behavior: Disconnects all connections under the specified tenant_id, regardless of user_id or client_id.

### 6. Add a Topic Subscription to an MQTT session

- **URL**: `/sub`
- **Method**: `PUT`
- **Headers**:
    - `req_id` (optional): Optional caller-provided request ID. Integer (int64).
    - `tenant_id` (required): The tenant ID. String.
    - `user_id` (required): The ID of the user who established the session. String.
    - `client_id` (required): The client ID of the MQTT session. String.
    - `topic_filter` (required): The topic filter. String.
    - `sub_qos` (required): the subscription qos level. 0|1|2.

- **Responses**:
    - `200`: Success.
    - `400`: Request is invalid.
    - `401`: Unauthorized to make the subscription using the given topic filter.
    - `404`: No session found for the given user and client ID.

### 8. Remove a Topic Subscription from an MQTT session

- **URL**: `/unsub`
- **Method**: `DELETE`
- **Headers**:
    - `req_id` (optional): Optional caller-provided request ID. Integer (int64).
    - `tenant_id` (required): The tenant ID. String.
    - `user_id` (required): The ID of the user who established the session. String.
    - `client_id` (required): The client ID of the MQTT session. String.
    - `topic_filter` (required): The topic filter. String.

- **Responses**:
    - `200`: Success.
    - `401`: Unauthorized to remove the subscription of the given topic filter.
    - `404`: No session found for the given user and client ID.