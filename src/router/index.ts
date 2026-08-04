import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由配置
 * - 静态路由：首页 / 关于 / 定价 / 联系 / 博客列表 / 文档中心 / 404
 * - 动态路由：/docs/:slug(.*)* 渲染任意嵌套 MD 文档；/blog/:slug 渲染博客文章
 *
 * 文档实际内容在 DocDetailPage / BlogArticlePage 中通过 import.meta.glob 加载
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/AboutPage.vue'),
    meta: { title: '关于我们' },
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: () => import('@/pages/PricingPage.vue'),
    meta: { title: '定价方案' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/pages/ContactPage.vue'),
    meta: { title: '联系我们' },
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/pages/BlogPage.vue'),
    meta: { title: '博客' },
  },
  {
    path: '/blog/:slug',
    name: 'blog-article',
    component: () => import('@/pages/BlogArticlePage.vue'),
    meta: { title: '博客文章' },
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('@/pages/DocDetailPage.vue'),
    meta: { title: '文档中心' },
  },
  // 文档动态路由：支持嵌套（用 catchAll 匹配深层路径）
  {
    path: '/docs/:slug(.*)*',
    name: 'doc-detail',
    component: () => import('@/pages/DocDetailPage.vue'),
    meta: { title: '文档' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '页面未找到' },
  },
]

export function setupRouter() {
  const isSSR = typeof window === 'undefined' || typeof window.history === 'undefined'
  // SSG 阶段用 memory history，避免 SSR 时路由报错
  const history = isSSR ? createMemoryHistory('/') : createWebHistory('/')
  const router = createRouter({
    history,
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth',
          top: 100, // header sticky offset
        }
      }
      return { top: 0, behavior: 'smooth' }
    },
  })

  return router
}

export const routeList = routes
