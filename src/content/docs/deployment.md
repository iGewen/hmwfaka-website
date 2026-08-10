---
title: Docker 部署详解
description: HmwCard 何慕雯发卡系统的 Docker 生产环境部署架构与运维指南
order: 3
category: 部署
---

# Docker 部署详解

本文档介绍 HmwCard 的 Docker 部署架构、服务组件和运维操作。对于新用户，推荐使用 [快速开始](/docs/quick-start) 中的 `install.sh` 一键部署。

## 系统架构

```
Internet
    ↓
Nginx 反向代理 (jwilder/nginx-proxy)
    ├── :80  → 自动跳转 :443
    └── :443 → SSL 终止 → 转发到后端服务
         ↓
    ┌────────────────────────────────────┐
    │  Docker Network: hmwcard-network   │
    │                                    │
    │  ┌─────────┐  ┌─────────┐         │
    │  │  MySQL  │  │  Redis  │         │
    │  │  :3306  │  │  :6379  │         │
    │  └────┬────┘  └────┬────┘         │
    │       │            │              │
    │  ┌────┴────────────┴────┐         │
    │  │    Node.js 后端       │         │
    │  │    (hmwcard-backend)  │         │
    │  │    :3000              │         │
    │  └────────────┬──────────┘         │
    │               │                    │
    │  ┌────────────┴──────────┐         │
    │  │   前端 Nginx           │         │
    │  │   (hmwcard-frontend)  │         │
    │  │   :80                  │         │
    │  └───────────────────────┘         │
    │                                    │
    │  ┌───────────────────────┐         │
    │  │  ACME 证书管理         │         │
    │  │  (自动续签 SSL)        │         │
    │  └───────────────────────┘         │
    └────────────────────────────────────┘
```

## 服务组件

### MySQL 8.0

| 项目 | 说明 |
|------|------|
| 镜像 | `mysql:8.0` |
| 端口 | 3306（仅容器内部访问） |
| 数据卷 | `mysql_data:/var/lib/mysql` |
| 健康检查 | `mysqladmin ping` 每 10 秒 |
| 配置 | `docker/mysql/my.cnf` |

### Redis 7.4

| 项目 | 说明 |
|------|------|
| 镜像 | `redis:7.4-alpine` |
| 端口 | 6379（仅容器内部访问） |
| 数据卷 | `redis_data:/data` |
| 认证 | 密码认证 |
| 配置 | `docker/redis.conf` |

### Node.js 后端

| 项目 | 说明 |
|------|------|
| 镜像 | `hmwcard-backend:latest`（本地构建） |
| 端口 | 3000（仅绑定 localhost） |
| ORM | Prisma |
| 数据库 | MySQL 8.0 |
| 缓存 | Redis 7.4 |
| 健康检查 | `/health` 接口 |

### 前端 Nginx

| 项目 | 说明 |
|------|------|
| 镜像 | `hmwcard-frontend:latest`（本地构建） |
| 端口 | 80 |
| 构建产物 | Vue 3 + Vite SSG 静态文件 |
| SPA 回退 | `try_files $uri $uri/ /index.html` |

### Nginx 反向代理

| 项目 | 说明 |
|------|------|
| 镜像 | `jwilder/nginx-proxy:alpine` |
| 端口 | 80, 443 |
| 功能 | 自动发现容器并按 `VIRTUAL_HOST` 路由 |
| 配置 | 自动生成 |

### ACME 证书管理

| 项目 | 说明 |
|------|------|
| 镜像 | `nginxproxy/acme-companion:2.8` |
| 功能 | 自动申请和续签 Let's Encrypt 证书 |
| 触发 | 检测容器的 `LETSENCRYPT_HOST` 环境变量 |

## Docker Compose 配置

### docker-compose.yml（基础服务）

包含 MySQL、Redis、后端、前端四个核心服务。

### docker-compose.ssl.yml（SSL 叠加配置）

在基础服务之上添加 nginx-proxy 和 acme-companion，用于生产环境。

### docker-compose.http.yml（HTTP 叠加配置）

仅使用基础服务 + HTTP 模式的前端，无 SSL 证书。

## 数据持久化

