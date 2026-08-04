<script setup lang="ts">
import Container from './Container.vue'

interface Props {
  eyebrow?: string
  title?: string
  description?: string
  align?: 'left' | 'center'
  // dark mode for dark sections
  dark?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  align: 'center',
  dark: false,
})
</script>

<template>
  <Container size="narrow" :class="['mb-12 lg:mb-16', props.align === 'center' ? 'text-center' : 'text-left']">
    <span
      v-if="eyebrow"
      :class="[
        'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3',
        dark ? 'text-brand-300' : 'text-brand-600',
      ]"
    >
      <span class="h-px w-6" :class="dark ? 'bg-brand-400/50' : 'bg-brand-500/50'" />
      {{ eyebrow }}
    </span>
    <h2
      v-if="title"
      :class="[
        'text-3xl lg:text-4xl font-bold tracking-tight',
        dark ? 'text-white' : 'text-ink-900',
      ]"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      :class="[
        'mt-4 text-base lg:text-lg leading-relaxed',
        dark ? 'text-slate-300' : 'text-slate-600',
      ]"
    >
      {{ description }}
    </p>
    <slot />
  </Container>
</template>
