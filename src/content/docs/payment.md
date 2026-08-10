---
title: 支付对接
description: 微信支付、支付宝、PayPal、Stripe 支付渠道的配置指南
order: 4
category: 开发
---

# 支付对接

HmwCard 支持四种支付渠道：**支付宝**、**微信支付**、**PayPal**、**Stripe**。本文档介绍每个渠道的申请流程和系统配置方式。

## 渠道对比

| 渠道 | 费率 | 到账 | 资质要求 | 适用场景 |
|------|------|------|----------|----------|
| 支付宝 | 0.6% | T+1 | 营业执照 / 个人 | 国内用户 |
| 微信支付 | 0.6% | T+1 | 营业执照 | 国内用户 |
| PayPal | 4.4% + $0.3 | 即时 | 个人可注册 | 海外用户 |
| Stripe | 2.9% + $0.3 | T+2 | 海外主体 | 海外用户（支持支付宝/微信） |

> 流水较大时可向支付平台申请费率优惠。

---

## 支付宝

### 申请商户号

1. 前往 [支付宝开放平台](https://open.alipay.com) 注册账号
2. 创建「网页 / 移动应用」
3. 申请「电脑网站支付」和「手机网站支付」能力
4. 获取以下凭证：
   - **应用 ID (appId)**
   - **应用私钥 (privateKey)** — RSA2 格式
   - **支付宝公钥 (alipayPublicKey)**

### 系统配置

在管理后台「系统设置」→「支付配置」→「支付宝」中填写：

| 字段 | 说明 |
|------|------|
| appId | 支付宝应用 ID |
| privateKey | 应用私钥（RSA 私钥完整内容） |
| alipayPublicKey | 支付宝公钥 |
| gateway | 网关地址，默认 `https://openapi.alipay.com/gateway.do` |

填写后可点击「测试配置」验证配置是否正确。

### 回调地址

系统自动处理支付宝回调，无需在支付宝后台手动配置。回调 URL：

```
异步通知: https://your-domain.com/api/payment/alipay/notify
同步跳转: https://your-domain.com/api/payment/alipay/return
```

### 支付方式

支付宝支持三种支付场景：

| 类型 | 说明 | API 参数 |
|------|------|----------|
| 当面付（扫码） | 用户扫二维码支付 | `paymentType: "precreate"` |
| 手机网站支付 | 移动端自动跳转支付宝 App | `paymentType: "wap"` |
| 电脑网站支付 | 电脑端生成支付表单跳转 | `paymentType: "page"` |

---

## 微信支付

### 申请商户号

1. 前往 [微信支付商户平台](https://pay.weixin.qq.com) 申请商户号
2. 准备材料：营业执照、法人身份证、对公账户、已备案域名
3. 获取以下凭证：
   - **商户号 (mchId)**
   - **应用 ID (appId)**
   - **API v3 密钥**
   - **商户证书序列号**
   - **商户私钥 (privateKey)**

### 系统配置

在管理后台「系统设置」→「支付配置」→「微信支付」中填写：

| 字段 | 说明 |
|------|------|
| mchId | 微信支付商户号 |
| appId | 应用 ID |
| privateKey | 商户私钥（RSA 私钥完整内容） |
| apiV3Key | API v3 密钥 |

### 回调地址

```
支付回调: https://your-domain.com/api/payment/wechatpay/notify
```

> 微信支付回调需要原始请求体验签，系统已自动处理。

---

## PayPal

### 申请凭证

1. 前往 [PayPal 开发者平台](https://developer.paypal.com) 注册
2. 创建 REST App（Live 模式）
3. 获取以下凭证：
   - **Client ID**
   - **Client Secret**
   - **Webhook ID**

### 系统配置

| 字段 | 说明 |
|------|------|
| clientId | PayPal REST App Client ID |
| clientSecret | PayPal REST App Client Secret |
| webhookId | PayPal Webhook ID |

### Webhook 配置

在 PayPal 开发者后台添加 Webhook，订阅以下事件：

- `PAYMENT.SALE.COMPLETED`
- `PAYMENT.SALE.REFUNDED`
- `PAYMENT.DISPUTE.CREATED`

回调 URL：

```
Webhook: https://your-domain.com/api/payment/paypal/webhook
返回地址: https://your-domain.com/api/payment/paypal/return
取消地址: https://your-domain.com/api/payment/paypal/cancel
```

### PayPal 争议处理

PayPal 对买家保护较严格，虚拟商品交易需注意：

- 保存卡密交付日志作为发货凭证
- 商品页提示"虚拟商品不支持退款"
- 争议发生后 7 天内提交证据

---

## Stripe

### 申请账号

前往 [Stripe](https://stripe.com) 注册，需海外主体（中国大陆可通过香港 / 美国子公司申请）。

获取凭证：

- **Publishable Key**（前端用）
- **Secret Key**（后端用）
- **Webhook Secret**

### 系统配置

| 字段 | 说明 |
|------|------|
| secretKey | Stripe Secret Key |

### Stripe 支持的支付方式

通过 Stripe Checkout，系统支持以下支付方式：

| 方式 | 说明 |
|------|------|
| stripe_alipay | Stripe 支付宝 |
| stripe_wechat_pay | Stripe 微信支付 |
| 信用卡/借记卡 | Visa、Mastercard、Amex 等 |

创建支付时指定支付方式：

```http
POST /api/payment/:orderNo/stripe/stripe_alipay
```

### Webhook 配置

```
Webhook: https://your-domain.com/api/payment/stripe/webhook
```

订阅事件：

- `checkout.session.completed`
- `payment_intent.payment_failed`
- `charge.refunded`

---

## 管理 API

所有支付配置通过管理员 API 管理，敏感字段（私钥、密钥等）存储时自动加密。

### 获取支付配置

```http
GET /api/admin/config/payment
```

### 更新支付配置

```http
POST /api/admin/config/payment
Content-Type: application/json

{
  "platform": "alipay",
  "config": {
    "appId": "2021**********",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
    "alipayPublicKey": "-----BEGIN PUBLIC KEY-----\n..."
  },
  "isActive": true
}
```

### 测试配置

每个渠道都有独立的测试接口，填写配置后点击「测试配置」验证：

```http
POST /api/admin/config/payment/alipay/test
POST /api/admin/config/payment/wechatpay/test
POST /api/admin/config/payment/paypal/test
POST /api/admin/config/payment/stripe/test
```

---

## 安全说明

- 所有敏感字段（私钥、密钥、Secret）在数据库中以 `ENC:v1:` 前缀加密存储
- 配置接口返回时敏感字段自动脱敏为 `******`
- 支付回调均进行签名验证，防止伪造
- 支付金额回调时二次校验，防止篡改

## 下一步

- [API 参考](/docs/api-reference) — 查看支付相关 API 接口详情
- [常见问题](/docs/faq) — 支付对接中的高频问题
