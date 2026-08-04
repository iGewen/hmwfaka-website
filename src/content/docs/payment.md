---
title: 支付渠道对接
description: 微信支付、支付宝、PayPal、Stripe 等主流支付渠道的对接指南
order: 1
category: 开发
---

# 支付渠道对接

HmwCard 支持主流的国内外支付渠道，本文档介绍每个渠道的对接流程、所需资质、费率参考及常见问题。

## 渠道对比

| 渠道 | 费率 | 到账 | 资质要求 | 适用场景 |
|------|------|------|----------|----------|
| 微信支付 | 0.6% | T+1 | 营业执照 | 国内个人 / 企业 |
| 支付宝 | 0.6% | T+1 | 营业执照 | 国内个人 / 企业 |
| PayPal | 4.4% + $0.3 | 即时 | 个人可注册 | 海外个人 |
| Stripe | 2.9% + $0.3 | T+2 | 海外主体 | 海外企业 |

> 流水较大时可申请费率优惠，微信 / 支付宝 0.6% 可谈至 0.38%；PayPal 月流水超 $5000 可降至 3.9%。

## 微信支付

### 1. 申请商户号

前往 [微信支付商户平台](https://pay.weixin.qq.com) 申请商户号，需准备：

- 营业执照（个体工商户或企业）
- 法人身份证
- 对公账户（用于结算）
- 已备案的网站域名

### 2. 配置参数

在管理后台「支付配置」→「微信支付」中填入：

```
商户号 (mch_id): 16**********
应用 ID (app_id): wx**********
API v3 密钥: 32 位随机字符串
商户证书序列号: 自动生成
商户私钥: apiclient_key.pem 文件内容
```

### 3. 设置回调地址

```
回调 URL: https://your-domain.com/api/payment/wechat/notify
```

确保该地址能被公网访问，且回调签名验证通过。

## 支付宝

### 1. 创建应用

前往 [支付宝开放平台](https://open.alipay.com) 创建「网页 / 移动应用」：

- 上传应用图标
- 配置回调地址
- 申请「电脑网站支付」能力

### 2. 配置参数

```
应用 ID (app_id): 2021**********
应用私钥: 自动生成或 RSA 工具生成
支付宝公钥: 沙箱或线上获取
```

### 3. 回调地址

```
异步通知: https://your-domain.com/api/payment/alipay/notify
同步跳转: https://your-domain.com/payment/return
```

## PayPal

### 1. 申请账号

前往 [PayPal 开发者平台](https://developer.paypal.com) 注册并创建 REST App：

- 选择 Live 或 Sandbox 模式
- 获取 Client ID 与 Secret

### 2. 配置参数

```
Client ID: AT****************************
Client Secret: EL****************************
Webhook ID: 8PT****************************
```

### 3. Webhook 配置

在 PayPal 后台添加 Webhook，订阅以下事件：

- `PAYMENT.SALE.COMPLETED`
- `PAYMENT.SALE.REFUNDED`
- `PAYMENT.DISPUTE.CREATED`

### PayPal 争议处理

PayPal 对买家保护较严格，虚拟商品交易需注意：

1. **发货留痕**：保存卡密交付日志、用户兑换时间戳
2. **明确标注**：商品页与支付前提示"虚拟商品不支持退款"
3. **快速响应**：争议发生后 7 天内必须提交证据
4. **完整证据链**：包括订单信息、交付凭证、用户行为日志

## Stripe

### 1. 申请账号

前往 [Stripe 官网](https://stripe.com) 注册，需海外公司主体或个人 SSN。中国大陆主体需通过香港 / 美国子公司申请。

### 2. 配置参数

```
Publishable Key: pk_live_****************************
Secret Key: sk_live_****************************
Webhook Secret: whsec_****************************
```

### 3. Webhook 端点

```
端点 URL: https://your-domain.com/api/payment/stripe/webhook
```

订阅事件：

- `checkout.session.completed`
- `payment_intent.payment_failed`
- `charge.refunded`

## 测试建议

对接完成后，务必进行一笔小额（¥1 或 $0.5）端到端测试：

1. 用户下单 → 跳转支付页
2. 完成支付 → 系统收到回调
3. 验证卡密自动发货
4. 验证订单状态变更为「已完成」

## 风控建议

为防止恶意退款与欺诈，建议：

- **同账号退款超 3 次自动标记**
- **5 分钟内兑换 + 退款自动拦截**
- **支付前显示倒计时冷却**
- **卡密状态实时检测**

## 下一步

- [常见问题](/docs/faq) - 支付对接中的高频问题
- [Docker 部署](/docs/deployment) - 生产环境部署指南
