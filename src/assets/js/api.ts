import http from './http'
import { ListParam, DetailParam, DeleteParam } from '@/types/axiosParam'
const baseUrl = '/api'

// 登录
const login = (params:
  {
    user_name: string | null, password: string | null
  }) => http.post(`${baseUrl}/auth/login`, params, 'application/json')
// token
const getToken = () => http.get(`${baseUrl}/upload/token`)

// 首页杂七杂八接口
const index = {
  searchAll: (params?: ListParam) => http.get(`${baseUrl}/index/search`, params),
  notifyList: (params?: ListParam) => http.get(`${baseUrl}/notify/all`, params)
}

// 修改密码
const changeUserPasd = {
  updated: (params: { sms_code: string, new_pass: string }) => http.post(`${baseUrl}/user/password/change`, params, 'application/json'),
  sendVerificationCode: () => http.post(`${baseUrl}/user/password/change/send/code`, {}, 'application/json')
}
// 用户信息
const authInfo = (params: any) => http.post(`${baseUrl}/auth/info`, params, 'application/json')
import {
  PartyBCheckParams, PartyBCreateParams, PartyBListParams,
  YarnTypeCreateParams, YarnTypeDetailParams, YarnTypeListParams,
  YarnColorCreateParams, YarnColorDetailParams, YarnColorListParams,
  UserCreateParams, UserDetailParams, UserListParams,
  PrintCreateParams, PrintDetailParams, PrintListParams,
} from '@/types/settings'
// 供应商加工厂客户
const partyB = {
  create: (params: PartyBCreateParams) => http.post(`${baseUrl}/client/save`, params, 'application/json'),
  detail: (params: PartyBCheckParams) => http.get(`${baseUrl}/client/detail`, params),
  check: (params: PartyBCheckParams) => http.post(`${baseUrl}/client/status/check`, params, 'application/json'),
  list: (params?: PartyBListParams) => http.get(`${baseUrl}/client/lists`, params)
}
// 纱线类型
const yarnType = {
  create: (params: YarnTypeCreateParams) => http.post(`${baseUrl}/yarn/type/save`, params, 'application/json'),
  detail: (params: YarnTypeDetailParams) => http.get(`${baseUrl}/yarn/type/detail`, params),
  delete: (params: YarnTypeDetailParams) => http.post(`${baseUrl}/yarn/type/delete`, params, 'application/json'),
  list: (params?: YarnTypeListParams) => http.get(`${baseUrl}/yarn/type/lists`, params)
}
// 纱线颜色
const yarnColor = {
  create: (params: YarnColorCreateParams) => http.post(`${baseUrl}/yarn/color/save`, params, 'application/json'),
  detail: (params: YarnColorDetailParams) => http.get(`${baseUrl}/yarn/color/detail`, params),
  delete: (params: YarnColorDetailParams) => http.post(`${baseUrl}/yarn/color/delete`, params, 'application/json'),
  list: (params?: YarnColorListParams) => http.get(`${baseUrl}/yarn/color/lists`, params)
}
// 系统用户
const user = {
  create: (params: UserCreateParams) => http.post(`${baseUrl}/user/save`, params, 'application/json'),
  detail: (params: UserDetailParams) => http.get(`${baseUrl}/user/detail`, params),
  check: (params: UserDetailParams) => http.post(`${baseUrl}/user/status/check`, params, 'application/json'),
  list: (params?: UserListParams) => http.get(`${baseUrl}/user/lists`, params)
}

