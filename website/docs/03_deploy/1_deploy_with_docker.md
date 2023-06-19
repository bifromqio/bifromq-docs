---
sidebar_position: 1
---

# Deploy on Docker

## Prerequisites

* [Docker](https://www.docker.com/) is installed.
* You have permission to use ports 1883, 1884, 80, and 443, and these ports are available. If you do not have permission, please change to the corresponding ports.

## Docker Command

Run the following command, which will run BifroMQ in `standalone` mode within a container as the Linux user `bifromq`.

```
docker run -d --name biformq -p 1883:1883 -p 1884:1884 -p 443:443 -p 80:80 bifromq/bifromq:latest
```