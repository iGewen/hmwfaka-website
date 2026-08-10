<script setup lang="ts">
import { computed, ref, watch, reactive } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Container from '@/components/common/Container.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppButton from '@/components/common/AppButton.vue'
import DocSidebar from '@/components/docs/DocSidebar.vue'
import DocToc from '@/components/docs/DocToc.vue'
import DocPrevNext from '@/components/docs/DocPrevNext.vue'
import { useSeo } from '@/composables/useSeo'
import { siteConfig } from '@/data/site'
import { getDocBySlug, getPrevNext, buildSidebar } from '@/lib/docs'
import { renderMarkdown } from '@/lib/markdown'

const route = useRoute()

const slug = computed(() => {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return (s as string) || ''
})

const doc = computed(() => getDocBySlug(slug.value))
const parsed = computed(() => {
  if (!doc.value) return null
  return renderMarkdown(doc.value.raw)
})

const prevNext = computed(() => getPrevNext(slug.value))
const sidebar = computed(() => buildSidebar())

const sidebarMobileOpen = ref(false)
function closeSidebarMobile() {
  sidebarMobileOpen.value = false
}

// 响应式 SEO 状态（避免在 watch 内重复 useHead）
const seoState = reactive({
  title: `${siteConfig.name} 文档`,
  description: 'HmwCard 发卡系统文档中心',
  keywords: ['HmwCard 文档', '发卡系统教程'],
  path: '/docs',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: '',
    description: '',
    author: { '@type': 'Organization', name: siteConfig.fullName },
    publisher: { '@type': 'Organization', name: siteConfig.fullName },
  } as object,
})
useSeo(seoState)

