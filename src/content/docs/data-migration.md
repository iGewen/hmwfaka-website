---
title: 数据迁移指南
description: HmwCard 数据备份、恢复、迁移和版本升级完整指南
order: 4
category: 部署
---

# 数据迁移指南

本文档介绍 HmwCard 数据的备份、恢复、迁移和版本升级操作。适用于所有部署方式（Docker、宝塔面板、1Panel、PM2 本地部署）。

## 数据概览

### 数据库表结构

系统使用 MySQL 8.0 + Prisma ORM，主要数据表：

| 表名 | 说明 | 数据量 |
|------|------|--------|
| `admin_users` | 管理员账号 | 少量 |
| `products` | 商品信息 | 中量 |
| `card_secrets` | 卡密数据 | 大量（核心资产） |
| `orders` | 订单记录 | 大量 |
| `refund_logs` | 退款记录 | 中量 |
| `order_cancel_logs` | 订单取消记录 | 中量 |
| `audit_logs` | 审计日志 | 中量 |
| `categories` | 商品分类 | 少量 |
| `announcements` | 公告 | 少量 |
| `carousels` | 轮播图 | 少量 |
| `payment_configs` | 支付配置 | 少量（敏感） |
| `site_settings` | 站点设置 | 少量 |
| `site_pages` | 自定义页面 | 少量 |

### 文件数据

| 路径 | 说明 |
|------|------|
| `backend/uploads/` | 上传的图片和文件 |
| `backend/logs/` | 应用日志 |
| `.env` | Docker Compose 环境变量 |
| `backend/.env` | 后端应用配置 |

---

## 数据备份

### 全量备份脚本

创建 `/opt/scripts/hmwcard-backup.sh`：

```bash
#!/bin/bash
# HmwCard 全量备份脚本
# 用法: bash /opt/scripts/hmwcard-backup.sh

set -e

# ==================== 配置 ====================
BACKUP_DIR="/backup/hmwcard"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/${DATE}"
RETENTION_DAYS=7

# 数据库配置（根据实际部署修改）
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_NAME="hmwcard"
DB_USER="root"
# 密码建议从环境变量读取，不要硬编码
DB_PASSWORD="${MYSQL_ROOT_PASSWORD:-}"

# 项目目录（根据实际部署修改）
PROJECT_DIR="/var/www/wwwroot/hmwcard"
# ==================== 配置结束 ====================

echo "🗄️ 开始备份 HmwCard 数据..."
echo "📁 备份路径: ${BACKUP_PATH}"

# 创建备份目录
mkdir -p "${BACKUP_PATH}"

# 1. 备份数据库
echo "📊 备份数据库..."
if [ -n "$DB_PASSWORD" ]; then
  mysqldump -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASSWORD}" \
    --single-transaction --routines --triggers "${DB_NAME}" \
    | gzip > "${BACKUP_PATH}/db_${DB_NAME}.sql.gz"
else
  echo "❌ 未设置数据库密码，请设置 MYSQL_ROOT_PASSWORD 环境变量"
  exit 1
fi

# 2. 备份上传文件
echo "📎 备份上传文件..."
if [ -d "${PROJECT_DIR}/backend/uploads" ]; then
  tar -czf "${BACKUP_PATH}/uploads.tar.gz" -C "${PROJECT_DIR}/backend" uploads
fi

# 3. 备份环境变量配置
echo "⚙️ 备份环境变量..."
mkdir -p "${BACKUP_PATH}/config"
[ -f "${PROJECT_DIR}/.env" ] && cp "${PROJECT_DIR}/.env" "${BACKUP_PATH}/config/"
[ -f "${PROJECT_DIR}/backend/.env" ] && cp "${PROJECT_DIR}/backend/.env" "${BACKUP_PATH}/config/backend.env"

# 4. 生成备份信息
cat > "${BACKUP_PATH}/backup_info.txt" << EOF
备份时间: $(date '+%Y-%m-%d %H:%M:%S')
数据库: ${DB_NAME}
项目目录: ${PROJECT_DIR}
EOF

# 5. 清理旧备份
echo "🧹 清理 ${RETENTION_DAYS} 天前的旧备份..."
find "${BACKUP_DIR}" -maxdepth 1 -type d -mtime +${RETENTION_DAYS} -exec rm -rf {} \; 2>/dev/null || true

# 6. 计算备份大小
BACKUP_SIZE=$(du -sh "${BACKUP_PATH}" | cut -f1)
echo "✅ 备份完成！"
echo "📦 备份大小: ${BACKUP_SIZE}"
echo "📂 备份位置: ${BACKUP_PATH}"
```