// 打印设置
const print = {
  create: (params: PrintCreateParams) => http.post(`${baseUrl}/print/config/save`, params, 'application/json'),
  detail: (params: PrintDetailParams) => http.get(`${baseUrl}/print/config/detail`, params),
  delete: (params: { id: number }) => http.post(`${baseUrl}/print/config/delete`, params, 'application/json'),
  list: (params?: PrintListParams) => http.get(`${baseUrl}/print/config/lists`, params)
}
// 产品
import { Product, ProductDetail } from '@/types/product'
const product = {
  create: (params: { data: Product[] }) => http.post(`${baseUrl}/yarn/save`, params, 'application/json'),
  list: (params?: ListParam) => http.get(`${baseUrl}/yarn/lists`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/yarn/delete`, params, 'application/json'),
  detail: (params: DetailParam) => http.get(`${baseUrl}/yarn/detail`, params),
  editPro: (params: { id: string, name: string, yarn_type: number }) => http.post(`${baseUrl}/yarn/edit`, params, 'application/json'),
  editProChild: (params: ProductDetail) => http.post(`${baseUrl}/yarn/child/edit`, params, 'application/json'),
  deleteChild: (params: DeleteParam) => http.post(`${baseUrl}/yarn/child/delete`, params, 'application/json')
}

// 订单
import { Order } from '@/types/order'
const order = {
  create: (params: Order) => http.post(`${baseUrl}/order/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/order/lists`, params),
  detail: (params: DetailParam) => http.get(`${baseUrl}/order/detail`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/order/delete`, params, 'application/json'),
  deleteChild: (params: DeleteParam) => http.post(`${baseUrl}/order/child/delete`, params, 'application/json')
}
import { StoreCreateParams, StoreDetailParams, StoreListParams, StoreDetailYarnListParams, OrderStoreInfo } from '@/types/store'
// 仓库管理 包含调取
const store = {
  create: (params: StoreCreateParams) => http.post(`${baseUrl}/store/save`, params, 'application/json'),
  detail: (params: StoreDetailParams) => http.get(`${baseUrl}/store/detail`, params),
  delete: (params: StoreDetailParams) => http.post(`${baseUrl}/store/delete`, params, 'application/json'),
  deleteSecond: (params: StoreDetailParams) => http.post(`${baseUrl}/store/second/delete`, params, 'application/json'),
  list: (params?: StoreListParams) => http.get(`${baseUrl}/store/lists`, params),
  detailYarnList: (params: StoreDetailYarnListParams) => http.get(`${baseUrl}/store/total/lists`, params),
  detailMateiralList: (params: StoreDetailYarnListParams) => http.get(`${baseUrl}/material/store/total/lists`, params),
  orderSave: (params: OrderStoreInfo) => http.post(`${baseUrl}/order/transfer/save`, params, 'application/json'),
  orderList: (params?: { order_id: string }) => http.get(`${baseUrl}/order/transfer/lists`, params),
  orderDelete: (params: DeleteParam) => http.post(`${baseUrl}/order/transfer/delete`, params, 'application/json'),
  orderDetail: (params: DetailParam) => http.get(`${baseUrl}/order/transfer/detail`, params)
}
// 出入库
import { StoreCreate } from '@/types/store'
interface UpdateCode { id: string, related_id: string, action_type: number }
const stock = {
  delete: (params: any) => http.post(`${baseUrl}/store/log/delete`, params, 'application/json'),
  list: (params?: any) => http.get(`${baseUrl}/store/log/lists`, params),
  detail: (params: { id: number }) => http.get(`${baseUrl}/store/log/detail`, params),
  materialList: (params?: any) => http.get(`${baseUrl}/material/store/log/lists`, params),
  create: (params: { data: StoreCreate[] }) => http.post(`${baseUrl}/store/total/save`, params, 'application/json'),
  materialCreate: (params: { data: StoreCreate[] }) => http.post(`${baseUrl}/material/store/total/save`, params, 'application/json'),
  update: (params: UpdateCode) => http.post(`${baseUrl}/store/log/update`, params, 'application/json'),
  materialDetail: (params: { id: number }) => http.get(`${baseUrl}/material/store/log/detail`, params)
}

// 采购
import { OrderYarn } from '@/types/orderProcessYarn'
const yarnOrder = {
  create: (params: { data: OrderYarn[], order_id?: string }) => http.post(`${baseUrl}/order/purchase/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/order/purchase/lists`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/order/purchase/delete`, params, 'application/json'),
  update: (params: OrderYarn) => http.post(`${baseUrl}/order/purchase/edit`, params, 'application/json'),
  detail: (params: DetailParam) => http.get(`${baseUrl}/order/purchase/detail`, params)
}

// 加工
import { ProcessYarn } from '@/types/orderProcessYarn'
const yarnProcess = {
  create: (params: { data: ProcessYarn[], order_id: string }) => http.post(`${baseUrl}/order/process/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/order/process/lists`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/order/process/delete`, params, 'application/json'),
  detail: (params: DetailParam) => http.get(`${baseUrl}/order/process/detail`, params)
}

