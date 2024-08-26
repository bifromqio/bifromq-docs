---
sidebar_position: 3
title: "Upgrade"
---

# Upgrade Guide

BifroMQ supports multiple upgrade strategies to ensure smooth transitions between versions. This document provides a detailed guide on upgrading BifroMQ, including version compatibility, upgrade methods, and specific steps for each method.

## Version Compatibility

BifroMQ version compatibility is categorized into two main aspects: **data compatibility** and **inter-cluster RPC protocol compatibility**. The versioning scheme follows semantic versioning conventions:

- **x.y.z**:
    - **x**: Major version number.
    - **y**: Minor version number.
    - **z**: Patch version number.

### Compatibility Rules

1. **Patch Version Upgrades (x.y.z)**:
    - When only the patch version (z) changes, **both data compatibility and inter-cluster RPC protocol compatibility** are guaranteed.

2. **Minor Version Upgrades (x.y)**:
    - When the minor version (y) changes, **inter-cluster RPC protocol compatibility** is guaranteed.
    - **Data compatibility** may change, but any such changes will be explicitly documented.

3. **Major Version Upgrades (x)**:
    - Major version upgrades may introduce **breaking changes** that affect both data compatibility and inter-cluster RPC protocol compatibility.
    - **Rolling upgrades within the cluster are not supported** for major version changes unless explicitly stated in the release notes that both data compatibility and inter-cluster RPC protocol compatibility are maintained. Users will need to manage the migration of their applications and data from the old version cluster to the new version cluster independently. 

## Upgrade Methods

BifroMQ supports two rolling upgrade methods:

1. **In-Place Upgrade**
2. **Replace Upgrade**

### In-Place Upgrade

This method is suitable when the new version maintains both data compatibility and inter-cluster RPC protocol compatibility with the existing version.

#### Steps for In-Place Upgrade

1. **Stop the Current Version**:
    - Gracefully shut down the BifroMQ service.

2. **Preserve the Data Directory**:
    - Ensure the `data` directory is retained.

3. **Update Files and Configurations**:
    - Replace the necessary binaries and update the configuration files as required by the new version.

4. **Start the New Version**:
    - Launch the new version of BifroMQ using the existing data.

### Replace Upgrade

Use this method when the new version does not maintain data compatibility or when inter-cluster RPC protocol compatibility is ensured.

#### Steps for Replace Upgrade

1. **Add New Version Nodes**:
    - Gradually introduce nodes running the new version into the cluster.

2. **Remove Old Version Nodes**:
    - Sequentially remove nodes running the old version from the cluster until all nodes are upgraded to the new version.

3. **Automatic Data Migration**:
    - During the upgrade, BifroMQ automatically handles data migration and synchronization between nodes.

#### Important Considerations for Replace Upgrade

- **Voter Configuration**:
    - Ensure that the following BifroSysProp properties for `dist-worker`, `inbox-store`, and `retain-store` have more than one Voter configured, otherwise data migration will not happen:
        - `dist_worker_range_voter_count`
        - `inbox_store_range_voter_count`
        - `retain_store_range_voter_count`

- **Node Upgrade Limitation**:
    - Do not upgrade more than half of the nodes simultaneously to avoid making the cluster unavailable.

## Summary

- **In-Place Upgrade**: Suitable for upgrades within the same major and minor versions (x.y), where data and RPC protocol compatibility are maintained.
- **Replace Upgrade**: Necessary for upgrades across minor versions or where data compatibility may not be maintained. Follow the step-by-step process to ensure a smooth transition.