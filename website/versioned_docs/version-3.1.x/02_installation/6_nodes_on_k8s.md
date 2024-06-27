---
sidebar_position: 6
title: "Notes on Kubernetes Deployment"
---

Deploying BifroMQ on Kubernetes requires careful consideration of its stateful service characteristics and understanding of Kubernetes-specific cluster operations and maintenance practices. Here are some key considerations and guidelines.

## Stateful Service Considerations

BifroMQ includes a built-in distributed storage engine, and users choosing to run BifroMQ in Kubernetes should carefully plan for:

- **Persistent Volume**
- **StatefulSets**
- **Headless Services**

## Deployment Complexity
Running BifroMQ on Kubernetes involves complexities including:

- **Networking**: Choosing the appropriate network policies and Ingress Controller to manage communication between internal and external clients to the cluster.
- **Configuration Management**: Using ConfigMaps or Secrets to manage BifroMQ configurations in a dynamic and scalable manner.
- **Resource Limits and Requests**: Defining appropriate CPU and memory limits and requests to ensure BifroMQ has sufficient resources for optimal performance without starving other applications.

## Cluster Operations and Maintenance

Successful deployment of BifroMQ on Kubernetes requires a deep understanding of:

- **Cluster Monitoring and Logging**: Implementing comprehensive monitoring and logging to quickly identify and resolve issues.
- **Scalability**: Understanding how to scale BifroMQ appropriately in Kubernetes to handle varying loads without impacting performance.

## BifroMQ Team Support
Deploying BifroMQ on Kubernetes introduces additional complexity, and the [BifroMQ team](mailto:hello@bifromq.io) offers professional consulting services to help users achieve optimal deployment outcomes.