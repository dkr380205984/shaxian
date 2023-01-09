export interface Customer {
  name: string
  abbreviation: string
  dirctor: string
  phone: string
  address: string
  contacts: string
  contactNumber: string
}

export interface User {
  id: number | null
  name: string
  user_name: string
  phone: string
  station: string // 岗位
  is_admin: 1 | 2 // 权限
  module_info: string  // 模块JSON.stringify()
  status?: boolean
}

export interface YarnType {
  id: number | null
  name: string,
  [key: string]: any
}

export interface PartyB {
  client_id?: any
  total_weight?: any
  total_price?: any
  real_total_weight?: any
  real_total_price?: any
  collection_total_price?: any
  invoice_total_price?: any
  deduct_total_price?: any
  invoice_wait?: any
  client_name?: string
  id: number | null
  name: string
  code?: string
  abbreviation: string
  client_type?: string
  user_name: string
  phone: string
  address: string
  contact: string
  contact_phone: string
  status?: boolean | number
  type?: 1 | 2 | 3
}

export interface Color {
  id: number | null
  name: string,
  [key: string]: any
}

export interface Store {
  id: number | null
  name: string
  type: 1 | 2 // 1本厂仓库2染厂仓库
  store_type: 1 | 2 // 1沙县仓库2毛条仓库
  admins: Array<string | number>
  LV2_info: Array<{ name: string, id: number | null }>
  desc: string
  checked?: boolean
  total_weight?: number
}
export interface StoreDetail {
  id: number
  name: string
  type: 1 | 2
  manager_data: Array<{ name: string, user_id: number | string }>
  second_data: Array<{ id: number, store_id?: number, name: string }>
  create_time: Date | null,
  user_name: string
  related_id?: number
  desc: string | null
}

export interface MaterialType {
  id?: number | string | null
  name: string
}

// 扣款信息
export interface DeductInfo {
  id?: any
  index?: any
  code?: string
  reason?: string
  deduct_type?: 1 | 2 | 3 | 4 | 5 // 1纱线定够 2沙县加工 3毛条定够 4毛条加工 5订单
  pid?: string | number
  type?: 1 | 2
  // 1 采购单,2 加工单,3 毛条采购单,4 毛条加工单,5 订单,6 扣款单,7 调取单,8 报价单,9 开票单,10 结算单,
  rel_doc_type?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  rel_doc_id?: number | string | undefined | null
  client_id?: string | number | undefined | null
  total_price?: string | number
  deduct_content?: string
  deduct_file?: string
  date?: string
  desc?: string
}

export interface ListSetting {
  key: string
  otherkey?: string // 如不显示产品编号就显示系统编号
  name: string
  ifShow: boolean
  ifLock: boolean
  ifCaogao?: string // 标记草稿
  caogaoArr?: string[] // 标记字符
  ifImage?: boolean // 是否是图片特殊格式
  errVal?: string // 数据为空时显示信息
  from?: string // 隶属于某数组对象，常用于一个订单有多个产品
  mark?: boolean // 在有数组对象的时候标记哪个字段需要箭头
  index: number
  numberToString?: boolean // 是否要转成带逗号的字符串
  unit?: string // 有些情况下需要单位
  unitKey?: string // 有些情况下单位在字段里
  filterArr?: string[] // 通常用于用于状态适配，如status = 1|2|3 filterArr:['待审核','已审核','未通过']
  class?: string // 用于改字体颜色用的
  classArr?: string[] // 一般配合filterArr一起用，不同状态用不同颜色标记
  isCheck?: boolean
  isStatus?: boolean // 给订单状态专门设置的
  isProgress?: boolean // 给订单进度专门设置的
  specialForOrderPrcess?: 'order' | 'sampleOrder' // 订单样单流程专用，理论上不应该出现在组件里
  is_urgent?: boolean // 订单样单加急状态专用
}

// 开票信息
export interface BillInfo {
  id?: any
  code?: any
  user_name?: any
  invoice_code?: string
  client_id: string | number | undefined
  invoice_type: 1 | 2 | 3 | 4 | 5
  type?: 1 | 2
  pid: string[]
  invoice_price: string | number
  invoice_date: string
  file_url: string | null
  desc: string
}
// 收款信息
export interface CollectionInfo {
  id?: any
  invoice_date?: any
  user_name?: any
  code?: any
  client_id: string | number | undefined
  collect_type: 1 | 2 | 3 | 4 | 5
  pid: string[]
  collect_price: string | number
  collect_date: string
  file_url: string | null
  collect_or_pay: number
  type: string // 收款方式
  desc: string
}
// 审核信息
export interface CheckInfo {
  id?: number
  pid: number | string // 关联id
  is_check: 1 | 2 // 1审核通过，2驳回
  check_type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 // 1纱线订购 2纱线加工 3毛条订购 4毛条加工 5 订单 6 扣款单 7 调取单 8 报价单
  check_desc: string // 常见驳回理由
  desc: string // 备注信息
  user_name?: string
  create_time?: string
}

export interface Print {
  id: number | null,
  [key: string]: any
}
