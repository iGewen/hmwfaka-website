import { useHead } from '@unhead/vue'
import { reactive, watch, type Ref } from 'vue'
import { siteConfig } from '@/data/site'

interface SeoOptions {
  title: string
  description: string
  keywords?: string[]
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  path?: string
  image?: string
  schema?: object | object[]
  breadcrumb?: Array<{ name: string; item: string }>
  speakable?: { cssSelector: string[]; about?: string }
}

/**
 * 页面级 SEO 配置（基于 @unhead/vue）
 * - 在 setup 顶层只调一次
 * - 支持 Ref 传入实现动态响应（route 变化时 head 自动更新）
 *
 * @example 静态
 *   useSeo({ title: '首页', description: '...' })
 *
 * @example 动态（推荐用 reactive 包装）
 *   const seoState = reactive({ title: '', description: '' })
 *   useSeo(seoState)
 *   seoState.title = '新标题'  // head 自动更新
 */
export function useSeo(options: SeoOptions | Ref<SeoOptions>) {
  const url = siteConfig.url.replace(/\/$/, '')

  // 计算 head 入口
  function buildHead(opt: SeoOptions) {
    const canonical = opt.path ? `${url}${opt.path}` : url
    const image = opt.image || `${url}/og-default.jpg`

    const head: any = {
      title: opt.title,
      meta: [
        { name: 'description', content: opt.description },
        ...(opt.keywords?.length
          ? [{ name: 'keywords', content: opt.keywords.join(', ') }]
          : []),
        // Open Graph
        { property: 'og:title', content: opt.title },
        { property: 'og:description', content: opt.description },
        { property: 'og:type', content: opt.type || 'website' },
        { property: 'og:url', content: canonical },
        { property: 'og:image', content: image },
        { property: 'og:site_name', content: siteConfig.name },
        { property: 'og:locale', content: 'zh_CN' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: opt.title },
        { name: 'twitter:description', content: opt.description },
        { name: 'twitter:image', content: image },
        // GEO (Generative Engine Optimization) - 生成式搜索引擎优化
        { name: 'ai:description', content: opt.description },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      ],
      link: [{ rel: 'canonical', href: canonical }],
    }

    // 结构化数据：合并自定义 schema + 面包屑
    const schemas: object[] = []
    if (opt.schema) {
      if (Array.isArray(opt.schema)) {
        schemas.push(...opt.schema)
      } else {
        schemas.push(opt.schema)
      }
    }
    // 面包屑结构化数据
    if (opt.breadcrumb && opt.breadcrumb.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: opt.breadcrumb.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${url}${item.item}`,
        })),
      })
    }
    // Speakable 结构化数据（语音助手 / AI 搜索）
    if (opt.speakable && opt.speakable.cssSelector.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: opt.title,
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: opt.speakable.cssSelector,
        },
        url: canonical,
      })
    }
    if (schemas.length > 0) {
      head.script = [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schemas.length === 1 ? schemas[0] : schemas),
        },
      ]
    }

    return head
  }

  // 静态使用
  if (!('value' in options)) {
    useHead(buildHead(options as SeoOptions))
    return
  }

  // 动态使用：响应式 ref
  const headState = reactive<any>(buildHead((options as Ref<SeoOptions>).value))
  useHead(headState)

  watch(
    options as Ref<SeoOptions>,
    (newOpt) => {
      const newHead = buildHead(newOpt)
      headState.title = newHead.title
      headState.meta = newHead.meta
      headState.link = newHead.link
      headState.script = newHead.script
    },
    { deep: true },
  )
}
