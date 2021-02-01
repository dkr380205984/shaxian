import { Product } from './product'
export interface Order {
  order_code: string
  order_time: string
  delivery_time: string
  client_id: string | number
  total_price: string | number
  desc: string
  product_info: Product[]
}