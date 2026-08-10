<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { siteConfig } from '@/data/site'
import HeroSection from '@/components/home/HeroSection.vue'
import PaymentMarquee from '@/components/home/PaymentMarquee.vue'
import StatsSection from '@/components/home/StatsSection.vue'
import FeaturesSection from '@/components/home/FeaturesSection.vue'
import HowItWorksSection from '@/components/home/HowItWorksSection.vue'
import CTASection from '@/components/home/CTASection.vue'

useSeo({
  title: `${siteConfig.fullName} - 自动发卡 · 多渠道支付 · 一键部署`,
  description: siteConfig.description,
  keywords: [
    '发卡系统', '自动发卡', '卡密交易', '虚拟商品', '自动发货',
    '发卡平台', '发卡源码', 'HmwCard', '何慕雯发卡系统', '在线发卡',
    '数字商品', '激活码发卡', '充值卡发卡', '虚拟商品交易', '自动售卡',
  ],
  path: '/',
  image: `${siteConfig.url}/og-default.jpg`,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteConfig.fullName,
      url: siteConfig.email,
      logo: `${siteConfig.url}/logo.svg`,
      email: siteConfig.email,
      description: siteConfig.description,
      sameAs: ['https://github.com/iGewen/hmwfaka-website'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteConfig.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Linux, Docker',
      description: siteConfig.description,
      offers: {
        '@type': 'Offer',
        price: '89',
        priceCurrency: 'CNY',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '128',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.fullName,
      url: siteConfig.url,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteConfig.url}/docs?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
  breadcrumb: [{ name: '首页', item: '/' }],
  speakable: {
    cssSelector: ['#features', '#how-it-works'],
    about: url,
  },
})
</script>

<template>
  <div>
    <HeroSection />
    <PaymentMarquee />
    <FeaturesSection />
    <StatsSection />
    <HowItWorksSection />
    <CTASection />
  </div>
</template>
