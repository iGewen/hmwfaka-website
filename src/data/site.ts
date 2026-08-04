/**
 * 站点全局配置
 */
export const siteConfig = {
  name: 'HmwCard',
  fullName: 'HmwCard 何慕雯发卡系统',
  shortName: 'HmwCard',
  tagline:
    '何慕雯发卡系统 — 专业、稳定、安全的自动发卡解决方案。让虚拟商品交易更简单。',
  description:
    'HmwCard 是一套开箱即用的自动发卡系统，支持微信支付、支付宝、PayPal 等多渠道收款。虚拟商品、卡密、激活码全自动交付。',
  url: 'https://www.ifaka.cc',
  demoUrl: 'https://demo.ifaka.cc',
  email: 'igewen@126.com',
  author: 'iGeWen',
  icp: '豫ICP备2026001786号',
  copyright: '© 2024-2026 HmwCard 何慕雯发卡系统. All rights reserved.',
  // 百度统计 ID
  baiduAnalytics: '4e0ec95a6635b4e8416d9340f5f339b2',
} as const

export const navConfig = [
  { label: '功能特性', to: '/#features' },
  { label: '定价', to: '/pricing' },
  { label: '在线演示', href: 'https://demo.ifaka.cc', external: true },
  { label: '文档', to: '/docs' },
  { label: '博客', to: '/blog' },
  { label: '关于', to: '/about' },
  { label: '联系我们', to: '/contact' },
] as const
