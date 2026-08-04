---
title: 快速开始
description: 10 分钟从零部署 HmwCard 自动发卡系统
order: 2
category: 入门
---

# 快速开始

本指南将带您在 10 分钟内完成 HmwCard 的本地部署与首次发卡。整套流程基于 Docker，无需手动配置环境。

## 前置准备

开始之前，请确认服务器已安装 Docker 与 Docker Compose。如未安装，可执行以下命令一键安装：

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | bash

# 启动 Docker 服务
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
docker compose version
```

## 步骤 1：获取源码

购买 HmwCard 后，您会收到源码包邮件。解压后进入项目目录：

```bash
unzip hmwcard-v2.zip
cd hmwcard
```

## 步骤 2：配置环境变量

复制示例配置文件并按需修改：

```bash
cp .env.example .env
```

打开 `.env` 文件，配置以下关键项：

```env
# 站点信息
SITE_NAME=我的发卡站
SITE_URL=https://your-domain.com

# 数据库（默认 SQLite，生产环境建议 MySQL）
DB_TYPE=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=hmwcard
DB_USER=root
DB_PASSWORD=your_password

# 管理员
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_me_in_production
```

## 步骤 3：启动系统

执行以下命令启动所有服务：

```bash
docker compose up -d
```

首次启动需要下载镜像并初始化数据库，约 2-3 分钟。完成后访问 `http://服务器IP:8080` 即可看到店铺首页。

## 步骤 4：登录管理后台

访问 `http://服务器IP:8080/admin`，使用 `.env` 中配置的管理员账号登录。

## 步骤 5：添加第一件商品

进入「商品管理」→「新增商品」，填写：

- **商品名称**：例如「Steam 充值卡 ¥100」
- **商品类型**：自动发卡
- **价格**：100
- **卡密库存**：粘贴卡密列表（每行一个）

保存后即可在店铺首页看到该商品。

## 步骤 6：对接支付

进入「支付配置」→ 选择支付渠道，按提示填写 API Key 与回调地址。建议先用小额（¥1）测试一笔完整流程。

## 常见问题

### 启动后访问白屏？

通常是前端资源未正确加载。检查浏览器控制台是否有 404 报错，确认 `public` 目录权限正确。

### 数据库连接失败？

确认 MySQL 容器已正常启动：`docker compose ps`。如果状态不是 `running`，查看日志：`docker compose logs mysql`。

### 支付回调收不到？

检查服务器防火墙是否放行了 80/443 端口，以及支付平台后台的回调 URL 配置是否正确。

## 下一步

完成基础部署后，建议继续阅读：

- [Docker 部署](/docs/deployment) - 生产环境最佳实践
- [支付对接](/docs/payment) - 详细支付渠道配置
- [常见问题](/docs/faq) - 使用中的高频问题
