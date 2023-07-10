---
sidebar_position: 1
---


# 配置简介

BifroMQ的系统参数主要通过配置文件进行设置，本章节会分别介绍这部分配置及其含义。


## 配置文件介绍

主配置文件名称为standalone.yml，位置位于：

| 安装方式   | 文件位置                               |
| :--------- | -------------------------------------- |
| 压缩包解压 | ./conf/standalone.yml                  |
| Docker容器 | /usr/share/bifromq/conf/standalone.yml |

主配置文件包含了大部分必须的配置项，其余配置项如果没有在配置文件中明确指定，将使用默认配置。 所有可用的配置项及其说明见：[配置文件手册](2_file_configs_manual.md)


