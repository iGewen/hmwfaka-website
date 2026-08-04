/**
 * SVG 图标注册表
 * 统一管理所有图标，避免散落在组件中
 * 每个图标都是 24x24 viewBox 的纯 SVG path（不含 stroke / fill 颜色，由组件控制）
 *
 * 添加新图标：直接在下面 registry 中追加即可
 */

export interface IconDefinition {
  name: string
  // viewBox 默认 0 0 24 24，特殊情况可覆盖
  viewBox?: string
  // SVG inner content（paths / shapes）
  body: string
  // 是否使用 stroke 风格（outline），默认 true
  stroke?: boolean
}

// 通用 outline 图标 - 24x24 viewBox，stroke 风格
// 描边宽 1.8（在组件中通过 CSS 控制）
export const icons: IconDefinition[] = [
  // —— 导航 / 通用 ——
  {
    name: 'menu',
    body: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  },
  {
    name: 'close',
    body: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  },
  {
    name: 'arrow-right',
    body: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  },
  {
    name: 'arrow-left',
    body: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  },
  {
    name: 'check',
    body: '<polyline points="20 6 9 17 4 12"/>',
  },
  {
    name: 'check-circle',
    body: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  },
  {
    name: 'chevron-down',
    body: '<polyline points="6 9 12 15 18 9"/>',
  },
  {
    name: 'chevron-right',
    body: '<polyline points="9 18 15 12 9 6"/>',
  },
  {
    name: 'chevron-left',
    body: '<polyline points="15 18 9 12 15 6"/>',
  },
  {
    name: 'external-link',
    body: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  },
  {
    name: 'search',
    body: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  },

  // —— 功能特性图标 ——
  {
    name: 'auto-card',
    body: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="6" cy="15" r="1.5" fill="currentColor" stroke="none"/>',
  },
  {
    name: 'payment',
    body: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/>',
  },
  {
    name: 'bell',
    body: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  },
  {
    name: 'shield',
    body: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  },
  {
    name: 'rocket',
    body: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  },
  {
    name: 'devices',
    body: '<rect x="2" y="3" width="14" height="11" rx="2"/><line x1="8" y1="18" x2="12" y2="18"/><line x1="10" y1="14" x2="10" y2="18"/><rect x="17" y="9" width="5" height="11" rx="1"/>',
  },

  // —— How it works ——
  {
    name: 'package',
    body: '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  },
  {
    name: 'database',
    body: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  },
  {
    name: 'wallet',
    body: '<path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>',
  },

  // —— 联系方式 ——
  {
    name: 'mail',
    body: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  },
  {
    name: 'message',
    body: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  },
  {
    name: 'wechat',
    body: '<path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66L4 17l2.5-1.34c.66.16 1.36.24 2 .24h.27a6 6 0 0 1-.27-1.78c0-3.31 3.36-6 7.5-6 .26 0 .51.01.76.04C16.05 5.55 13.04 4 9.5 4z"/><path d="M22 14.5c0-2.49-2.69-4.5-6-4.5s-6 2.01-6 4.5 2.69 4.5 6 4.5c.69 0 1.35-.09 1.96-.25L20 20l-.5-1.66c1.55-.83 2.5-2.18 2.5-3.84z"/>',
  },

  // —— 社交 / 媒体 ——
  {
    name: 'github',
    body: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    viewBox: '0 0 24 24',
  },
  {
    name: 'telegram',
    body: '<path d="M21.5 4.5L2.5 12.5l5 1.5 1.5 5 3-3 5 4 5-15z"/><path d="M8 14l9-6-5 7"/>',
  },

  // —— 文档中心 ——
  {
    name: 'book',
    body: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  },
  {
    name: 'file-text',
    body: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
  },
  {
    name: 'list',
    body: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  },
  {
    name: 'edit',
    body: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  },
  {
    name: 'clock',
    body: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  },
  {
    name: 'tag',
    body: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  },

  // —— 价值观 / 关于 ——
  {
    name: 'zap',
    body: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  },
  {
    name: 'heart',
    body: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  },
  {
    name: 'users',
    body: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    name: 'target',
    body: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  },

  // —— 定价 / 状态 ——
  {
    name: 'star',
    body: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  },
  {
    name: 'sparkles',
    body: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  },
  {
    name: 'minus',
    body: '<line x1="5" y1="12" x2="19" y2="12"/>',
  },

  // —— 杂项 ——
  {
    name: 'globe',
    body: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  },
  {
    name: 'server',
    body: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
  },
  {
    name: 'code',
    body: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  },
  {
    name: 'copy',
    body: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  },
  {
    name: 'phone',
    body: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  },
  {
    name: 'map-pin',
    body: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  },
  {
    name: 'calendar',
    body: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  },

  // —— 新增：终端 / 控制台 / 状态 ——
  {
    name: 'terminal',
    body: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
  },
  {
    name: 'activity',
    body: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  },
  {
    name: 'trending-up',
    body: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  },
  {
    name: 'command',
    body: '<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>',
  },
  {
    name: 'layers',
    body: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  },
  {
    name: 'git-branch',
    body: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  },
  {
    name: 'infinity',
    body: '<path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/>',
  },
  {
    name: 'anchor',
    body: '<circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
  },
  {
    name: 'compass',
    body: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  },
  {
    name: 'gauge',
    body: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4"/><path d="M5 5l2 2"/><path d="M19 13a7 7 0 0 0-7-7"/>',
  },
  {
    name: 'sun',
    body: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  },

  // —— 支付方式品牌图标（简化轮廓） ——
  {
    name: 'brand-wechat',
    body: '<path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66L4 17l2.5-1.34c.66.16 1.36.24 2 .24h.27a6 6 0 0 1-.27-1.78c0-3.31 3.36-6 7.5-6 .26 0 .51.01.76.04C16.05 5.55 13.04 4 9.5 4z"/><path d="M22 14.5c0-2.49-2.69-4.5-6-4.5s-6 2.01-6 4.5 2.69 4.5 6 4.5c.69 0 1.35-.09 1.96-.25L20 20l-.5-1.66c1.55-.83 2.5-2.18 2.5-3.84z"/>',
  },
  {
    name: 'brand-alipay',
    body: '<rect x="2" y="2" width="20" height="20" rx="4"/><path d="M4 14c2-1 4-2 7-3 2-1 4-2 6-2"/><path d="M16 7c1 2 2 4 2 7s-1 5-3 6"/>',
  },
  {
    name: 'brand-paypal',
    body: '<path d="M7 4h6c2.5 0 4 1.5 4 4s-2 4-4 4H9l-1 4H4l3-12z"/><path d="M9 12l-1 4h5c2 0 4-1 4-3"/>',
  },
  {
    name: 'brand-stripe',
    body: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M9 10c-1 0-2 .5-2 2s1 2 2 2 2-.5 2-2"/><path d="M14 9v6"/>',
  },
  {
    name: 'brand-unionpay',
    body: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 8l-2 8M11 8l-2 8M14 8l-1 8M18 8l-2 8"/>',
  },

  // —— 装饰性 / 箭头系列 ——
  {
    name: 'arrow-up-right',
    body: '<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>',
  },
  {
    name: 'arrow-down',
    body: '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>',
  },
  {
    name: 'plus',
    body: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  },
  {
    name: 'dot',
    body: '<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',
  },
  {
    name: 'circle',
    body: '<circle cx="12" cy="12" r="9"/>',
  },
]

// 转为 Map 方便查找
export const iconMap = new Map<string, IconDefinition>(
  icons.map((icon) => [icon.name, icon]),
)

export function getIcon(name: string): IconDefinition | undefined {
  return iconMap.get(name)
}
