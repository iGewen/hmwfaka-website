<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '@/icons'

interface Props {
  name: string
  size?: number | string
  // stroke-width，默认 1.8
  strokeWidth?: number
  // 自定义类（控制颜色等）
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
  strokeWidth: 1.8,
  class: '',
})

const icon = computed(() => getIcon(props.name))
</script>

<template>
  <svg
    v-if="icon"
    :width="size"
    :height="size"
    :viewBox="icon.viewBox || '0 0 24 24'"
    :class="['inline-block shrink-0', $props.class]"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="icon.body"
  />
</template>
