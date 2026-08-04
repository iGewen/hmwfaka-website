import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  readdirSync,
  existsSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
} from 'node:fs'

// ESM 兼容的 __dirname
const __dirname = dirname(fileURLToPath(import.meta.url))

// 扫描 src/content/docs 与 src/content/blog 下所有 .md 文件
// 返回对应的路由路径，用于 SSG 静态预渲染
function collectMdRoutesSync(): string[] {
  const routes: string[] = []
  const projectRoot = __dirname

  const scan = (dir: string, prefix: string) => {
    const abs = resolve(projectRoot, dir)
    if (!existsSync(abs)) return
    const files = readdirSync(abs, { recursive: true }) as string[]
    for (const file of files) {
      if (!file.endsWith('.md')) continue
      const slug = file
        .replace(/\.md$/, '')
        .replace(/\\/g, '/') // windows safe
        .replace(/\/index$/, '')
      routes.push(`${prefix}/${slug}`)
    }
  }

  scan('src/content/docs', '/docs')
  scan('src/content/blog', '/blog')
  return routes
}

// 静态路由列表
const staticRoutes = ['/', '/about', '/pricing', '/contact', '/blog', '/docs']

// 生成 sitemap.xml 插件
function sitemapPlugin(): Plugin {
  return {
    name: 'sitemap-generator',
    apply: 'build',
    closeBundle() {
      // sitemap.xml 在 client build 结束时生成（不依赖渲染结果）
      const site = 'https://www.ifaka.cc'
      const allRoutes = [...staticRoutes, ...collectMdRoutesSync()]
      const today = new Date().toISOString().split('T')[0]

      const urls = allRoutes
        .map((path) => {
          const priority = path === '/' ? '1.0' : path.startsWith('/docs') ? '0.8' : '0.6'
          return `  <url>
    <loc>${site}${path === '/' ? '' : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
        })
        .join('\n')

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

      const outDir = resolve(__dirname, 'dist')
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
      writeFileSync(resolve(outDir, 'sitemap.xml'), xml, 'utf-8')
      console.log(`[sitemap] Generated sitemap.xml with ${allRoutes.length} URLs`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), sitemapPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    // 允许 Z.ai 预览域名（网关反代）访问 dev server
    allowedHosts: ['.space-z.ai', '.chatglm.cn', '.z.ai', 'localhost'],
    // 信任网关代理，正确解析 X-Forwarded-* 头
    // Vite 6 在 configureServer 中需手动处理 trust proxy（已通过 allowedHosts 解决主要问题）
    fs: {
      // 限制可服务的文件范围（避免 skills 目录被访问）
      allow: [__dirname],
      deny: [
        resolve(__dirname, 'skills'),
        resolve(__dirname, '.git'),
      ],
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['.space-z.ai', '.chatglm.cn', '.z.ai', 'localhost'],
  },
  // 静态资源在构建时内联到 JS，避免 MD 文件路径问题
  assetsInclude: ['**/*.md'],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    dirStyle: 'nested',
    // 显式包含动态路由（文档 / 博客文章）+ 所有静态路由
    includedRoutes: (paths) => {
      // paths 包含 vite-ssg 自动收集的所有静态路由
      const staticRoutesFromPaths = paths.filter((p) => !p.includes(':'))
      const mdRoutes = collectMdRoutesSync()
      // 添加一个 /404 路径用于生成 404.html（匹配 router 的 catch-all）
      return [...staticRoutesFromPaths, ...mdRoutes, '/404']
    },
    // 所有页面渲染完成后：复制 404/index.html → dist/404.html
    onFinished() {
      const outDir = resolve(__dirname, 'dist')
      const notFoundSrc = resolve(outDir, '404', 'index.html')
      if (existsSync(notFoundSrc)) {
        copyFileSync(notFoundSrc, resolve(outDir, '404.html'))
        console.log('[ssg] Copied 404.html for static hosting')
      }
    },
  },
})
