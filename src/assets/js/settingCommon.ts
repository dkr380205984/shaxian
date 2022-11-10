
import { PrintListParams } from '@/types/settings'
export const printList = (option?: PrintListParams, type?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) => { // 再次封装一下打印设置接口
  const companyName: string = window.sessionStorage.getItem('full_name') || ''
  const { print } = require('@/assets/js/api')
  const tableList = [
    { id: null, name: '纱线采购单', type: 1, title: `${companyName}纱线采购单`, desc: '' },
    { id: null, name: '纱线调取单', type: 2, title: `${companyName}纱线调取单`, desc: '' },
    { id: null, name: '纱线加工单', type: 3, title: `${companyName}纱线加工单`, desc: '' },
    { id: null, name: '入库打印单', type: 4, title: `${companyName}入库单`, desc: '' },
    { id: null, name: '出库打印单', type: 5, title: `${companyName}出库单`, desc: '' },
    { id: null, name: '毛条加工单', type: 6, title: `${companyName}`, desc: '' }, // 委托纱线加工合同与加工工艺单
    { id: null, name: '毛条采购单', type: 7, title: `${companyName}毛条采购单`, desc: '' },
    { id: null, name: '毛条入库打印单', type: 8, title: `${companyName}毛条入库单`, desc: '' },
    { id: null, name: '毛条出库打印单', type: 9, title: `${companyName}毛条出库单`, desc: '' }
  ]
  return new Promise((reject) => {
    print.list(option).then((res: any) => {
      if (res.data.status !== false) {
        res.data.data.forEach((itemF: any) => {
          const finded = tableList.find((itemFI) => itemFI.type === itemF.type)
          if (finded) {
            finded.title = itemF.title
            finded.id = itemF.id
            finded.desc = itemF.desc
          }
        })
      }
      if (type) {
        reject(tableList.find((itemF) => itemF.type === type))
      } else {
        reject(tableList)
      }
    })
  })
}
export const processArr = [
  { value: '染色' },
  { value: '倒纱' },
  { value: '膨纱' }
]

export const moduleList = [
  {
    id: '0',
    label: '纱线管理',
    children: [
      {
        id: '0-0',
        label: '纱线列表',
        icon: '&#xe617;',
        url: '/product/list?page=1&page_size=10&name=&color=&attribute=&yarn_type='
      },
      {
        id: '0-1',
        label: '毛条列表',
        icon: '&#xe620;',
        url: '/material/list?page=1&type=&name=&page_size=10'
      }
    ]
  },
  {
    id: '1',
    label: '报价管理',
    children: [
      {
        id: '1-0',
        label: '报价列表',
        icon: '&#xe617;',
        url: '/price/list?page=1&code=&name=&client=&status=&user=&date=&limit=10'
      }
    ]
  },
  {
    id: '2',
    label: '订单管理',
    children: [
      {
        id: '1-0',
        label: '订单列表',
        icon: '&#xe61b;',
        url: '/order/list?page=1&order_code=&product_name=&client_id=&user_id=&page_size=10&date='
      },
      {
        id: '1-1',
        label: '纱线采购列表',
        icon: '&#xe616;',
        url: '/directOrder/yarnList?page=1&code=&name=&client_id=&user_id=&page_size=10&date='
      },
      {
        id: '1-2',
        label: '纱线加工列表',
        icon: '&#xe61a;',
        url: '/directProcess/yarnList?page=1&code=&name=&client_id=&user_id=&page_size=10&date='
      },
      {
        id: '1-3',
        label: '毛条采购列表',
        icon: '&#xe61e;',
        url: '/directOrder/materialList?page=1&code=&name=&client_id=&user_id=&page_size=10&date='
      },
      {
        id: '1-4',
        label: '工艺单列表',
        icon: '&#xe61f;',
        url: '/material/craftList?page=1&code=&name=&client_id=&user_id=&status=&page_size=10&date='
      }
    ]
  },
  {
    id: '3',
    label: '库存管理',
    children: [
      {
        id: '3-0',
        label: '纱线库存',
        icon: '&#xe61c;',
        // url: '/store/list?page=&type=&name=&page_size='
        url: '/store/allDetail'
      },
      {
        id: '3-1',
        label: '毛条库存',
        icon: '&#xe618;',
        url: '/store/materialList?page=&type=&name=&page_size='
      }
    ]
  },
  {
    id: '4',
    label: '财务管理',
    children: [
      {
        id: '4-0',
        label: '客户财务',
        icon: '&#xe611;',
        url: '/finance/clientList?page=&page_size=&date=&sort_type=&sort_cloum='
      },
      {
        id: '4-1',
        label: '供货商财务',
        icon: '&#xe611;',
        url: '/finance/supplierList?page=&page_size=&date=&sort_type=&sort_cloum='
      },
      {
        id: '4-2',
        label: '加工厂财务',
        icon: '&#xe611;',
        url: '/finance/factoryList?page=&page_size=&date=&sort_type=&sort_cloum='
      },
      {
        id: '4-3',
        label: '发票列表',
        icon: '&#xe611;',
        url: '/finance/billList?page=&page_size=10'
      },
      {
        id: '4-4',
        label: '收款列表',
        icon: '&#xe611;',
        url: '/finance/collectionList?page=&page_size=10'
      },
      {
        id: '4-5',
        label: '付款列表',
        icon: '&#xe611;',
        url: '/finance/payList?page=&page_size=10'
      },
      {
        id: '4-6',
        label: '扣款列表',
        icon: '&#xe611;',
        url: '/finance/deductList?page=&page_size=10'
      }
    ]
  },
  {
    id: '5',
    label: '系统设置',
    children: [
      {
        id: '5-0',
        label: '用户管理',
        icon: '&#xe615;',
        url: '/settings/user'
      },
      // {
      //   id: '5-1',
      //   label: '纱线类型管理',
      //   icon: '&#xe615;',
      //   url: '/settings/yarnType'
      // },
      {
        id: '5-2',
        label: '加工厂管理',
        icon: '&#xe615;',
        url: '/settings/factory'
      },
      {
        id: '5-3',
        label: '供货商管理',
        icon: '&#xe615;',
        url: '/settings/supplier'
      },
      {
        id: '5-4',
        label: '客户管理',
        icon: '&#xe615;',
        url: '/settings/client'
      },
      {
        id: '5-5',
        label: '颜色管理',
        icon: '&#xe615;',
        url: '/settings/color'
      },
      {
        id: '5-6',
        label: '打印设置',
        icon: '&#xe615;',
        url: '/settings/print'
      },
      // {
      //   id: '5-7',
      //   label: '毛条类型管理',
      //   icon: '&#xe615;',
      //   url: '/settings/material'
      // },
      {
        id: '5-8',
        label: '公司信息设置',
        icon: '&#xe615;',
        url: '/settings/clientInfo'
      }
    ]
  }, {
    id: '6',
    label: '操作记录',
    children: [{
      id: '6-0',
      label: '系统操作',
      icon: '&#xe615;',
      url: '/oprHistory/system'
    }]
  }
]
