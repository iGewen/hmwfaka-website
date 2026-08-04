<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'
import { useCountdown } from '@/composables/useCountdown'

const STORAGE_KEY = 'hmwcard_promo_start_v2'
const DISMISS_KEY = 'hmwcard_promo_dismissed_v2'
const DURATION_DAYS = 7

const { remaining, formatted, start } = useCountdown()
const visible = ref(true)

function getStartTime(): number {
  if (typeof window === 'undefined') return Date.now()
  let t = window.localStorage.getItem(STORAGE_KEY)
  if (!t) {
    t = String(Date.now())
    window.localStorage.setItem(STORAGE_KEY, t)
  }
  return Number(t)
}

onMounted(() => {
  // 用户已主动关闭过，本次会话不再显示
  if (window.localStorage.getItem(DISMISS_KEY) === '1') {
    visible.value = false
    return
  }
  const startTs = getStartTime()
  const endTs = startTs + DURATION_DAYS * 24 * 60 * 60 * 1000
  start(endTs)
})

function dismiss() {
  visible.value = false
  try {
    window.localStorage.setItem(DISMISS_KEY, '1')
  } catch (e) {
    // localStorage 不可用时静默失败
  }
}

const isExpired = computed(() => remaining.value <= 0)
</script>

<template>
  <div
    v-if="visible && !isExpired"
    class="bg-ink-950 text-cream-50 border-b border-ink-700"
  >
    <div class="container-page">
      <div class="flex h-9 items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="inline-flex h-1 w-1 rounded-full bg-accent-500 pulse-dot" />
          <span class="font-mono text-accent-400 font-medium uppercase tracking-wider text-[10px]">Limited</span>
          <span class="text-cream-50/80 truncate">开业特惠，立省最高 ¥100</span>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <div class="hidden sm:flex items-center gap-1.5 font-mono text-accent-400 tnum">
            <AppIcon name="clock" :size="12" />
            <span class="text-[11px]">{{ formatted }}</span>
          </div>
          <RouterLink
            to="/pricing"
            class="hidden sm:inline-flex items-center gap-1 text-cream-50 hover:text-accent-400 font-medium transition-colors"
          >
            查看
            <AppIcon name="arrow-right" :size="11" />
          </RouterLink>
          <button
            class="inline-flex h-5 w-5 items-center justify-center rounded text-cream-50/40 hover:text-cream-50 hover:bg-cream-50/10"
            aria-label="关闭"
            @click="dismiss"
          >
            <AppIcon name="close" :size="12" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
