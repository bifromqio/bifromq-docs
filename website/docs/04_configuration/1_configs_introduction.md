---
sidebar_position: 1
title: "Overview"
---


# Configuration Overview

BifroMQ's system parameters can be configured through two different methods: using a configuration file and setting system variables. This section will introduce both methods and explain their meanings.

## Configuration File Introduction

The main configuration file is named `standalone.yml` and is located at:

| Installation Method | File Location                          |
| :------------------ | -------------------------------------- |
| Zip Extraction      | ./conf/standalone.yml                  |
| Docker Container    | /usr/share/bifromq/conf/standalone.yml |

The main configuration file contains most of the essential configuration options. For any additional configuration options not explicitly specified in the configuration file, the default settings will be used. For the full list of available configuration options and their descriptions, please refer to the [Configuration File Manual](2_file_configs_manual.md).

## System Variables Introduction

In addition to the configuration file, BifroMQ can also be configured using system variables.

Most of the configuration options injected through system variables do not overlap with those injected through the configuration file, as they are responsible for different scopes.

System variables are injected by using the `-DargKey=argValue` format when executing the Java command. They can be retrieved internally using `System.getProperty(argKey)`. If not explicitly specified, default values will be used.

Note: System variables injected using `-D` are in String format. Internally, they will be parsed into different value types based on the `argKey`, so it is essential to ensure the correct format when injecting parameters.

For the full list of available configuration options and their descriptions, please refer to the [System Variables Manual](3_sys_props_manual.md).