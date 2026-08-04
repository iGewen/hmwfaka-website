# HmwCard 何慕雯发卡系统 · 官网

> Vue 3 + Vite + Tailwind CSS v4 + vite-ssg 静态预渲染  
> SaaS 风格、SEO 友好、文档中心支持 Markdown 自动加载

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 (Composition API) | 前端框架 |
| Vite 6 | 构建工具 |
| Tailwind CSS v4 | 原子化 CSS（CSS-first 配置） |
| vite-ssg | 静态站点生成（SSG，SEO 友好） |
| vue-router 4 | 路由 |
| @unhead/vue | SEO meta 管理 |
| markdown-it + highlight.js | Markdown 渲染 + 代码高亮 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:5173）
npm run dev

# 构建静态站点到 dist/
npm run build

# 本地预览构建结果
npm run preview
```

## 目录结构

```
ifaka-website/
├── public/                         # 静态资源（直接复制到 dist）
│   ├── favicon.svg
│   ├── og-default.svg              # Open Graph 默认图
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css            # Tailwind v4 入口 + 设计 tokens
│   ├── components/
│   │   ├── common/                 # 通用基础组件
│   │   │   ├── AppButton.vue
│   │   │   ├── AppIcon.vue         # SVG 图标组件
│   │   │   ├── Container.vue
│   │   │   └── SectionHeading.vue
│   │   ├── layout/                 # 布局组件
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   └── PromoBanner.vue     # 限时活动横幅
│   │   ├── home/                   # 首页区块
│   │   │   ├── HeroSection.vue
│   │   │   ├── FeaturesSection.vue
│   │   │   ├── HowItWorksSection.vue
│   │   │   └── CTASection.vue
│   │   ├── pricing/                # 定价页
│   │   │   ├── PricingCard.vue
│   │   │   └── ComparisonTable.vue
│   │   ├── contact/                # 联系页
│   │   │   └── ContactForm.vue
│   │   ├── blog/                   # 博客
│   │   │   └── BlogCard.vue
│   │   └── docs/                   # 文档中心
│   │       ├── DocSidebar.vue
│   │       ├── DocToc.vue
│   │       └── DocPrevNext.vue
│   ├── composables/                # 组合式函数
│   │   ├── useSeo.ts               # 页面 SEO 配置
│   │   └── useCountdown.ts         # 倒计时
│   ├── content/                    # ★ Markdown 内容
│   │   ├── docs/                   # 文档中心 MD 文件
│   │   │   ├── introduction.md
│   │   │   ├── quick-start.md
│   │   │   ├── deployment.md
│   │   │   ├── payment.md
│   │   │   └── faq.md
│   │   └── blog/                   # 博客 MD 文件
│   │       ├── pricing-strategy.md
│   │       ├── refund-protection.md
│   │       └── system-comparison-2026.md
│   ├── data/                       # 静态数据
│   │   ├── site.ts                 # 站点配置
│   │   ├── features.ts             # 首页六大功能 + 统计 + 步骤
│   │   ├── pricing.ts              # 定价方案 + 对比表
│   │   └── company.ts              # 关于页 + FAQ
│   ├── icons/
│   │   └── index.ts                # SVG 图标注册表
│   ├── lib/                        # 工具库
│   │   ├── markdown.ts             # markdown-it 配置 + frontmatter 解析
│   │   └── docs.ts                 # 文档自动加载 / 侧边栏生成
│   ├── pages/                      # 页面组件
│   │   ├── HomePage.vue
│   │   ├── AboutPage.vue
│   │   ├── PricingPage.vue
│   │   ├── ContactPage.vue
│   │   ├── BlogPage.vue
│   │   ├── BlogArticlePage.vue
│   │   ├── DocDetailPage.vue       # 文档中心首页 + 详情页
│   │   └── NotFoundPage.vue
│   ├── router/
│   │   └── index.ts                # 路由配置
│   ├── App.vue
│   ├── main.ts                     # vite-ssg 入口
│   └── env.d.ts
├── index.html
├── vite.config.ts                  # Vite + SSG + sitemap 插件配置
├── postcss.config.js               # Tailwind CSS v4 PostCSS
├── tsconfig.json
└── package.json
```

## 文档中心使用说明

### 添加新文档

只需将 `.md` 文件放入 `src/content/docs/` 目录，无需修改任何代码：

```
src/content/docs/
├── introduction.md                 → /docs/introduction
├── quick-start.md                  → /docs/quick-start
├── deploy/
│   └── docker.md                   → /docs/deploy/docker
└── index.md                        → /docs（文档中心首页）
```

### Markdown Frontmatter

每篇 MD 文件头部可包含 YAML frontmatter：

```markdown
---
title: 文档标题
description: SEO 描述
order: 1                            # 同分类内排序（数字越小越靠前）
category: 入门                       # 侧边栏分组（入门 / 部署 / 开发 / 常见问题）
---

