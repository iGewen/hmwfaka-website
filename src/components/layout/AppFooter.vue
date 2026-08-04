<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'
import { siteConfig } from '@/data/site'

const cols = [
  {
    title: '产品',
    links: [
      { label: '功能特性', to: '/#features' },
      { label: '定价方案', to: '/pricing' },
      { label: '更新日志', to: '/blog' },
      { label: '在线演示', href: 'https://demo.ifaka.cc', external: true },
    ],
  },
  {
    title: '资源',
    links: [
      { label: '文档中心', to: '/docs' },
      { label: '常见问题', to: '/docs/faq' },
      { label: '部署指南', to: '/docs/deployment' },
      { label: '博客', to: '/blog' },
    ],
  },
  {
    title: '公司',
    links: [
      { label: '关于我们', to: '/about' },
      { label: '联系我们', to: '/contact' },
      { label: '商务合作', to: '/contact' },
    ],
  },
]
</script>

<template>
  <footer class="relative overflow-hidden bg-ink-900 text-cream-50">
    <!-- 顶部网格装饰 -->
    <div class="absolute inset-0 bg-grid-dark opacity-40" />
    <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />

    <div class="container-page relative pt-20 pb-10">
      <!-- 上半：链接 -->
      <div class="grid grid-cols-2 gap-8 md:grid-cols-12 lg:gap-12">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-5 lg:col-span-6">
          <RouterLink to="/" class="inline-flex items-center gap-2.5">
            <img src="/logo.svg" alt="HmwCard Logo" class="h-9 w-9 rounded-lg" />
            <span class="flex flex-col leading-none">
              <span class="font-display text-lg font-semibold tracking-tight text-cream-50">
                何慕雯发卡
              </span>
              <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-50/40 mt-0.5">
                HMW AUTOCARD
              </span>
            </span>
          </RouterLink>
          <p class="mt-4 max-w-sm text-sm text-cream-50/60 leading-relaxed">
            {{ siteConfig.tagline }}
          </p>
          <!-- Status -->
          <div class="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cream-50/10 bg-cream-50/5 text-xs">
            <span class="relative inline-flex h-1.5 w-1.5">
              <span class="absolute inset-0 rounded-full bg-live-500" style="animation: ping-soft 1.8s ease-in-out infinite;" />
              <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-live-500" />
            </span>
            <span class="font-mono text-cream-50/70">所有系统运行正常</span>
          </div>
        </div>

        <!-- Link columns -->
        <div
          v-for="col in cols"
          :key="col.title"
          class="md:col-span-2 lg:col-span-2"
        >
          <h3 class="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-50/40 font-medium">
            {{ col.title }}
          </h3>
          <ul class="mt-4 space-y-2.5">
            <li v-for="link in col.links" :key="link.label">
              <a
                v-if="link.external"
                :href="link.href"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 text-sm text-cream-50/70 hover:text-cream-50 transition-colors"
              >
                {{ link.label }}
                <AppIcon name="arrow-up-right" :size="11" class="opacity-60" />
              </a>
              <RouterLink
                v-else
                :to="link.to"
                class="text-sm text-cream-50/70 hover:text-cream-50 transition-colors"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- 巨型 Wordmark（装饰性，不进入文档大纲） -->
      <div class="relative mt-16 mb-8 select-none">
        <div aria-hidden="true" class="font-display font-bold tracking-tighter text-cream-50/95 leading-none text-[18vw] md:text-[15vw] lg:text-[13vw]">
          HmwCard
        </div>
        <div class="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream-50/20 to-transparent" />
      </div>

      <!-- 底部信息 -->
      <div class="flex flex-col items-start justify-between gap-3 text-xs text-cream-50/50 sm:flex-row sm:items-center">
        <p class="font-mono">
          {{ siteConfig.copyright }}
        </p>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
          <a
            v-if="siteConfig.icp"
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener"
            class="hover:text-cream-50/80"
          >
            {{ siteConfig.icp }}
          </a>
          <span class="text-cream-50/20">·</span>
          <span>Made by {{ siteConfig.author }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>
