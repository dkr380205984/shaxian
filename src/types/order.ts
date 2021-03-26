import { OrderPro } from './product'
// 额外费用
interface AditionalFee {
  name: string
  price: string
  desc: string
}

export interface Order {
  order_code: string
  order_time: string
  delivery_time: string
  client_id: string | number
  client_name?: string
  total_price: string | number
  total_weight: string | number
  create_time?: string
  is_check?: number
  additional_fee: string | AditionalFee[]
  desc: HTMLElement | string
  process_log?: any[] // 统计加工信息用的加工日志
  product_info: OrderPro[]
}
