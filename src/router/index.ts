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
      },
      {
        path: '/product/list/:params',
        name: '纱线列表',
        component: () => import('../views/product/list.vue')
      },
      {
        path: '/product/create',
        name: '添加纱线',
        component: () => import('../views/product/create.vue')
      }, {
        path: '/settings/yarn',
        name: '纱线设置',
        component: () => import('../views/settings/yarn.vue')
      },
      {
        path: '/settings/factory',
        name: '加工厂设置',
        component: () => import('../views/settings/factory.vue')
      },
      {
        path: '/settings/supplier',
        name: '供货商设置',
        component: () => import('../views/settings/supplier.vue')
      },
      {
        path: '/settings/client',
        name: '客户设置',
        component: () => import('../views/settings/client.vue')
      },
      {
        path: '/settings/color',
        name: '颜色设置',
        component: () => import('../views/settings/color.vue')
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
