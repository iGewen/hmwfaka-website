---
title: 1Panel 部署
description: 使用 1Panel 部署 HmwCard 何慕雯发卡系统的详细步骤
order: 2
category: 面板部署
---

# 1Panel 部署

本文档介绍如何使用 1Panel（现代化 Linux 服务器运维管理面板）部署 HmwCard 何慕雯发卡系统。

## 前置要求

| 项目 | 要求 |
|------|------|
| 操作系统 | CentOS 7+ / Ubuntu 20.04+ / Debian 11+ / Fedora |
| 1Panel | 最新版 |
| 内存 | ≥ 2GB |
| 磁盘 | ≥ 20GB |
| 域名 | 已解析到服务器 IP |

## 第一步：安装 1Panel

### 一键安装

```bash
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && bash quick_start.sh
```

安装完成后，记录：
- 面板访问地址（如 `http://服务器IP:38076/xxxxxx`）
- 默认用户名和密码

### 登录面板

浏览器打开面板地址，使用记录的账号登录。

## 第二步：安装基础应用

进入 1Panel「应用商店」，安装以下应用：

| 应用 | 版本要求 | 用途 |
|------|----------|------|
| MySQL | 8.0 | 数据库 |
| Redis | 7.0+ | 缓存 |
| OpenResty | 1.21+ | Web 服务器（Nginx） |
| Docker | 已内置 | 容器运行时 |

> 1Panel 已内置 Docker，无需单独安装。

## 第三步：创建网站

进入「网站」→「网站」→「创建网站」：

| 配置项 | 值 |
|--------|-----|
| 域名 | your-domain.com |
| 网站类型 | 反向代理（或静态站点） |
| 代理地址 | `http://127.0.0.1:8080`（前端） |

点击「确认」创建。

## 第四步：上传源码

### 方式一：Git 部署

1. 进入「文件」→ 导航到 `/opt` 目录
2. 打开终端（1Panel 右上角「终端」按钮）
3. 执行：

```bash
cd /opt
git clone https://github.com/iGewen/hmwfaka-website.git hmwcard
cd hmwcard
```

### 方式二：上传文件

1. 在本地打包源码为 ZIP
2. 在 1Panel「文件」中上传到 `/opt` 目录
3. 解压：`unzip hmwcard.zip`

## 第五步：配置 Docker 镜像加速

在 1Panel「容器」→「配置」中配置镜像加速：

```json
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me",
    "https://docker.m.daocloud.io"
  ]
}
```

点击「确认」保存，Docker 会自动重启。

## 第六步：部署 Docker 服务

在 1Panel 终端中进入项目目录：

```bash
cd /opt/hmwcard
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

如果需要更精细的控制：

```bash
# 1. 复制环境变量
cp .env.example .env

# 2. 编辑环境变量
vim .env

# 3. 构建镜像
docker compose build

# 4. 启动服务（含 SSL）
docker compose -f docker-compose.yml -f docker-compose.ssl.yml up -d

# 5. 查看状态
docker compose ps
```

## 第七步：配置 OpenResty 反向代理

如果使用 1Panel 管理的 OpenResty（不通过 nginx-proxy），需要手动配置：

### 编辑网站配置

进入「网站」→「网站」→ 点击网站名称 →「配置」→「配置文件」：

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
    
    # API 超时设置
    proxy_connect_timeout 60s;
    proxy_read_timeout 60s;
    proxy_send_timeout 60s;
}

# 上传文件
location /uploads/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    
    # 上传文件大小限制
    client_max_body_size 5m;
}

# 健康检查
location /health {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
}
```

点击「保存」并重启 OpenResty。

## 第八步：配置 SSL 证书

### 使用 Let's Encrypt（免费）

1. 进入「网站」→「网站」→ 点击网站名称
2. 切换到「SSL」标签页
3. 选择「Let's Encrypt」
4. 勾选域名
5. 点击「申请」
6. 申请成功后开启「HTTPS」

### 使用已有证书

如果有商业证书：
1. 在「SSL」标签页选择「其他证书」
2. 粘贴证书（PEM 格式）和私钥
3. 点击「保存」

## 第九步：开放端口

进入「防火墙」或「安全组」开放以下端口：

| 端口 | 用途 | 必须 |
|------|------|------|
| 22 | SSH | 是 |
| 80 | HTTP | 是（SSL 申请需要） |
| 443 | HTTPS | 是 |
| 3000 | 后端 API | 否（反向代理后不需要） |
| 8080 | 前端 | 否（反向代理后不需要） |

> 1Panel 面板端口（如 38076）也需要开放。

## 第十步：验证部署

访问以下地址确认部署成功：

| 地址 | 预期结果 |
|------|----------|
| `https://your-domain.com` | 前台首页 |
| `https://your-domain.com/admin/login` | 管理后台登录页 |
| `https://your-domain.com/api/health` | `{"success":true,"message":"OK"}` |

## 常用运维操作

### 查看容器状态

在 1Panel「容器」→「容器」页面查看所有运行中的容器。

### 查看日志

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
cd /opt/hmwcard
git pull
docker compose -p hmwcard build
docker compose -p hmwcard up -d
```

### 备份数据库

```bash
docker compose -p hmwcard exec -e MYSQL_PWD='root密码' mysql \
  mysqldump -u root hmwcard > /opt/backup/hmwcard_$(date +%Y%m%d).sql
```

## 1Panel 特有功能

### 计划任务

在 1Panel「计划任务」中配置自动备份：

| 配置项 | 值 |
|--------|-----|
| 任务类型 |  Shell 脚本 |
| 执行周期 | 每天 03:00 |
| 脚本内容 | `docker compose -p hmwcard exec -e MYSQL_PWD='密码' mysql mysqldump -u root hmwcard > /opt/backup/hmwcard_$(date +\%Y\%m\%d).sql` |

### 监控

1Panel 提供内置监控功能：
- 查看「监控」页面查看 CPU、内存、磁盘、网络使用情况
- 设置告警规则

### 防火墙

1Panel 内置防火墙管理：
- 可视化端口管理
- IP 黑白名单
- 地区限制

## 常见问题

### 1Panel 安装后无法访问

```bash
# 查看 1Panel 状态
systemctl status 1panel

# 查看面板信息
1pctl user-info

# 重启 1Panel
systemctl restart 1panel
```

### Docker 镜像拉取失败

```bash
# 检查镜像加速配置
cat /etc/docker/daemon.json

# 重启 Docker
systemctl restart docker

# 测试拉取
docker pull hello-world
```

### 端口冲突

```bash
# 查看端口占用
ss -tlnp | grep -E ':80|:443|:3000|:8080'

# 停止占用端口的进程
kill <PID>
```

### 数据库连接失败

1. 检查 MySQL 容器是否运行：`docker ps | grep mysql`
2. 检查 MySQL 密码是否正确
3. 检查网络配置：`docker network ls`

## 下一步

- [宝塔面板部署指南](/docs/bt-panel) — 使用宝塔面板部署
- [安全最佳实践](/docs/security) — 服务器安全配置
- [常见问题](/docs/faq) — 运维问题解答
