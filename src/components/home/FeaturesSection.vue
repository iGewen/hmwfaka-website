<script setup lang="ts">
import Container from '@/components/common/Container.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import SectionLabel from '@/components/common/SectionLabel.vue'
import StatusDot from '@/components/common/StatusDot.vue'

// Bento Grid 设计：
// 行1: [大格: 自动发卡 跨2列2行] [中格: 多渠道] [中格: 即时通知]
// 行2: [大格继续]               [中格: 安全] [中格: 一键部署]
// 行3: [全宽格: 全端适配]
//
// 使用 grid 12 列做精细布局
</script>

<template>
  <section id="features" class="relative py-20 lg:py-28 bg-cream-50 scroll-mt-24">
    <Container>
      <SectionLabel
        label="/ features"
        title="为虚拟商品生意<br />设计的每一个细节"
        description="从发卡到收款、从部署到通知，覆盖全链路。每个功能都经过实战检验，稳定可靠。"
      />

      <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        <!-- 大格：自动发卡（占 lg 2x2） -->
        <article class="lift-card group relative md:col-span-2 lg:row-span-2 rounded-2xl border border-border bg-cream-50 p-7 lg:p-8 hover:border-ink-900 hover:shadow-float overflow-hidden">
          <!-- 装饰渐变 -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-accent-100/40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div class="relative">
            <div class="flex items-center gap-2 mb-5">
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-cream-50">
                <AppIcon name="auto-card" :size="20" :stroke-width="1.8" />
              </span>
              <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">01 · core</span>
            </div>

            <h3 class="font-display text-2xl lg:text-3xl font-semibold tracking-tight text-ink-900 leading-tight">
              自动发卡
            </h3>
            <p class="mt-2 text-sm lg:text-base text-fg-muted leading-relaxed max-w-md">
              用户付款后系统自动发送卡密，7×24 小时无人值守。订单实时处理，无需人工干预。
            </p>

            <!-- 演示：发卡流程 -->
            <div class="mt-7 rounded-xl border border-border bg-ink-900 p-4 font-mono text-[12px] text-cream-50/90 overflow-x-auto">
              <div class="flex items-center gap-2 text-live-400">
                <StatusDot color="live" :pulse="true" size="sm" />
                <span class="text-cream-50/60">payment.received</span>
              </div>
              <div class="mt-2 text-cream-50/80">
                → <span class="text-accent-400">order #20831</span> · ¥99 · wechat
              </div>
              <div class="mt-1 text-cream-50/80">
                → <span class="text-accent-400">card issued</span> · 7H2K-9X4M-NP3Q
              </div>
              <div class="mt-1 text-cream-50/80">
                → <span class="text-live-400">delivered</span> · 50ms
              </div>
            </div>
          </div>
        </article>

        <!-- 多渠道支付 -->
        <article class="lift-card group rounded-2xl border border-border bg-cream-50 p-6 hover:border-ink-900 hover:shadow-lift">
          <div class="flex items-center gap-2 mb-4">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
              <AppIcon name="payment" :size="18" />
            </span>
            <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">02</span>
          </div>
          <h3 class="font-display text-lg font-semibold text-ink-900">多渠道支付</h3>
          <p class="mt-1.5 text-sm text-fg-muted leading-relaxed">
            微信、支付宝、PayPal、Stripe 全支持，覆盖国内外用户。
          </p>
          <!-- 支付通道列表 -->
          <div class="mt-4 flex flex-wrap gap-1.5">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cream-100 text-[10px] font-mono text-fg-muted">
              <AppIcon name="brand-wechat" :size="11" /> 微信
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cream-100 text-[10px] font-mono text-fg-muted">
              <AppIcon name="brand-alipay" :size="11" /> 支付宝
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cream-100 text-[10px] font-mono text-fg-muted">
              <AppIcon name="brand-paypal" :size="11" /> PayPal
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cream-100 text-[10px] font-mono text-fg-muted">
              <AppIcon name="brand-stripe" :size="11" /> Stripe
            </span>
          </div>
        </article>

        <!-- 即时通知 -->
        <article class="lift-card group rounded-2xl border border-border bg-cream-50 p-6 hover:border-ink-900 hover:shadow-lift">
          <div class="flex items-center gap-2 mb-4">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
              <AppIcon name="bell" :size="18" />
            </span>
            <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">03</span>
          </div>
          <h3 class="font-display text-lg font-semibold text-ink-900">即时通知</h3>
          <p class="mt-1.5 text-sm text-fg-muted leading-relaxed">
            新订单、库存预警、异常告警多渠道实时推送，不错过任何交易。
          </p>
          <!-- 通知样式 -->
          <div class="mt-4 space-y-1.5">
            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-cream-100 text-[11px]">
              <StatusDot color="live" :pulse="false" size="sm" />
              <span class="font-mono text-fg-muted">新订单 ¥99</span>
              <span class="ml-auto font-mono text-fg-subtle">2s</span>
            </div>
            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-accent-50 text-[11px]">
              <StatusDot color="accent" :pulse="false" size="sm" />
              <span class="font-mono text-accent-700">库存预警</span>
              <span class="ml-auto font-mono text-accent-600/70">1m</span>
            </div>
          </div>
        </article>

        <!-- 安全可靠 -->
        <article class="lift-card group rounded-2xl border border-border bg-cream-50 p-6 hover:border-ink-900 hover:shadow-lift">
          <div class="flex items-center gap-2 mb-4">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
              <AppIcon name="shield" :size="18" />
            </span>
            <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">04</span>
          </div>
          <h3 class="font-display text-lg font-semibold text-ink-900">安全可靠</h3>
          <p class="mt-1.5 text-sm text-fg-muted leading-relaxed">
            数据加密存储、接口签名验证、防刷机制，多重防护每一笔交易。
          </p>
          <div class="mt-4 grid grid-cols-3 gap-2 text-center">
            <div class="rounded-md bg-cream-100 py-1.5">
              <div class="font-mono text-[10px] text-fg-subtle">AES</div>
              <div class="font-mono text-[11px] font-semibold text-ink-900">256</div>
            </div>
            <div class="rounded-md bg-cream-100 py-1.5">
              <div class="font-mono text-[10px] text-fg-subtle">Limit</div>
              <div class="font-mono text-[11px] font-semibold text-ink-900">30/min</div>
            </div>
            <div class="rounded-md bg-cream-100 py-1.5">
              <div class="font-mono text-[10px] text-fg-subtle">Sign</div>
              <div class="font-mono text-[11px] font-semibold text-ink-900">HMAC</div>
            </div>
          </div>
        </article>

        <!-- 一键部署 -->
        <article class="lift-card group rounded-2xl border border-border bg-cream-50 p-6 hover:border-ink-900 hover:shadow-lift">
          <div class="flex items-center gap-2 mb-4">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
              <AppIcon name="rocket" :size="18" />
            </span>
            <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">05</span>
          </div>
          <h3 class="font-display text-lg font-semibold text-ink-900">一键部署</h3>
          <p class="mt-1.5 text-sm text-fg-muted leading-relaxed">
            Docker 容器化，一条命令启动。宝塔、云服务器、VPS 都能跑。
          </p>
          <div class="mt-4 rounded-md bg-ink-900 px-3 py-2 font-mono text-[11px] text-cream-50/90 overflow-x-auto">
            <span class="text-live-400">$</span>
            <span class="text-cream-50/60"> docker compose</span>
            <span class="text-accent-400"> up -d</span>
          </div>
        </article>

        <!-- 全端适配：横跨整行 -->
        <article class="lift-card group md:col-span-2 lg:col-span-3 rounded-2xl border border-border bg-cream-50 p-7 lg:p-8 hover:border-ink-900 hover:shadow-lift">
          <div class="grid lg:grid-cols-3 gap-6 items-center">
            <div class="lg:col-span-2">
              <div class="flex items-center gap-2 mb-3">
                <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                  <AppIcon name="devices" :size="18" />
                </span>
                <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">06</span>
              </div>
              <h3 class="font-display text-xl lg:text-2xl font-semibold text-ink-900">全端适配</h3>
              <p class="mt-2 text-sm text-fg-muted leading-relaxed max-w-xl">
                响应式设计完美适配 PC、平板、手机。支持微信小程序、H5 多端访问，随时随地管理店铺。
              </p>
            </div>
            <!-- 设备示意 -->
            <div class="flex items-end justify-center gap-3">
              <!-- PC -->
              <div class="flex flex-col items-center gap-1">
                <div class="w-16 h-10 rounded-md border-2 border-border-strong bg-cream-100"></div>
                <div class="w-10 h-1 rounded-full bg-border-strong"></div>
                <span class="font-mono text-[9px] text-fg-subtle">PC</span>
              </div>
              <!-- Tablet -->
              <div class="flex flex-col items-center gap-1">
                <div class="w-9 h-12 rounded-md border-2 border-border-strong bg-cream-100"></div>
                <span class="font-mono text-[9px] text-fg-subtle mt-1">PAD</span>
              </div>
              <!-- Phone -->
              <div class="flex flex-col items-center gap-1">
                <div class="w-5 h-9 rounded border-2 border-border-strong bg-cream-100"></div>
                <span class="font-mono text-[9px] text-fg-subtle mt-1">H5</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </Container>
  </section>
</template>
