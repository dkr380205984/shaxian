
import { PrintListParams } from '@/types/settings'
export const printList = (option?: PrintListParams, type?: 1 | 2 | 3 | 4 | 5 | 6) => { // 再次封装一下打印设置接口
  const companyName: string = window.sessionStorage.getItem('full_name') || ''
  const { print } = require('@/assets/js/api')
  const tableList = [
    { id: null, name: '纱线采购单', type: 1, title: `${companyName}纱线采购单`, desc: '' },
    { id: null, name: '纱线调取单', type: 2, title: `${companyName}纱线调取单`, desc: '' },
    { id: null, name: '纱线加工单', type: 3, title: `${companyName}纱线加工单`, desc: '' },
    { id: null, name: '入库打印单', type: 4, title: `${companyName}入库单`, desc: '' },
    { id: null, name: '出库打印单', type: 5, title: `${companyName}出库单`, desc: '' },
    { id: null, name: '毛条加工单', type: 6, title: `${companyName}委托纱线加工合同与加工工艺单`, desc: '' }
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
