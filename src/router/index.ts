import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '../store/index';
Vue.use(VueRouter)
// 解决ele组件点击当前页路由时出错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location: string) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}
const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '登录页',
    component: () => import('../views/login.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/index.vue'),
    children: [
      {
        path: '/homePage/homePage',
        name: '首页',
        component: () => import('../views/homePage/homePage.vue')
      },
      {
        path: '/settings/user',
        name: '用户设置',
        component: () => import('../views/settings/user.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  store.commit('status/getBreadUrl', {
    url: to.path,
    name: to.name
  })
  next()
})

export default router;
