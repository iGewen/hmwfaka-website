---
title: 安全最佳实践
description: HmwCard 系统安全配置、服务器安全和运维安全建议
order: 2
category: 部署
---

# 安全最佳实践

本文档汇总 HmwCard 部署和运维中的安全最佳实践，帮助用户构建安全可靠的生产环境。

## 系统内置安全机制

HmwCard 在架构层面内置了多重安全防护：

### 应用层防护

| 防护机制 | 实现方式 | 说明 |
|----------|----------|------|
| SQL 注入防护 | Prisma ORM 参数化查询 | 所有数据库操作使用参数化查询，杜绝 SQL 注入 |
| XSS 防护 | Vue 自动转义 + Helmet | 前端自动转义输出，后端设置安全响应头 |
| CSRF 防护 | Double Submit Cookie | 状态变更请求需通过 CSRF Token 验证 |
| 接口限流 | express-rate-limit | 全局 + 接口级限流，防止暴力破解和 CC 攻击 |
| 请求体限制 | 500KB 限制 | 防止大请求 DoS |
| 安全响应头 | Helmet | HSTS、CSP、X-Frame-Options 等 |
| 密码哈希 | bcrypt（cost 12） | 用户密码和卡密均哈希存储 |

### 数据层防护

| 防护机制 | 实现方式 | 说明 |
|----------|----------|------|
| 卡密加密 | AES-256-GCM | 卡密加密存储，密钥独立于数据库 |
| 支付密钥加密 | AES-256 | 支付私钥、API Key 加密存储 |
| 敏感字段脱敏 | 接口返回掩码 | 配置接口返回时私钥显示为 `******` |
| 数据库连接加密 | Prisma SSL | 支持数据库连接 SSL 加密 |

### 认证防护

| 防护机制 | 实现方式 | 说明 |
|----------|----------|------|
| 会话管理 | HttpOnly Cookie | 防 XSS 窃取会话 |
| 登录限流 | 频次限制 + 锁定 | 连续失败触发账户锁定 |
| 操作审计 | 审计日志 | 所有管理员操作记录到日志 |

## 服务器安全

### 防火墙配置

仅开放必要端口：

```bash
# UFW 示例
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable
```

### SSH 安全

```bash
# /etc/ssh/sshd_config
PermitRootLogin no              # 禁止 root 直接登录
PasswordAuthentication no       # 禁用密码登录，仅用密钥
PubkeyAuthentication yes        # 启用密钥认证
MaxAuthTries 3                  # 最大尝试次数
Port 22                         # 建议修改为非标端口
```

### 系统更新

```bash
# 定期更新系统和软件
apt update && apt upgrade -y

# 启用自动安全更新
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

### 数据库安全

```bash
# MySQL 安全加固
mysql_secure_installation

# 确保：
# - root 密码已设置
# - 匿名用户已删除
# - 远程 root 登录已禁用
# - test 数据库已删除
```

### Docker 安全

```bash
# 定期更新 Docker
apt upgrade docker-ce docker-ce-cli containerd.io

# 限制容器资源（docker-compose.yml）
services:
  hmwcard-backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
    read_only: true           # 只读根文件系统
    security_opt:
      - no-new-privileges:true  # 禁止提权
```

## 应用层安全配置

### 环境变量保护

```bash
# .env 文件权限设置为 600
chmod 600 .env backend/.env

# 不要将 .env 提交到 Git
echo ".env" >> .gitignore
echo "backend/.env" >> .gitignore
```

### JWT 密钥管理

```bash
# 定期更换 JWT_SECRET（需重新登录所有用户）
# 生成新密钥
openssl rand -hex 32

# 更新 backend/.env 后重启
docker compose -p hmwcard restart hmwcard-backend
```

### 加密密钥保护

- `ENCRYPTION_KEY` 用于加密卡密和支付密钥
- **更换密钥前必须备份数据**，更换后需重新加密所有卡密
- 建议存储在安全的地方（如密钥管理服务）

## 网络安全

### SSL/TLS 配置

系统使用 Let's Encrypt 自动管理证书，acme-companion 自动续签。

检查证书状态：

```bash
docker exec hmwcard-nginx-proxy ls /etc/nginx/certs/
```

### Nginx 安全头

系统已配置以下安全头：

```
Strict-Transport-Security: max-age=31536000
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### CDN 和 WAF

生产环境建议：
- 使用 CDN（如 Cloudflare）隐藏源站 IP
- 启用 WAF 防护
- 配置 DDoS 防护

## 数据安全

### 定期备份

```bash
# 数据库备份脚本
#!/bin/bash
BACKUP_DIR="/backup/hmwcard"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# 备份数据库
docker compose -p hmwcard exec -T -e MYSQL_PWD='root密码' mysql \
  mysqldump -u root hmwcard | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# 备份上传文件
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/wwwroot/hmwcard/backend/uploads

# 保留最近 7 天备份
find $BACKUP_DIR -mtime +7 -delete
```

配置定时任务：

```bash
crontab -e
# 每天凌晨 3 点备份
0 3 * * * /path/to/backup.sh
```

### 备份验证

- 定期测试备份文件可恢复
- 备份文件存储到异地（如云存储）
- 备份文件加密存储

## 监控与告警

### 日志监控

```bash
# 查看错误日志
docker compose -p hmwcard logs hmwcard-backend 2>&1 | grep -i error

# 监控登录失败
docker compose -p hmwcard logs hmwcard-backend 2>&1 | grep -i "login.*fail"
```

### 健康检查

```bash
# 检查所有服务健康状态
docker compose -p hmwcard ps

# 检查后端健康
curl https://your-domain.com/health
```

### 告警配置

建议配置：
- 服务下线告警（监控 `/health` 接口）
- 磁盘空间告警（>80% 时通知）
- 异常登录告警（多次失败登录）

## 应急响应

### 服务异常

```bash
# 1. 查看日志定位问题
docker compose -p hmwcard logs hmwcard-backend --tail 100

# 2. 重启服务
docker compose -p hmwcard restart hmwcard-backend

# 3. 如仍失败，回滚到上一个版本
git checkout <上一个commit>
docker compose -p hmwcard build hmwcard-backend
docker compose -p hmwcard up -d
```

### 数据泄露

1. 立即更改所有密码（管理员、数据库、Redis）
2. 轮换 JWT_SECRET 和 ENCRYPTION_KEY
3. 检查审计日志确认影响范围
4. 通知受影响用户

### 被攻击

1. 启用防火墙限制来源 IP
2. 检查并封堵攻击入口
3. 更新到最新版本
4. 审查安全日志

## 合规建议

- 网站底部添加隐私政策和使用条款
- 收集用户数据需告知并获得同意
- 保留操作日志至少 6 个月
- 遵守当地法律法规要求

## 下一步

- [快速开始](/docs/quick-start) — 部署指南
- [Docker 部署详解](/docs/deployment) — 部署架构文档
- [常见问题](/docs/faq) — 运维问题解答
