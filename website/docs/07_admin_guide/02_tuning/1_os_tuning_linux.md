---
sidebar_position: 2 
title: "Linux Kernel Tuning"
---

The following Kernel parameters can affect the maximum number of connections that the machine hosting BifroMQ can accept.

## Memory

* vm.max_map_count: Limits the number of VMAs (Virtual Memory Areas) that a process can have. It can be increased to 221184.

## Maximum Open Files

* nofile: Specifies the maximum number of files that a single process can open.
* nr_open: Specifies the maximum number of files that can be allocated per process, usually defaulting to 1024 * 1024 = 1048576.
* file-max: Specifies the maximum number of files that the system kernel can open, with a default value of 185745.

## Max user processes
* nproc: Indicates the maximum number of processes that a single user can launch. For Java processes, each thread will also occupy a Linux proc resource. In certain versions, for non-root users, this parameter defaults to 4096 and may need to be appropriately increased.

## NetFilter Tuning

Use `sysctl -a | grep conntrack` to view the current parameters. The following parameters determine the maximum number of connections:

* net.netfilter.nf_conntrack_buckets: The size of the hashtable buckets that record connection entries.
  * Modification command: `echo 262144 > /sys/module/nf_conntrack/parameters/hashsize`
* net.netfilter.nf_conntrack_max: The maximum number of entries in the hashtable, generally equal to nf_conntrack_buckets * 4.
* net.nf_conntrack_max: Same as net.netfilter.nf_conntrack_max.
* net.netfilter.nf_conntrack_tcp_timeout_fin_wait: Default 120s -> Recommended 30s.
* net.netfilter.nf_conntrack_tcp_timeout_time_wait: Default 120s -> Recommended 30s.
* net.netfilter.nf_conntrack_tcp_timeout_close_wait: Default 60s -> Recommended 15s.
* net.netfilter.nf_conntrack_tcp_timeout_established: Default 432000 seconds (5 days) -> Recommended 300s.

The following sysctl parameters can affect the performance of TCP channels under high load:

## Server-Side and Load Testing TCP-related Tuning

It is recommended to use the CentOS 7 and above environment for deployment and stress testing.

For CentOS 6, system parameter tuning is required:
* net.core.wmem_max: Maximum TCP data send window size (bytes).
  * Modification command: `echo 'net.core.wmem_max=16777216' >> /etc/sysctl.conf`
* net.core.wmem_default: Default TCP data send window size (bytes).
  * Modification command: `echo 'net.core.wmem_default=262144' >> /etc/sysctl.conf`
* net.core.rmem_max: Maximum TCP data receive window size (bytes).
  * Modification command: `echo 'net.core.rmem_max=16777216' >> /etc/sysctl.conf`
* net.core.rmem_default: Default TCP data receive window size (bytes).
  * Modification command: `echo 'net.core.rmem_default=262144' >> /etc/sysctl.conf`
* net.ipv4.tcp_rmem: Memory usage of the socket receive buffer - minimum, warning, maximum.
  * Modification command: `echo 'net.ipv4.tcp_rmem= 1024 4096 16777216' >> /etc/sysctl.conf`
* net.ipv4.tcp_wmem: Memory usage of the socket send buffer - minimum, warning, maximum.
  * Modification command: `echo 'net.ipv4.tcp_wmem= 1024 4096 16777216' >> /etc/sysctl.conf`
* net.core.optmem_max: The maximum buffer size (in bytes) allowed for each socket.
  * Modification command: `echo 'net.core.optmem_max = 16777216' >> /etc/sysctl.conf`
* net.core.netdev_max_backlog: The length of the queue into which network device places requests.
  * Modification command:`echo 'net.core.netdev_max_backlog = 16384' >> /etc/sysctl.conf`

After making the modifications, use `sysctl -p` and restart the server for them to take effect.