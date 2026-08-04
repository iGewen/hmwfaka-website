<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'
import type { TocItem } from '@/lib/markdown'

interface Props {
  items: TocItem[]
}
defineProps<Props>()
</script>

<template>
  <nav v-if="items.length > 0" aria-label="页面目录" class="space-y-1.5">
    <h3 class="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle font-medium mb-3 flex items-center gap-2">
      <AppIcon name="list" :size="12" />
      / on this page
    </h3>
    <ul class="space-y-1 border-l border-border">
      <li v-for="item in items" :key="item.id">
        <a
          :href="`#${item.id}`"
          :class="[
            'block border-l-2 -ml-px px-3 py-1 text-xs transition-colors hover:text-ink-900',
            item.level === 2
              ? 'text-fg-muted hover:border-accent-500'
              : 'pl-5 text-fg-subtle hover:border-accent-400',
          ]"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
