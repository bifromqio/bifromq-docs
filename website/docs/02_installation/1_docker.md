---
sidebar_position: 1
title: "Docker"
---

## Prerequisites

* [Docker](https://www.docker.com/) is installed.
* You have permission to use port 1883, and the port are available. If you do not have permission, please change to the corresponding port.

## Docker Command

Run the following command, which will run BifroMQ within a container as the Linux user `bifromq`.

```
docker run -d --name bifromq -p 1883:1883 bifromq/bifromq:latest
```

## Memory Constraints

By default, upon BifroMQ process initiation, it dynamically computes the relevant JVM parameters based on the physical memory of the hosting server. However, when launched within a containerized environment, it introspects the host
machine's physical memory, potentially causing conflicts with Docker or container-imposed memory constraints, consequently leading to the premature termination of the container.

To circumvent such challenges, it is advisable to proactively delimit the container's memory consumption and convey these limitations to the container runtime via environmental variables. During the startup of BifroMQ, priority is given to
the calculation of JVM parameters based on the `MEM_LIMIT` environmental variable. A specific illustration is provided below:

```
docker run -d -m 10G -e MEM_LIMIT='10737418240' --name bifromq -p 1883:1883 bifromq/bifromq:latest
```

***Note: The unit of MEM_LIMIT is in bytes.***

Going a step further, it is possible to proactively configure the JVM heap memory and directly transmit it to the container runtime for utilization by BifroMQ. A specific illustration is provided below:

```
docker run -d -m 10G -e JVM_HEAP_OPTS='-Xms2G -Xmx4G -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=500m -XX:MaxDirectMemorySize=1G' --name bifromq -p 1883:1883 bifromq/bifromq:latest
```