设置权限和定时任务：

```bash
chmod +x /opt/scripts/hmwcard-backup.sh

# 编辑 crontab
crontab -e

# 每天凌晨 3 点自动备份
0 3 * * * /opt/scripts/hmwcard-backup.sh >> /var/log/hmwcard-backup.log 2>&1
```

### Docker 部署备份

```bash
# 备份数据库
docker compose -p hmwcard exec -T -e MYSQL_PWD='root密码' mysql \
  mysqldump -u root --single-transaction hmwcard | gzip > backup_$(date +%Y%m%d).sql.gz

# 备份上传文件（从容器复制到宿主机）
docker cp hmwcard-backend:/app/uploads ./uploads_backup

# 备份配置
cp .env .env.backup
cp backend/.env backend/.env.backup
```

### PM2 部署备份

```bash
# 备份数据库
mysqldump -h 127.0.0.1 -u root -p hmwcard | gzip > backup_$(date +%Y%m%d).sql.gz

# 备份项目文件
tar -czf hmwcard_files_$(date +%Y%m%d).tar.gz /var/www/wwwroot/hmwcard
```

---

## 数据恢复

### Docker 部署恢复

```bash
# 1. 解压备份
gunzip backup_20260810.sql.gz

# 2. 恢复数据库
cat backup_20260810.sql | docker compose -p hmwcard exec -T -e MYSQL_PWD='root密码' mysql \
  mysql -u root hmwcard

# 3. 恢复上传文件
docker cp ./uploads_backup hmwcard-backend:/app/uploads

# 4. 重启后端
docker compose -p hmwcard restart hmwcard-backend
```

### 直接连接恢复

```bash
# 解压
gunzip backup.sql.gz

# 恢复
mysql -h 127.0.0.1 -u root -p hmwcard < backup.sql
```

### 恢复后验证

```bash
# 1. 检查表是否完整
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysql -u root -e "USE hmwcard; SHOW TABLES;"

# 2. 检查数据量
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysql -u root -e "USE hmwcard; SELECT COUNT(*) AS products FROM products; SELECT COUNT(*) AS orders FROM orders; SELECT COUNT(*) AS cards FROM card_secrets;"

# 3. 测试登录
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

---

## 版本升级

### Docker 部署升级

```bash
cd /var/www/wwwroot/hmwcard

# 1. 备份（重要！）
bash /opt/scripts/hmwcard-backup.sh

# 2. 拉取最新代码
git pull

# 3. 重新构建镜像
docker compose -p hmwcard build

# 4. 停止旧服务
docker compose -p hmwcard down

# 5. 启动新服务
docker compose -p hmwcard -f docker-compose.yml -f docker-compose.ssl.yml up -d

# 6. 执行数据库迁移
docker compose -p hmwcard exec hmwcard-backend npx prisma migrate deploy

# 7. 验证
docker compose -p hmwcard ps
curl https://your-domain.com/health
```

### PM2 部署升级

```bash
cd /var/www/wwwroot/hmwcard

# 1. 备份
bash /opt/scripts/hmwcard-backup.sh

# 2. 停止 PM2
pm2 stop hmwcard-backend

# 3. 拉取代码
git pull

# 4. 安装依赖
cd backend && npm install

# 5. 重新构建
npm run build

# 6. 执行迁移
npx prisma migrate deploy

# 7. 重启 PM2
pm2 restart hmwcard-backend
```

### 升级注意事项

1. **务必先备份**：升级前必须完整备份数据库和配置
2. **检查迁移文件**：新版本可能包含数据库迁移，首次启动会自动执行
3. **停机窗口**：升级期间服务会短暂中断（通常 1-2 分钟）
4. **回滚准备**：保留上一版本代码，出问题时可回滚

### 回滚操作

```bash
# 1. 查看历史版本
git log --oneline

# 2. 回滚到指定版本
git checkout <commit-hash>

# 3. 重新构建并启动
docker compose -p hmwcard build
docker compose -p hmwcard up -d

# 4. 如有数据库回退，恢复备份
gunzip backup.sql.gz
cat backup.sql | docker compose -p hmwcard exec -T -e MYSQL_PWD='root密码' mysql mysql -u root hmwcard
```

---

## 跨服务器迁移

### 迁移步骤

**在源服务器上**：

```bash
# 1. 停止服务（减少数据不一致）
docker compose -p hmwcard down

