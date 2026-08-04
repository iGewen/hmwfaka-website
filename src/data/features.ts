/**
 * 六大核心功能
 */
export interface Feature {
  icon: string
  title: string
  description: string
}

export const features: Feature[] = [
  {
    icon: 'auto-card',
    title: '自动发卡',
    description:
      '用户付款后系统自动发送卡密，7×24 小时无人值守，订单实时处理，无需人工干预。',
  },
  {
    icon: 'payment',
    title: '多渠道支付',
    description:
      '支持微信支付、支付宝、PayPal、Stripe 等主流支付方式，覆盖国内外用户，收款更灵活。',
  },
  {
    icon: 'bell',
    title: '即时通知',
    description:
      '新订单、库存预警、异常告警，通过邮件、微信、Telegram 等多渠道实时推送，不错过每一笔交易。',
  },
  {
    icon: 'shield',
    title: '安全可靠',
    description:
      '数据加密存储，接口签名验证，防刷防攻击。多年安全实践积累，保障您的每一笔交易安全。',
  },
  {
    icon: 'rocket',
    title: '一键部署',
    description:
      'Docker 容器化部署，一条命令即可启动。支持宝塔面板、云服务器、VPS 等多种环境，开箱即用。',
  },
  {
    icon: 'devices',
    title: '全端适配',
    description:
      '响应式设计，完美适配 PC、平板、手机。支持微信小程序、H5 等多端访问，随时随地管理店铺。',
  },
]

// 首页统计
export const stats = [
  { value: '2000+', label: '活跃商户' },
  { value: '99.9%', label: '系统可用率' },
  { value: '50ms', label: '平均响应时间' },
  { value: '¥0', label: '额外手续费' },
]

// How it works 三步
export const steps = [
  {
    icon: 'server',
    title: '部署系统',
    description: 'Docker 一键部署，配置域名和支付接口，10 分钟内完成上线。',
  },
  {
    icon: 'package',
    title: '添加商品',
    description: '导入卡密库存，设置价格和描述，支持批量导入，轻松管理商品。',
  },
  {
    icon: 'wallet',
    title: '自动收款',
    description: '用户下单付款，系统自动发卡，资金直达您的账户，坐享收益。',
  },
]
