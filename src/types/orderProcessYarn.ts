export interface YarnInfo {
  id?: number | string
  name?: string
  order_info_id?: number | string // 订单里的纱线id ,采购单无
  order_number?: number | string // 下单数量
  weight: number | string // 订购数量
  reality_weight?: number | string // 实际订购数量
  color: string
  attribute: string
  price: number | string
}

// 额外费用
interface AditionalFee {
  name: string
  price: string
  desc: string
}

export interface OrderYarn {
  id?: string
  code?: string // 系统生成
  order_id?: string
  client_name?: string
  client_id: number | string
  child_data: YarnInfo[]
  is_check?: string
  order_time: string
  delivery_time: string
  additional_fee?: string | AditionalFee[]// 额外费用的JSON字符串
  common_price?: string | number
  common_attr?: string
  total_price?: string | number
  desc: string
}

interface ChildData {
  name: string
  before_color?: string
  after_color?: string
  before_attribute?: string
  after_attribute?: string
  color?: string
  attribute?: string
  price?: string | number
  weight: string | number
}
export interface ProcessYarn {
  order_id: number | string
  client_id: number | string
  type: string // 加工类型
  price?: number | string // 加工单价
  desc: string
  order_time: string
  delivery_time: string
  total_price?: string | number
  additional_fee?: string | AditionalFee[]// 额外费用的JSON字符串
  child_data: ChildData[]
}
