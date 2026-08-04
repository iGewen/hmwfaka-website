<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from './AppIcon.vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  icon?: string
  iconRight?: string
  block?: boolean
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  loading: false,
  disabled: false,
})

const classes = computed(() => {
  const base =
    'group inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap'

  const sizes: Record<string, string> = {
    sm: 'text-[13px] px-3 py-1.5 h-8',
    md: 'text-sm px-4 py-2 h-10',
    lg: 'text-[15px] px-5 py-2.5 h-12',
  }

  const variants: Record<string, string> = {
    primary:
      'bg-ink-900 text-cream-50 hover:bg-ink-800 hover:shadow-[0_8px_20px_-8px_rgba(10,10,11,0.5)] active:scale-[0.98] focus-visible:ring-ink-700 shadow-soft',
    secondary:
      'bg-accent-500 text-ink-950 hover:bg-accent-400 hover:shadow-[0_8px_24px_-8px_rgba(245,158,11,0.6)] active:scale-[0.98] focus-visible:ring-accent-500 shadow-soft font-semibold',
    outline:
      'border border-border-strong text-fg hover:border-ink-900 hover:bg-cream-100 focus-visible:ring-ink-700 bg-transparent',
    ghost:
      'text-fg hover:bg-cream-200/60 focus-visible:ring-ink-400',
    dark: 'bg-ink-900 text-cream-50 hover:bg-ink-800 hover:shadow-[0_8px_20px_-8px_rgba(10,10,11,0.5)] focus-visible:ring-ink-700 shadow-soft',
  }

  return [base, sizes[props.size], variants[props.variant], props.block ? 'w-full' : ''].join(' ')
})
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <AppIcon v-if="icon" :name="icon" :size="size === 'lg' ? 18 : 16" />
    <span><slot /></span>
    <AppIcon
      v-if="iconRight"
      :name="iconRight"
      :size="size === 'lg' ? 18 : 16"
      class="transition-transform group-hover:translate-x-0.5"
    />
  </RouterLink>
  <a v-else-if="href" :href="href" :class="classes">
    <AppIcon v-if="icon" :name="icon" :size="size === 'lg' ? 18 : 16" />
    <span><slot /></span>
    <AppIcon
      v-if="iconRight"
      :name="iconRight"
      :size="size === 'lg' ? 18 : 16"
      class="transition-transform group-hover:translate-x-0.5"
    />
  </a>
  <button v-else :class="classes" :disabled="disabled || loading" type="button">
    <AppIcon v-if="loading" name="activity" :size="size === 'lg' ? 18 : 16" class="animate-spin" />
    <AppIcon v-else-if="icon" :name="icon" :size="size === 'lg' ? 18 : 16" />
    <span><slot /></span>
    <AppIcon
      v-if="iconRight"
      :name="iconRight"
      :size="size === 'lg' ? 18 : 16"
      class="transition-transform group-hover:translate-x-0.5"
    />
  </button>
</template>
