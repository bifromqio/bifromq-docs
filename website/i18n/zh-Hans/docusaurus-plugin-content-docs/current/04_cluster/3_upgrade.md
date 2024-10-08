---
sidebar_position: 3
title: "升级指南"
---

# 升级指南

BifroMQ 支持多种升级策略，以确保版本之间的平滑过渡。本文件提供了 BifroMQ 升级的详细指南，包括版本兼容性、升级方法以及每种方法的具体步骤。

## 版本兼容性

BifroMQ 的版本兼容性分为两个主要方面：**数据兼容性** 和 **集群间 RPC 协议兼容性**。版本号采用语义化版本控制惯例：

- **x.y.z**：
    - **x**：主版本号。
    - **y**：次版本号。
    - **z**：修订版本号。

### 兼容性规则

1. **修订版本升级 (x.y.z)**：
    - 当仅修订版本号 (z) 变化时，**数据兼容性和集群间 RPC 协议兼容性** 均得到保证。

2. **次版本升级 (x.y)**：
    - 当次版本号 (y) 变化时，**集群间 RPC 协议兼容性** 得到保证。
    - **数据兼容性** 可能会发生变化，但任何此类变化将会明确说明。

3. **主版本升级 (x)**：
    - 主版本升级可能引入影响数据兼容性和集群间 RPC 协议兼容性的 **重大变化**。
    - **集群内滚动升级不支持** 主版本升级，除非在发行说明中明确说明同时满足数据兼容性和集群间 RPC 协议兼容性。用户需要自行管理从旧版本集群到新版本集群的应用程序和数据迁移。

## 升级方法

BifroMQ 支持两种滚动升级方法：

1. **原地升级**
2. **替换升级**

### 原地升级

当新版本与现有版本保持数据兼容性和集群间 RPC 协议兼容性时，适合采用此方法。

#### 原地升级步骤

1. **停止当前版本**：
    - 正常关闭 BifroMQ 服务。

2. **保留数据目录**：
    - 确保保留 `data` 目录。

3. **更新文件和配置**：
    - 替换必要的二进制文件并根据新版本的要求更新配置文件。

4. **启动新版本**：
    - 使用现有数据启动新版本的 BifroMQ。

### 替换升级

当新版本不保持数据兼容性或仅确保集群间 RPC 协议兼容性时，使用此方法。

#### 替换升级步骤

1. **添加新版本节点**：
    - 逐步将运行新版本的节点引入集群。

2. **移除旧版本节点**：
    - 依次从集群中移除运行旧版本的节点，直到所有节点都升级到新版本。

3. **自动数据迁移**：
    - 在升级过程中，BifroMQ 会自动处理节点间的数据迁移和同步。

#### 替换升级的重要注意事项

- **Voter 配置**：
    - 确保 `dist-worker`、`inbox-store` 和 `retain-store` 的以下 BifroSysProp 属性配置了多于一个的 Voter，否则不会发生数据迁移：
        - `dist_worker_range_voter_count`
        - `inbox_store_range_voter_count`
        - `retain_store_range_voter_count`

- **节点升级限制**：
    - 不要同时升级超过半数的节点，以免导致集群不可用。

## 总结

- **原地升级**：适用于同一主版本和次版本 (x.y) 内的升级，其中数据和 RPC 协议兼容性得到保证。
- **替换升级**：适用于跨次版本升级或数据兼容性可能无法保持的情况。请按照逐步过程确保平稳过渡。