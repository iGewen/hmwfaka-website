<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'
import { computed } from 'vue'
import { buildSidebar } from '@/lib/docs'

const sidebar = computed(() => buildSidebar())
const route = useRoute()

function currentSlug(): string {
  const s = route.params.slug
  if (Array.isArray(s)) return s.join('/')
  return (s as string) || ''
}
</script>

<template>
  <nav aria-label="文档导航" class="space-y-7">
    <div v-for="group in sidebar" :key="group.category">
      <h3 class="px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle font-medium mb-2 flex items-center gap-2">
        <span class="h-1 w-1 rounded-full bg-accent-500" />
        {{ group.category }}
      </h3>
      <ul class="space-y-0.5">
        <li v-for="item in group.items" :key="item.slug">
          <RouterLink
            :to="`/docs/${item.slug}`"
            :class="[
              'group flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-all',
              currentSlug() === item.slug
                ? 'bg-ink-900 text-cream-50 font-medium'
                : 'text-fg-muted hover:bg-cream-100 hover:text-ink-900',
            ]"
          >
            <AppIcon
              name="file-text"
              :size="13"
              :class="[
                'shrink-0 transition-colors',
                currentSlug() === item.slug ? 'text-accent-400' : 'text-fg-subtle/50',
              ]"
            />
            <span class="truncate">{{ item.title }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
