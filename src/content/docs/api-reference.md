---
title: API 参考
description: HmwCard 何慕雯发卡系统后端 API 接口完整参考
order: 5
category: 开发
---

# API 参考

本文档列出 HmwCard 后端所有 API 接口，包括公开接口和管理员接口。

## 基础信息

| 项目 | 说明 |
|------|------|
| 基础路径 | `/api` |
| 数据格式 | JSON |
| 认证方式 | HttpOnly Cookie（登录后自动携带） |
| 统一响应格式 | `{ "success": boolean, "message"?: string, "data"?: any }` |

## 认证

### 管理员登录

```http
POST /api/auth/login
```

**请求体：**

```json
{
  "username": "admin",
  "password": "your_password"
}
```

**成功响应：**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "mustChangePassword": false
  }
}
```

> 登录成功后，服务端会设置 HttpOnly Cookie，后续请求自动携带。

### 获取当前管理员信息

```http
GET /api/auth/profile
```

**成功响应：**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### 修改密码

```http
POST /api/auth/change-password
```

**请求体：**

```json
{
  "currentPassword": "old_password",
  "newPassword": "new_secure_password"
}
```

### 强制修改密码

首次登录时如果 `mustChangePassword` 为 `true`，需调用此接口设置新密码：

```http
POST /api/auth/force-change-password
```

**请求体：**

```json
{
  "newPassword": "your_new_password"
}
```

### 登出

```http
POST /api/auth/logout
```

---

## 商品（公开）

### 获取商品列表

```http
GET /api/products
```

### 获取商品分类

```http
GET /api/products/categories
```

### 获取商品详情

```http
GET /api/products/:id
```

### 查询商品库存

```http
GET /api/products/:id/stocks
```

---

## 商品管理（管理员）

> 以下所有接口需要在 Cookie 中携带管理员认证信息。

### 获取商品列表（后台）

```http
GET /api/admin/products
```

### 创建商品

```http
POST /api/admin/products
```

**请求体：**

```json
{
  "name": "Steam 充值卡 ¥100",
  "description": "自动发卡，即时到账",
  "price": 99.00,
  "categoryId": 1,
  "status": "active"
}
```

### 更新商品

```http
PUT /api/admin/products/:id
```

### 删除商品（软删除）

```http
DELETE /api/admin/products/:id
```

### 恢复已删除商品

```http
POST /api/admin/products/:id/restore
```

### 永久删除商品

```http
DELETE /api/admin/products/:id/hard
```

### 删除商品分类

```http
DELETE /api/admin/products/categories/:name
```

### 批量添加卡密

```http
POST /api/admin/products/:id/card-secrets/batch
```

**请求体：**

```json
{
  "secrets": "CARD-XXXX-1\nCARD-XXXX-2\nCARD-XXXX-3"
}
```

### 查询卡密列表

```http
GET /api/admin/products/:id/card-secrets
```

### 删除单个卡密

```http
DELETE /api/admin/products/card-secrets/:secretId
```

---

## 订单（公开）

### 创建订单

```http
POST /api/orders
```

**请求体：**

```json
{
  "productId": 1,
  "quantity": 1,
  "paymentMethod": "alipay"
}
```

### 查询订单

```http
GET /api/orders/:orderNo
```

---

## 订单管理（管理员）

### 获取订单列表

```http
GET /api/admin/orders
```

### 查询订单详情

```http
GET /api/admin/orders/:orderNo
```

### 更新支付状态

```http
PATCH /api/admin/orders/:orderNo/payment-status
```

**请求体：**

```json
{
  "status": "paid"
}
```

### 登记线下收款

```http
POST /api/admin/orders/:orderNo/offline-payment
```

### 重发卡密

```http
POST /api/admin/orders/:id/resend
```

### 订单退款

```http
POST /api/admin/orders/:id/refund
```

### 查询未知退款（人工对账）

```http
GET /api/admin/orders/refunds/:refundNo/reconcile
```

### 导出订单

```http
POST /api/admin/orders/export
```

### 删除订单

```http
DELETE /api/admin/orders/:id
```

### 恢复订单

```http
POST /api/admin/orders/:id/restore
```

---

## 支付

### 创建支付宝订单

```http
POST /api/payment/:orderNo/alipay
```

### 查询支付宝订单状态

```http
GET /api/payment/:orderNo/alipay/status
```

### 支付宝同步回调

```http
GET /api/payment/alipay/return
```

### 支付宝异步通知

```http
POST /api/payment/alipay/notify
```

### 创建微信支付订单

```http
POST /api/payment/:orderNo/wechatpay
```

### 查询微信支付订单状态

```http
GET /api/payment/:orderNo/wechatpay/status
```

### 创建 PayPal 订单

```http
POST /api/payment/:orderNo/paypal
```

### PayPal 同步返回

```http
GET /api/payment/paypal/return
```

### PayPal 取消支付

```http
GET /api/payment/paypal/cancel
```

### PayPal Webhook

```http
POST /api/payment/paypal/webhook
```

### 创建 Stripe Checkout

```http
POST /api/payment/:orderNo/stripe/:method
```

> `:method` 支持 `stripe_alipay`（支付宝）和 `stripe_wechat_pay`（微信支付）。

### Stripe Webhook

```http
POST /api/payment/stripe/webhook
```

> Stripe Webhook 需要原始请求体验签，请勿对此路径进行 JSON 解析。

### 微信支付回调

```http
POST /api/payment/wechatpay/notify
```

> 微信支付回调需要原始请求体验签。

---

## 文件上传（管理员）

### 单文件上传

```http
POST /api/upload/single
```

**请求格式：** `multipart/form-data`，字段名 `file`

### 多文件上传

```http
POST /api/upload/multiple
```

**请求格式：** `multipart/form-data`，字段名 `files`

### 删除文件

```http
DELETE /api/upload/:filename
```

---

## 系统配置（管理员）

### 邮箱配置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/config/email` | 获取邮箱配置 |
| POST | `/api/admin/config/email` | 更新邮箱配置 |
| POST | `/api/admin/config/email/test` | 发送测试邮件 |

