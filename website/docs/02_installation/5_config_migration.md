---
sidebar_position: 5 
title: "Configuration Convention & Migration"
---

Configurations may vary between different versions. While deploying BifroMQ, you can use previous configurations to set it up, and it won't interrupt the running of BifroMQ. However, please note that these configurations may not take an effect.

Additionally, at the start of the `info.log`, the complete configurations will be printed.

To streamline the setup and customization of BifroMQ, it utilizes values provided in standalone.yml for a subset of commonly configurable options. For any settings not specified within standalone.yml, default values are employed to ensure the system functions correctly without manual intervention.

It is important to acknowledge that while BifroMQ does not guarantee the compatibility of configuration options across different versions, it is designed to ensure that configurations from older versions do not cause disruptions or anomalies in the functionality of newer versions of BifroMQ. This approach is aimed at minimizing potential issues that could arise from version discrepancies, thereby facilitating a smoother operational experience.

To further simplify the migration process during version upgrades, BifroMQ outputs the complete content of the standalone.yml file to the `info.log` file upon startup. This feature allows users to conveniently compare and update their standalone.yml configuration by reviewing the differences highlighted in the log file. By providing a detailed record of the configuration settings in use, BifroMQ assists users in maintaining an up-to-date and efficient deployment, ensuring that the system is optimized for their specific requirements.