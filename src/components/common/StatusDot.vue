<script setup lang="ts">
interface Props {
  // 颜色：live(绿) / accent(琥珀) / muted(灰)
  color?: 'live' | 'accent' | 'muted' | 'red'
  // 是否脉冲
  pulse?: boolean
  size?: 'sm' | 'md'
}
withDefaults(defineProps<Props>(), {
  color: 'live',
  pulse: true,
  size: 'md',
})

const colorMap = {
  live: 'bg-live-500',
  accent: 'bg-accent-500',
  muted: 'bg-fg-subtle',
  red: 'bg-red-500',
}
</script>

<template>
  <span class="relative inline-flex" :class="size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'">
    <span
      v-if="pulse"
      :class="['absolute inset-0 rounded-full', colorMap[color]]"
      style="animation: ping-soft 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"
    />
    <span :class="['relative inline-flex rounded-full', colorMap[color], size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2']" />
  </span>
</template>
