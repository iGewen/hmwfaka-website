import type { RouteRecordRaw } from 'vue-router'
import { parseFrontmatter, type DocFrontmatter } from './markdown'

/**
 * 文档自动加载核心逻辑
 * - 通过 Vite 的 import.meta.glob 自动发现 src/content/docs/ 下所有 .md 文件
 * - SSG 构建时会生成对应的路由
 * - 添加 / 删除 .md 文件 = 自动增删文档与路由
 *
 * 路径约定：
 *   src/content/docs/introduction.md   → /docs/introduction
 *   src/content/docs/deploy/docker.md   → /docs/deploy/docker
 *   src/content/docs/index.md          → /docs
 */

interface DocEntry {
  // 相对路径，如 'deploy/docker'
  slug: string
  // 完整 markdown 内容
  raw: string
  // frontmatter
  frontmatter: DocFrontmatter
  // 文件路径（用于调试）
  filePath: string
}

// Vite 在构建时会将下面这行替换为模块映射
// eager: 立即加载内容（不是懒加载）
// query: '?raw' 让 MD 文件作为字符串导入
const docModules = import.meta.glob<string>('../content/docs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const blogModules = import.meta.glob<string>('../content/blog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function slugFromPath(p: string, base: string): string {
  // 标准化路径分隔符
  const norm = p.replace(/\\/g, '/')
  // 找到 content/docs 或 content/blog 之后的部分
  const marker = `/content/${base}/`
  const idx = norm.indexOf(marker)
  if (idx !== -1) {
    const rel = norm.slice(idx + marker.length)
    return rel.replace(/\.md$/, '').replace(/\/index$/, '')
  }
  // fallback：直接去掉已知的相对前缀
  const rel = norm.replace(new RegExp(`.*content/${base}/`), '')
  return rel.replace(/\.md$/, '').replace(/\/index$/, '')
}

/** 收集所有文档条目（运行时，由 import.meta.glob 提供） */
export function collectDocs(): DocEntry[] {
  const base = 'docs'
  return Object.entries(docModules).map(([path, raw]) => {
    const slug = slugFromPath(path, base)
    const content = raw as string
    const { frontmatter } = parseFrontmatter(content)
    return { slug, raw: content, frontmatter, filePath: path }
  })
}

/** 收集所有博客条目 */
export function collectBlogPosts(): DocEntry[] {
  const base = 'blog'
  return Object.entries(blogModules).map(([path, raw]) => {
    const slug = slugFromPath(path, base)
    const content = raw as string
    const { frontmatter } = parseFrontmatter(content)
    return { slug, raw: content, frontmatter, filePath: path }
  })
}

/**
 * 文档中心侧边栏结构（按 frontmatter 的 category 字段分组，没有分到 "其它"）
 * 按 frontmatter.order 排序，无 order 按字母序
 */
export interface SidebarGroup {
  category: string
  items: Array<{
    slug: string
    title: string
    order?: number
  }>
}

export function buildSidebar(): SidebarGroup[] {
  const docs = collectDocs()
  const groups: Record<string, SidebarGroup> = {}

  for (const doc of docs) {
    const cat = (doc.frontmatter.category as string) || '入门'
    if (!groups[cat]) groups[cat] = { category: cat, items: [] }
    groups[cat].items.push({
      slug: doc.slug,
      title: (doc.frontmatter.title as string) || doc.slug,
      order: typeof doc.frontmatter.order === 'number' ? doc.frontmatter.order : 99,
    })
  }

  const result = Object.values(groups)
  for (const g of result) {
    g.items.sort(
      (a, b) => (a.order ?? 99) - (b.order ?? 99) || a.slug.localeCompare(b.slug),
    )
  }
  // 类别顺序：入门 → 部署 → 开发 → 常见问题 → 其它
  const order = ['入门', '部署', '开发', '常见问题', '其它']
  result.sort((a, b) => {
    const ai = order.indexOf(a.category)
    const bi = order.indexOf(b.category)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })

  return result
}

/**
 * 根据当前 slug 获取上一篇 / 下一篇文档
 */
export function getPrevNext(currentSlug: string): {
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
} {
  const flat: { slug: string; title: string; order: number }[] = []
  for (const g of buildSidebar()) {
    for (const it of g.items) {
      flat.push({ slug: it.slug, title: it.title, order: it.order ?? 99 })
    }
  }
  flat.sort((a, b) => a.order - b.order)
  const idx = flat.findIndex((it) => it.slug === currentSlug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? { slug: flat[idx - 1].slug, title: flat[idx - 1].title } : null,
    next:
      idx < flat.length - 1
        ? { slug: flat[idx + 1].slug, title: flat[idx + 1].title }
        : null,
  }
}

/**
 * 根据 slug 获取文档内容
 */
export function getDocBySlug(slug: string): DocEntry | null {
  return collectDocs().find((d) => d.slug === slug) || null
}

export function getBlogBySlug(slug: string): DocEntry | null {
  return collectBlogPosts().find((d) => d.slug === slug) || null
}

/**
 * SSG 时收集所有动态路由（在 Node 环境中用 fs 直接扫描，不依赖 import.meta.glob）
 */
export async function collectMdRoutes(): Promise<string[]> {
  // 优先尝试 import.meta.glob（dev / 客户端构建环境）
  // 如果不在 Vite 上下文，fallback 到 fs 扫描
  try {
    const docs = collectDocs()
    const blog = collectBlogPosts()
    if (docs.length > 0 || blog.length > 0) {
      return [
        ...docs.map((d) => `/docs/${d.slug}`),
        ...blog.map((b) => `/blog/${b.slug}`),
      ]
    }
  } catch (e) {
    // fallthrough to fs scan
  }

  // Node 环境 fallback：直接读文件系统
  const fs = await import('node:fs')
  const path = await import('node:path')
  const { fileURLToPath } = await import('node:url')

  let projectRoot: string
  try {
    projectRoot = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '..', '..',
    )
  } catch {
    projectRoot = process.cwd()
  }

  const routes: string[] = []
  const scanDir = (dir: string, prefix: string) => {
    if (!fs.existsSync(dir)) return
    for (const file of fs.readdirSync(dir, { recursive: true }) as string[]) {
      if (!file.endsWith('.md')) continue
      const slug = file.replace(/\.md$/, '').replace(/\/index$/, '')
      routes.push(`${prefix}/${slug}`)
    }
  }

  scanDir(path.resolve(projectRoot, 'src/content/docs'), '/docs')
  scanDir(path.resolve(projectRoot, 'src/content/blog'), '/blog')

  return routes
}
