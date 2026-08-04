<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  value: number
  decimals?: number
  separator?: boolean
  prefix?: string
  suffix?: string
  duration?: number
}
const props = withDefaults(defineProps<Props>(), {
  decimals: 0,
  separator: true,
  prefix: '',
  suffix: '',
  duration: 1500,
})

// SSG 时直接显示目标值，避免 hydration 后看到 0 闪烁
const display = ref(props.value)
const el = ref<HTMLElement | null>(null)
let started = false
let observer: IntersectionObserver | null = null

function animate() {
  if (started) return
  started = true

  const start = 0
  const end = props.value
  const startTime = performance.now()

  function tick(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    // ease-out-cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    display.value = start + (end - start) * eased
    if (progress < 1) requestAnimationFrame(tick)
    else display.value = end
  }
  requestAnimationFrame(tick)
}

function format(n: number): string {
  const fixed = n.toFixed(props.decimals)
  if (!props.separator) return fixed
  const [intPart, decPart] = fixed.split('.')
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decPart ? `${formatted}.${decPart}` : formatted
}

// 当 props.value 变化时，重置 started 并重新触发动画
watch(
  () => props.value,
  (newVal) => {
    started = false
    display.value = 0  // 先归零再动画
    if (el.value && observer) {
      // 已挂载，直接 animate
      animate()
    }
  },
)

onMounted(() => {
  if (!el.value) return
  // 滚动到视口时启动
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // 重置 started = false，从 0 开始动画
          started = false
          display.value = 0
          animate()
          observer?.disconnect()
          break
        }
      }
    },
    { threshold: 0.1, rootMargin: '100px' },
  )
  observer.observe(el.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <span ref="el" class="tnum">
    {{ prefix }}{{ format(display) }}{{ suffix }}
  </span>
</template>
