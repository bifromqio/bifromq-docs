---
sidebar_position: 1
---

# Connect to BifroMQ

BifroMQ is a standard MQTT messaging middleware, which allows you to connect using any client that supports MQTT version 3.1 or 3.1.1.

## Connection Address

Use the IP address or domain name corresponding to the launched service. Below are the default ports and their purposes:

| Port                  | Note           |
|-----------------------|----------------|
| IP or Domain:1883     | TCP Connection |
| IP or Domain:1884     | TLS Connection |
| IP or Domain:80/mqtt  | WS Connection  |
| IP or Domain:443/mqtt | WSS Connection |

## Authentication

By default, authentication is not enabled. You can connect without providing a username or password. If you need authentication, please refer to the [Authentication Plugin](../../06_plugin/2_auth_provider.md).
