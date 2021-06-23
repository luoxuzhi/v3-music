import { createRouter, createWebHashHistory } from 'vue-router'

// import Recommend from '@/views/recommend'

const Recommend = () => import('@/views/recommend.vue' /* webpackChunkName: "about" */)
const Album = () => import(/* webpackChunkName: "about" */ '@/views/album.vue')
const Singer = () => import(/* webpackChunkName: "about" */ '@/views/singer.vue')
const SingerDetail = () => import(/* webpackChunkName: "about" */ '@/views/singer-detail.vue')
const TopList = () => import(/* webpackChunkName: "about" */ '@/views/top-list.vue')
const TopDetail = () => import(/* webpackChunkName: "about" */ '@/views/top-detail.vue')
const Search = () => import(/* webpackChunkName: "about" */ '@/views/search.vue')
const UserCenter = () => import(/* webpackChunkName: "about" */ '@/views/user-center.vue')

const routes = [
  {
    path: '/',
    redirect: '/recommend',
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album,
      },
    ],
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail,
      },
    ],
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail,
      },
    ],
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail,
      },
    ],
  },
  {
    path: '/user',
    components: {
      user: UserCenter,
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
