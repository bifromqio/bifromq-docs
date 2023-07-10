---
sidebar_position: 1
---

# TLS 配置

## 简介

TLS允许使用加密方法在客户机和服务器的网络上传输信息，防止任何未经授权的人监听您的通信或访问您通过网络发送的数据。
BifroMQ提供丰富的SSL/TLS接入能力支持，包括TLS接入及WebSocket Security接入。同时支持灵活的切换单/双向认证，您可以根据配置选择不同的认证级别。

## 前置准备

您需要准备配置使用的SSL/TLS证书，在测试环境使用openssl工具生成自签名证书即可，在生产环境应使用可信CA机构签发的证书。

## 通过配置开启

按照[配置文件手册](../04_configuration/2_file_configs_manual.md)中`brokerSSLCtxConfig`部分参数的介绍：开启对应的认证级别，填写对应的证书名称，并将证书文件放置在配置参数描述中的位置。