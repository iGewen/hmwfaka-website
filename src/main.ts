import { ViteSSG } from 'vite-ssg'
import { setupRouter } from './router'
import App from './App.vue'
import './assets/styles/main.css'

// Vite SSG 入口：构建时静态预渲染所有路由，运行时 SPA 激活
export const createApp = ViteSSG(
  App,
  {
    routes: setupRouter().options.routes,
    base: '/',
  },
  // 初始化钩子：注册全局 head、路由守卫等
  async (ctx) => {
    // hash 滚动由 router.scrollBehavior 统一处理（带 top:100 偏移）
    // 这里只做客户端激活后的额外逻辑
    if (ctx.isClient) {
      ctx.router.afterEach((to) => {
        // 路由切换时关闭可能打开的移动菜单
        if (to.hash) {
          // 给 hash 元素一点时间渲染后再滚动
          setTimeout(() => {
            const el = document.querySelector(to.hash)
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 100
              window.scrollTo({ top, behavior: 'smooth' })
            }
          }, 50)
        }
      })
    }
  },
)

export default createApp
