import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import store from '../store/index';
Vue.use(VueRouter)
// 解决ele组件点击当前页路由时出错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location: string) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}

// 非常重要！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
// 情保证所有页面name不同！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
// 面包屑组件是根据名称来判断的！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
// 不能根据路由一致判断，因为列表页筛选条件会改变url，只能根据名称判断是否跳转到新页面！！！！！！
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
        path: '/product/list',
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
        path: '/material/list',
        name: '毛条列表',
        component: () => import('../views/material/list.vue')
      }, {
        path: '/material/craftList',
        name: '工艺单列表',
        component: () => import('../views/material/craftList.vue')
      }, {
        path: '/material/craftCreate',
        name: '添加工艺单',
        component: () => import('../views/material/craftCreate.vue')
      }, {
        path: '/material/craftUpdate/:id',
        name: '修改工艺单',
        component: () => import('../views/material/craftUpdate.vue')
      }, {
        path: '/material/craftDetail/:id',
        name: '工艺单详情',
        component: () => import('../views/material/craftDetail.vue')
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
        path: '/order/list',
        name: '订单列表',
        component: () => import('../views/order/list.vue')
      }, {
        path: '/orderProcessYarn/list',
        name: '订购调取列表',
        component: () => import('../views/orderProcessYarn/list.vue')
      }, {
        path: '/orderProcessYarn/detail/:id',
        name: '纱线订购调取',
        component: () => import('../views/orderProcessYarn/detail.vue')
      }, {
        path: '/inAndOut/list',
        name: '纱线出入库',
        component: () => import('../views/inAndOut/list.vue')
      }, {
        path: '/inAndOut/detail/:id',
        name: '纱线出入库详情',
        component: () => import('../views/inAndOut/detail.vue')
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
      },
      {
        path: '/settings/print',
        name: '打印设置',
        component: () => import('../views/settings/print.vue')
      }, {
        path: '/settings/material',
        name: '毛条设置',
        component: () => import('../views/settings/material.vue')
      }, {
        path: '/store/list',
        name: '纱线仓库列表',
        component: () => import('../views/store/list.vue')
      }, {
        path: '/store/materialList',
        name: '毛条仓库列表',
        component: () => import('../views/store/materialList.vue')
      }, {
        path: '/store/detail/:id',
        name: '纱线仓库详情',
        component: () => import('../views/store/detail.vue')
      }, {
        path: '/store/materialDeatail/:id',
        name: '毛条仓库详情',
        component: () => import('../views/store/materialDeatail.vue')
      }, {
        path: '/directOrder/materialList',
        name: '毛条采购列表',
        component: () => import('../views/directOrder/materialList.vue')
      }, {
        path: '/directOrder/materialDetail/:id',
        name: '毛条采购详情',
        component: () => import('../views/directOrder/materialDetail.vue')
      }, {
        path: '/directOrder/yarnList',
        name: '纱线采购列表',
        component: () => import('../views/directOrder/yarnList.vue')
      }, {
        path: '/directOrder/yarnDetail/:id',
        name: '纱线采购详情',
        component: () => import('../views/directOrder/yarnDetail.vue')
      }, {
        path: '/directProcess/materialList',
        name: '毛条加工列表',
        component: () => import('../views/directOrder/materialList.vue')
      }, {
        path: '/directProcess/materialDetail/:id',
        name: '毛条加工详情',
        component: () => import('../views/directOrder/materialDetail.vue')
      }, {
        path: '/directProcess/yarnList',
        name: '纱线加工列表',
        component: () => import('../views/directOrder/yarnList.vue')
      }, {
        path: '/directProcess/yarnDetail/:id',
        name: '纱线加工详情',
        component: () => import('../views/directOrder/yarnDetail.vue')
      }
    ]
  },
  {
    path: '/print',
    name: 'print',
    redirect: '/index',
    component: () => import('@/views/print/index.vue'),
    children: [
      {// 1调取单
        path: 'orderYarn/1/:orderId',
        name: 'orderYarnFS',
        component: () => import('@/views/print/orderYarnFS.vue')
      },
      {// 2订购单
        path: 'orderYarn/2/:documentId',
        name: 'orderYarnFC',
        component: () => import('@/views/print/orderYarnFC.vue')
      },
      {// 加工单
        path: 'processYarn/:documentId',
        name: 'processYarn',
        component: () => import('@/views/print/processYarn.vue')
      },
      {// 毛条采购单
        path: 'orderMaterial/2/:documentId',
        name: 'orderMaterial',
        component: () => import('@/views/print/orderMaterialFC.vue')
      },
      {// 毛条加工/工艺单
        path: 'processMaterial/:documentId',
        name: 'processMaterial',
        component: () => import('@/views/print/processMaterial.vue')
      },
      {// 出入库单
        path: 'store/:type/:documentId',
        name: 'store',
        component: () => import('@/views/print/store.vue')
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
    url: to.fullPath,
    name: to.name
  })
  next()
})

export default router;
