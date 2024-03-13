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

- **URL**: `/kill`
- **Method**: `DELETE`
- **Headers**:
    - `req_id` (optional): Optional caller-provided request ID. Integer (int64).
    - `tenant_id` (required): The ID of the tenant. String.
    - `user_id` (required): The ID of the user who established the session. String.
    - `client_id` (required): The client ID of the MQTT session. String.
    - `client_type` (required): The kicker type. String.
    - `client_meta_*`: The metadata header about the kicker, must start with `client_meta_`. String.
- **Responses**:
    - `200`: Success.
    - `404`: Not Found.

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