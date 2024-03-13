---
sidebar_position: 5 
title: "Configuration Convention & Migration"
---

Configurations may vary between different versions. When deploying BifroMQ, you can use previous configuration files, and it won't prevent BifroMQ from starting. However, please be aware that these older configurations might not take effect.

To simplify the configuration process of BifroMQ, the configuration file standalone.yml includes only common configuration items. For unspecified configurations, default values will be used, and BifroMQ will output the complete content of the configuration file at the beginning of `info.log` after starting. Users can utilize the full configuration output in the log to compare and update their standalone.yml configuration.