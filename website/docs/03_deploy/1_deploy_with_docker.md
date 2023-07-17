---
sidebar_position: 1
---

# Deploy on Docker

## Prerequisites

* [Docker](https://www.docker.com/) is installed.
* You have permission to use port 1883, and the port are available. If you do not have permission, please change to the corresponding port.

## Docker Command

Run the following command, which will run BifroMQ in `standalone` mode within a container as the Linux user `bifromq`.

```
docker run -d --name bifromq -p 1883:1883 bifromq/bifromq:latest
```