<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'
import AppButton from '@/components/common/AppButton.vue'

const inquiryTypes = ['购买咨询', '技术支持', '商务合作', '功能定制', '其它问题']

const form = reactive({
  name: '',
  email: '',
  type: inquiryTypes[0],
  message: '',
})
const errors = reactive({ name: '', email: '', message: '' })
const submitting = ref(false)
const submitted = ref(false)

function validate() {
  errors.name = form.name.trim() ? '' : '请输入您的姓名'
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : '请输入有效邮箱'
  errors.message = form.message.trim().length >= 5 ? '' : '消息内容至少 5 个字'
  return !errors.name && !errors.email && !errors.message
}
const isValid = computed(() => validate())

async function submit() {
  if (!validate()) return
  submitting.value = true
  await new Promise((r) => setTimeout(r, 800))
  submitting.value = false
  submitted.value = true
  form.name = form.email = form.message = ''
  form.type = inquiryTypes[0]
}
</script>

<template>
  <form
    class="rounded-2xl border border-border bg-cream-50 p-6 lg:p-8 shadow-soft"
    @submit.prevent="submit"
  >
    <div class="grid sm:grid-cols-2 gap-4">
      <div>
        <label for="name" class="block font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle font-medium mb-1.5">
          姓名 <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="您的称呼"
          class="w-full rounded-lg border border-border-strong bg-cream-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder-fg-subtle/50 focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 focus:outline-none transition-colors"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/10': errors.name }"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500 font-mono">{{ errors.name }}</p>
      </div>

      <div>
        <label for="email" class="block font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle font-medium mb-1.5">
          邮箱 <span class="text-red-500">*</span>
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="you@example.com"
          class="w-full rounded-lg border border-border-strong bg-cream-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder-fg-subtle/50 focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 focus:outline-none transition-colors"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/10': errors.email }"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-red-500 font-mono">{{ errors.email }}</p>
      </div>
    </div>

    <div class="mt-4">
      <label for="type" class="block font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle font-medium mb-1.5">
        咨询类型
      </label>
      <div class="relative">
        <select
          id="type"
          v-model="form.type"
          class="w-full appearance-none rounded-lg border border-border-strong bg-cream-50 px-3.5 py-2.5 text-sm text-ink-900 focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 focus:outline-none transition-colors pr-10"
        >
          <option v-for="t in inquiryTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <AppIcon name="chevron-down" :size="16" class="absolute right-3 top-1/2 -translate-y-1/2 text-fg-subtle pointer-events-none" />
      </div>
    </div>

    <div class="mt-4">
      <label for="message" class="block font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle font-medium mb-1.5">
        消息内容 <span class="text-red-500">*</span>
        <span class="ml-1 text-fg-subtle/60 normal-case tracking-normal">（至少 5 个字）</span>
      </label>
      <textarea
        id="message"
        v-model="form.message"
        rows="5"
        placeholder="请描述您的问题或合作意向，我们会尽快回复。"
        class="w-full rounded-lg border border-border-strong bg-cream-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder-fg-subtle/50 focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10 focus:outline-none transition-colors resize-y"
        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/10': errors.message }"
      />
      <p v-if="errors.message" class="mt-1 text-xs text-red-500 font-mono">{{ errors.message }}</p>
    </div>

    <div class="mt-6 flex items-center justify-between gap-4">
      <p class="text-xs text-fg-subtle font-mono">24h 内回复</p>
      <AppButton type="submit" variant="primary" :loading="submitting" icon-right="arrow-right">
        发送消息
      </AppButton>
    </div>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div
        v-if="submitted"
        class="mt-4 flex items-center gap-2 rounded-lg bg-live-50 border border-live-400/30 px-4 py-3 text-sm text-live-600"
      >
        <AppIcon name="check-circle" :size="16" :stroke-width="2" />
        消息已提交，我们将尽快通过邮件回复您。
      </div>
    </transition>
  </form>
</template>
