<script setup lang="ts">
import Container from '@/components/common/Container.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { useSeo } from '@/composables/useSeo'
import { siteConfig } from '@/data/site'

useSeo({
  title: `页面未找到 - ${siteConfig.name}`,
  description: '您访问的页面不存在或已被移动。',
  path: '/404',
})
</script>

<template>
  <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-cream-50">
    <div class="absolute inset-0 bg-grid-fade opacity-50" />
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-accent-200/30 blur-3xl pointer-events-none" />

    <Container size="narrow" class="relative text-center py-20">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-mono font-medium">
        <AppIcon name="close" :size="12" :stroke-width="2.5" />
        ERROR · 404
      </div>

      <h1 class="mt-8 font-display font-bold text-ink-900 tracking-tighter leading-none text-[clamp(6rem,18vw,12rem)]">
        4<span class="text-gradient-amber">0</span>4
      </h1>

      <h2 class="mt-4 font-display text-2xl lg:text-3xl font-semibold text-ink-900 tracking-tight">
        页面未找到
      </h2>
      <p class="mt-3 text-base text-fg-muted leading-relaxed max-w-md mx-auto">
        您访问的页面不存在或已被移动，请检查链接是否正确。
      </p>

      <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <AppButton to="/" variant="primary" icon="arrow-left">
          返回首页
        </AppButton>
        <AppButton to="/docs" variant="outline">
          浏览文档
        </AppButton>
      </div>
    </Container>
  </section>
</template>
