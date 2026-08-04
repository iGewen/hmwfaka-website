<script setup lang="ts">
import Container from '@/components/common/Container.vue'
import SectionLabel from '@/components/common/SectionLabel.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import { useSeo } from '@/composables/useSeo'
import { siteConfig } from '@/data/site'
import { values, milestones } from '@/data/company'

useSeo({
  title: `关于我们 - ${siteConfig.name}`,
  description:
    'HmwCard 是一支专注于虚拟商品自动交付解决方案的技术团队。从 2024 年创立至今，为超过 2000+ 商户提供自动发卡服务。',
  keywords: ['关于 HmwCard', '发卡系统团队', '虚拟商品解决方案'],
  path: '/about',
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: `关于 ${siteConfig.name}`,
      url: `${siteConfig.url}/about`,
    },
  ],
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-cream-50 pt-16 pb-12 lg:pt-24">
      <div class="absolute inset-0 bg-grid-fade opacity-50" />
      <Container class="relative">
        <SectionLabel
          label="/ about"
          title="专注虚拟商品自动交付"
          description="让每一笔交易都简单可靠。"
        />
      </Container>
    </section>

    <!-- 我们是谁 -->
    <section class="py-16 lg:py-20 bg-cream-50">
      <Container>
        <div class="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div class="lg:col-span-7">
            <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">/ who we are</span>
            <h2 class="mt-3 font-display text-3xl lg:text-4xl font-semibold tracking-tight text-ink-900">
              我们是谁
            </h2>
            <div class="mt-6 space-y-4 text-fg-muted leading-relaxed">
              <p>
                HmwCard（何慕雯发卡系统）是一支专注于虚拟商品自动交付解决方案的技术团队。我们深知虚拟商品卖家在手动发货、库存管理、收款对接等环节的痛点。
              </p>
              <p>
                从 2024 年创立至今，我们始终坚持"简单、稳定、安全"的产品理念，为超过 2000+ 商户提供自动发卡服务。无论是个人卖家还是企业客户，HmwCard 都能提供匹配的解决方案。
              </p>
              <p>
                我们的系统支持微信支付、支付宝、PayPal、Stripe 等主流支付方式，覆盖国内外主流市场。Docker 容器化部署让系统上线变得前所未有的简单。
              </p>
            </div>
          </div>

          <div class="lg:col-span-5 grid grid-cols-2 gap-3">
            <div class="rounded-2xl border border-border bg-cream-50 p-6">
              <div class="font-display text-3xl font-bold text-gradient-amber tabular-nums">2,000+</div>
              <div class="mt-1 font-mono text-[11px] text-fg-subtle uppercase tracking-wider">活跃商户</div>
            </div>
            <div class="rounded-2xl border border-border bg-cream-50 p-6">
              <div class="font-display text-3xl font-bold text-ink-900 tabular-nums">99.9%</div>
              <div class="mt-1 font-mono text-[11px] text-fg-subtle uppercase tracking-wider">系统可用率</div>
            </div>
            <div class="rounded-2xl border border-border bg-cream-50 p-6">
              <div class="font-display text-3xl font-bold text-ink-900 tabular-nums">4+</div>
              <div class="mt-1 font-mono text-[11px] text-fg-subtle uppercase tracking-wider">支付渠道</div>
            </div>
            <div class="rounded-2xl border border-border bg-cream-50 p-6">
              <div class="font-display text-3xl font-bold text-ink-900 tabular-nums">10<span class="text-base font-normal text-fg-muted">min</span></div>
              <div class="mt-1 font-mono text-[11px] text-fg-subtle uppercase tracking-wider">平均部署</div>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- 价值观 -->
    <section class="py-16 lg:py-20 bg-cream-100/40 border-y border-border">
      <Container>
        <SectionLabel
          label="/ values"
          title="我们的价值观"
          description="三个原则贯穿产品的每一个细节。"
        />
        <div class="grid md:grid-cols-3 gap-4 mt-10">
          <article
            v-for="value in values"
            :key="value.title"
            class="lift-card rounded-2xl border border-border bg-cream-50 p-7 hover:border-ink-900 hover:shadow-lift"
          >
            <div class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ink-900 text-cream-50">
              <AppIcon :name="value.icon" :size="20" />
            </div>
            <h3 class="mt-4 font-display text-lg font-semibold text-ink-900">{{ value.title }}</h3>
            <p class="mt-2 text-sm text-fg-muted leading-relaxed">{{ value.description }}</p>
          </article>
        </div>
      </Container>
    </section>

    <!-- 发展历程 -->
    <section class="py-16 lg:py-20 bg-cream-50">
      <Container>
        <SectionLabel
          label="/ timeline"
          title="发展历程"
          description="从 0 到 2000+ 商户，每一步都算数。"
        />

        <div class="mt-12 max-w-3xl">
          <div class="relative pl-8">
            <!-- 轴线 -->
            <div class="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-accent-500 via-border to-transparent" />

            <div class="space-y-8">
              <div
                v-for="milestone in milestones"
                :key="milestone.time"
                class="relative"
              >
                <!-- 节点 -->
                <span class="absolute -left-7 top-1.5 inline-flex h-3 w-3 rounded-full bg-cream-50 border-2 border-accent-500" />

                <div class="flex flex-wrap items-baseline gap-3">
                  <span class="font-mono text-xs font-semibold text-accent-700 bg-accent-50 border border-accent-200 px-2 py-0.5 rounded">
                    {{ milestone.time }}
                  </span>
                  <h3 class="font-display text-lg font-semibold text-ink-900">{{ milestone.title }}</h3>
                </div>
                <p class="mt-2 text-sm text-fg-muted leading-relaxed max-w-xl">{{ milestone.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-ink-900 relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-dark opacity-40" />
      <Container size="narrow" class="relative text-center">
        <h2 class="font-display text-3xl lg:text-4xl font-bold text-cream-50 tracking-tight">
          准备好开始了吗？
        </h2>
        <p class="mt-3 text-cream-50/70">体验在线演示，感受自动发卡的便捷</p>
        <div class="mt-8">
          <AppButton href="https://demo.ifaka.cc" variant="secondary" size="lg" icon-right="arrow-right">
            访问在线演示
          </AppButton>
        </div>
      </Container>
    </section>
  </div>
</template>
