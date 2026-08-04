<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'

interface Props {
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}
defineProps<Props>()
</script>

<template>
  <nav class="grid sm:grid-cols-2 gap-3 mt-12 pt-8 border-t border-border">
    <RouterLink
      v-if="prev"
      :to="`/docs/${prev.slug}`"
      class="lift-card group flex items-start gap-3 rounded-xl border border-border bg-cream-50 p-4 hover:border-ink-900 hover:shadow-soft"
    >
      <AppIcon name="arrow-left" :size="16" class="mt-0.5 text-fg-subtle group-hover:text-ink-900 shrink-0" />
      <div class="min-w-0">
        <p class="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">prev</p>
        <p class="mt-0.5 text-sm font-medium text-ink-900 truncate group-hover:text-accent-700">
          {{ prev.title }}
        </p>
      </div>
    </RouterLink>
    <div v-else />

    <RouterLink
      v-if="next"
      :to="`/docs/${next.slug}`"
      class="lift-card group flex items-start gap-3 rounded-xl border border-border bg-cream-50 p-4 hover:border-ink-900 hover:shadow-soft sm:text-right sm:flex-row-reverse"
    >
      <AppIcon name="arrow-right" :size="16" class="mt-0.5 text-fg-subtle group-hover:text-ink-900 shrink-0" />
      <div class="min-w-0">
        <p class="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">next</p>
        <p class="mt-0.5 text-sm font-medium text-ink-900 truncate group-hover:text-accent-700">
          {{ next.title }}
        </p>
      </div>
    </RouterLink>
  </nav>
</template>
