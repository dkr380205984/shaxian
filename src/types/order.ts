import { OrderPro } from './product'
import { StoreCreateChild } from './store'
// 额外费用
interface AditionalFee {
  name: string
  price: string
  desc: string
}

export interface Order {
  code?: string
  order_code: string
  order_time: string
  delivery_time: string
  store_id?: string | number // 销售出库的时候填的
  client_id: string | number
  client_name?: string
  total_price: string | number
  total_weight: string | number
  create_time?: string
  is_check?: number
  additional_fee: string | AditionalFee[]
  total_additional_fee: number
  desc: HTMLElement | string
  process_log?: any[] // 统计加工信息用的加工日志
  product_info: OrderPro[],
  file_url?: string,
  reduce_store_data?: Array<{
    store_id: number | string
    second_store_id: number | string
    child_data: StoreCreateChild[]
  }>
}
