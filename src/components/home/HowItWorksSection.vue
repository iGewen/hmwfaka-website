<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Container from '@/components/common/Container.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import SectionLabel from '@/components/common/SectionLabel.vue'

const steps = [
  {
    num: '01',
    icon: 'server',
    title: '部署系统',
    description: 'Docker 一键部署，配置域名和支付接口，10 分钟内完成上线。',
    code: [
      { prompt: '$', cmd: 'git clone hmwcard', out: '✓ Cloned to /opt/hmwcard' },
      { prompt: '$', cmd: 'cp .env.example .env && vim .env', out: '' },
      { prompt: '$', cmd: 'docker compose up -d', out: '✓ All services started · listening :8080' },
    ],
  },
  {
    num: '02',
    icon: 'package',
    title: '添加商品',
    description: '导入卡密库存，设置价格和描述，支持批量导入。',
    code: [
      { prompt: '>', action: '商品管理 → 新增商品', out: '' },
      { prompt: '>', action: '名称: Steam 充值卡 ¥100', out: '' },
      { prompt: '>', action: '粘贴卡密 (每行一个) · 已识别 24 张', out: '✓ Saved · inventory=24' },
    ],
  },
  {
    num: '03',
    icon: 'wallet',
    title: '自动收款',
    description: '用户下单付款，系统自动发卡，资金直达您的账户。',
    code: [
      { prompt: '∞', action: '用户付款 ¥99 · wechat', out: '' },
      { prompt: '∞', action: '订单 #20831 已创建', out: '' },
      { prompt: '∞', action: '卡密 7H2K-9X4M 已发送', out: '✓ Delivered in 50ms' },
    ],
  },
]

// 当前后台步骤
const activeStep = ref(0)
const sectionRef = ref<HTMLElement | null>(null)

function onScroll() {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  const total = rect.height - window.innerHeight
  const scrolled = Math.max(0, -rect.top)
  const progress = Math.min(1, scrolled / total)
  activeStep.value = Math.min(steps.length - 1, Math.floor(progress * steps.length))
}

// rAF 节流
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
</script>

<template>
  <section ref="sectionRef" class="relative bg-cream-100/40 py-20 lg:py-28">
    <Container>
      <SectionLabel
        label="/ how it works"
        title="三步开始赚钱"
        description="从部署到收款，整套流程不到 10 分钟。简单到一个人也能轻松运营。"
      />

      <div class="mt-12 lg:mt-16 grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <!-- 左侧 sticky 步骤导航（占7列，更多视觉权重） -->
        <div class="lg:col-span-7">
          <div class="lg:sticky lg:top-24 space-y-3">
            <button
              v-for="(step, i) in steps"
              :key="step.num"
              class="group w-full text-left rounded-2xl border p-5 transition-all duration-300"
              :class="[
                activeStep === i
                  ? 'border-ink-900 bg-cream-50 shadow-lift'
                  : 'border-border bg-cream-50/40 hover:bg-cream-50',
              ]"
            >
              <div class="flex items-start gap-4">
                <div class="flex flex-col items-center gap-2 shrink-0">
                  <span
                    class="font-display text-3xl font-bold tabular-nums transition-colors leading-none"
                    :class="activeStep === i ? 'text-accent-600' : 'text-fg-subtle'"
                  >
                    {{ step.num }}
                  </span>
                  <span
                    class="inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                    :class="activeStep === i ? 'bg-ink-900 text-cream-50' : 'bg-cream-100 text-fg-subtle'"
                  >
                    <AppIcon :name="step.icon" :size="20" />
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-display text-lg font-semibold text-ink-900">{{ step.title }}</h3>
                  <p class="mt-1.5 text-sm text-fg-muted leading-relaxed">{{ step.description }}</p>
                </div>
              </div>
              <!-- 进度条 -->
              <div class="mt-4 h-px bg-border overflow-hidden">
                <div
                  class="h-full bg-ink-900 transition-all duration-500"
                  :style="{ width: activeStep === i ? '100%' : activeStep > i ? '100%' : '0%' }"
                />
              </div>
            </button>
          </div>
        </div>

        <!-- 右侧：代码演示（占5列，更紧凑） -->
        <div class="lg:col-span-5">
          <div class="lg:sticky lg:top-24 rounded-2xl border border-ink-700 bg-ink-900 overflow-hidden shadow-float">
            <!-- Terminal header -->
            <div class="flex items-center justify-between px-4 py-2.5 border-b border-ink-700">
              <div class="flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <span class="h-2.5 w-2.5 rounded-full bg-accent-400/60" />
                <span class="h-2.5 w-2.5 rounded-full bg-live-400/60" />
              </div>
              <span class="font-mono text-[10px] text-cream-50/40">~/hmwcard · {{ activeStep + 1 }}/3</span>
            </div>
            <!-- Terminal body -->
            <div class="p-5 font-mono text-[12px] lg:text-[13px] space-y-2 min-h-[260px]">
              <div
                v-for="(line, i) in steps[activeStep].code"
                :key="`${activeStep}-${i}`"
                class="animate-fade-in-up"
                :style="{ animationDelay: `${i * 100}ms` }"
              >
                <div class="flex items-start gap-2">
                  <span class="text-accent-400 shrink-0">{{ line.prompt }}</span>
                  <span v-if="line.cmd" class="text-cream-50/90">{{ line.cmd }}</span>
                  <span v-else-if="line.action" class="text-cream-50/90">{{ line.action }}</span>
                </div>
                <div v-if="line.out" class="mt-1 text-live-400 pl-5">
                  {{ line.out }}
                </div>
              </div>

              <!-- 光标 -->
              <div class="flex items-center gap-2 pt-2">
                <span class="text-accent-400">$</span>
                <span class="inline-block h-4 w-2 bg-cream-50/80 animate-pulse-soft"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
