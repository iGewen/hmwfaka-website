<script setup lang="ts">
import { pricingPlans, comparisonTable } from '@/data/pricing'
import AppIcon from '@/components/common/AppIcon.vue'
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-border bg-cream-50">
    <div class="overflow-x-auto">
      <table class="w-full text-sm min-w-[680px]">
        <thead>
          <tr class="border-b border-border bg-cream-100/60">
            <th class="text-left px-6 py-5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle font-medium w-1/3">
              / service
            </th>
            <th
              v-for="plan in pricingPlans"
              :key="plan.id"
              :class="[
                'px-6 py-5 text-center',
                plan.recommended ? 'bg-accent-50/30' : '',
              ]"
            >
              <div class="flex flex-col items-center gap-1">
                <span class="font-display text-base font-semibold text-ink-900">{{ plan.name }}</span>
                <span class="font-mono text-xs text-fg-muted">¥{{ plan.price }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          <tr
            v-for="row in comparisonTable"
            :key="row.label"
            class="hover:bg-cream-100/40 transition-colors"
          >
            <td class="px-6 py-3.5 text-fg-muted">{{ row.label }}</td>
            <td
              v-for="(value, idx) in row.values"
              :key="idx"
              :class="[
                'px-6 py-3.5 text-center',
                pricingPlans[idx].recommended ? 'bg-accent-50/20' : '',
              ]"
            >
              <template v-if="value === true">
                <AppIcon name="check" :size="16" class="text-live-600 inline-block" :stroke-width="2.5" />
              </template>
              <template v-else-if="value === false">
                <span class="text-fg-subtle/40">—</span>
              </template>
              <template v-else>
                <span class="font-mono text-[13px] text-ink-900 font-medium">{{ value }}</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
