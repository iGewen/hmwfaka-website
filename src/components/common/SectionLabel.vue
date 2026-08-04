<script setup lang="ts">
interface Props {
  // eyebrow 文字
  label?: string
  // 大标题（可包含 <br>）
  title?: string
  // 描述
  description?: string
  align?: 'left' | 'center'
  // dark mode
  dark?: boolean
  // 是否带顶部装饰线
  withLine?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  align: 'left',
  dark: false,
  withLine: false,
})
</script>

<template>
  <div :class="['flex flex-col gap-4', props.align === 'center' ? 'items-center text-center' : 'items-start text-left']">
    <div v-if="withLine" :class="['h-px w-12', dark ? 'bg-cream-50/30' : 'bg-fg/20']" />

    <div v-if="label || $slots.label" :class="['inline-flex items-center gap-2', dark ? 'text-cream-50/70' : 'text-fg-muted']">
      <slot name="label">
        <span class="font-mono text-[11px] uppercase tracking-[0.18em] font-medium">{{ label }}</span>
      </slot>
    </div>

    <h2
      v-if="title || $slots.title"
      :class="[
        'font-display font-semibold tracking-tight text-balance leading-[1.05]',
        'text-3xl md:text-4xl lg:text-5xl',
        dark ? 'text-cream-50' : 'text-ink-900',
      ]"
    >
      <slot name="title">{{ title }}</slot>
    </h2>

    <p
      v-if="description || $slots.description"
      :class="[
        'text-base md:text-lg leading-relaxed text-pretty',
        'max-w-2xl',
        dark ? 'text-cream-50/70' : 'text-fg-muted',
      ]"
    >
      <slot name="description">{{ description }}</slot>
    </p>

    <slot />
  </div>
</template>
