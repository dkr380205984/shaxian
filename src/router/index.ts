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
      },
      {
        path: '/product/update/:id',
        name: '修改纱线',
        component: () => import('../views/product/update.vue')
      }, {
        path: '/product/detail/:id',
        name: '纱线详情',
        component: () => import('../views/product/detail.vue')
      }, {
        path: '/order/create',
        name: '添加订单',
        component: () => import('../views/order/create.vue')
      }, {
        path: '/order/update/:id',
        name: '修改订单',
        component: () => import('../views/order/update.vue')
      }, {
        path: '/order/detail/:id',
        name: '订单详情',
        component: () => import('../views/order/detail.vue')
      }, {
        path: '/order/list/:params',
        name: '订单列表',
        component: () => import('../views/order/list.vue')
      }, {
        path: '/orderYarn/list/:params',
        name: '订购调取列表',
        component: () => import('../views/orderYarn/list.vue')
      }, {
        path: '/orderYarn/detail/:id',
        name: '纱线订购调取',
        component: () => import('../views/orderYarn/detail.vue')
      }, {
        path: '/settings/yarnType',
        name: '纱线类型设置',
        component: () => import('../views/settings/yarnType.vue')
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
      }, {
        path: '/store/list',
        name: '仓库列表',
        component: () => import('../views/store/list.vue')
      }, {
        path: '/store/detail/:storeId',
        name: '仓库详情',
        component: () => import('../views/store/detail.vue')
      }
    ]
  }, {
    path: '/document',
    name: '单据',
    component: () => import('@/views/documents/index.vue'),
    children: [
      {
        path: 'GDFE',
        name: '出口货物报关单',
        component: () => import('@/views/documents/GDFE.vue')
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
