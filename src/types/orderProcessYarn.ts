export interface YarnInfo {
  id?: number | string
  order_info_id: number | string // 订单里的纱线id
  order_number?: number | string // 下单数量
  weight: number | string // 订购数量
  reality_weight?: number | string // 实际订购数量
  color: string
  attribute: string
  price: number | string
}
export interface OrderYarn {
  code?: string // 系统生成
  order_id: string
  client_name?: string
  client_id: number | string
  child_data: YarnInfo[]
  order_time: string
  delivery_time: string
  common_price?: string | number
  common_attr?: string
  desc: string
}
