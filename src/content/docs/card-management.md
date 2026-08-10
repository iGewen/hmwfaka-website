---
title: 卡密管理
description: HmwCard 卡密管理完整指南：批量导入、库存监控、安全存储
order: 1
category: 使用指南
---

# 卡密管理

卡密是发卡系统的核心库存。HmwCard 提供完整的卡密生命周期管理，包括批量导入、库存监控、使用追踪和安全存储。

## 卡密存储安全

系统在多个层面保障卡密安全：

| 安全机制 | 说明 |
|----------|------|
| 加密存储 | 卡密使用 AES-256 加密后存入数据库，密钥独立存储 |
| 防重复消费 | 数据库事务 + 行级锁，确保每张卡密只发放一次 |
| 传输加密 | 全程 HTTPS，卡密在传输过程中加密 |
| 访问控制 | 卡密查询需要管理员认证（HttpOnly Cookie） |
| 操作审计 | 所有卡密操作记录到审计日志 |

## 商品类型

HmwCard 支持两种商品类型：

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| **单品**（single） | 一个商品对应一组卡密 | 单一价格商品 |
| **套餐**（package） | 一个商品下多组卡密，按时长区分 | 包月、包季、包年等 |

## 批量添加卡密

### 通过管理后台

1. 进入「商品管理」页面
2. 找到目标商品，点击「卡密管理」
3. 点击「批量添加卡密」按钮
4. 在文本框中输入卡密，**每行一个**
5. 如为套餐商品，选择对应套餐时长
6. 点击确认添加

### 通过 API

```http
POST /api/admin/products/:id/card-secrets/batch
Content-Type: application/json

{
  "secrets": "CARD-XXXX-1\nCARD-XXXX-2\nCARD-XXXX-3",
  "packageDuration": 30
}
```

### 批量导入限制

| 限制项 | 数值 | 说明 |
|--------|------|------|
| 单次最大数量 | 1000 个 | 防止 DoS 攻击 |
| 单个卡密长度 | ≤ 500 字符 | 防止异常数据 |
| 重复卡密 | 自动过滤 | 数据库唯一约束 |
| 空行 | 自动跳过 | 自动清理 |

### 导入格式

支持以下格式，每行一个卡密：

```
XXXXX-XXXXX-XXXXX
XXXXX-XXXXX-XXXXX
XXXXX-XXXXX-XXXXX
```

也支持带额外信息的格式（系统会存储完整内容）：

```
Steam Key: XXXXX-XXXXX-XXXXX
充值卡密: XXXXXXXXXXXXXXXX
激活码: XXXX-XXXX-XXXX-XXXX
```

## 卡密查询与筛选

### 查询商品下的卡密

```http
GET /api/admin/products/:id/card-secrets?page=1&limit=20
```

### 按使用状态筛选

```http
# 只查未使用
GET /api/admin/products/:id/card-secrets?isUsed=false

# 只查已使用
GET /api/admin/products/:id/card-secrets?isUsed=true
```

### 按套餐筛选（套餐商品）

```http
GET /api/admin/products/:id/card-secrets?packageDuration=30
```

### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "secret": "XXXXX-XXXXX-XXXXX",
      "isUsed": false,
      "packageDuration": null,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156
  }
}
```

## 库存管理

### 库存统计

在商品管理页面，可以实时查看每个商品的库存状态：

| 指标 | 说明 |
|------|------|
| 卡密总数 | 该商品下所有卡密数量 |
| 未使用 | 可发放的卡密数量 |
| 已使用 | 已发放的卡密数量 |
| 库存预警 | 库存 ≤ 20 时显示预警标识 |

### 库存自动管理

- 卡密数量 = 未使用卡密数（系统自动计算，无需手动维护）
- 添加卡密 → 库存自动增加
- 卡密被使用 → 库存自动减少
- 删除未使用卡密 → 库存自动减少

## 删除卡密

### 删除单个卡密

```http
DELETE /api/admin/products/card-secrets/:secretId
```

> **注意**：已使用的卡密不能删除（防止交易纠纷），只能删除未使用的卡密。

### 删除确认

管理后台删除时会弹出确认框，防止误操作。

## 卡密使用记录

当用户成功下单并支付后，系统会：

1. 从该商品的未使用卡密中锁定一张
2. 标记为已使用状态
3. 将卡密发送给用户
4. 记录到订单的 `cardSecretId` 字段

可通过订单详情查看发放的卡密信息。

## 最佳实践

### 导入建议

- **分批导入**：大量卡密（>1000）建议分批次导入，避免超时
- **格式检查**：导入前检查卡密格式，确保无空行或重复
- **备份保留**：导入前保留原始卡密文件备份

### 库存监控

- 设置库存预警阈值（建议 ≤ 20 时补货）
- 定期检查商品库存状态
- 及时清理无效或过期卡密

### 安全建议

- 不要在日志或截图中暴露明文卡密
- 定期更换加密密钥（需重新加密所有卡密）
- 离职管理员账号及时禁用
- 开启审计日志记录所有卡密操作

## 下一步

- [后台使用指南](/docs/admin-guide) — 商品、订单、支付配置完整操作
- [安全最佳实践](/docs/security) — 系统安全配置建议
- [API 参考](/docs/api-reference) — 卡密管理相关 API 详情
