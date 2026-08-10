---
title: 故障排查手册
description: HmwCard 常见故障诊断与解决方案，覆盖 Docker/宝塔/1Panel/PM2 部署
order: 3
category: 部署
---

# 故障排查手册

本文档汇总 HmwCard 部署和运行中的常见故障，提供诊断步骤和解决方案。适用于所有部署方式（Docker、宝塔面板、1Panel、PM2 本地部署）。

## 诊断流程

遇到故障时，按以下顺序排查：

```
1. 确认服务器状态（CPU/内存/磁盘）
       ↓
2. 查看服务运行状态（容器/进程）
       ↓
3. 查看错误日志
       ↓
4. 根据错误信息定位问题
```

## 服务器状态检查

### 检查系统资源

```bash
# CPU 和内存
top
# 或
htop

# 磁盘使用
df -h

# 内存详情
free -h
```

### 检查端口占用

```bash
# 查看所有监听端口
ss -tlnp

# 检查特定端口
ss -tlnp | grep :80
ss -tlnp | grep :443
ss -tlnp | grep :3000
```

---

## Docker 部署故障

### 容器无法启动

**症状**：`docker compose ps` 显示容器状态为 `Restarting` 或 `Exited`

**排查步骤**：

```bash
# 1. 查看容器日志
docker compose -p hmwcard logs hmwcard-backend --tail 50

# 2. 检查容器退出码
docker inspect hmwcard-website --format='{{.State.ExitCode}}'
```

**常见原因和解决方案**：

| 退出码 | 原因 | 解决方案 |
|--------|------|----------|
| 1 | 应用启动失败 | 查看后端日志，检查 `.env` 配置 |
| 127 | 命令未找到 | Dockerfile CMD 格式错误，检查引号 |
| 137 | 内存不足 (OOM) | 增加内存或 Swap |
| 143 | 被 SIGTERM 终止 | 正常停止，无需处理 |

### 数据库连接失败

**症状**：后端日志显示 `Can't reach database server` 或 `P1001`

**排查步骤**：

```bash
# 1. 检查 MySQL 容器状态
docker compose -p hmwcard ps mysql

# 2. 查看 MySQL 日志
docker compose -p hmwcard logs hmwcard-mysql --tail 30

# 3. 手动测试连接
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysql -u root -e "SELECT 1"
```

**常见原因**：

| 原因 | 解决方案 |
|------|----------|
| MySQL 未就绪 | 等待 MySQL 完全启动（首次启动需 30-60 秒） |
| 密码错误 | 检查 `.env` 中 `MYSQL_PASSWORD` 是否与 MySQL 初始化一致 |
| 网络不通 | 检查 Docker 网络：`docker network inspect hmwcard_hmwcard-network` |
| 权限不足 | 检查 MySQL 用户权限 |

### SSL 证书申请失败

**症状**：HTTPS 访问显示证书错误或 nginx-proxy 日志显示证书申请失败

**排查步骤**：

```bash
# 1. 查看 ACME 日志
docker compose -p hmwcard logs hmwcard-acme

# 2. 检查证书文件
docker exec hmwcard-nginx-proxy ls /etc/nginx/certs/
```

**常见原因**：

| 原因 | 解决方案 |
|------|----------|
| 域名未解析 | 确认 `ping your-domain.com` 返回服务器 IP |
| 80 端口未开放 | 检查防火墙和安全组 |
| 频率限制 | Let's Encrypt 每周同一域名限 5 次，等待重试 |
| DNS 传播延迟 | 新修改的 DNS 记录可能需要 1-24 小时生效 |

### nginx-proxy 无法路由

**症状**：访问域名返回 502 或 503

**排查步骤**：

```bash
# 1. 检查 nginx-proxy 配置
docker exec hmwcard-nginx-proxy cat /etc/nginx/conf.d/default.conf | grep your-domain

# 2. 确认容器在同一网络
docker network inspect hmwcard_hmwcard-network

# 3. 测试上游连通性
docker exec hmwcard-nginx-proxy curl -s http://hmwcard-frontend:80/
```

---

## 宝塔面板部署故障

### 站点无法访问

**排查步骤**：

