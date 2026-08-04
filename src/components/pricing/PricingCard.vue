<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'
import AppButton from '@/components/common/AppButton.vue'
import type { PricingPlan } from '@/data/pricing'

interface Props {
  plan: PricingPlan
}
defineProps<Props>()
</script>

<template>
  <article
    :class="[
      'relative rounded-2xl p-7 lg:p-8 transition-all duration-300',
      plan.recommended
        ? 'bg-ink-900 text-cream-50 shadow-float border border-ink-700 lg:-translate-y-2'
        : 'bg-cream-50 border border-border hover:border-ink-900 hover:shadow-lift lift-card',
    ]"
  >
    <!-- 推荐 tag -->
    <span
      v-if="plan.recommended"
      class="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-500 text-ink-950 text-[10px] font-mono font-bold uppercase tracking-wider shadow-soft"
    >
      <AppIcon name="star" :size="10" :stroke-width="2.5" />
      Popular
    </span>

    <header>
      <div class="flex items-center justify-between">
        <h3
          :class="[
            'font-display text-xl font-semibold tracking-tight',
            plan.recommended ? 'text-cream-50' : 'text-ink-900',
          ]"
        >
          {{ plan.name }}
        </h3>
        <span
          v-if="plan.recommended"
          class="font-mono text-[10px] uppercase tracking-wider text-cream-50/40"
        >
          推荐
        </span>
      </div>
      <p
        :class="[
          'mt-1 text-sm',
          plan.recommended ? 'text-cream-50/60' : 'text-fg-muted',
        ]"
      >
        {{ plan.description }}
      </p>
    </header>

    <!-- 价格 -->
    <div class="mt-6 flex items-baseline gap-2">
      <span
        v-if="plan.originalPrice"
        :class="[
          'font-mono text-sm line-through',
          plan.recommended ? 'text-cream-50/30' : 'text-fg-subtle',
        ]"
      >
        ¥{{ plan.originalPrice }}
      </span>
      <span
        :class="[
          'font-display font-bold tabular-nums text-[2.75rem] leading-none',
          plan.recommended ? 'text-cream-50' : 'text-ink-900',
        ]"
      >
        ¥{{ plan.price }}
      </span>
    </div>
    <p
      :class="[
        'mt-1 text-xs font-mono',
        plan.recommended ? 'text-cream-50/40' : 'text-fg-subtle',
      ]"
    >
      / 一次买断 · 终身使用
    </p>

    <AppButton
      href="https://demo.ifaka.cc"
      :variant="plan.recommended ? 'secondary' : 'outline'"
      block
      size="md"
      class="mt-6"
      icon-right="arrow-right"
    >
      立即购买
    </AppButton>

    <ul class="mt-7 space-y-3">
      <li
        v-for="feature in plan.features"
        :key="feature"
        class="flex items-start gap-2.5 text-sm"
        :class="plan.recommended ? 'text-cream-50/80' : 'text-fg-muted'"
      >
        <AppIcon
          name="check"
          :size="14"
          :stroke-width="2.5"
          :class="plan.recommended ? 'text-accent-400' : 'text-accent-600'"
          class="mt-0.5 shrink-0"
        />
        <span>{{ feature }}</span>
      </li>
    </ul>
  </article>
</template>
