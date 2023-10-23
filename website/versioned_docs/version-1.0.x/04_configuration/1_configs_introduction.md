---
sidebar_position: 1
title: "Overview"
---


# Configuration Overview

BifroMQ's system parameters can be configured through configuration file. This section will introduce explain their meanings.

## Configuration File Introduction

The main configuration file is named `standalone.yml` and is located at:

| Installation Method | File Location                          |
| :------------------ | -------------------------------------- |
| Zip Extraction      | ./conf/standalone.yml                  |
| Docker Container    | /usr/share/bifromq/conf/standalone.yml |

The main configuration file contains most of the essential configuration options. For any additional configuration options not explicitly specified in the configuration file, the default settings will be used. For the full list of available configuration options and their descriptions, please refer to the [Configuration File Manual](2_file_configs_manual.md).