# 2. 备份数据库
docker compose -p hmwcard exec -T -e MYSQL_PWD='root密码' mysql \
  mysqldump -u root --single-transaction hmwcard > hmwcard_full.sql

# 3. 打包上传文件
tar -czf uploads.tar.gz backend/uploads/

# 4. 复制配置文件
cp .env .env.migration
cp backend/.env backend/.env.migration

# 5. 传输到目标服务器
scp hmwcard_full.sql root@目标服务器:/tmp/
scp uploads.tar.gz root@目标服务器:/tmp/
scp .env.migration root@目标服务器:/tmp/
scp backend/.env.migration root@目标服务器:/tmp/backend.env.migration
```

**在目标服务器上**：

```bash
# 1. 安装 Docker（如未安装）
curl -fsSL https://get.docker.com | bash

# 2. 克隆项目
git clone https://github.com/iGewen/hmwfaka-website.git /var/www/wwwroot/hmwcard
cd /var/www/wwwroot/hmwcard

# 3. 恢复配置
cp /tmp/.env.migration .env
cp /tmp/backend.env.migration backend/.env

# 4. 启动数据库
docker compose -p hmwcard up -d mysql redis

# 5. 等待 MySQL 就绪
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysql -u root -e "SELECT 1"

# 6. 恢复数据库
cat /tmp/hmwcard_full.sql | docker compose -p hmwcard exec -T -e MYSQL_PWD='root密码' mysql \
  mysql -u root hmwcard

# 7. 恢复上传文件
tar -xzf /tmp/uploads.tar.gz -C backend/

# 8. 启动所有服务
docker compose -p hmwcard -f docker-compose.yml -f docker-compose.ssl.yml up -d

# 9. 验证
docker compose -p hmwcard ps
```

---

## 数据库迁移管理

### Prisma 迁移命令

```bash
# 查看迁移状态
docker compose -p hmwcard exec hmwcard-backend npx prisma migrate status

# 执行待执行的迁移
docker compose -p hmwcard exec hmwcard-backend npx prisma migrate deploy

# 创建新迁移（开发时使用）
docker compose -p hmwcard exec hmwcard-backend npx prisma migrate dev --name <迁移名称>

# 重置数据库（危险！会清空所有数据）
docker compose -p hmwcard exec hmwcard-backend npx prisma migrate reset
```

### 迁移卡住处理

如果迁移过程中断，可能出现锁定：

```bash
# 查看迁移状态
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysql -u root -e "SELECT * FROM hmwcard._prisma_migrations WHERE finished_at IS NULL;"

# 解锁（删除卡住的迁移记录）
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysql -u root -e "DELETE FROM hmwcard._prisma_migrations WHERE started_at IS NOT NULL AND finished_at IS NULL;"
```

---

## 数据清理

### 清理审计日志

审计日志会持续增长，建议定期清理：

```bash
# 保留最近 90 天
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysql -u root -e "DELETE FROM hmwcard.audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);"
```

### 清理取消的订单

```bash
# 保留最近 30 天的取消记录
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysql -u root -e "DELETE FROM hmwcard.order_cancel_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);"
```

### 清理已删除的卡密

软删除的卡密仍占用数据库空间：

```bash
# 物理删除已软删除的卡密（谨慎操作！）
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysql -u root -e "DELETE FROM hmwcard.card_secrets WHERE deleted_at IS NOT NULL;"
```

---

## 安全注意事项

### 备份文件安全

- 备份文件包含敏感数据（卡密、密码哈希），务必加密存储
- 不要将备份文件上传到公共存储
- 定期清理过期备份

### 迁移过程安全

- 迁移过程中服务不可用，选择低峰期操作
- 迁移完成后验证所有功能正常
- 迁移完成后清理源服务器上的备份文件

### 密钥管理

- `ENCRYPTION_KEY` 更换后，所有加密数据（卡密、支付密钥）需重新加密
- `JWT_SECRET` 更换后，所有用户需要重新登录
- 建议定期轮换密钥（需停机维护）

## 下一步

- [故障排查手册](/docs/troubleshooting) — 常见故障诊断
- [安全最佳实践](/docs/security) — 数据安全配置
- [Docker 部署详解](/docs/deployment) — 部署架构
