---
sidebar_position: 1
---

# TLS

## Introduction
TLS allows for the secure transmission of information across the network between a client and a server through the use of encryption. This prevents any unauthorized individuals from eavesdropping on your communications or accessing data that you send over the network. BifroMQ provides extensive support for SSL/TLS connectivity options, including TLS connections and WebSocket Security connections. It also supports flexible configuration options for both single and two-way authentication, allowing you to select different levels of authentication based on your configuration.

## Prerequisites
You will need to prepare and configure the SSL/TLS certificates that you will use. In a testing environment, you can generate self-signed certificates using the OpenSSL tool. However, in a production environment, you should use certificates issued by a trusted CA (Certificate Authority).

## Enabling via Configuration
Follow the instructions in the `brokerSSLCtxConfig` section of the [Configuration File Manual](../04_configuration/2_file_configs_manual.md). Enable the desired level of authentication, enter the appropriate certificate names, and place the certificate files in the location specified by the configuration parameters.