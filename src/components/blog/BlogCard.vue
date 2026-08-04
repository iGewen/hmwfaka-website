<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'

interface Props {
  slug: string
  title: string
  description: string
  date: string
  tags?: string[]
  author?: string
  category?: string
}
const props = defineProps<Props>()

const formattedDate = computed(() => {
  try {
    return new Date(props.date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return props.date
  }
})
</script>

<template>
  <RouterLink
    :to="`/blog/${slug}`"
    class="lift-card group block rounded-2xl border border-border bg-cream-50 p-6 hover:border-ink-900 hover:shadow-lift"
  >
    <div class="flex items-center gap-3 mb-3 text-xs">
      <span v-if="category" class="inline-flex items-center gap-1 font-mono text-accent-700 uppercase tracking-wider text-[10px]">
        <AppIcon name="tag" :size="10" />
        {{ category }}
      </span>
      <span class="font-mono text-fg-subtle text-[11px]">{{ formattedDate }}</span>
    </div>

    <h3 class="font-display text-lg font-semibold text-ink-900 leading-snug tracking-tight group-hover:text-accent-700 transition-colors">
      {{ title }}
    </h3>

    <p class="mt-2 text-sm text-fg-muted leading-relaxed line-clamp-3">
      {{ description }}
    </p>

    <div class="mt-5 flex items-center justify-between">
      <div class="flex flex-wrap items-center gap-1.5">
        <span
          v-for="tag in (tags || []).slice(0, 3)"
          :key="tag"
          class="inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[10px] text-fg-muted bg-cream-100"
        >
          #{{ tag }}
        </span>
      </div>
      <span class="inline-flex items-center gap-1 text-xs font-medium text-ink-900 group-hover:gap-2 transition-all">
        阅读
        <AppIcon name="arrow-right" :size="12" />
      </span>
    </div>
  </RouterLink>
</template>
