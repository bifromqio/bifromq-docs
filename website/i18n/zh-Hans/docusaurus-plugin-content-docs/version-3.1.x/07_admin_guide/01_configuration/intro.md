---
id: "intro"
sidebar_position: 0 
title: "配置概述"
---

根据不同的使用场景，BifroMQ将配置分为系统级和租户级。系统级配置在系统启动时设置，并且之后不能更改。相比之下，租户级配置可以根据需要在运行时动态调整，其初始值也可以在系统启动时自定义。租户级设置的能力需要实现一个自定义的[Setting Provider](../../06_plugin/4_setting_provider/intro.md)插件，本章不涵盖此内容。

系统级配置根据它们的常用性、是否处于实验阶段或是否未最终确定等标准进行分类。它们可以通过[配置文件](1_config_file_manual.md)（位于conf目录的standalone.yml中）或通过JVM系统[属性](2_bifromq_sys_props.md)（以-D`conf`=`value`的格式）提供。

配置文件通常包含常见且相对稳定的配置项，而其他设置则通过JVM系统属性提供。因此，随着版本更新，系统级配置的内容和方法可能会发生变化。为简化系统级配置的迁移过程，BifroMQ提供了辅助手段，详细信息可在[配置约定与迁移](../../02_installation/5_config_migration.md)中找到。