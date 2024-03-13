---
sidebar_position: 0 
title: "Security Overview"
---

Security, a broad and critical aspect of any system, is a key focus for BifroMQ. Recognizing the importance of securing MQTT broker deployments, BifroMQ offers a suite of features designed to address various security concerns, from cluster isolation to client authentication and risk management of malicious client behavior.

## Cluster Isolation and Secure Inter-Node Communication

### Decentralized Cluster Formation
BifroMQ utilizes a decentralized approach for cluster building, allowing nodes to join a cluster by simply sending a `join` request to any existing cluster member. To prevent unintended cluster mergers due to operational errors, BifroMQ supports specifying a "cluster environment" in the [configuration file](../01_configuration/1_config_file_manual.md). This logical separation ensures that clusters intended for different purposes remain distinct, safeguarding against incorrect merges.

### Secure Inter-Node Communication
Node communication in BifroMQ occurs through two primary methods: P2P communication via `base-cluster` technology and RPC communication via `base-rpc` technology. Both methods offer configurable binding addresses and ports for finer control over firewall rules. Importantly, base-rpc supports TLS configuration, enabling end-to-end secure RPC communication between nodes.

## Client Authentication and Authorization

### Auth Provider Plugin
Client security in BifroMQ encompasses both authentication (verifying client identity) and authorization (granting privileges to various actions). BifroMQ employs the [auth provider plugin](../../06_plugin/1_auth_provider.md) as a unified approach to client security management.

### Secure Communication Channels
BifroMQ supports MQTT over TLS and MQTT over WSS, enabling secure communication between clients and the broker. Businesses can choose between one-way and two-way authentication depending on their security requirements. For two-way authentication scenarios, the plugin implementation can access the complete certificate content, aiding in custom large-scale client certificate lifecycle management.

## Risk Management of Bad-behavior Clients
Identifying and managing bad-behavior clients—those that violate protocol standards or consume excessive system resources—is crucial for maintaining system integrity, especially in large-scale, multi-tenant MQTT deployments. BifroMQ addresses this challenge through real-time event collection and analysis via the EventCollector plugin. By identifying malicious client behaviors and integrating response strategies into the auth provider plugin, BifroMQ enables administrators to deny access to offending clients effectively. While the implementation of such strategies extends beyond BifroMQ's core functionality, the [BifroMQ team](mailto:hello@bifromq.io) offers extensive expertise and professional consulting services for users facing similar challenges.
