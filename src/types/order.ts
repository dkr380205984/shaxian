import { OrderPro } from './product'
export interface Order {
  order_code: string
  order_time: string
  delivery_time: string
  client_id: string | number
  total_price: string | number
  total_weight: string | number
  desc: HTMLElement | string
  product_info: OrderPro[]
}
