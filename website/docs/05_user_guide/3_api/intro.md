---
id: intro
sidebar_position: 0
title: "Overview"
---

BifroMQ offers a user-friendly HTTP RESTful API. This API lets you perform various actions, including disconnecting clients, querying session status, publishing messages, and managing subscriptions. Integrate BifroMQ seamlessly into your
custom management consoles or admin tools using these capabilities.

## Deployment

By default, API service capabilities are automatically enabled on every BifroMQ service node. This means requests sent to any node can achieve the same results, ensuring high availability of the API service in a default deployment.

![API-Arch.png](images%2FAPI-Arch.png)

To distribute incoming API requests and improve scalability, you can set up a load balancer, such as Nginx, in front of the BifroMQ API cluster.