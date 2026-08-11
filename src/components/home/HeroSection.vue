<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Container from '@/components/common/Container.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import BrandIcon from '@/components/common/BrandIcon.vue'
import StatusDot from '@/components/common/StatusDot.vue'

// —— 模拟实时订单流 ——
interface Order {
  id: string
  product: string
  amount: number
  channel: 'wechat' | 'alipay' | 'paypal'
  ago: string
}

const orders = ref<Order[]>([
  { id: '1', product: 'Steam 充值卡 ¥100', amount: 100, channel: 'wechat', ago: '刚刚' },
  { id: '2', product: 'ChatGPT Plus 月卡', amount: 159, channel: 'alipay', ago: '12秒前' },
  { id: '3', product: 'Netflix 会员季卡', amount: 89, channel: 'wechat', ago: '34秒前' },
  { id: '4', product: 'Steam Key · Cyberpunk 2077', amount: 199, channel: 'paypal', ago: '1分钟前' },
  { id: '5', product: 'Spotify Premium 年卡', amount: 268, channel: 'alipay', ago: '2分钟前' },
])

const channelLabel: Record<Order['channel'], string> = {
  wechat: '微信支付',
  alipay: '支付宝',
  paypal: 'PayPal',
}

let timer: ReturnType<typeof setInterval> | null = null
const productPool = [
  { product: 'Steam 充值卡 ¥100', amount: 100 },
  { product: 'ChatGPT Plus 月卡', amount: 159 },
  { product: 'Netflix 会员季卡', amount: 89 },
  { product: 'Steam Key · Elden Ring', amount: 299 },
  { product: 'Spotify Premium 年卡', amount: 268 },
  { product: 'Adobe Creative Cloud 月卡', amount: 99 },
  { product: 'XGP 游戏年卡', amount: 298 },
  { product: 'Notion Plus 月卡', amount: 12 },
  { product: 'Discord Nitro 月卡', amount: 38 },
  { product: 'YouTube Premium 季卡', amount: 65 },
]
const channels: Order['channel'][] = ['wechat', 'alipay', 'paypal']

