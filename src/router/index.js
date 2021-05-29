import { createRouter, createWebHashHistory } from 'vue-router'

// import Recommend from '@/views/recommend'

const Recommend = () => import('@/views/recommend.vue' /* webpackChunkName: "about" */)
const Singer = () => import(/* webpackChunkName: "about" */ '@/views/singer.vue')
const TopList = () => import(/* webpackChunkName: "about" */ '@/views/top-list.vue')
const Search = () => import(/* webpackChunkName: "about" */ '@/views/search.vue')
const User = () => import(/* webpackChunkName: "about" */ '@/views/user.vue')

const routes = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/recommend',
    component: Recommend,
  },
  {
    path: '/singer',
    component: Singer,
  },
  {
    path: '/top-list',
    component: TopList,
  },
  {
    path: '/search',
    component: Search,
  },
  {
    path: '/user',
    component: User,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
