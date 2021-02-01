export interface ProductDetail {
  id?: number | string
  pid?: number | string
  color: string
  attribute: string
  price: number | string
  edit?: boolean // 用于编辑操作
  desc: string
}
export interface Product {
  id?: number | string
  name: string
  yarn_type: string
  child_data: ProductDetail[]
}
