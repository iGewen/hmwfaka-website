<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Container from '@/components/common/Container.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppButton from '@/components/common/AppButton.vue'
import { useSeo } from '@/composables/useSeo'
import { siteConfig } from '@/data/site'
import { getBlogBySlug } from '@/lib/docs'
import { renderMarkdown } from '@/lib/markdown'

const route = useRoute()

const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return (s as string) || ''
})

const post = computed(() => getBlogBySlug(slug.value))
const parsed = computed(() => {
  if (!post.value) return null
  return renderMarkdown(post.value.raw)
})

const formattedDate = computed(() => {
  const date = post.value?.frontmatter.date
  if (!date) return ''
  try {
    return new Date(date as string).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return date as string
  }
})

// 响应式 SEO 状态
const seoState = reactive({
  title: `${siteConfig.name} 博客`,
  description: siteConfig.description,
  keywords: [] as string[],
  type: 'article' as const,
  publishedTime: undefined as string | undefined,
  author: siteConfig.author,
  path: `/blog/${slug.value}`,
  schema: {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: '',
    description: '',
    author: { '@type': 'Person', name: siteConfig.author },
    publisher: { '@type': 'Organization', name: siteConfig.fullName },
  } as object,
})
useSeo(seoState)

// 监听内容变化，更新 SEO
watch(
  () => parsed.value,
  (val) => {
    if (!val || !post.value) return
    seoState.title = `${val.title} - ${siteConfig.name} 博客`
    seoState.description = val.description || val.title
    seoState.keywords = (post.value.frontmatter.tags as string[]) || []
    seoState.publishedTime = post.value.frontmatter.date as string
    seoState.author = (post.value.frontmatter.author as string) || siteConfig.author
    seoState.path = `/blog/${slug.value}`
    const schemaObj = seoState.schema as any
    schemaObj.headline = val.title
    schemaObj.description = val.description
    schemaObj.author = {
      '@type': 'Person',
      name: (post.value.frontmatter.author as string) || siteConfig.author,
    }
    schemaObj.datePublished = post.value.frontmatter.date
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <section v-if="!post" class="py-24">
      <Container size="narrow" class="text-center">
        <AppIcon name="file-text" :size="48" class="text-fg-subtle/40 mx-auto" />
        <h1 class="mt-4 font-display text-2xl font-bold text-ink-900">文章不存在</h1>
        <p class="mt-2 text-fg-muted">您访问的文章可能已被删除或链接错误。</p>
        <AppButton to="/blog" variant="primary" class="mt-6" icon="arrow-left">
          返回博客
        </AppButton>
      </Container>
    </section>

    <article v-else>
      <section class="relative overflow-hidden bg-cream-50 border-b border-border">
        <div class="absolute inset-0 bg-grid-fade opacity-50" />
        <Container size="narrow" class="relative py-14 lg:py-20">
          <RouterLink
            to="/blog"
            class="inline-flex items-center gap-1 text-xs font-mono text-fg-subtle hover:text-ink-900 transition-colors"
          >
            <AppIcon name="arrow-left" :size="12" />
            / blog
          </RouterLink>

          <div class="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <span v-if="post.frontmatter.category" class="inline-flex items-center gap-1 font-mono text-accent-700 uppercase tracking-wider">
              <AppIcon name="tag" :size="11" />
              {{ post.frontmatter.category }}
            </span>
            <span v-if="formattedDate" class="inline-flex items-center gap-1 font-mono text-fg-subtle">
              <AppIcon name="calendar" :size="11" />
              {{ formattedDate }}
            </span>
            <span v-if="post.frontmatter.author" class="inline-flex items-center gap-1 font-mono text-fg-subtle">
              <AppIcon name="edit" :size="11" />
              {{ post.frontmatter.author }}
            </span>
          </div>

          <h1 class="mt-4 font-display text-3xl lg:text-5xl font-bold text-ink-900 leading-[1.1] tracking-tight">
            {{ parsed?.title }}
          </h1>
          <p v-if="parsed?.description" class="mt-5 text-base lg:text-lg text-fg-muted leading-relaxed">
            {{ parsed.description }}
          </p>

          <div v-if="(post.frontmatter.tags as string[])?.length" class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="tag in (post.frontmatter.tags as string[])"
              :key="tag"
              class="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] text-fg-muted bg-cream-100"
            >
              #{{ tag }}
            </span>
          </div>
        </Container>
      </section>

      <section class="py-12 lg:py-16 bg-cream-50">
        <Container size="narrow">
          <div class="prose-docs prose prose-lg max-w-none" v-html="parsed?.html" />
        </Container>
      </section>

      <section class="py-12 lg:py-16 bg-cream-100/40 border-t border-border">
        <Container size="narrow" class="text-center">
          <AppIcon name="sparkles" :size="28" class="text-accent-500 mx-auto" />
          <h2 class="mt-4 font-display text-2xl font-bold text-ink-900">觉得有帮助？</h2>
          <p class="mt-2 text-fg-muted">体验 HmwCard 自动发卡系统，让您的虚拟商品生意更简单。</p>
          <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <AppButton to="/pricing" variant="primary" icon-right="arrow-right">
              查看定价
            </AppButton>
            <AppButton href="https://demo.ifaka.cc" variant="outline" icon="external-link">
              在线演示
            </AppButton>
          </div>
        </Container>
      </section>
    </article>
  </div>
</template>
