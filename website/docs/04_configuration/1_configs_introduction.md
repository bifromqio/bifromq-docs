---
sidebar_position: 1
title: "Overview"
---


# Configuration Overview
Based on different usage scenarios, BifroMQ divides configurations into system-level and tenant-level. System-level configurations are set at the system's startup and cannot be changed afterward. In contrast, tenant-level configurations can be dynamically adjusted during runtime as needed, and their initial values can also be customized at the system's startup. The capability for tenant-level settings requires the implementation of a custom bifroq-plugin-setting-provider plugin, which is not covered in this chapter.

System-level configurations are categorized based on criteria such as their common use, whether they are in an experimental phase, or whether they have not been finalized. They can be provided either through a [configuration file](2_file_configs_manual.md) (located in the conf directory's standalone.yml) or via JVM system properties (in the format of -D`conf`=`value`).

The configuration file usually includes common and relatively stable configuration items, while other settings are provided through JVM system properties. Therefore, as versions are updated, the content and method of system-level configurations may change. To simplify the migration process of system-level configurations, BifroMQ provides auxiliary means, with detailed information available in [Configuration Convention & Migration](../../deploy/config_migration).