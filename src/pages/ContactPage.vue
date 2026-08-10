<script setup lang="ts">
import { ref } from 'vue'
import Container from '@/components/common/Container.vue'
import SectionLabel from '@/components/common/SectionLabel.vue'
import AppIcon from '@/components/common/AppIcon.vue'
import ContactForm from '@/components/contact/ContactForm.vue'
import WechatModal from '@/components/common/WechatModal.vue'
import { useSeo } from '@/composables/useSeo'
import { siteConfig } from '@/data/site'
import { faqs } from '@/data/company'

useSeo({
  title: `联系我们 - ${siteConfig.name}`,
  description:
    '有任何问题或合作意向？随时与我们联系。客服邮箱 igewen@126.com，24 小时内回复。',
  keywords: ['联系 HmwCard', '发卡系统咨询', '商务合作'],
  path: '/contact',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `联系 ${siteConfig.name}`,
    url: `${siteConfig.url}/contact`,
  },
})

// 微信模态框
const wechatModalRef = ref<InstanceType<typeof WechatModal> | null>(null)
const WECHAT_ID = 'hewenwen20190921'
const WECHAT_QR = '/images/wxqrcode.jpg'

function openWechat() {
  wechatModalRef.value?.show()
}

const contactMethods = [
  {
    icon: 'mail',
    label: '客服邮箱',
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    note: '建议包含：订单号、商品名称、问题描述、相关截图',
    mono: 'email',
  },
  {
    icon: 'wechat',
    label: '微信客服',
    value: '点击复制微信号 + 弹出二维码',
    note: '微信号已自动复制，添加时请备注来源',
    mono: 'wechat',
    action: openWechat,
  },
  {
    icon: 'message',
    label: '在线咨询',
    value: '提交下方表单',
    note: '我们将在 24 小时内回复',
    mono: 'form',
    href: '#contact-form',
  },
]

const openFaq = ref<number | null>(0)
function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i
}
</script>

<template>
  <div>
    <section class="relative overflow-hidden bg-cream-50 pt-16 pb-12 lg:pt-24">
      <div class="absolute inset-0 bg-grid-fade opacity-50" />
      <Container class="relative">
        <SectionLabel
          label="/ contact"
          title="联系我们"
          description="有什么问题或合作意向？随时与我们联系，我们会尽快回复。"
        />
      </Container>
    </section>

    <!-- 联系方式 -->
    <section class="pb-16 lg:pb-20 bg-cream-50">
      <Container>
        <div class="grid sm:grid-cols-3 gap-4">
          <component
            :is="method.href ? 'a' : 'button'"
            v-for="method in contactMethods"
            :key="method.label"
            :href="method.href"
            class="lift-card group w-full text-left rounded-2xl border border-border bg-cream-50 p-6 hover:border-ink-900 hover:shadow-lift"
            @click="method.action ? method.action() : null"
          >
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ink-900 text-cream-50">
                <AppIcon :name="method.icon" :size="18" />
              </span>
              <AppIcon name="arrow-up-right" :size="14" class="text-fg-subtle group-hover:text-ink-900" />
            </div>
            <div class="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">{{ method.mono }}</div>
            <h3 class="mt-1 font-display text-base font-semibold text-ink-900">{{ method.label }}</h3>
            <p class="mt-1 text-sm font-medium text-accent-700 break-all">{{ method.value }}</p>
            <p class="mt-2 text-xs text-fg-muted leading-relaxed">{{ method.note }}</p>
          </component>
        </div>
      </Container>
    </section>

    <!-- 表单 -->
    <section id="contact-form" class="py-16 lg:py-20 bg-cream-100/40 border-y border-border scroll-mt-24">
      <Container size="narrow">
        <SectionLabel
          label="/ send message"
          title="给我们留言"
          description="填写表单，我们将在 24 小时内通过邮件回复。"
        />
        <div class="mt-8">
          <ContactForm />
        </div>
      </Container>
    </section>

    <!-- FAQ -->
    <section class="py-16 lg:py-20 bg-cream-50">
      <Container size="narrow">
        <SectionLabel
          label="/ faq"
          title="常见问题"
          description="购买前最常被问到的几个问题。"
        />
        <div class="mt-8 space-y-2">
          <div
            v-for="(faq, i) in faqs"
            :key="i"
            class="rounded-xl border border-border bg-cream-50 overflow-hidden transition-all"
            :class="{ 'border-ink-900 shadow-soft': openFaq === i }"
          >
            <button
              class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              :aria-expanded="openFaq === i"
              @click="toggleFaq(i)"
            >
              <div class="flex items-center gap-3">
                <span class="font-mono text-xs text-fg-subtle tabular-nums">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="text-sm font-medium text-ink-900">{{ faq.q }}</span>
              </div>
              <AppIcon
                name="chevron-down"
                :size="16"
                :class="[
                  'transition-transform text-fg-subtle shrink-0',
                  openFaq === i ? 'rotate-180' : '',
                ]"
              />
            </button>
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-96 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="max-h-96 opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div v-if="openFaq === i" class="overflow-hidden">
                <p class="px-5 pb-4 pl-12 text-sm text-fg-muted leading-relaxed">{{ faq.a }}</p>
              </div>
            </transition>
          </div>
        </div>
      </Container>
    </section>

    <!-- 微信二维码模态框 -->
    <WechatModal ref="wechatModalRef" :wechat-id="WECHAT_ID" :qr-image="WECHAT_QR" />
  </div>
</template>
