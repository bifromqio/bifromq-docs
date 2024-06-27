---
sidebar_position: 4
title: "Install from Source"
---

## Prerequisites

* JDK 17+
* Maven 3.5.0+

## Build

Clone the repository to local workspace

```
cd <YOUR_WORKSPACE>
git clone https://github.com/bifromqio/bifromq bifromq
```

Change directory to project root folder and execute following commands to build the whole project

```
cd bifromq
mvn wrapper:wrapper
./mvnw -U clean package
```

The build output are two tar.gz and one zip files under `/build/build-bifromq-starters/target/`

* bifromq-xxx-standalone.tar.gz // standalone deployment tar.gz for linux and mac os
* bifromq-xxx-windows-standalone.zip // standalone deployment zip for windows