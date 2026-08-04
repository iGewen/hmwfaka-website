import { ref, computed, onUnmounted } from 'vue'

/**
 * 倒计时 composable
 * @returns remaining(ms), formatted(DD天 HH:MM:SS)
 */
export function useCountdown() {
  const remaining = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  function start(endTimestamp: number) {
    stop()
    const update = () => {
      remaining.value = Math.max(0, endTimestamp - Date.now())
      if (remaining.value <= 0) stop()
    }
    update()
    timer = setInterval(update, 1000)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const formatted = computed(() => {
    const s = Math.floor(remaining.value / 1000)
    const days = Math.floor(s / 86400)
    const hours = Math.floor((s % 86400) / 3600)
    const minutes = Math.floor((s % 3600) / 60)
    const seconds = s % 60
    const pad = (n: number) => String(n).padStart(2, '0')
    if (days > 0) {
      return `${days}天 ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  })

  onUnmounted(stop)

  return { remaining, formatted, start, stop }
}
