import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // 配置所有未匹配的路由都指向404组件
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../components/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
