<script setup lang="ts">
interface Props {
  name: 'wechat' | 'alipay' | 'unionpay' | 'paypal' | 'stripe'
  size?: number | string
}

withDefaults(defineProps<Props>(), {
  size: 24,
})

// 阿里矢量库 Symbol ID 映射
const symbolId: Record<Props['name'], string> = {
  wechat: '#icon-weixin',
  alipay: '#icon-zhifubao',
  unionpay: '#icon-zhifupingtai-yinlian',
  paypal: '#icon-social-paypal',
  stripe: '#icon-stripe-4',
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    class="inline-block shrink-0"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId[name]" />
  </svg>
</template>
