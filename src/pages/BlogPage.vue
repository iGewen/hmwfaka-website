<script setup lang="ts">
import { computed } from 'vue'
import Container from '@/components/common/Container.vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { useSeo } from '@/composables/useSeo'
import { siteConfig } from '@/data/site'
import { collectBlogPosts } from '@/lib/docs'

const posts = computed(() => {
  return collectBlogPosts()
    .map((p) => ({
      slug: p.slug,
      title: p.frontmatter.title as string,
      description: p.frontmatter.description as string,
      date: p.frontmatter.date as string,
      tags: (p.frontmatter.tags as string[]) || [],
      author: p.frontmatter.author as string | undefined,
      category: p.frontmatter.category as string | undefined,
    }))
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
})

useSeo({
  title: `博客 - ${siteConfig.name}`,
  description:
    '虚拟商品定价、退款风控、运营经验分享。HmwCard 团队关于自动发卡与虚拟商品交易的实战经验与思考。',
  keywords: ['虚拟商品', '发卡系统', '运营经验', '退款风控', 'Docker 部署'],
  path: '/blog',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteConfig.name} 博客`,
    url: `${siteConfig.url}/blog`,
  },
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-cream-50 pt-16 pb-12 lg:pt-24">
      <div class="absolute inset-0 bg-grid-fade opacity-50" />
      <Container class="relative">
        <div class="flex items-center gap-3 mb-6">
          <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle font-medium">/ blog</span>
          <span class="h-px flex-1 bg-border max-w-xs" />
        </div>
        <h1 class="font-display font-bold text-ink-900 tracking-tight text-4xl lg:text-5xl leading-[1.05]">
          虚拟商品<br />
          <span class="text-gradient-amber">运营实战笔记</span>
        </h1>
        <p class="mt-5 text-base lg:text-lg text-fg-muted leading-relaxed max-w-xl">
          定价、退款、风控、运营经验分享。来自一线发卡商家的真实经历与思考。
        </p>
      </Container>
    </section>

    <!-- 文章列表 -->
    <section class="py-12 lg:py-16 bg-cream-50">
      <Container>
        <div v-if="posts.length === 0" class="text-center py-20 text-fg-muted">
          暂无文章，请将 Markdown 文件放入 src/content/blog/ 目录。
        </div>
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <BlogCard v-for="post in posts" :key="post.slug" v-bind="post" />
        </div>
      </Container>
    </section>
  </div>
</template>
