---
title: 常见问题
description: HmwCard 何慕雯发卡系统使用中的高频问题与解答
order: 6
category: 常见问题
---

# 常见问题

汇总用户在使用和部署 HmwCard 过程中最常遇到的问题。如未找到答案，请前往 [联系我们](/contact) 提交工单。

## 部署相关

### 安装脚本运行失败怎么办？

**Docker 安装失败：**
- 国内服务器可能无法访问 `get.docker.com`，脚本会自动切换到阿里云镜像源
- 如仍失败，可手动安装 Docker 后重新运行脚本：
  ```bash
  # Ubuntu/Debian
  apt update && apt install -y docker.io docker-compose-plugin
  systemctl enable docker && systemctl start docker
  ```

**内存不足：**
- 脚本检测到内存 ≤ 2GB 时会自动建议配置 Swap
- 也可手动配置：
  ```bash
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  ```

**端口被占用：**
- 确保服务器 80、443 端口未被其他程序占用
- 查看端口占用：`ss -tlnp | grep -E ':80|:443'`

### 安装中断了怎么办？

重新运行 `bash install.sh`，脚本会检测到上次中断的配置状态，询问是否恢复继续安装。

### SSL 证书申请失败？

常见原因：
1. **域名未解析** — 确保域名 A 记录已指向服务器 IP（DNS 生效可能需要几分钟到几小时）
2. **端口未开放** — Let's Encrypt 需要通过 80 端口验证域名所有权
3. **频率限制** — Let's Encrypt 同一域名每周最多申请 5 次，等一段时间再试

查看证书申请日志：
```bash
docker compose -p hmwcard -f docker-compose.yml -f docker-compose.ssl.yml logs hmwcard-acme
```

### 前端页面打开白屏？

1. 检查前端容器是否正常运行：
   ```bash
   docker compose -p hmwcard ps hmwcard-frontend
   ```
2. 查看前端容器日志：
   ```bash
   docker compose -p hmwcard logs hmwcard-frontend
   ```
3. 确认 nginx-proxy 配置已生成：
   ```bash
   docker exec hmwcard-nginx-proxy cat /etc/nginx/conf.d/default.conf | grep your-domain
   ```

### 后端 API 报错 500？

1. 查看后端日志：
   ```bash
   docker compose -p hmwcard logs hmwcard-backend --tail 50
   ```
2. 确认数据库连接正常：
   ```bash
   docker compose -p hmwcard exec hmwcard-backend node -e "console.log('OK')"
   ```
3. 确认 MySQL 已就绪：
   ```bash
   docker compose -p hmwcard exec -e MYSQL_PWD='你的密码' mysql mysqladmin ping -h localhost -u root
   ```

---

## 支付相关

### 个人没有营业执照怎么收款？

国内微信支付、支付宝均需要营业执照。可选方案：
- 注册个体工商户（成本低，可开对公账户）
- 使用 PayPal 收款（个人可注册，面向海外用户）
- Stripe 香港账户（支持国内个人申请）

### 支付回调收不到？

1. 确认回调 URL 能被公网访问
2. 检查 nginx-proxy 是否正确转发到后端
3. 查看后端日志确认是否收到回调：
   ```bash
   docker compose -p hmwcard logs hmwcard-backend | grep -i notify
   ```
4. 确认支付平台后台的回调地址配置正确

### 支付成功但订单状态未更新？

1. 检查回调是否被签名验证拒绝（查看后端日志）
2. 确认回调金额与订单金额一致（系统会校验金额防止篡改）
3. 手动查询订单状态：
   ```bash
   curl https://your-domain.com/api/payment/{orderNo}/alipay/status
   ```

---

## 使用相关

### 卡密会重复发放吗？

不会。系统使用数据库事务 + 行级锁确保每张卡密只被消费一次，高并发场景下也不会重复。

### 如何批量导入卡密？

在管理后台「商品管理」→ 选择商品 →「卡密管理」→「批量导入」，支持每行一个卡密，单次最多 10000 条。

也可以通过 API 批量导入：

```http
POST /api/admin/products/:id/card-secrets/batch
Content-Type: application/json

{
  "secrets": "CARD-XXXX-1\nCARD-XXXX-2\nCARD-XXXX-3"
}
```

### 数据库如何备份？

```bash
# 进入项目目录
cd /var/www/wwwroot/hmwcard

# 备份数据库
docker compose -p hmwcard exec -e MYSQL_PWD='你的root密码' mysql \
  mysqldump -u root hmwcard > backup_$(date +%Y%m%d_%H%M%S).sql
```

建议配置定时自动备份：

```bash
# 编辑 crontab
crontab -e

# 每天凌晨 3 点备份
0 3 * * * cd /var/www/wwwroot/hmwcard && docker compose -p hmwcard exec -e MYSQL_PWD='密码' mysql mysqldump -u root hmwcard > /backup/db_$(date +\%Y\%m\%d).sql
```

### 如何升级版本？

```bash
cd /var/www/wwwroot/hmwcard
git pull
bash install.sh
# 选择相同模式，脚本会保留现有配置
```

升级前务必备份数据库。

---

## 安全相关

### 系统有哪些安全防护？

| 防护 | 说明 |
|------|------|
| 限流 | 所有 API 启用请求频率限制，登录和支付接口有额外限制 |
| CSRF | 状态变更请求需通过 CSRF 验证（支付回调路径豁免） |
| SQL 注入 | 使用 Prisma ORM 参数化查询，杜绝 SQL 注入 |
| XSS | 前端 Vue 自动转义 + 后端 Helmet 安全头 |
| 加密存储 | 卡密、支付私钥等敏感数据 AES-256 加密存储 |
| 签名验证 | 支付回调均进行签名验证，防止伪造 |

### 服务器安全建议

- 防火墙只开放 22、80、443 端口
- SSH 禁用密码登录，使用密钥认证
- 定期更新系统和 Docker 镜像
- 数据库端口不对外开放（脚本默认仅暴露到 localhost）
- SSL 证书保持有效（acme-companion 自动续签）

---

## 性能相关

### 首次加载很慢？

系统已移除 Google Fonts，使用系统字体栈。如仍慢：
- 检查服务器带宽和延迟
- 确认静态资源缓存配置正确（nginx 已配置 1 年缓存）

### 高并发如何优化？

- 增加 Swap 防止内存不足
- 调整 MySQL 配置（innodb_buffer_pool_size）
- 增加 Redis 缓存命中率
- 考虑使用 CDN 加速静态资源

---

## 还没找到答案？

请前往 [联系我们](/contact) 提交工单，或发送邮件至 shaocn@live.com。