onMounted(() => {
  let counter = 100

  function addOrder() {
    const p = productPool[Math.floor(Math.random() * productPool.length)]
    const c = channels[Math.floor(Math.random() * channels.length)]
    const newOrder: Order = {
      id: String(counter++),
      product: p.product,
      amount: p.amount,
      channel: c,
      ago: '刚刚',
    }
    // 更新现有订单的 ago
    orders.value = orders.value.map((o) => {
      if (o.ago === '刚刚') return { ...o, ago: '几秒前' }
      return o
    })
    orders.value.unshift(newOrder)
    if (orders.value.length > 5) orders.value.pop()
  }

  // 标签页隐藏时不更新，节省性能
  timer = setInterval(() => {
    if (document.hidden) return
    addOrder()
  }, 3500)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 过渡钩子：进入时 absolute 防撑高，动画结束后恢复 relative
function onEnter(el: Element, done: () => void) {
  const elr = el as HTMLElement
  elr.style.position = 'absolute'
  elr.style.width = 'calc(100% - 16px)'
  elr.style.visibility = 'hidden'
  // 等下一帧再开始动画，让初始 absolute 生效
  requestAnimationFrame(() => {
    elr.style.visibility = ''
    elr.style.position = ''
    elr.style.width = ''
    done()
  })
}

function onAfterEnter(el: Element) {
  const elr = el as HTMLElement
  elr.style.position = ''
  elr.style.width = ''
}

function onLeave(el: Element, done: () => void) {
  const elr = el as HTMLElement
  elr.style.position = 'absolute'
  elr.style.width = 'calc(100% - 16px)'
  elr.addEventListener('transitionend', done, { once: true })
}

function onAfterLeave(el: Element) {
  const elr = el as HTMLElement
  elr.style.position = ''
  elr.style.width = ''
}
</script>

<template>
  <section class="relative overflow-hidden bg-cream-50">
    <!-- 装饰：渐变光 + 网格 -->
    <div class="absolute inset-0 bg-grid-fade opacity-60" />
    <div class="absolute top-0 right-0 w-[600px] h-[400px] bg-accent-200/30 rounded-full blur-3xl pointer-events-none" />
    <!-- 左下角装饰几何形 -->
    <div class="absolute bottom-20 left-0 w-32 h-32 border border-accent-200/40 rounded-full pointer-events-none hidden lg:block" />
    <div class="absolute bottom-32 left-16 w-2 h-2 rounded-full bg-accent-400/60 pointer-events-none hidden lg:block" />

    <Container class="relative pt-16 pb-20 lg:pt-24 lg:pb-32">
      <!-- 顶部 eyebrow -->
      <div class="flex items-center gap-3 mb-8 flex-wrap">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-strong bg-cream-50 text-xs font-mono text-fg-muted">
          <span class="inline-flex h-1 w-1 rounded-full bg-live-500 pulse-dot" />
          v2.0 已发布
        </span>
        <span class="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-fg-subtle">
          <AppIcon name="git-branch" :size="12" />
          <span>2,000+ 商户在线</span>
        </span>
        <span class="hidden md:inline-flex items-center gap-1 text-xs font-mono text-fg-subtle">
          <AppIcon name="trending-up" :size="12" class="text-live-600" />
          <span>今日成交 ¥48,729</span>
        </span>
      </div>

      <!-- 不对称布局：左 7 列文案 / 右 5 列 mock dashboard -->
      <div class="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <!-- 左：文案 -->
        <div class="lg:col-span-7 max-w-2xl">
          <h1 class="font-display font-bold text-ink-900 tracking-tight leading-[0.95] text-[clamp(2.5rem,7vw,5rem)]">
            自动发卡<br />
            <span class="inline-flex items-baseline gap-3">
              <span>为</span>
              <span class="relative">
                <span class="text-gradient-amber">虚拟商品</span>
                <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path d="M 2 4 Q 50 0, 100 4 T 198 4" stroke="#D97706" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.4" />
                </svg>
              </span>
              <span>而生</span>
            </span>
          </h1>

          <p class="mt-6 text-base lg:text-xl text-fg-muted leading-relaxed max-w-xl">
            HmwCard 是一套开箱即用的自动发卡系统。微信、支付宝、PayPal 多渠道收款，
            卡密全自动交付，Docker 一键部署。让您专注于业务，不再被发货困扰。
          </p>

          <div class="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <AppButton to="/pricing" variant="primary" size="lg" icon-right="arrow-right">
              立即购买 ¥89 起
            </AppButton>
            <AppButton href="https://demo.ifaka.cc" variant="ghost" size="lg" icon="external-link">
              在线演示
            </AppButton>
          </div>

          <!-- 信任标识 -->
          <div class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-fg-subtle font-mono">
            <span class="inline-flex items-center gap-1.5">
              <AppIcon name="check" :size="13" class="text-live-600" :stroke-width="2.5" />
              一次购买终身使用
            </span>
            <span class="inline-flex items-center gap-1.5">
              <AppIcon name="check" :size="13" class="text-live-600" :stroke-width="2.5" />
              成品系统交付
            </span>
            <span class="inline-flex items-center gap-1.5">
              <AppIcon name="check" :size="13" class="text-live-600" :stroke-width="2.5" />
              Docker 一键部署
            </span>
          </div>
        </div>

        <!-- 右：实时订单流 mock -->
        <div class="lg:col-span-5 lg:sticky lg:top-24">
          <div class="relative">
            <!-- 装饰光晕 -->
            <div class="absolute -inset-4 bg-gradient-to-br from-accent-200/20 to-accent-100/10 rounded-3xl blur-2xl" />

            <div class="relative rounded-2xl border border-border-strong bg-cream-50 shadow-float overflow-hidden">
              <!-- Console header -->
              <div class="flex items-center justify-between px-4 py-2.5 border-b border-border bg-cream-100/50">
                <div class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-red-400/70" />
                  <span class="h-2 w-2 rounded-full bg-accent-400/70" />
                  <span class="h-2 w-2 rounded-full bg-live-400/70" />
                  <span class="ml-2 font-mono text-[11px] text-fg-subtle">hmwcard · live-orders</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <StatusDot color="live" :pulse="true" size="sm" />
                  <span class="font-mono text-[10px] text-fg-muted uppercase tracking-wider">Live</span>
                </div>
              </div>

              <!-- 订单列表 -->
              <div class="p-2 space-y-1">
                <transition-group
                  @enter="onEnter"
                  @after-enter="onAfterEnter"
                  @leave="onLeave"
                  @after-leave="onAfterLeave"
                  enter-active-class="transition duration-500 ease-out"
                  enter-from-class="opacity-0 -translate-y-3 scale-[0.96]"
                  enter-to-class="opacity-100 translate-y-0 scale-100"
                  leave-active-class="transition duration-300 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                  move-class="transition duration-300 ease-out"
                >
                  <div
                    v-for="order in orders"
                    :key="order.id"
                    class="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-cream-100/60 transition-colors"
                  >
                    <!-- 通道 icon -->
                    <div class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-border">
                      <BrandIcon
                        :name="order.channel === 'wechat' ? 'wechat' : order.channel === 'alipay' ? 'alipay' : 'paypal'"
                        :size="24"
                      />
                    </div>

                    <!-- 商品 + 金额 -->
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-ink-900 truncate">{{ order.product }}</div>
                      <div class="flex items-center gap-2 mt-0.5">
                        <span class="font-mono text-[10px] text-fg-subtle uppercase tracking-wider">{{ channelLabel[order.channel] }}</span>
                        <span class="text-fg-subtle/50">·</span>
                        <span class="font-mono text-[10px] text-fg-subtle">{{ order.ago }}</span>
                      </div>
                    </div>

                    <!-- 金额 -->
                    <div class="font-mono text-sm font-semibold text-ink-900 tabular-nums">
                      +¥{{ order.amount }}
                    </div>
                  </div>
                </transition-group>
              </div>

              <!-- Console footer -->
              <div class="px-4 py-2 border-t border-border bg-cream-100/40">
                <div class="flex items-center justify-between font-mono text-[10px] text-fg-subtle">
                  <span>今日成交</span>
                  <span class="text-live-600 font-medium">¥48,729 · 312 笔</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
