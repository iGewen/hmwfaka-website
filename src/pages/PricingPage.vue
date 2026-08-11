<script setup lang="ts">
import Container from '@/components/common/Container.vue'
import SectionLabel from '@/components/common/SectionLabel.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import PricingCard from '@/components/pricing/PricingCard.vue'
import ComparisonTable from '@/components/pricing/ComparisonTable.vue'
import { useSeo } from '@/composables/useSeo'
import { siteConfig } from '@/data/site'
import { pricingPlans, addons } from '@/data/pricing'

useSeo({
  title: `定价方案 - ${siteConfig.name}`,
  description:
    '三个版本均为完整成品系统，区别在于售后服务。基础版 ¥89 起，专业版 ¥199，至尊版 ¥299。一次购买，终身使用。',
  keywords: ['HmwCard 定价', '发卡系统价格', '自动发卡系统多少钱', '发卡系统购买'],
  path: '/pricing',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: siteConfig.fullName,
    description: siteConfig.description,
    offers: pricingPlans.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      price: p.price,
      priceCurrency: 'CNY',
      description: p.description,
    })),
  },
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-cream-50 pt-16 pb-12 lg:pt-24">
      <div class="absolute inset-0 bg-grid-fade opacity-50" />
      <Container class="relative">
        <SectionLabel
          label="/ pricing"
          title="简单透明的定价"
          description="三个版本均为完整成品系统，区别仅在于售后服务。一次购买，终身使用。"
        />

        <!-- 价格标签：mono 风格 -->
        <div class="mt-8 flex flex-wrap items-center gap-3 text-xs font-mono text-fg-subtle">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-cream-100">
            <AppIcon name="check" :size="11" class="text-live-600" :stroke-width="2.5" />
            一次买断
          </span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-cream-100">
            <AppIcon name="check" :size="11" class="text-live-600" :stroke-width="2.5" />
            成品系统交付
          </span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-cream-100">
            <AppIcon name="check" :size="11" class="text-live-600" :stroke-width="2.5" />
            交付前可退款
          </span>
        </div>
      </Container>
    </section>

    <!-- 三档定价 -->
    <section class="pb-16 lg:pb-20 bg-cream-50">
      <Container>
        <div class="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          <PricingCard v-for="plan in pricingPlans" :key="plan.id" :plan="plan" />
        </div>
      </Container>
    </section>

    <!-- 对比表 -->
    <section class="py-16 lg:py-20 bg-cream-100/40 border-y border-border">
      <Container>
        <SectionLabel
          label="/ compare"
          title="服务对比"
          description="清晰对比三个版本的服务差异，按需选择。"
        />
        <div class="mt-10">
          <ComparisonTable />
        </div>
      </Container>
    </section>

    <!-- 增值服务 -->
    <section class="py-16 lg:py-20 bg-cream-50">
      <Container>
        <SectionLabel
          label="/ add-ons"
          title="增值服务"
          description="按需选择，灵活组合。所有服务均可单独购买，价格透明。"
        />

        <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <article
            v-for="addon in addons"
            :key="addon.name"
            class="lift-card group relative rounded-2xl border border-border bg-cream-50 p-6 hover:border-ink-900 hover:shadow-lift flex flex-col"
          >
            <!-- 热门标签 -->
            <span
              v-if="addon.tag"
              class="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider bg-accent-100 text-accent-700 border border-accent-200"
            >
              {{ addon.tag }}
            </span>

            <!-- 图标 -->
            <div class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ink-900 text-cream-50 transition-transform group-hover:scale-105">
              <AppIcon :name="addon.icon" :size="20" />
            </div>

            <!-- 名称 -->
            <h3 class="mt-4 font-display text-base font-semibold text-ink-900">{{ addon.name }}</h3>

            <!-- 价格 -->
            <div class="mt-3 flex items-baseline gap-1">
              <span class="font-display text-2xl font-bold text-ink-900 tabular-nums">¥{{ addon.price }}</span>
              <span class="font-mono text-xs text-fg-subtle">/ {{ addon.unit }}</span>
            </div>

            <!-- 描述 -->
            <p class="mt-2 text-xs text-fg-muted leading-relaxed flex-1">
              {{ addon.description }}
            </p>

            <!-- 底部 CTA -->
            <div class="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span class="font-mono text-[10px] text-fg-subtle uppercase tracking-wider">详细咨询</span>
              <AppIcon name="arrow-up-right" :size="14" class="text-fg-subtle group-hover:text-ink-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </article>
        </div>

        <!-- 底部说明 -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-fg-subtle">
          <span class="inline-flex items-center gap-1.5">
            <AppIcon name="check-circle" :size="13" class="text-live-600" :stroke-width="2" />
            价格透明，无隐形消费
          </span>
          <span class="inline-flex items-center gap-1.5">
            <AppIcon name="check-circle" :size="13" class="text-live-600" :stroke-width="2" />
            大型项目可签订正式合同
          </span>
          <span class="inline-flex items-center gap-1.5">
            <AppIcon name="check-circle" :size="13" class="text-live-600" :stroke-width="2" />
            支持对公转账 / 开票
          </span>
        </div>

        <!-- 退款说明 -->
        <div class="mt-8 rounded-xl border border-border bg-cream-100/60 p-5 text-center">
          <p class="text-sm text-fg-muted leading-relaxed">
            <span class="font-medium text-ink-900">退款政策：</span>
            系统为可复制数字产品，交付前支持退款；一旦交付完成，因产品性质无法撤回，概不退款。
            购买前请充分评估需求，如有疑问请先联系我们确认。
          </p>
        </div>
      </Container>
    </section>
  </div>
</template>
