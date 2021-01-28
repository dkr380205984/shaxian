export interface ProductDetail {
  color: string
  attribute: string
  price: number | string
  desc: string
}
export interface Product {
  name: string
  yarn_type: string
  child_data: ProductDetail[]
}