// 毛条
import { MaterialType } from '@/types/common'
import { MaterialInfo, OrderMaterialInfo } from '@/types/material'
const material = {
  typeCreate: (params: MaterialType) => http.post(`${baseUrl}/material/type/save`, params, 'application/json'),
  typeList: (params?: ListParam) => http.get(`${baseUrl}/material/type/lists`, params),
  typeDelete: (params: DeleteParam) => http.post(`${baseUrl}/material/type/delete`, params, 'application/json'),
  create: (params: { data: MaterialInfo[] }) => http.post(`${baseUrl}/material/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/material/lists`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/material/delete`, params, 'application/json'),
  orderCreate: (params: { data: OrderMaterialInfo[] }) => http.post(`${baseUrl}/material/purchase/save`, params, 'application/json'),
  orderList: (params: ListParam) => http.get(`${baseUrl}/material/purchase/lists`, params),
  orderDetail: (params: DetailParam) => http.get(`${baseUrl}/material/purchase/detail`, params),
  orderDelete: (params: DeleteParam) => http.post(`${baseUrl}/material/purchase/delete`, params, 'application/json')
}

// 毛条工艺单
import { CraftInfo } from '@/types/material'
const craft = {
  create: (params: CraftInfo) => http.post(`${baseUrl}/material/craft/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/material/craft/lists`, params),
  detail: (params: DetailParam) => http.get(`${baseUrl}/material/craft/detail`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/material/craft/delete`, params, 'application/json')
}

// 扣款
import { DeductInfo } from '@/types/common'
const deduct = {
  create: (params: DeductInfo) => http.post(`${baseUrl}/financial/deduct/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/financial/deduct/lists`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/financial/deduct/delete`, params, 'application/json')
}

// 开票
import { BillInfo } from '@/types/common'
const bill = {
  create: (params: BillInfo) => http.post(`${baseUrl}/financial/invoice/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/financial/invoice/lists`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/financial/invoice/delete`, params, 'application/json')
}

// 收款
import { CollectionInfo } from '@/types/common'
const collection = {
  create: (params: CollectionInfo) => http.post(`${baseUrl}/financial/collection/save`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/financial/collection/lists`, params),
  delete: (params: DeleteParam) => http.post(`${baseUrl}/financial/collection/delete`, params, 'application/json')
}

// 审核
import { CheckInfo } from '@/types/common'
const check = {
  create: (params: CheckInfo) => http.post(`${baseUrl}/financial/check`, params, 'application/json'),
  list: (params: ListParam) => http.get(`${baseUrl}/financial/check/logs`, params),
  confirm: (params: { pid: string | number, complete_type: 1 | 2 | 3 | 4 | 5 | 6 | 7 }) => http.post(`${baseUrl}/financial/complete`, params, 'application/json')
}

// 单据列表 此接口包含所有单据列表信息，根据单号进行搜索
const allList = {
  forSeachId: (params: ListParam) => http.get(`${baseUrl}/order/document/code/lists`, params)
}
// 报价单
const price = {
  create: (params: any) => http.post(`${baseUrl}/quote/save`, params, 'application/json'),
  list: (params: any) => http.get(`${baseUrl}/quote/lists`, params),
  detail: (params: any) => http.get(`${baseUrl}/quote/detail`, params),
  delete: (params: any) => http.post(`${baseUrl}/quote/delete`, params, 'application/json')
}

const finance = {
  clientList: (params: any) => http.get(`${baseUrl}/financial/client/lists`, params),
  clientDetail: (params: any) => http.get(`${baseUrl}/financial/client/detail`, params)
}

export {
  price,
  login,
  authInfo,
  getToken,
  index,
  changeUserPasd,
  yarnType,
  yarnColor,
  product,
  partyB,
  user,
  order,
  store,
  stock,
  yarnOrder,
  yarnProcess,
  material,
  craft,
  deduct,
  bill,
  collection,
  check,
  print,
  allList,
  finance
}
