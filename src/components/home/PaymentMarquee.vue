<script setup lang="ts">
import Container from '@/components/common/Container.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import BrandIcon from '@/components/common/BrandIcon.vue'

type BrandName = 'wechat' | 'alipay' | 'unionpay' | 'paypal' | 'stripe'

// 各支付渠道的视觉色（用于卡片品牌色点缀）
const methods: { icon: BrandName, name: string, desc: string, badge: string, color: string }[] = [
  {
    icon: 'wechat',
    name: '微信支付',
    desc: '0.6% 费率',
    badge: '国内',
    color: '#07C160',
  },
  {
    icon: 'alipay',
    name: '支付宝',
    desc: '0.6% 费率',
    badge: '国内',
    color: '#1677FF',
  },
  {
    icon: 'unionpay',
    name: '银联',
    desc: '聚合通道',
    badge: '国内',
    color: '#E60012',
  },
  {
    icon: 'paypal',
    name: 'PayPal',
    desc: '4.4% + $0.3',
    badge: '海外',
    color: '#003087',
  },
  {
    icon: 'stripe',
    name: 'Stripe',
    desc: '2.9% + $0.3',
    badge: '海外',
    color: '#635BFF',
  },
]
</script>

<template>
  <section class="relative border-y border-border bg-ink-900 py-12 lg:py-14 overflow-hidden">
    <!-- 装饰：右上角琥珀光晕 -->
    <div class="absolute -top-20 -right-20 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -bottom-20 -left-20 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

    <Container class="relative">
      <!-- 标题 -->
      <div class="flex items-center gap-3 mb-6">
        <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-50/50 font-medium">
          / supported payment channels
        </span>
        <span class="h-px flex-1 bg-cream-50/10" />
        <span class="font-mono text-[11px] text-accent-400 font-medium">
          5 个渠道 · 国内外全覆盖
        </span>
      </div>

      <!-- 卡片网格 - 静态不移动 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        <div
          v-for="m in methods"
          :key="m.name"
          class="lift-card group relative rounded-xl border border-cream-50/10 bg-cream-50/[0.03] hover:bg-cream-50/[0.08] hover:border-cream-50/25 p-5 transition-all duration-300"
        >
          <!-- 品牌色条 -->
          <span
            class="absolute top-0 left-4 right-4 h-0.5 rounded-b-full opacity-70"
            :style="{ background: m.color }"
          />

          <!-- 图标 + badge -->
          <div class="flex items-start justify-between mb-3">
            <span
              class="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-cream-50/15 bg-white/90 transition-transform group-hover:scale-105"
            >
              <BrandIcon :name="m.icon" :size="32" />
            </span>
            <span
              :class="[
                'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider',
                m.badge === '国内'
                  ? 'bg-accent-500/15 text-accent-300 border border-accent-500/30'
                  : 'bg-cream-50/10 text-cream-50/70 border border-cream-50/15',
              ]"
            >
              {{ m.badge }}
            </span>
          </div>

          <!-- 名称 -->
          <div class="font-display text-base font-semibold text-cream-50">{{ m.name }}</div>
          <!-- 描述 -->
          <div class="mt-0.5 font-mono text-[11px] text-cream-50/50">{{ m.desc }}</div>
        </div>
      </div>

      <!-- 底部说明 -->
      <div class="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-cream-50/40">
        <span class="inline-flex items-center gap-1.5">
          <AppIcon name="check-circle" :size="12" class="text-live-400" :stroke-width="2" />
          官方接口 · 资金直达
        </span>
        <span class="inline-flex items-center gap-1.5">
          <AppIcon name="check-circle" :size="12" class="text-live-400" :stroke-width="2" />
          支持个人 / 个体户 / 企业
        </span>
        <span class="inline-flex items-center gap-1.5">
          <AppIcon name="check-circle" :size="12" class="text-live-400" :stroke-width="2" />
          自定义费率可谈
        </span>
      </div>
    </Container>
  </section>
</template>
