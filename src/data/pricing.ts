/**
 * 定价方案 + 服务对比
 */
export interface PricingPlan {
  id: string
  name: string
  recommended?: boolean
  originalPrice: number
  price: number
  description: string
  features: string[]
  highlight?: string
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: '基础版',
    originalPrice: 129,
    price: 89,
    description: '适合有技术能力、能自己部署的用户',
    features: [
      '完整系统源码',
      '全部功能无限制',
      '部署文档 + 教程',
      '自行部署、自行运维',
      '6 个月售后答疑',
      '6 个月版本更新',
    ],
  },
  {
    id: 'pro',
    name: '专业版',
    recommended: true,
    originalPrice: 268,
    price: 199,
    description: '适合想省心、快速上线的商户',
    features: [
      '完整系统源码',
      '免费远程部署上线',
      '免费对接 1 次支付接口',
      '免费定制 1 个简单功能',
      '1 年售后答疑',
      '1 年版本更新',
    ],
    highlight: '推荐',
  },
  {
    id: 'ultimate',
    name: '至尊版',
    originalPrice: 399,
    price: 299,
    description: '适合需要深度定制和长期保障的团队',
    features: [
      '完整系统源码',
      '免费远程部署上线',
      '免费对接 2 次支付接口',
      '免费定制 2 个简单功能',
      '2 年售后答疑（优先响应）',
      '2 年版本更新',
    ],
  },
]

// 服务对比表
export interface ComparisonRow {
  label: string
  values: [string | boolean, string | boolean, string | boolean]
}

export const comparisonTable: ComparisonRow[] = [
  { label: '完整系统源码', values: [true, true, true] },
  { label: '全部功能无限制', values: [true, true, true] },
  { label: '部署文档 + 教程', values: [true, true, true] },
  { label: '免费远程部署', values: [false, true, true] },
  { label: '支付接口对接', values: [false, '1 次', '2 次'] },
  { label: '简单功能定制', values: [false, '1 个', '2 个'] },
  { label: '售后答疑', values: ['6 个月', '1 年', '2 年（优先）'] },
  { label: '版本更新', values: ['6 个月', '1 年', '2 年'] },
  { label: '优先响应', values: [false, false, true] },
]

// 增值服务
export interface Addon {
  name: string
  price: number
  unit: string
  description: string
  icon: string
  tag?: string
}

export const addons: Addon[] = [
  {
    name: '远程部署服务',
    price: 50,
    unit: '次',
    description: '远程帮您部署到服务器，从环境配置到上线一条龙搞定。',
    icon: 'server',
  },
  {
    name: '支付接口对接',
    price: 100,
    unit: '次起',
    description: '微信、支付宝、PayPal、Stripe 等支付渠道对接，含回调调试。',
    icon: 'payment',
    tag: '热门',
  },
  {
    name: '简单功能定制',
    price: 200,
    unit: '项起',
    description: '在不改变系统架构前提下的功能扩展，如新支付方式、报表导出等。',
    icon: 'code',
  },
  {
    name: '复杂功能定制',
    price: 500,
    unit: '项起',
    description: '涉及核心逻辑修改、新模块开发、第三方系统对接等深度定制。',
    icon: 'layers',
  },
  {
    name: '其他功能开发',
    price: 200,
    unit: '项起',
    description: 'Web 工具、脚本、数据处理等非发卡系统类开发，按需求评估报价。',
    icon: 'command',
  },
  {
    name: '定制系统开发',
    price: 500,
    unit: '项目起',
    description: '基于业务需求从零搭建完整系统，含需求分析、架构设计、开发交付。',
    icon: 'compass',
  },
  {
    name: '网站开发',
    price: 500,
    unit: '项目起',
    description: '企业官网、博客、商城、SaaS 平台等前端站点开发，响应式 + SEO 友好。',
    icon: 'globe',
  },
  {
    name: '技术咨询',
    price: 200,
    unit: '小时起',
    description: '架构选型、技术栈评估、性能优化、安全加固等专项咨询服务。',
    icon: 'gauge',
  },
]