1. 检查网站是否启动：宝塔「网站」列表查看状态
2. 检查域名是否绑定正确
3. 检查网站根目录是否存在
4. 检查 Nginx/Apache 配置

```bash
# 测试 Nginx 配置
nginx -t

# 重载 Nginx
nginx -s reload
```

### 反向代理不生效

**排查步骤**：

1. 检查反向代理配置的目标 URL 是否正确
2. 确认后端服务正在运行
3. 检查 Nginx 配置语法

```bash
# 查看 Nginx 错误日志
tail -f /www/wwwlogs/error.log
```

### Docker 容器无法启动（宝塔）

```bash
# 检查 Docker 服务
systemctl status docker

# 启动 Docker
systemctl start docker

# 查看容器日志
docker logs hmwcard-backend
```

---

## 1Panel 部署故障

### 网站创建失败

**排查步骤**：

1. 检查域名格式是否正确
2. 检查端口是否被占用
3. 查看 1Panel 日志

```bash
# 查看 1Panel 日志
journalctl -u 1panel -f
```

### 容器镜像拉取失败

**排查步骤**：

1. 检查镜像加速配置
2. 测试网络连通性
3. 尝试手动拉取

```bash
# 测试 Docker Hub 连通性
docker pull hello-world

# 检查镜像加速配置
cat /etc/docker/daemon.json

# 重启 Docker
systemctl restart docker
```

### OpenResty 配置不生效

```bash
# 检查 OpenResty 状态
systemctl status openresty

# 测试配置
openresty -t

# 重载配置
openresty -s reload
```

---

## PM2 部署故障

### PM2 进程无法启动

**排查步骤**：

```bash
# 查看 PM2 日志
pm2 logs hmwcard-backend

# 查看 PM2 状态
pm2 status

# 重启进程
pm2 restart hmwcard-backend
```

**常见原因**：

| 原因 | 解决方案 |
|------|----------|
| 端口被占用 | `lsof -i :3000` 找到并停止占用进程 |
| 环境变量缺失 | 检查 `.env` 文件 |
| 编译失败 | 重新运行 `npm run build` |
| 内存不足 | `pm2 restart hmwcard-backend --max-memory-restart 500M` |

### PM2 进程频繁重启

```bash
# 查看重启次数
pm2 describe hmwcard-backend | grep restart

# 查看详细日志
pm2 logs hmwcard-backend --lines 100
```

---

## 应用层故障

### 前端白屏

**排查步骤**：

1. 打开浏览器开发者工具（F12）查看 Console 和 Network
2. 检查是否有 404 错误（静态资源未找到）
3. 检查是否有 JS 错误

**常见原因**：

| 原因 | 解决方案 |
|------|----------|
| 静态资源 404 | 检查前端容器是否正常运行 |
| Mixed Content | 确认所有资源使用 HTTPS |
| SPA 路由 404 | 配置 Nginx `try_files` 兜底到 index.html |
| JS 加载失败 | 检查 CDN 或静态资源是否可访问 |

### API 返回 500

**排查步骤**：

```bash
# Docker 部署
docker compose -p hmwcard logs hmwcard-backend --tail 50

# PM2 部署
pm2 logs hmwcard-backend --lines 50
```

**常见原因**：

| 错误关键词 | 原因 | 解决方案 |
|------------|------|----------|
| `Can't reach database` | 数据库连接失败 | 检查 MySQL 状态和配置 |
| `JWT_SECRET` 相关 | 密钥配置错误 | 检查 `.env` 中的 JWT_SECRET |
| `ENCRYPTION_KEY` 相关 | 加密密钥错误 | 检查 `.env` 中的 ENCRYPTION_KEY |
| `OutOfMemory` | 内存不足 | 增加内存或 Swap |

### API 返回 429（请求过于频繁）

系统内置了多层限流：

| 限流类型 | 阈值 | 说明 |
|----------|------|------|
| 通用 API | 500 次/15 分钟 | 所有 API 接口 |
| 登录 | 5 次/15 分钟 | 登录接口 |
| 支付创建 | 10 次/分钟 | 支付接口 |
| 订单创建 | 10 次/分钟 | 下单接口 |
| 订单查询 | 30 次/分钟 | 查询接口 |
| 内容接口 | 120 次/分钟 | 公告/轮播等 |

