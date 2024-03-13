---
id: "intro"
sidebar_position: 0 
title: "Configuration Overview"
---

Based on different usage scenarios, BifroMQ divides configurations into system-level and tenant-level. System-level configurations are set at the system's startup and cannot be changed afterward. In contrast, tenant-level configurations can be dynamically adjusted during runtime as needed, and their initial values can also be customized at the system's startup. The capability for tenant-level settings requires the implementation of a custom [setting provider](../../06_plugin/4_setting_provider/intro.md) plugin, which is not covered in this chapter.

System-level configurations are categorized based on criteria such as their common use, whether they are in an experimental phase, or whether they have not been finalized. They can be provided either through a [configuration file](1_config_file_manual.md) (located in the conf directory's standalone.yml) or via JVM system [properties](2_bifromq_sys_props.md) (in the format of -D`conf`=`value`).

The configuration file usually includes common and relatively stable configuration items, while other settings are provided through JVM system properties. Therefore, as versions are updated, the content and method of system-level configurations may change. To simplify the migration process of system-level configurations, BifroMQ provides auxiliary means, with detailed information available in [Configuration Convention & Migration](../../02_installation/5_config_migration.md).