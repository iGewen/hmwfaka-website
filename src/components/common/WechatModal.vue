<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import AppIcon from '@/components/common/AppIcon.vue'

interface Props {
  wechatId: string
  qrImage: string
}
const props = defineProps<Props>()

const open = ref(false)
const copied = ref(false)
const dialogRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
let copyTimer: ReturnType<typeof setTimeout> | null = null

function show() {
  // 保存当前焦点元素，关闭时恢复
  triggerRef.value = document.activeElement as HTMLElement | null
  open.value = true
  // 重置复制状态（不自动复制，等用户手动点击复制按钮）
  copied.value = false
  // 锁定 body 滚动
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
    // 移动焦点到对话框
    nextTick(() => {
      dialogRef.value?.focus()
    })
  }
}

function close() {
  open.value = false
  copied.value = false
  if (copyTimer) {
    clearTimeout(copyTimer)
    copyTimer = null
  }
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
    // 焦点还给触发元素
    nextTick(() => {
      triggerRef.value?.focus()
    })
  }
}

async function copyWechatId() {
  const text = props.wechatId
  let success = false

  // 方式 1：现代 Clipboard API（HTTPS 或 localhost 下可用）
  // 不依赖 isSecureContext 判断（headless 浏览器可能误判），直接尝试
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      success = true
    } catch (e) {
      console.warn('Clipboard API failed, fallback to execCommand:', e)
    }
  }

  // 方式 2：fallback - 临时 textarea + execCommand
  if (!success && typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      // 避免页面滚动
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '0'
      textarea.style.opacity = '0'
      textarea.setAttribute('readonly', '')
      document.body.appendChild(textarea)

      // iOS 兼容 select
      if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        const range = document.createRange()
        range.selectNodeContents(textarea)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
        textarea.setSelectionRange(0, text.length)
      } else {
        textarea.select()
      }

      success = document.execCommand('copy')
      document.body.removeChild(textarea)
    } catch (e) {
      console.warn('execCommand copy failed:', e)
    }
  }

  if (success) {
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 2500)
  }
}

// focus trap：Tab / Shift+Tab 限制在对话框内
function onKey(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') {
    close()
    return
  }
  if (e.key !== 'Tab') return

  const dialog = dialogRef.value
  if (!dialog) return

  const focusable = dialog.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement as HTMLElement

  if (e.shiftKey) {
    if (active === first || active === dialog) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (active === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  if (copyTimer) clearTimeout(copyTimer)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})

defineExpose({ show })
</script>

<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="微信联系方式"
      >
        <!-- 遮罩 -->
        <div
          class="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
          @click="close"
        />

        <!-- 内容卡片（tabindex 让对话框可获焦） -->
        <div
          ref="dialogRef"
          tabindex="-1"
          class="relative w-full max-w-sm rounded-2xl bg-cream-50 border border-border shadow-float overflow-hidden animate-fade-in-up outline-none"
        >
          <!-- 头部 -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-border">
            <div class="flex items-center gap-2">
              <span class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#07C160] text-white">
                <AppIcon name="brand-wechat" :size="16" />
              </span>
              <span class="font-display text-sm font-semibold text-ink-900">微信联系</span>
            </div>
            <button
              class="inline-flex h-7 w-7 items-center justify-center rounded text-fg-subtle hover:bg-cream-200 hover:text-ink-900 transition-colors"
              aria-label="关闭"
              @click="close"
            >
              <AppIcon name="close" :size="16" />
            </button>
          </div>

          <!-- 二维码 -->
          <div class="p-6 flex flex-col items-center">
            <div class="relative">
              <img
                :src="qrImage"
                alt="微信二维码"
                class="w-48 h-48 rounded-lg border border-border bg-white object-contain"
                loading="eager"
              />
              <!-- 装饰角 -->
              <span class="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent-500 rounded-tl" />
              <span class="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent-500 rounded-tr" />
              <span class="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-accent-500 rounded-bl" />
              <span class="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent-500 rounded-br" />
            </div>

            <p class="mt-4 text-xs text-fg-muted text-center leading-relaxed">
              微信扫码添加好友<br />
              添加时请备注来源，优先通过
            </p>

            <!-- 微信号复制 -->
            <button
              class="mt-4 group w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-border bg-cream-100/60 hover:bg-cream-100 hover:border-ink-900 transition-colors"
              @click="copyWechatId"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <AppIcon name="wechat" :size="14" class="text-fg-subtle shrink-0" />
                <div class="text-left min-w-0">
                  <div class="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">微信号</div>
                  <div class="font-mono text-sm font-medium text-ink-900 truncate">{{ wechatId }}</div>
                </div>
              </div>
              <span
                :class="[
                  'inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-colors shrink-0',
                  copied
                    ? 'text-live-600 bg-live-50'
                    : 'text-fg-muted group-hover:text-ink-900',
                ]"
              >
                <AppIcon :name="copied ? 'check' : 'copy'" :size="12" :stroke-width="2.5" />
                {{ copied ? '已复制' : '复制' }}
              </span>
            </button>

            <!-- 复制成功提示 -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div
                v-if="copied"
                class="mt-2 flex items-center justify-center gap-1.5 text-xs text-live-600 font-medium"
              >
                <AppIcon name="check-circle" :size="12" :stroke-width="2" />
                <span>微信号已复制到剪贴板</span>
              </div>
            </transition>
          </div>

          <!-- 底部 -->
          <div class="px-5 py-3 bg-cream-100/40 border-t border-border flex items-center justify-between">
            <span class="font-mono text-[10px] text-fg-subtle uppercase tracking-wider">
              工作时间 9:00 - 22:00
            </span>
            <span class="font-mono text-[10px] text-fg-subtle">ESC 关闭</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
