<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'
import PromoBanner from '@/components/layout/PromoBanner.vue'

const route = useRoute()
const mobileOpen = ref(false)
const scrolled = ref(false)

// 导航加大尺寸 + 每项配图标
const nav = [
  { label: '功能', to: '/#features', icon: 'layers' },
  { label: '定价', to: '/pricing', icon: 'tag' },
  { label: '文档', to: '/docs', icon: 'book' },
  { label: '博客', to: '/blog', icon: 'file-text' },
  { label: '关于', to: '/about', icon: 'users' },
]

function isActive(item: { to?: string }): boolean {
  if (!item.to) return false
  if (item.to === '/#features') return route.path === '/'
  return route.path.startsWith(item.to) && item.to !== '/#features'
}

// 路由切换时关闭移动菜单
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)

function onScroll() {
  scrolled.value = window.scrollY > 8
}
// 节流：用 rAF 避免每次 scroll 都触发响应式更新
let ticking = false
function onScrollThrottled() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    onScroll()
    ticking = false
  })
}
onMounted(() => {
  window.addEventListener('scroll', onScrollThrottled, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScrollThrottled))

function closeMobile() {
  mobileOpen.value = false
}
</script>

<template>
  <!-- 整个 header 容器（含 promo banner）一起 sticky -->
  <div class="sticky top-0 z-40">
    <!-- 促销横幅 -->
    <PromoBanner />

    <!-- 真正的 header -->
    <header
      :class="[
        'transition-all duration-300',
        scrolled
          ? 'bg-cream-50/85 backdrop-blur-xl border-b border-border'
          : 'bg-cream-50/0 border-b border-transparent',
      ]"
    >
      <div class="container-page">
        <div class="flex h-20 items-center justify-between py-4">
          <!-- Logo -->
          <RouterLink to="/" class="group flex items-center gap-3 shrink-0" @click="closeMobile">
            <img src="/logo.svg" alt="HmwCard Logo" class="h-11 w-11 rounded-xl transition-transform group-hover:scale-105" />
            <span class="flex flex-col leading-none">
              <span class="font-display text-xl font-semibold tracking-tight text-ink-900">
                何慕雯发卡系统
              </span>
              <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle mt-1">
                HMW AUTOCARD
              </span>
            </span>
          </RouterLink>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-1.5">
            <RouterLink
              v-for="item in nav"
              :key="item.label"
              :to="item.to"
              :class="[
                'inline-flex items-center gap-2 px-4 py-2.5 text-base font-medium rounded-lg transition-all',
                isActive(item)
                  ? 'text-ink-900 bg-cream-200/70'
                  : 'text-fg-muted hover:text-ink-900 hover:bg-cream-100/60',
              ]"
            >
              <AppIcon
                :name="item.icon"
                :size="18"
                :class="isActive(item) ? 'text-accent-600' : ''"
              />
              <span>{{ item.label }}</span>
            </RouterLink>

            <!-- 联系我们 -->
            <RouterLink
              to="/contact"
              :class="[
                'ml-2 inline-flex items-center gap-2 px-4 py-2.5 text-base font-medium rounded-lg transition-all',
                isActive({ to: '/contact' })
                  ? 'text-ink-900 bg-cream-200/70'
                  : 'text-fg-muted hover:text-ink-900 hover:bg-cream-100/60',
              ]"
            >
              <AppIcon name="mail" :size="18" />
              <span>联系</span>
            </RouterLink>
          </nav>

          <!-- Mobile toggle -->
          <button
            class="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-900 hover:bg-cream-200/60"
            :aria-label="mobileOpen ? '关闭菜单' : '打开菜单'"
            :aria-expanded="mobileOpen"
            aria-controls="mobile-nav"
            @click="mobileOpen = !mobileOpen"
          >
            <AppIcon :name="mobileOpen ? 'close' : 'menu'" :size="22" />
          </button>
        </div>

        <!-- Mobile Nav -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="mobileOpen" id="mobile-nav" class="md:hidden border-t border-border py-3">
            <nav class="flex flex-col gap-0.5">
              <RouterLink
                v-for="item in [...nav, { label: '联系', to: '/contact', icon: 'mail' }]"
                :key="item.label"
                :to="item.to"
                :class="[
                  'flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md',
                  isActive(item) ? 'text-ink-900 bg-cream-200' : 'text-fg-muted hover:bg-cream-100',
                ]"
                @click="closeMobile"
              >
                <AppIcon
                  :name="item.icon"
                  :size="18"
                  :class="isActive(item) ? 'text-accent-600' : 'text-fg-subtle'"
                />
                <span>{{ item.label }}</span>
                <AppIcon name="chevron-right" :size="14" class="ml-auto text-fg-subtle" />
              </RouterLink>
            </nav>
          </div>
        </transition>
      </div>
    </header>
  </div>
</template>
