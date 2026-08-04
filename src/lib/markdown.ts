import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import hljs from 'highlight.js'

/**
 * markdown-it 实例
 * - 启用锚点（h2/h3 自动生成 id）
 * - 代码高亮（highlight.js）
 * - 容器 / 表格 / 链接处理
 */
export const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: false,
  highlight(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        return `<pre class="hljs"><code class="language-${lang}">${highlighted}</code></pre>`
      } catch (e) {
        // fall through
      }
    }
    const escaped = md.utils.escapeHtml(str)
    return `<pre class="hljs"><code>${escaped}</code></pre>`
  },
})

// 锚点插件：自动给 h2/h3 加 id 用于 TOC 跳转
md.use(anchor, {
  level: [2, 3],
  permalink: anchor.permalink.linkInsideHeader({
    symbol: '<span aria-hidden="true">#</span>',
    placement: 'before',
    renderHref: (slug: string) => `#${slug}`,
  }),
  slugify: (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''),
})

// 外部链接自动 target="_blank"
const defaultLinkOpen =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  const href = token.attrGet('href') || ''
  if (href.startsWith('http://') || href.startsWith('https://')) {
    if (!href.includes('ifaka.cc') && !href.includes('hmwcard')) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noopener noreferrer')
    }
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

/**
 * 解析 markdown，返回 HTML + 标题 + TOC
 */
export interface ParsedDoc {
  html: string
  title: string
  description?: string
  toc: TocItem[]
}

export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * 从 markdown 文本中提取 frontmatter (YAML 简化版)
 * 支持: ---\n title: xxx\n description: yyy\n order: 1\n ---
 */
export interface DocFrontmatter {
  title?: string
  description?: string
  order?: number
  category?: string
  author?: string
  date?: string
  tags?: string[]
  [key: string]: unknown
}

export function parseFrontmatter(content: string): {
  frontmatter: DocFrontmatter
  body: string
} {
  const fm: DocFrontmatter = {}
  let body = content

  // 兼容空 frontmatter（---\n---\n正文）和正常 frontmatter
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n?---\r?\n?([\s\S]*)$/)
  if (fmMatch) {
    const fmText = fmMatch[1] || ''
    body = fmMatch[2] || ''

    // 简易 YAML 解析（不依赖 gray-matter，避免构建问题）
    for (const line of fmText.split('\n')) {
      const m = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/)
      if (!m) continue
      const key = m[1].trim()
      let value: any = m[2].trim()

      // 去掉引号
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      // 布尔值
      else if (value === 'true' || value === 'false') {
        value = value === 'true'
      }
      // 数字（含负数、小数）
      else if (/^-?\d+(\.\d+)?$/.test(value)) {
        value = Number(value)
      }
      // 数组 [a, b, c]
      else if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map((s) => {
            const v = s.trim().replace(/^["']|["']$/g, '')
            // 数组里的元素也尝试转 Number / Boolean
            if (v === 'true' || v === 'false') return v === 'true'
            if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
            return v
          })
          .filter((s) => s !== '' && s !== undefined)
      }
      fm[key] = value
    }
  }

  return { frontmatter: fm, body }
}

/**
 * 从 HTML 中提取 H2/H3 作为 TOC
 */
function extractToc(html: string): TocItem[] {
  const toc: TocItem[] = []
  // [\s\S] 用于跨行匹配，i 标志忽略大小写
  const re = /<h([23])\s+[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi
  let match
  while ((match = re.exec(html)) !== null) {
    const level = Number(match[1])
    const id = match[2]
    // 去掉锚点 # 符号的 span
    const text = match[3]
      .replace(/<span[^>]*>#<\/span>/g, '')
      .replace(/<[^>]+>/g, '')
      .trim()
    toc.push({ id, text, level })
  }
  return toc
}

/**
 * 完整解析一个 markdown 文档
 */
export function renderMarkdown(content: string): ParsedDoc {
  const { frontmatter, body } = parseFrontmatter(content)

  // 移除第一个 H1（避免与模板里 frontmatter.title 渲染的 H1 重复，破坏文档大纲）
  let processedBody = body
  const h1Match = body.match(/^#\s+(.+)$/m)
  if (h1Match) {
    // 移除第一个 H1 行（含前后的换行）
    processedBody = body.replace(/^[\s]*#\s+.+\r?\n?/m, '').replace(/^\n+/, '')
  }
  const title = frontmatter.title || (h1Match ? h1Match[1].trim() : '未命名文档')

  const html = md.render(processedBody)
  const toc = extractToc(html)

  return {
    html,
    title,
    description: frontmatter.description,
    toc,
  }
}
