---
title: 支付接入实战：微信、支付宝、PayPal、Stripe 怎么接
description: 从申请商户号到系统配置，手把手教你接入四种主流支付渠道，附常见坑点解决方案
date: 2026-07-28
author: iGeWen
category: 技术教程
tags: [支付, 支付宝, 微信支付, PayPal, Stripe]
---

# 支付接入实战：微信、支付宝、PayPal、Stripe 怎么接

支付是发卡系统的核心环节。本文从申请到配置，完整梳理四种支付渠道的接入流程和常见坑点。

## 支付渠道概览

| 渠道 | 费率 | 到账 | 资质 | 适用 |
|------|------|------|------|------|
| 支付宝 | 0.6% | T+1 | 营业执照/个人 | 国内用户 |
| 微信支付 | 0.6% | T+1 | 营业执照 | 国内用户 |
| PayPal | 4.4%+$0.3 | 即时 | 个人可注册 | 海外用户 |
| Stripe | 2.9%+$0.3 | T+2 | 海外主体 | 海外用户 |

## 支付宝接入

### 申请流程

1. 打开 [支付宝开放平台](https://open.alipay.com)
2. 注册企业账号（个人账号功能受限）
3. 创建「网页/移动应用」
4. 申请「电脑网站支付」和「手机网站支付」能力
5. 生成 RSA2 密钥对（2048 位）

### 密钥生成

```bash
# 生成私钥
openssl genrsa -out app_private_key.pem 2048

# 提取公钥
openssl rsa -in app_private_key.pem -pubout -out app_public_key.pem
```

将公钥上传到支付宝开放平台，保存支付宝返回的「支付宝公钥」。

### 系统配置

在 HmwCard 管理后台「系统设置」→「支付配置」→「支付宝」中填入：

| 字段 | 获取位置 |
|------|----------|
| appId | 应用详情页 |
| privateKey | 你生成的私钥（完整内容，含头尾标记） |
| alipayPublicKey | 支付宝开放平台显示的「支付宝公钥」 |
| gateway | 默认 `https://openapi.alipay.com/gateway.do` |

点击「测试配置」验证签名是否正确。

### 回调配置

系统自动处理回调，无需在支付宝后台配置。回调 URL：

```
异步通知: https://your-domain.com/api/payment/alipay/notify
同步跳转: https://your-domain.com/api/payment/alipay/return
```

## 微信支付接入

### 申请流程

1. 打开 [微信支付商户平台](https://pay.weixin.qq.com)
2. 申请商户号（需营业执照）
3. 完成账户验证和对公账户验证
4. 获取商户号（mchId）和 API v3 密钥

### 系统配置

在管理后台「支付配置」→「微信支付」中填入：

| 字段 | 获取位置 |
|------|----------|
| mchId | 商户平台 → 账户中心 |
| appId | 应用详情页 |
| privateKey | 商户平台 → API 安全 → 申请 API 证书 |
| apiV3Key | 商户平台 → API 安全 → 设置 API v3 密钥 |

### 回调配置

```
支付回调: https://your-domain.com/api/payment/wechatpay/notify
```

> 微信支付回调需要原始请求体验签，系统已自动处理。

## PayPal 接入

### 申请流程

1. 打开 [PayPal 开发者平台](https://developer.paypal.com)
2. 登录 PayPal 账号（个人或企业均可）
3. 进入 Dashboard → My Apps & Credentials
4. 点击「Create App」创建 REST App
5. 切换到 Live 模式获取真实凭证

### 系统配置

| 字段 | 获取位置 |
|------|----------|
| clientId | App 详情页的 Client ID |
| clientSecret | App 详情页的 Secret |
| webhookId | Webhooks 列表中的 Webhook ID |

### Webhook 配置

在 PayPal 开发者后台添加 Webhook：

- URL: `https://your-domain.com/api/payment/paypal/webhook`
- 订阅事件：
  - `PAYMENT.SALE.COMPLETED`
  - `PAYMENT.SALE.REFUNDED`
  - `PAYMENT.DISPUTE.CREATED`

## Stripe 接入

### 申请流程

1. 打开 [Stripe](https://stripe.com) 注册账号
2. 需要海外主体（个人可通过香港/美国公司申请）
3. 完成身份验证
4. 获取 API Keys

### 系统配置

| 字段 | 获取位置 |
|------|----------|
| secretKey | Developers → API keys → Secret key |

### Stripe 支持的支付方式

通过 Stripe Checkout，系统支持：

- 信用卡/借记卡（Visa、Mastercard、Amex 等）
- Stripe 内嵌支付宝（`stripe_alipay`）
- Stripe 内嵌微信支付（`stripe_wechat_pay`）

### Webhook 配置

在 Stripe Dashboard → Developers → Webhooks 中添加端点：

- URL: `https://your-domain.com/api/payment/stripe/webhook`
- 订阅事件：
  - `checkout.session.completed`
  - `payment_intent.payment_failed`
  - `charge.refunded`

## 常见坑点

### 1. 签名验证失败

**症状**：支付成功但订单状态不更新，日志显示「签名验证失败」

**排查**：
- 检查私钥是否完整（含 `-----BEGIN RSA PRIVATE KEY-----` 头尾标记）
- 检查公钥是否匹配（支付宝公钥 vs 应用公钥别搞混）
- 检查编码格式（统一 UTF-8）

### 2. 回调收不到

**症状**：支付成功但系统没收到通知

**排查**：
- 检查回调 URL 是否可从公网访问
- 检查服务器防火墙是否开放 80/443
- 检查 nginx 是否正确转发到后端
- 查看后端日志：`docker compose -p hmwcard logs hmwcard-backend | grep notify`

### 3. 金额校验失败

**症状**：日志显示「回调金额与订单金额不匹配」

**原因**：系统会校验回调金额与订单金额是否一致，防止篡改。

**排查**：
- 检查商品价格是否被修改过
- 检查是否有优惠券/折扣导致金额不一致
- 检查货币单位（分 vs 元）

### 4. 支付页面白屏

**症状**：跳转到支付页面后白屏

**排查**：
- 检查前端资源是否正常加载
- 检查是否有 JS 错误（F12 控制台）
- 检查支付渠道是否已启用

## 测试建议

每个渠道接入完成后，务必进行小额测试：

1. 创建 ¥0.01 或 $0.01 的测试商品
2. 完成支付流程
3. 验证订单状态变为「已支付」
4. 验证卡密自动发放
5. 验证退款流程

## 费率优化

### 国内渠道

- 月流水 > 10 万：可联系支付宝/微信申请费率优惠（0.6% → 0.38%）
- 月流水 > 100 万：可谈至 0.25%-0.3%

### 海外渠道

- PayPal 月流水 > $5000：可申请降至 3.9%
- Stripe 大客户：可谈定制费率

## 写在最后

支付接入是发卡系统最关键的环节。建议先接一个渠道跑通全流程，再逐步接入其他渠道。

不要贪多——一个稳定运行的渠道，比四个半吊子的渠道值钱得多。

---

相关文章：[卖虚拟商品被退款薅羊毛怎么办](/blog/refund-protection)
