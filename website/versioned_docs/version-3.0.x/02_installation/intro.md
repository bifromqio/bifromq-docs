---
sidebar_position: 0
title: "Installation Overview"
---

## Prerequisites

BifroMQ requires **Java 17** or higher for its operation. Ensure your Java runtime environment is updated to meet these requirements before proceeding with the BifroMQ installation.

## Installation Directory Structure

Upon installation, BifroMQ organizes its files within the following directory structure:

| Directory | Description                                                       |
|-----------|-------------------------------------------------------------------|
| `bin`     | Executable scripts for starting and managing BifroMQ.             |
| `conf`    | Configuration files necessary for customizing BifroMQ operations. |
| `lib`     | Program libs for running BifroMQ.                                 |
| `plugins` | BifroMQ plugins in [pf4j](https://pf4j.org) compatible format.    |
| `data`    | User's persistent data.                                           |
| `logs`    | Log files.                                                        |

## Running BifroMQ

The startup script for BifroMQ recognizes several environment variables that allow for customization and optimization of its runtime environment:

| Environment Variable | Description                                                                                      |
|----------------------|--------------------------------------------------------------------------------------------------|
| `LOG_DIR`            | Specifies the directory where BifroMQ should store its log files. Defaults to `./logs` if unset. |
| `DATA_DIR`           | Determines the directory for storing BifroMQ data. Defaults to `./data` if unset.                |
| `JAVA_HOME`          | Specifies the path to the Java Runtime Environment (JRE) that BifroMQ should use.                |
| `MEM_LIMIT`          | Limits the maximum amount of memory that BifroMQ can use.                                        |
| `JVM_PERF_OPTS`      | Custom JVM performance options for tuning the JVM instance running BifroMQ.                      |
| `JVM_GC_OPTS`        | Garbage Collection (GC) options to optimize memory management for BifroMQ.                       |
| `JVM_HEAP_OPTS`      | Specifies JVM heap size and other memory settings directly impacting BifroMQ's performance.      |
| `EXTRA_JVM_OPTS`     | Additional JVM options that users may want to pass to customize the BifroMQ runtime environment. |
| `JVM_DEBUG`          | Enables debugging options for the JVM, useful for development and troubleshooting.               |
| `JAVA_DEBUG_PORT`    | When `JVM_DEBUG` is enabled, sets the port for the JVM debugger to attach to.                    |
