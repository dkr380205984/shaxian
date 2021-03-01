export interface StoreDetailParams {
  id: number | null
}
export interface StoreCreateParams {
  id: number | null,
  name: string,
  type: 1 | 2,
  manager_data: Array<string | number>,
  second_data: Array<{ name: string, id: number | null }>,
  desc: string | null
}
export interface StoreListParams {
  limit?: number,
  page?: number,
  name: string | null,
  type: number | null
}
export interface StoreDetailYarnListParams {
  store_id: string,
  second_store_id: string | null,
  name: string | null,
  color: string | null,
  weight: 0 | null
}

// 订单调取库存
export interface OrderStoreInfo {
  order_id: string | number
  store_total_id: string | number
  total_weight: string | number
  desc: string
  child_data: Array<{
    order_info_id: string | number
    weight: string | number
  }>,
  [propName: string]: any
}
