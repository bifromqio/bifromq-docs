---
sidebar_position: 5
title: "配置约定与迁移"
---

不同版本之间的配置可能会有所不同。在部署 BifroMQ 时，您可以使用以前的配置文件，这不会导致BifroMQ不能启动。然而，请注意，这些旧版本的配置可能不会生效。 

为了简化BifroMQ的配置过程，配置文件standalone.yml中只包含常用配置项。对于未指定的配置项将使用默认值，BifroMQ启动后会在 `info.log` 的开头输出完整的配置文件内容。用户可以使用日志中的全量配置输出来比较和更新他们的standalone.yml配置。