### 支付配置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/config/payment` | 获取支付配置 |
| POST | `/api/admin/config/payment` | 更新支付配置 |
| POST | `/api/admin/config/payment/alipay/test` | 测试支付宝配置 |
| POST | `/api/admin/config/payment/wechatpay/test` | 测试微信支付配置 |
| POST | `/api/admin/config/payment/stripe/test` | 测试 Stripe 配置 |
| POST | `/api/admin/config/payment/paypal/test` | 测试 PayPal 配置 |

### 短信配置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/config/sms` | 获取短信配置 |
| POST | `/api/admin/config/sms` | 更新短信配置 |
| POST | `/api/admin/config/sms/test` | 发送测试短信 |

### SEO 配置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/config/seo` | 获取 SEO 配置 |
| POST | `/api/admin/config/seo` | 更新 SEO 配置 |

### 页脚配置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/config/footer` | 获取页脚配置 |
| POST | `/api/admin/config/footer` | 更新页脚配置 |

### Favicon 配置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/config/favicon` | 获取 Favicon 配置 |
| POST | `/api/admin/config/favicon` | 更新 Favicon 配置 |

### 对象存储配置

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/config/object-storage` | 获取存储配置 |
| POST | `/api/admin/config/object-storage` | 更新存储配置 |
| POST | `/api/admin/config/object-storage/test` | 测试存储连接 |

---

## 内容管理（管理员）

### 公告管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/announcements` | 获取公告列表 |
| POST | `/api/admin/announcements` | 创建公告 |
| PUT | `/api/admin/announcements/:id` | 更新公告 |
| DELETE | `/api/admin/announcements/:id` | 删除公告 |

### 轮播图管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/carousels` | 获取轮播图列表 |
| POST | `/api/admin/carousels` | 创建轮播图 |
| PUT | `/api/admin/carousels/:id` | 更新轮播图 |
| DELETE | `/api/admin/carousels/:id` | 删除轮播图 |

---

## 统计（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/stats/dashboard` | 仪表盘概览数据 |
| GET | `/api/admin/stats/sales-trend` | 销售趋势 |
| GET | `/api/admin/stats/product-ranking` | 商品销量排行 |
| GET | `/api/admin/stats/payment-methods` | 支付方式统计 |

---

## 审计日志（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/audit-logs` | 查询管理员操作日志 |

---

## 公开内容接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/content/announcements` | 获取活跃公告列表 |
| GET | `/api/content/announcements/:id` | 获取公告详情 |
| GET | `/api/content/carousels` | 获取活跃轮播图 |
| GET | `/api/content/payment-methods` | 获取启用的支付方式 |
| GET | `/api/content/seo` | 获取 SEO 配置 |
| GET | `/api/content/favicon` | 获取 Favicon 配置 |
| GET | `/api/content/footer` | 获取页脚配置 |
| GET | `/api/content/site-settings` | 获取站点设置 |
| GET | `/api/content/pages/:slug` | 获取自定义页面 |

---

## 健康检查

```http
GET /health
```

**响应：**

```json
{
  "success": true,
  "message": "OK",
  "timestamp": "2026-08-10T07:37:12.000Z",
  "uptime": 3600
}
```

---

## 安全限制

系统对 API 有以下安全防护：

| 防护类型 | 说明 |
|----------|------|
| 通用限流 | 所有 `/api` 路径启用请求频率限制 |
| 登录限流 | 登录接口有额外频次限制和账户锁定机制 |
| 支付限流 | 支付创建接口有独立限流策略 |
| CSRF 防护 | 所有状态变更请求需通过 CSRF 验证（支付回调路径豁免） |
| 请求体限制 | JSON 请求体默认限制 500KB |
| 上传限制 | 文件上传限制 5MB，仅允许图片格式 |

## 错误响应

当 `success` 为 `false` 时，`message` 字段包含错误原因：

```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

常见 HTTP 状态码：

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或认证过期 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁（限流） |
| 500 | 服务器内部错误 |
