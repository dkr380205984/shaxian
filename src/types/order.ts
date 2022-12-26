import { OrderPro } from './product'
import { StoreCreateChild } from './store'
import { DeductInfo } from '@/types/common'
import { StoreCreate } from '@/types/store'
// 额外费用
interface AditionalFee {
  name: string
  price: string
  desc: string
}

export interface Order {
  total_weight_sale?: string | number
  total_price_sale?: string | number
  code?: string
  order_code: string
  order_time: string
  settle_type?: string
  delivery_time: string
  store_id?: string | number // 销售出库的时候填的
  client_id: string | number
  client_name?: string
  total_price: string | number
  total_weight: string | number
  create_time?: string
  is_check?: number
  status?: number
  additional_fee: string | AditionalFee[]
  total_additional_fee: number
  desc: HTMLElement | string
  deduct?: any[]// 扣款单
  process_log?: any[]// 统计加工信息用的加工日志
  purchase_log?: any[]// 统计采购信息用的
  transfer_log?: any[]// 调取单日志
  total_purchase_weight?: any
  product_info: OrderPro[]
  file_url?: string,
  reduce_store_data?: Array<{
    store_id: number | string
    second_store_id: number | string
    child_data: StoreCreateChild[]
  }>
}

export interface CancelOrder {
  pid?: string | number
  order_id: string
  cancel_reason: string
  cancel_date: string
  file: string
  client_fee: string
  store_data?: StoreCreate[]
  deduct_data: DeductInfo
  document_type: number // 1采购 2加工 3毛条采购 4毛条加工 5订单 6扣款 7调取 8报价 9开票 10结算
}
