---
title: 快速开始
description: 使用 install.sh 一键部署 HmwCard 何慕雯发卡系统
order: 2
category: 入门
---

# 快速开始

本指南介绍如何使用官方 `install.sh` 一键部署脚本，在 10 分钟内完成 HmwCard 何慕雯发卡系统的生产环境部署。

## 前置要求

| 项目 | 要求 |
|------|------|
| 操作系统 | CentOS 7+ / Ubuntu 18.04+ / Debian 10+ / Fedora |
| 权限 | root 用户或具有 sudo 权限的用户 |
| 内核版本 | ≥ 3.10（cgroup v2 建议 ≥ 5.10） |
| 内存 | ≥ 1GB（推荐 2GB+） |
| 磁盘 | ≥ 20GB 可用空间 |
| 域名 | SSL 部署需要一个已解析到服务器的域名 |

## 部署模式

脚本支持三种部署模式，根据需求选择：

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **Docker + SSL**（推荐） | 全自动 Docker 部署，自动申请 Let's Encrypt 证书 | 生产环境 |
| **Docker + HTTP** | Docker 部署，不申请证书 | 本地测试、无域名环境 |
| **PM2 本地部署** | 不依赖 Docker，直接运行 Node.js | 无 Docker 环境的服务器 |

## 一键安装

### 步骤 1：获取源码

```bash
cd /var/www/wwwroot
git clone https://github.com/iGewen/hmwfaka-website.git hmwcard
cd hmwcard
```

### 步骤 2：运行安装脚本

```bash
bash install.sh
```

### 步骤 3：选择部署模式

脚本启动后会显示交互式菜单：

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   🐳  [1] Docker 部署 (含自动 SSL 证书)              推荐   │
│      自动化程度最高，一键完成全部配置                        │
│                                                             │
│   🟡  [2] Docker 部署 (HTTP 模式，无 SSL)                   │
│      适合本地测试或无域名场景                                │
│                                                             │
│   📦  [3] PM2 本地部署 (无容器，直接运行)                    │
│      适合无 Docker 环境的服务器                              │
│                                                             │
│   🔴  [4] 退出                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

输入 `1` 选择推荐的 Docker + SSL 模式。

### 步骤 4：填写配置信息

根据提示依次输入：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| 域名 | 用于 SSL 证书申请，需已解析到服务器 IP | 必填 |
| 邮箱 | 用于 SSL 证书申请和通知 | admin@域名 |
| MySQL Root 密码 | 留空自动生成强密码 | 自动随机 |
| 数据库名 | MySQL 数据库名称 | hmwcard |
| 数据库用户 | MySQL 用户名 | hmwcard |
| 数据库密码 | 留空自动生成 | 自动随机 |
| Redis 密码 | 留空自动生成 | 自动随机 |
| 管理员用户名 | 后台登录账号 | admin |
| 管理员密码 | 自动生成，首次登录后强制修改 | 自动随机 |

> **提示**：密码类字段建议留空，脚本会自动生成强密码。所有密码会在安装完成后显示并保存到 `INSTALL_INFO.txt`。

### 步骤 5：等待部署完成

脚本会自动执行以下操作：

1. 检查系统环境（内核版本、Docker 状态等）
2. 自动安装 Docker 和 Docker Compose（如未安装）
3. 配置 Docker 镜像加速（国内服务器自动使用阿里云镜像源）
4. 拉取并构建服务镜像
5. 启动 MySQL、Redis、后端、前端等服务
6. 等待 MySQL 就绪后执行数据库迁移
7. 初始化业务数据种子
8. 申请 Let's Encrypt SSL 证书（SSL 模式）

部署完成后会显示：

```
  ════════════════════════════════════════════════════
   🚀  安装完成！  🚀
  ════════════════════════════════════════════════════

  🎯 访问地址
      前台: https://your-domain.com
      后台: https://your-domain.com/admin/login

  🔒 管理员账号
      账号: admin
      密码: xxxxxxxx

  🔐 数据库密码
      MySQL(hmwcard): xxxxxxxx
      Redis: xxxxxxxx
```

## 部署后的服务

Docker + SSL 模式部署的容器：

| 容器名 | 镜像 | 说明 |
|--------|------|------|
| hmwcard-mysql | mysql:8.0 | MySQL 数据库 |
| hmwcard-redis | redis:7.4-alpine | Redis 缓存 |
| hmwcard-backend | hmwcard-backend:latest | Node.js 后端 |
| hmwcard-frontend | hmwcard-frontend:latest | 前端 Nginx |
| hmwcard-nginx-proxy | jwilder/nginx-proxy | 反向代理 |
| hmwcard-acme | nginxproxy/acme-companion | 自动 SSL 证书 |

## 常用管理命令

```bash
# 进入项目目录
cd /var/www/wwwroot/hmwcard

# 查看所有服务状态
docker compose -p hmwcard ps

# 查看日志
docker compose -p hmwcard logs -f

# 查看后端日志
docker compose -p hmwcard logs -f hmwcard-backend

# 停止服务
docker compose -p hmwcard -f docker-compose.yml -f docker-compose.ssl.yml down

# 启动服务
docker compose -p hmwcard -f docker-compose.yml -f docker-compose.ssl.yml up -d

# 重启后端
docker compose -p hmwcard restart hmwcard-backend
```

## 升级版本

```bash
cd /var/www/wwwroot/hmwcard
git pull
bash install.sh
# 选择相同模式，脚本会检测已有配置并保留密码
```

## 注意事项

### 域名解析

SSL 模式要求域名 **提前解析到服务器 IP**，否则 Let's Encrypt 证书申请会失败。

### 端口开放

确保服务器防火墙开放以下端口：

| 端口 | 用途 |
|------|------|
| 22 | SSH 远程管理 |
| 80 | HTTP（SSL 证书申请必需） |
| 443 | HTTPS |

### 阿里云 ACR 镜像加速

国内服务器拉取 Docker Hub 镜像可能较慢或失败。脚本会询问是否配置阿里云 ACR（容器镜像服务），如有阿里云 ACR 实例可填入信息加速镜像拉取。没有则直接回车跳过。

### Swap 内存

如果服务器内存 ≤ 2GB，脚本会自动检测并建议配置 Swap 虚拟内存，防止构建时内存不足。

### 安装中断恢复

如果安装过程中意外中断（如 SSH 断开），重新运行 `bash install.sh` 会检测到上次的配置状态，询问是否恢复继续安装。

### 密码保管

安装完成后务必保存 `INSTALL_INFO.txt` 中的密码信息，文件包含数据库密码、管理员密码等敏感信息。

## 下一步

- [支付对接](/docs/payment) — 配置微信支付、支付宝、PayPal、Stripe
- [常见问题](/docs/faq) — 运维中的高频问题和解决方案
- [系统简介](/docs/introduction) — 了解 HmwCard 的核心能力和适用场景