# 正文标题
```

### 博客文章

将 `.md` 文件放入 `src/content/blog/`，必需字段：

```markdown
---
title: 博客标题
description: 摘要
date: 2026-08-01
author: iGeWen
category: 运营经验
tags: [定价, 心理学]
---

# 正文
```

### 自动加载机制

- **构建时**：Vite 的 `import.meta.glob('../content/**/*.md', { eager: true, query: '?raw' })` 自动收集所有 MD 文件
- **路由生成**：`vite.config.ts` 中的 `collectMdRoutesSync()` 函数扫描文件系统，将 MD 路径添加到 SSG 渲染列表
- **侧边栏**：按 frontmatter `category` 字段自动分组，按 `order` 排序
- **TOC**：从 H2/H3 标题自动提取，渲染到右侧目录

## SVG 图标系统

所有图标在 `src/icons/index.ts` 中注册，使用方式：

```vue
<AppIcon name="rocket" :size="24" :stroke-width="1.8" />
```

**添加新图标**：在 `src/icons/index.ts` 的 `icons` 数组中追加一项即可，**禁止使用 emoji**。

## SEO 优化

- **SSG 预渲染**：所有页面在构建时生成静态 HTML，搜索引擎可直接抓取
- **Meta 动态注入**：每页通过 `useSeo()` composable 设置 title / description / keywords
- **Open Graph + Twitter Card**：自动生成社交分享卡片
- **Schema.org 结构化数据**：首页（Organization + SoftwareApplication）、关于页（AboutPage）、定价页（Product）、博客文章（BlogPosting）、文档（TechArticle）
- **sitemap.xml**：构建时自动生成
- **robots.txt**：位于 `public/robots.txt`
- **canonical URL**：每页自动生成
- **百度统计**：在 `index.html` 中异步加载

## 设计系统

主色（蓝紫渐变）：

| 名称 | Hex | 用途 |
|------|-----|------|
| `brand-600` | `#2563eb` | 主按钮 / 链接 |
| `brand-500` | `#3b82f6` | 强调色 |
| `accent-600` | `#7c3aed` | 渐变终点 |
| `ink-900` | `#0f172a` | 深色背景 / 标题 |
| `ink-800` | `#1e293b` | 次级深色 |

字体：`Inter` + `PingFang SC` + `Noto Sans SC` + `Microsoft YaHei`

## 部署

构建产物在 `dist/`，可直接部署到任何静态托管：

- **Nginx**：直接 `dist/` 目录指向 root，配置 `try_files $uri $uri/ /index.html;` 兜底 SPA 路由
- **Vercel / Netlify**：构建命令 `npm run build`，输出目录 `dist`
- **Cloudflare Pages**：同上

### Nginx 示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/ifaka-website/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 404 兜底
    error_page 404 /404.html;

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 常见问题

### 添加文档后没有立即生效？

开发模式下 Vite 会自动热更新。生产构建需要重新执行 `npm run build`。

### 如何修改品牌色？

编辑 `src/assets/styles/main.css` 的 `@theme` 块，修改 `--color-brand-*` 和 `--color-accent-*` 变量。

### 如何关闭限时活动横幅？

注释 `src/App.vue` 中的 `<PromoBanner />` 即可。

## License

© 2024-2026 HmwCard 何慕雯发卡系统. All rights reserved.
