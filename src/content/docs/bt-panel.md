---
title: 宝塔面板部署
description: 使用宝塔面板部署 HmwCard 何慕雯发卡系统的详细步骤
order: 1
category: 面板部署
---

# 宝塔面板部署

本文档介绍如何使用宝塔面板（BT Panel）部署 HmwCard 何慕雯发卡系统。适合不熟悉 Docker 命令的用户。

## 前置要求

| 项目 | 要求 |
|------|------|
| 操作系统 | CentOS 7+ / Ubuntu 20.04+ / Debian 10+ |
| 宝塔版本 | 最新版（免费版即可） |
| 内存 | ≥ 2GB |
| 磁盘 | ≥ 20GB |
| 域名 | 已解析到服务器 IP |

## 第一步：安装宝塔面板

### CentOS

```bash
yum install -y wget && wget -O install.sh https://download.bt.cn/install/install_6.0.sh && sh install.sh ed8484bec
```

### Ubuntu/Debian

```bash
wget -O install.sh https://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh ed8484bec
```

安装完成后，记录面板地址、用户名和密码。

## 第二步：安装基础软件

登录宝塔面板，进入「软件商店」安装以下软件：

| 软件 | 版本要求 | 用途 |
|------|----------|------|
| Nginx | 1.20+ | Web 服务器 |
| MySQL | 8.0 | 数据库 |
| Redis | 7.0+ | 缓存 |
| Docker 管理器 | 最新版 | Docker 容器管理 |

> 如果宝塔软件商店没有 Docker 管理器，可在终端手动安装：
> ```bash
> curl -fsSL https://get.docker.com | bash
> systemctl enable docker
> ```

## 第三步：创建网站

1. 进入「网站」→「添加站点」
2. 填写域名（如 `your-domain.com`）
3. 选择「纯静态」（前端）或创建 API 站点（后端）
4. 设置 PHP 版本为「纯静态」
5. 点击「提交」

## 第四步：上传源码

### 方式一：Git 拉取

在宝塔「终端」中执行：

```bash
cd /www/wwwroot
git clone https://github.com/iGewen/hmwfaka-website.git hmwcard
cd hmwcard
```

### 方式二：上传压缩包

1. 下载源码 ZIP 包
2. 在宝塔「文件」中上传到网站目录
3. 解压到网站根目录

## 第五步：配置 Docker 镜像加速（推荐）

国内服务器拉取镜像较慢，建议配置镜像加速：

在宝塔「终端」中执行：

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me"
  ]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 第六步：部署 Docker 服务

在宝塔「终端」中进入项目目录：

```bash
cd /www/wwwroot/hmwcard
```

### 检查项目结构

确认项目包含以下文件：

```
hmwcard/
├── docker-compose.yml          # 基础服务
├── docker-compose.ssl.yml      # SSL 叠加配置
├── docker-compose.http.yml     # HTTP 叠加配置
├── Dockerfile.backend          # 后端镜像构建
├── Dockerfile.frontend         # 前端镜像构建
├── .env.example                # 环境变量示例
└── install.sh                  # 一键安装脚本
```

### 使用一键安装脚本（推荐）

```bash
bash install.sh
```

选择部署模式：
- 输入 `1` 选择「Docker 部署（含 SSL）」
- 按提示填写域名、邮箱、数据库密码等信息
- 等待安装完成

### 手动部署

如果需要更精细的控制，可以手动部署：

```bash
# 1. 复制环境变量
cp .env.example .env

# 2. 编辑环境变量（使用宝塔终端或文件编辑器）
nano .env

# 3. 构建镜像
docker compose build

# 4. 启动服务（含 SSL）
docker compose -f docker-compose.yml -f docker-compose.ssl.yml up -d

# 5. 查看状态
docker compose ps
```

## 第七步：配置 Nginx 反向代理

如果使用宝塔管理 Nginx（不通过 nginx-proxy），需要手动配置反向代理：

### 前端代理

在网站设置 → 「反向代理」→「添加反向代理」：

| 配置项 | 值 |
|--------|-----|
| 代理名称 | hmwcard-frontend |
| 目标 URL | `http://127.0.0.1:8080` |

### 后端 API 代理

再添加一个反向代理：

| 配置项 | 值 |
|--------|-----|
| 代理名称 | hmwcard-api |
| 目标 URL | `http://127.0.0.1:3000` |
| 代理目录 | `/api` |

### Nginx 配置文件方式

在网站设置 → 「配置文件」中添加：

```nginx
# 前端静态文件
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# 后端 API
location /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# 上传文件
location /uploads/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 第八步：配置 SSL 证书

### 使用 Let's Encrypt（免费）

1. 进入网站设置 → 「SSL」
2. 选择「Let's Encrypt」
3. 勾选域名
4. 点击「申请」
5. 开启「强制 HTTPS」

### 使用已有证书

如果有商业证书：
1. 在「SSL」标签页粘贴证书内容
2. 点击「保存」
3. 开启「强制 HTTPS」

## 第九步：开放端口

在宝塔「安全」中开放以下端口：

| 端口 | 用途 |
|------|------|
| 80 | HTTP |
| 443 | HTTPS |
| 3000 | 后端 API（如需外部访问） |
| 8080 | 前端（如需外部访问） |

> 如果使用了反向代理，3000 和 8080 端口不需要对外开放。

## 第十步：验证部署

访问以下地址确认部署成功：

| 地址 | 预期结果 |
|------|----------|
| `https://your-domain.com` | 前台首页 |
| `https://your-domain.com/admin/login` | 管理后台登录页 |
| `https://your-domain.com/api/health` | `{"success":true,"message":"OK"}` |

## 常用运维操作

### 查看日志

在宝塔「终端」中：

```bash
# 后端日志
docker compose -p hmwcard logs -f hmwcard-backend

# 前端日志
docker compose -p hmwcard logs -f hmwcard-frontend

# MySQL 日志
docker compose -p hmwcard logs -f hmwcard-mysql
```

### 重启服务

```bash
docker compose -p hmwcard restart
```

### 升级版本

```bash
cd /www/wwwroot/hmwcard
git pull
docker compose -p hmwcard build
docker compose -p hmwcard up -d
```

### 备份数据库

```bash
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysqldump -u root hmwcard > /backup/hmwcard_$(date +%Y%m%d).sql
```

## 常见问题

### 宝塔面板安装 Docker 后无法启动

```bash
# 检查 Docker 状态
systemctl status docker

# 启动 Docker
systemctl start docker

# 如报错，尝试重新安装
curl -fsSL https://get.docker.com | bash
```

### 端口被占用

```bash
# 查看端口占用
ss -tlnp | grep -E ':80|:443|:3000|:8080'

# 停止占用端口的进程
kill <PID>
```

### 域名无法访问

1. 检查域名解析是否生效：`ping your-domain.com`
2. 检查服务器防火墙是否开放 80/443
3. 检查宝塔安全组是否开放端口
4. 检查 Nginx 是否正常运行

### SSL 证书申请失败

1. 确保域名已解析到服务器
2. 确保 80 端口可访问（Let's Encrypt 验证需要）
3. 检查是否有其他程序占用 80 端口

## 下一步

- [1Panel 部署指南](/docs/1panel) — 使用 1Panel 部署
- [安全最佳实践](/docs/security) — 服务器安全配置
- [常见问题](/docs/faq) — 运维问题解答
