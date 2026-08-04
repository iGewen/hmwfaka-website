<script setup lang="ts">
import Container from '@/components/common/Container.vue'
import AnimatedNumber from '@/components/common/AnimatedNumber.vue'
import AppIcon from '@/components/common/AppIcon.vue'

const stats = [
  { value: 2000, suffix: '+', label: '活跃商户', sub: '遍布全国与海外' },
  { value: 99.9, suffix: '%', label: '系统可用率', sub: '7×24 不间断', decimals: 1 },
  { value: 50, suffix: 'ms', label: '平均响应', sub: '极致快速' },
  { value: 312, suffix: '', label: '今日成交笔数', sub: '实时增长中' },
]
</script>

<template>
  <section class="relative py-20 lg:py-24 bg-ink-900 text-cream-50 overflow-hidden">
    <!-- 背景网格 -->
    <div class="absolute inset-0 bg-grid-dark opacity-50" />
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

    <Container class="relative">
      <!-- 顶部章节标 -->
      <div class="flex items-center gap-3 mb-12">
        <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-50/50 font-medium">
          / trusted by merchants
        </span>
        <span class="h-px flex-1 bg-cream-50/10" />
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          class="group"
        >
          <!-- 数字 -->
          <div class="flex items-baseline gap-1">
            <span class="font-display font-bold tracking-tight text-[clamp(2.5rem,6vw,4rem)] leading-none text-gradient-amber">
              <AnimatedNumber
                :value="stat.value"
                :decimals="stat.decimals || 0"
                :suffix="stat.suffix"
              />
            </span>
          </div>
          <!-- 标签 -->
          <div class="mt-3 flex items-center gap-2">
            <AppIcon
              :name="i === 3 ? 'activity' : i === 2 ? 'zap' : i === 1 ? 'shield' : 'users'"
              :size="14"
              class="text-accent-400"
            />
            <span class="text-sm font-medium text-cream-50">{{ stat.label }}</span>
          </div>
          <p class="mt-1 text-xs text-cream-50/50 font-mono">{{ stat.sub }}</p>
        </div>
      </div>
    </Container>
  </section>
</template>
