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
  yarn_type: string
  child_data: ProductDetail[]
}

export interface OrderPro {
  product_id: string | number
  product_name?: string
  child_data: ProductDetail[]
}
