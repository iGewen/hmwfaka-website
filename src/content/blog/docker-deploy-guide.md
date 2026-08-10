---
title: Docker 部署发卡系统：10 分钟从零到上线
description: 手把手教你用 Docker 部署一套完整的自动发卡系统，包括 MySQL、Redis、后端、前端、自动 SSL 证书
date: 2026-08-05
author: iGeWen
category: 技术教程
tags: [Docker, 部署, 自动发卡]
---

# Docker 部署发卡系统：10 分钟从零到上线

Docker 是目前部署发卡系统最省心的方式。本文手把手教你从零开始，10 分钟内完成 HmwCard 的完整部署——包括数据库、后端、前端、反向代理和自动 SSL 证书。

## 前置准备

你需要一台：

- Linux 服务器（Ubuntu 20.04+ / CentOS 7+ / Debian 10+）
- 至少 1 核 1G 内存（推荐 2G）
- 一个已解析到服务器 IP 的域名

本文以 Ubuntu 24.04 + 单域名为例。

## 第一步：安装 Docker

如果服务器上已有 Docker，跳过这步。

```bash
# 一键安装 Docker
curl -fsSL https://get.docker.com | bash

# 国内服务器如果上面失败，用阿里云镜像
# curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

# 启动并设置开机自启
systemctl enable docker
systemctl start docker

# 验证
docker --version
docker compose version
```

## 第二步：克隆项目

```bash
cd /var/www/wwwroot
git clone https://github.com/iGewen/hmwfaka-website.git hmwcard
cd hmwcard
```

## 第三步：运行安装脚本

```bash
bash install.sh
```

选择部署模式时输入 `1`（Docker + SSL，推荐）。

按提示依次填入：

- **域名**：你的域名（如 `demo.ifaka.cc`）
- **邮箱**：用于 SSL 证书申请
- **数据库密码**：建议留空自动生成
- **管理员用户名**：默认 `admin`

其他配置一路回车使用默认值即可。

## 第四步：等待部署完成

脚本会自动执行以下操作：

1. 安装 Docker Compose 插件
2. 拉取 MySQL、Redis 镜像
3. 构建后端和前端镜像
4. 启动所有服务
5. 执行数据库迁移
6. 初始化业务数据
7. 申请 Let's Encrypt SSL 证书

整个过程大约 3-5 分钟（取决于服务器网速）。

看到以下输出说明部署成功：

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
```

## 第五步：验证部署

打开浏览器访问：

| 地址 | 预期结果 |
|------|----------|
| `https://your-domain.com` | 发卡站首页 |
| `https://your-domain.com/admin/login` | 管理后台登录页 |
| `https://your-domain.com/api/health` | `{"success":true,"message":"OK"}` |

登录后台后，建议立即做以下操作：

1. 修改默认密码
2. 配置支付方式
3. 添加第一个商品
4. 导入卡密

## 部署架构说明

安装完成后，你的服务器上会运行以下容器：

```
hmwcard-mysql         MySQL 8.0 数据库
hmwcard-redis         Redis 7.4 缓存
hmwcard-backend       Node.js 后端 API
hmwcard-frontend      前端 Nginx
hmwcard-nginx-proxy   反向代理（自动路由）
hmwcard-acme          SSL 证书自动续签
```

所有容器通过 `hmwcard_hmwcard-network` 内部网络通信，只有 nginx-proxy 暴露 80/443 端口到外网。

## 常用运维命令

```bash
# 查看服务状态
docker compose -p hmwcard ps

# 查看日志
docker compose -p hmwcard logs -f

# 重启服务
docker compose -p hmwcard restart

# 停止服务
docker compose -p hmwcard down

# 启动服务
docker compose -p hmwcard -f docker-compose.yml -f docker-compose.ssl.yml up -d
```

## 升级版本

```bash
cd /var/www/wwwroot/hmwcard
git pull
bash install.sh
# 选择相同模式，脚本会保留现有配置
```

## 数据备份

```bash
# 备份数据库
docker compose -p hmwcard exec -T -e MYSQL_PWD='root密码' mysql \
  mysqldump -u root --single-transaction hmwcard | gzip > backup_$(date +%Y%m%d).sql.gz

# 建议配置定时任务
crontab -e
# 添加：每天凌晨 3 点备份
0 3 * * * cd /var/www/wwwroot/hmwcard && docker compose -p hmwcard exec -T -e MYSQL_PWD='密码' mysql mysqldump -u root --single-transaction hmwcard | gzip > /backup/hmwcard_$(date +\%Y\%m\%d).sql.gz
```

## 常见问题

### 安装脚本提示 Docker 安装失败

国内服务器访问 Docker 官方源可能超时。脚本会自动切换到阿里云镜像源重试。如果仍然失败，手动安装：

```bash
# Ubuntu/Debian
apt update
apt install -y docker.io docker-compose-plugin
systemctl enable docker && systemctl start docker
```

### SSL 证书申请失败

检查：
1. 域名是否已解析到服务器 IP（`ping your-domain.com`）
2. 80 端口是否开放（`ss -tlnp | grep :80`）
3. 查看 ACME 日志：`docker compose -p hmwcard logs hmwcard-acme`

### 内存不足

如果服务器内存 ≤ 2GB，建议先配置 Swap：

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## 写在最后

Docker 部署最大的好处是**环境隔离**——不会污染服务器环境，卸载也干净（`docker compose down` 一条命令全清）。

对于不想折腾 Linux 命令的用户，也可以用宝塔面板或 1Panel 部署，原理一样，只是多了图形界面。

---

相关阅读：[2026 年自动发卡系统选型指南](/blog/system-comparison-2026)
