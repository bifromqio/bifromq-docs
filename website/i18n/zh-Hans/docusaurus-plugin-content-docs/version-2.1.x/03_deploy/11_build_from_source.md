---
sidebar_position: 11
---

# 从源码编译部署

## 前提条件

* JDK 17+
* Maven 3.5.0+
  
## 编译构建

克隆版本库到本地

```
cd <YOUR_WORKSPACE>
git clone https://github.com/bifromqio/bifromq bifromq
```

执行以下命令，进入项目根目录，构建整个项目

```
cd bifromq
mvn wrapper:wrapper
./mvnw -U clean package
```

构建输出是两个 tar.gz 和一个 zip 文件，位于 `/build/build-bifromq-starters/target/`

* bifromq-xxx-all.tar.gz // 适用于 Linux 和 macOS 的 standalone 集群部署 tar.gz 包
* bifromq-xxx-standalone.tar.gz  // 适用于 Linux 和 macOS 的 standalone 部署 tar.gz 包
* bifromq-xxx-windows-standalone.zip // 适用于 Windows 的 standalone 部署的 zip 包