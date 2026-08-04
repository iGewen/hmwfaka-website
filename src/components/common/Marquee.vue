<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  duration?: number
  pauseOnHover?: boolean
  gap?: string
}
const props = withDefaults(defineProps<Props>(), {
  duration: 30,
  pauseOnHover: true,
  gap: '3rem',
})

const paused = ref(false)
function onEnter() {
  if (props.pauseOnHover) paused.value = true
}
function onLeave() {
  if (props.pauseOnHover) paused.value = false
}
</script>

<template>
  <div
    class="relative overflow-hidden"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <!--
      关键：渲染两份内容副本做无缝循环
      Vue 会自动给两份 slot 内的 v-for 项加不同 ref，
      但为避免 key 冲突，需要让 slot 用户给 key 加唯一前缀。
      见 PaymentMarquee 使用 :key="`a-${i}`" 和 `b-${i}` 的写法
    -->
    <div
      class="marquee-track flex w-max items-center"
      :style="{
        gap,
        animationDuration: `${duration}s`,
        animationPlayState: paused ? 'paused' : 'running',
      }"
    >
      <div class="flex items-center" :style="{ gap }">
        <slot name="a" />
      </div>
      <div class="flex items-center" :style="{ gap }" aria-hidden="true">
        <slot name="b" />
      </div>
    </div>
  </div>
</template>

<style>
@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
.marquee-track {
  animation-name: marquee-scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}
</style>
