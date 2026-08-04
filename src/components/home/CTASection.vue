<script setup lang="ts">
import Container from '@/components/common/Container.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'
</script>

<template>
  <section class="relative py-24 lg:py-32 bg-cream-50 overflow-hidden">
    <!-- 装饰：大字背景 -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.08]">
      <span class="font-display font-bold text-[20vw] leading-none text-ink-900 tracking-tighter">HMW</span>
    </div>

    <Container size="narrow" class="relative text-center">
      <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-200 bg-accent-50 text-accent-700 text-xs font-mono font-medium">
        <AppIcon name="sparkles" :size="12" />
        限时特惠 · 仅此一次
      </span>

      <h2 class="mt-6 font-display font-bold tracking-tight text-ink-900 text-balance leading-[1.05] text-[clamp(2rem,5vw,3.5rem)]">
        准备好开启<br />
        <span class="text-gradient-amber">自动发卡</span>了吗？
      </h2>

      <p class="mt-5 text-base lg:text-lg text-fg-muted leading-relaxed max-w-xl mx-auto">
        一次购买，终身使用。完整源码交付，免费更新与技术支持。
      </p>

      <!-- 价格 -->
      <div class="mt-10 inline-flex items-baseline gap-3">
        <span class="text-fg-subtle line-through font-mono text-lg">¥129</span>
        <span class="font-display font-bold text-[clamp(3rem,8vw,5rem)] leading-none text-ink-900 tabular-nums">
          ¥89
        </span>
        <span class="font-mono text-sm text-fg-muted">起</span>
      </div>

      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <AppButton to="/pricing" variant="primary" size="lg" icon-right="arrow-right">
          查看定价方案
        </AppButton>
        <AppButton href="https://demo.ifaka.cc" variant="outline" size="lg" icon="external-link">
          在线体验演示
        </AppButton>
      </div>

      <!-- 底部 trust -->
      <div class="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-mono text-fg-subtle">
        <span class="inline-flex items-center gap-1.5">
          <AppIcon name="check" :size="12" class="text-live-600" :stroke-width="2.5" />
          7 天无理由退款
        </span>
        <span class="inline-flex items-center gap-1.5">
          <AppIcon name="check" :size="12" class="text-live-600" :stroke-width="2.5" />
          终身使用
        </span>
        <span class="inline-flex items-center gap-1.5">
          <AppIcon name="check" :size="12" class="text-live-600" :stroke-width="2.5" />
          源码全给
        </span>
        <span class="inline-flex items-center gap-1.5">
          <AppIcon name="check" :size="12" class="text-live-600" :stroke-width="2.5" />
          免费更新
        </span>
      </div>
    </Container>
  </section>
</template>