**解决方案**：

1. 等待限流窗口过期（通常 1-15 分钟）
2. 检查是否有异常请求（如死循环调用）
3. 如需调整，修改 `backend/src/shared/middleware/rateLimiter.ts`

### 登录账号被锁定

系统基于 Redis 实现登录锁定：

| 失败次数 | 锁定时间 |
|----------|----------|
| 5 次 | 15 分钟 |
| 10 次 | 1 小时 |

**解锁方法**：

```bash
# Docker 部署
docker compose -p hmwcard exec hmwcard-redis redis-cli DEL "login_lock:用户名"
docker compose -p hmwcard exec hmwcard-redis redis-cli DEL "login_fail:用户名"

# 或等待自动解锁
```

---

## 数据库故障

### 数据库备份

```bash
# Docker 部署
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysqldump -u root --single-transaction hmwcard > backup_$(date +%Y%m%d_%H%M%S).sql

# 直接连接
mysqldump -h 127.0.0.1 -u root -p hmwcard > backup.sql
```

### 数据库恢复

```bash
# Docker 部署
cat backup.sql | docker compose -p hmwcard exec -T -e MYSQL_PWD='root密码' mysql \
  mysql -u root hmwcard

# 直接连接
mysql -h 127.0.0.1 -u root -p hmwcard < backup.sql
```

### 数据库迁移失败

```bash
# 检查迁移状态
docker compose -p hmwcard exec hmwcard-backend npx prisma migrate status

# 执行迁移
docker compose -p hmwcard exec hmwcard-backend npx prisma migrate deploy

# 如迁移卡住，先解锁
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysql -u root -e "DELETE FROM `_prisma_migrations` WHERE started_at IS NOT NULL AND finished_at IS NULL"
```

---

## 日志位置

### Docker 部署

```bash
# 后端应用日志
docker compose -p hmwcard logs hmwcard-backend

# 后端错误日志文件（容器内）
docker exec hmwcard-backend cat /app/logs/error.log
docker exec hmwcard-backend cat /app/logs/combined.log

# Nginx 代理日志
docker exec hmwcard-nginx-proxy cat /var/log/nginx/access.log

# MySQL 日志
docker compose -p hmwcard logs hmwcard-mysql
```

### PM2 部署

```bash
# PM2 日志
pm2 logs hmwcard-backend

# 应用日志文件
tail -f /var/www/wwwroot/hmwcard/backend/logs/error.log
tail -f /var/www/wwwroot/hmwcard/backend/logs/combined.log

# PM2 错误日志
tail -f /var/www/wwwroot/hmwcard/backend/logs/pm2-error.log
```

### 宝塔/1Panel 部署

```bash
# Nginx 错误日志（宝塔）
tail -f /www/wwwlogs/error.log

# Nginx 错误日志（1Panel）
tail -f /opt/1panel/openresty/nginx/logs/error.log
```

---

## 紧急恢复

### 服务完全不可用

```bash
# 1. 停止所有服务
docker compose -p hmwcard down

# 2. 检查并修复配置
vim .env

# 3. 重新启动
docker compose -p hmwcard up -d

# 4. 查看启动日志
docker compose -p hmwcard logs -f
```

### 回滚到上一版本

```bash
cd /var/www/wwwroot/hmwcard

# 1. 查看历史版本
git log --oneline

# 2. 回滚到指定版本
git checkout <commit-hash>

# 3. 重新构建
docker compose -p hmwcard build
docker compose -p hmwcard up -d
```

## 获取帮助

如果以上方法无法解决问题，请准备以下信息后联系支持：

1. 部署方式（Docker/宝塔/1Panel/PM2）
2. 操作系统版本
3. 错误日志截图或文本
4. 问题复现步骤

联系邮箱：shaocn@live.com

## 下一步

- [安全最佳实践](/docs/security) — 预防故障的配置建议
- [数据迁移指南](/docs/data-migration) — 数据备份和迁移
- [常见问题](/docs/faq) — 更多常见问题
