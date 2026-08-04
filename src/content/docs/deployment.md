---
title: Docker 部署
description: 使用 Docker 在生产环境部署 HmwCard 自动发卡系统的完整指南
order: 1
category: 部署
---

# Docker 部署

本指南介绍如何在生产环境中使用 Docker 部署 HmwCard。HmwCard 全部组件均已容器化，包括 Web 应用、数据库、缓存、定时任务等。

## 部署架构

HmwCard 的生产环境推荐架构如下：

- **Nginx**：反向代理 + SSL 终止
- **HmwCard App**：Vue 3 前端 + Node.js 后端
- **MySQL 8.0**：业务数据存储
- **Redis 7**：缓存与会话
- **Cron Worker**：定时任务（订单超时、库存预警）

## 环境要求

| 资源 | 最低 | 推荐 |
|------|------|------|
| CPU | 1 核 | 2 核 |
| 内存 | 1 GB | 2 GB |
| 磁盘 | 20 GB | 50 GB SSD |
| 带宽 | 1 Mbps | 5 Mbps |

## 准备工作

### 1. 服务器初始化

```bash
# 更新系统
apt update && apt upgrade -y

# 安装基础工具
apt install -y curl wget git vim ufw

# 配置防火墙
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

### 2. 安装 Docker

```bash
curl -fsSL https://get.docker.com | bash
systemctl enable docker
```

### 3. 安装 Docker Compose v2

Docker 20.10+ 已内置 Compose v2 插件，无需单独安装。验证：

```bash
docker compose version
# Docker Compose version v2.24.0
```

## 部署步骤

### 1. 拉取源码

```bash
cd /opt
git clone https://github.com/iGeWen/hmwcard.git
cd hmwcard
```

### 2. 配置环境

```bash
cp .env.production.example .env
vim .env
```

关键字段说明：

```env
# 必须修改
DB_PASSWORD=<strong-password>
JWT_SECRET=<random-32-chars-string>
ADMIN_PASSWORD=<strong-password>

# 站点信息
SITE_URL=https://your-domain.com
SITE_NAME=我的发卡站
```

### 3. 启动服务

```bash
# 拉取镜像并启动
docker compose -f docker-compose.prod.yml up -d

# 查看启动状态
docker compose -f docker-compose.prod.yml ps
```

### 4. 初始化数据库

```bash
docker compose exec app npm run db:migrate
docker compose exec app npm run db:seed
```

### 5. 配置 Nginx + SSL

使用宝塔面板或 certbot 配置反向代理：

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 6. 申请 SSL 证书

```bash
# 使用 certbot 申请 Let's Encrypt 免费证书
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

## 验证部署

访问以下地址确认部署成功：

- 店铺首页：`https://your-domain.com`
- 管理后台：`https://your-domain.com/admin`
- 健康检查：`https://your-domain.com/api/health`

## 运维操作

### 查看日志

```bash
# 全部服务
docker compose logs -f

# 单个服务
docker compose logs -f app
docker compose logs -f mysql
```

### 重启服务

```bash
docker compose restart app
```

### 升级版本

```bash
git pull
docker compose pull
docker compose up -d
docker compose exec app npm run db:migrate
```

### 数据备份

```bash
# 备份数据库
docker compose exec mysql mysqldump -u root -p hmwcard > backup_$(date +%Y%m%d).sql

# 备份卡密文件（如使用文件存储）
tar -czf uploads_$(date +%Y%m%d).tar.gz ./uploads

# 推荐配合 crontab 自动备份
echo "0 3 * * * cd /opt/hmwcard && ./scripts/backup.sh" | crontab -
```

## 性能调优

### 1. 调整容器资源

在 `docker-compose.prod.yml` 中限制资源：

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
```

### 2. 启用 Redis 缓存

确认 `.env` 中 Redis 已启用，并将 `CACHE_TTL` 调整为 300 秒以上。

### 3. MySQL 调优

修改 `my.cnf`：

```ini
[mysqld]
innodb_buffer_pool_size = 512M
innodb_log_file_size = 64M
query_cache_size = 32M
```

## 故障排查

### 容器启动失败

```bash
# 查看具体错误
docker compose logs app --tail 100

# 常见原因
# 1. 端口被占用 → 修改 docker-compose 中的端口映射
# 2. 数据库密码错误 → 检查 .env 与 mysql 容器初始化是否一致
# 3. 镜像拉取失败 → 配置国内镜像加速
```

### 支付回调 404

确认 Nginx 配置中 `proxy_pass` 末尾没有斜杠（除非明确需要），并且 `X-Forwarded-Proto` 已正确传递。

### 前端白屏

打开浏览器控制台，常见原因：

- 静态资源 404 → 检查 `public/` 目录权限
- Mixed Content → 确认所有资源走 HTTPS
- 路由 404 → 配置 Nginx 的 `try_files` 兜底

## 下一步

部署完成后，建议阅读：

- [支付对接](/docs/payment) - 详细配置微信、支付宝、PayPal、Stripe
- [常见问题](/docs/faq) - 运维中的高频问题
