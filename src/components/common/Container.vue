<script setup lang="ts">
interface Props {
  // 最大宽度，默认 'page' = 80rem，可指定 'narrow' / 'wide'
  size?: 'page' | 'narrow' | 'wide'
  as?: string
}
const props = withDefaults(defineProps<Props>(), {
  size: 'page',
  as: 'div',
})

const widths: Record<string, string> = {
  narrow: 'max-w-3xl',
  page: 'max-w-7xl',
  wide: 'max-w-screen-2xl',
}
</script>

<template>
  <component
    :is="as"
    :class="['mx-auto w-full px-5 lg:px-8', widths[props.size]]"
  >
    <slot />
  </component>
</template>