| 数据卷 | 内容 | 说明 |
|--------|------|------|
| `mysql_data` | MySQL 数据文件 | 数据库所有表数据 |
| `redis_data` | Redis 持久化数据 | RDB/AOF |
| `backend/uploads` | 上传文件（宿主机绑定） | 图片等静态资源 |
| `backend/logs` | 后端日志（宿主机绑定） | 应用日志 |

## 环境变量

### 根目录 .env（Docker Compose 使用）

```env
DOMAIN=your-domain.com
EMAIL=admin@your-domain.com

# MySQL
MYSQL_ROOT_PASSWORD=auto_generated
MYSQL_DATABASE=hmwcard
MYSQL_USER=hmwcard
MYSQL_PASSWORD=auto_generated
MYSQL_PORT=3306

# Redis
REDIS_PASSWORD=auto_generated
REDIS_PORT=6379

# 后端
BACKEND_PORT=3000

# SSL
LETSENCRYPT_HOST=your-domain.com
LETSENCRYPT_EMAIL=admin@your-domain.com
VIRTUAL_HOST=your-domain.com
VIRTUAL_PORT=80
```

### backend/.env（Node.js 后端使用）

```env
NODE_ENV=production
PORT=3000
APP_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com

DATABASE_URL=mysql://hmwcard:password@mysql:3306/hmwcard
DB_HOST=mysql
DB_PORT=3306
DB_USER=hmwcard
DB_PASSWORD=password
DB_NAME=hmwcard

REDIS_URL=redis://redis:6379
REDIS_PASSWORD=password

JWT_SECRET=auto_generated
JWT_EXPIRES_IN=24h
ENCRYPTION_KEY=auto_generated

UPLOAD_PATH=./uploads
ADMIN_USERNAME=admin
ADMIN_PASSWORD=auto_generated
```

## 运维操作

### 查看所有服务状态

```bash
docker compose -p hmwcard ps
```

### 查看日志

```bash
# 全部服务
docker compose -p hmwcard logs -f

# 单个服务
docker compose -p hmwcard logs -f hmwcard-backend
docker compose -p hmwcard logs -f hmwcard-mysql
docker compose -p hmwcard logs -f hmwcard-nginx-proxy
```

### 重启服务

```bash
# 重启单个服务
docker compose -p hmwcard restart hmwcard-backend

# 重启全部
docker compose -p hmwcard restart
```

### 进入容器

```bash
# 进入后端容器
docker compose -p hmwcard exec hmwcard-backend sh

# 进入 MySQL
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql mysql -u root hmwcard
```

### 数据库备份与恢复

```bash
# 备份
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysqldump -u root hmwcard > backup.sql

# 恢复
cat backup.sql | docker compose -p hmwcard exec -T -e MYSQL_PWD='root密码' mysql \
  mysql -u root hmwcard
```

### 数据库迁移

```bash
docker compose -p hmwcard exec hmwcard-backend npx prisma migrate deploy
```

## 监控与健康检查

所有服务均配置了 Docker healthcheck：

| 服务 | 健康检查方式 |
|------|-------------|
| MySQL | `mysqladmin ping` |
| Redis | `redis-cli ping` |
| 后端 | HTTP GET `/health` |
| 前端 | `wget localhost` |

查看健康状态：

```bash
docker compose -p hmwcard ps --format '{{.Names}} {{.Status}}'
```

## 故障排查

### 容器反复重启

```bash
# 查看退出原因
docker compose -p hmwcard logs hmwcard-backend --tail 100

# 常见原因：
# 1. 数据库连接失败 → 检查 MySQL 是否就绪
# 2. 端口冲突 → 检查端口占用
# 3. 配置错误 → 检查 backend/.env
```

### SSL 证书未生效

```bash
# 查看 acme 日志
docker compose -p hmwcard -f docker-compose.yml -f docker-compose.ssl.yml logs hmwcard-acme

# 检查证书文件
docker exec hmwcard-nginx-proxy ls /etc/nginx/certs/

# 手动触发重载
docker exec hmwcard-nginx-proxy nginx -s reload
```

### 性能问题

```bash
# 查看容器资源占用
docker stats hmwcard-backend hmwcard-mysql hmwcard-redis

# 检查慢查询
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysql -u root -e "SHOW PROCESSLIST"
```

## 下一步

- [快速开始](/docs/quick-start) — 一键部署指南
- [API 参考](/docs/api-reference) — 后端接口文档
- [常见问题](/docs/faq) — 更多运维问题