// 路由变化时更新 SEO + 关闭移动端侧边栏
watch(
  () => route.fullPath,
  () => {
    closeSidebarMobile()
    if (parsed.value && doc.value) {
      seoState.title = `${parsed.value.title} - ${siteConfig.name} 文档`
      seoState.description =
        parsed.value.description || `${parsed.value.title} - HmwCard 发卡系统文档`
      seoState.keywords = [parsed.value.title, 'HmwCard 文档', '发卡系统教程']
      seoState.path = `/docs/${slug.value}`
      const schemaObj = seoState.schema as any
      schemaObj.headline = parsed.value.title
      schemaObj.description = parsed.value.description
    }
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <!-- Top bar -->
    <section class="border-b border-border bg-cream-100/40">
      <Container>
        <div class="flex h-12 items-center justify-between">
          <div class="flex items-center gap-2 text-xs">
            <RouterLink to="/" class="font-mono text-fg-subtle hover:text-ink-900">~</RouterLink>
            <AppIcon name="chevron-right" :size="12" class="text-fg-subtle/50" />
            <RouterLink to="/docs" class="font-mono text-fg-subtle hover:text-ink-900">docs</RouterLink>
            <template v-if="doc">
              <AppIcon name="chevron-right" :size="12" class="text-fg-subtle/50" />
              <span class="font-mono text-ink-900 truncate max-w-[200px]">{{ parsed?.title }}</span>
            </template>
          </div>
          <AppButton href="https://demo.ifaka.cc" variant="ghost" size="sm" icon="external-link" class="hidden sm:inline-flex">
            在线演示
          </AppButton>
        </div>
      </Container>
    </section>

    <!-- 文档不存在 -->
    <section v-if="!doc && slug" class="py-24">
      <Container size="narrow" class="text-center">
        <AppIcon name="file-text" :size="48" class="text-fg-subtle/40 mx-auto" />
        <h1 class="mt-4 font-display text-2xl font-bold text-ink-900">文档不存在</h1>
        <p class="mt-2 text-fg-muted">您访问的文档可能已被删除或链接错误。</p>
        <AppButton to="/docs" variant="primary" class="mt-6" icon="arrow-left">
          返回文档中心
        </AppButton>
      </Container>
    </section>

    <!-- 文档中心首页 -->
    <section v-else-if="!doc && !slug" class="py-16 lg:py-20">
      <Container>
        <!-- 顶部标题区 -->
        <div class="max-w-2xl mb-12">
          <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">/ docs</span>
          <h1 class="mt-3 font-display text-4xl lg:text-5xl font-bold text-ink-900 tracking-tight">
            文档中心
          </h1>
          <p class="mt-4 text-base lg:text-lg text-fg-muted leading-relaxed">
            从快速开始到深度配置，这里有您需要的全部资料。
          </p>
        </div>

        <!-- 所有分类的文档卡片 -->
        <div class="space-y-12">
          <div v-for="group in sidebar" :key="group.category">
            <!-- 分类标题 -->
            <div class="flex items-center gap-3 mb-5">
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">{{ group.category }}</span>
              <span class="text-fg-subtle/40">·</span>
              <span class="font-mono text-[11px] text-fg-subtle/60">{{ group.items.length }} 篇</span>
            </div>

            <!-- 该分类下的文档卡片网格 -->
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <RouterLink
                v-for="item in group.items"
                :key="item.slug"
                :to="`/docs/${item.slug}`"
                class="lift-card group rounded-2xl border border-border bg-cream-50 p-6 hover:border-ink-900 hover:shadow-lift"
              >
                <div class="flex items-center justify-between mb-4">
                  <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ink-900 text-cream-50">
                    <AppIcon name="book" :size="18" />
                  </span>
                  <AppIcon name="arrow-up-right" :size="14" class="text-fg-subtle group-hover:text-ink-900" />
                </div>
                <h3 class="font-display text-base font-semibold text-ink-900 group-hover:text-accent-700 transition-colors">{{ item.title }}</h3>
                <p class="mt-1 text-xs font-mono text-fg-subtle">/docs/{{ item.slug }}</p>
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- 在线演示 CTA -->
        <div class="mt-16 rounded-2xl border border-border bg-ink-900 p-8 lg:p-10 text-center">
          <h2 class="font-display text-2xl font-bold text-cream-50">在线体验</h2>
          <p class="mt-2 text-cream-50/60 text-sm">想看看系统是什么样？访问我们的在线演示站点。</p>
          <AppButton href="https://demo.ifaka.cc" variant="accent" size="lg" icon="external-link" class="mt-6 bg-accent-500 hover:bg-accent-600 text-white">
            访问演示站点
          </AppButton>
        </div>
      </Container>
    </section>

    <!-- 文档详情 -->
    <section v-else class="py-10 lg:py-12">
      <Container>
        <div class="grid lg:grid-cols-[240px_minmax(0,1fr)_200px] gap-8">
          <!-- Sidebar -->
          <aside class="hidden lg:block">
            <div class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              <DocSidebar />
            </div>
          </aside>

          <!-- 移动端侧边栏触发 -->
          <div class="lg:hidden mb-4">
            <button
              class="flex w-full items-center justify-between rounded-lg border border-border bg-cream-50 px-4 py-2.5 text-sm font-medium text-ink-900"
              :aria-expanded="sidebarMobileOpen"
              aria-controls="mobile-sidebar"
              @click="sidebarMobileOpen = !sidebarMobileOpen"
            >
              <span class="inline-flex items-center gap-2">
                <AppIcon name="list" :size="16" />
                文档目录
              </span>
              <AppIcon name="chevron-down" :size="16" :class="{ 'rotate-180': sidebarMobileOpen }" />
            </button>
            <transition
              enter-active-class="transition duration-200"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div v-if="sidebarMobileOpen" id="mobile-sidebar" class="mt-2 rounded-xl border border-border bg-cream-50 p-4">
                <DocSidebar />
              </div>
            </transition>
          </div>

          <!-- Content -->
          <article class="min-w-0">
            <header class="mb-8 pb-6 border-b border-border">
              <div class="flex items-center gap-2 mb-2">
                <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                  / docs / {{ slug }}
                </span>
              </div>
              <h1 class="font-display text-3xl lg:text-4xl font-bold text-ink-900 tracking-tight leading-tight">
                {{ parsed?.title }}
              </h1>
              <p v-if="parsed?.description" class="mt-3 text-base text-fg-muted leading-relaxed">
                {{ parsed.description }}
              </p>
            </header>

            <div class="prose-docs prose prose-lg max-w-none" v-html="parsed?.html" />

            <DocPrevNext :prev="prevNext.prev" :next="prevNext.next" />
          </article>

          <!-- TOC -->
          <aside class="hidden lg:block">
            <div class="sticky top-24">
              <DocToc :items="parsed?.toc || []" />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  </div>
</template>
