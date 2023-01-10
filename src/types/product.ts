export interface ProductDetail {
  id?: number | string
  pid?: number | string
  color: string
  attribute: string
  price: number | string
  edit?: boolean // 用于编辑操作
  number_attribute?: string // 订单里的98纱足金纱属性
  weight?: string | number // 订单里的数量
  desc?: string
} 
export interface Product {
  id?: number | string
  name: string
  yarn_type?: string | any[]
  yarn_type_name?: string
  rel_type?: any
  type_name?: string
  updated_at?: any
  price?: string
  attribute?: string
  desc?: string
  user?: any
  user_name?: string
  child_data: ProductDetail[]
}

export interface OrderPro {
  name?: string | number | any[]
  product_name?: string
  child_data: ProductDetail[]
  process_info?: any[]
}
