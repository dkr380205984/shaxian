export interface StoreDetailParams {
  id: number | null
}
export interface StoreCreateParams {
  id: number | null,
  name: string,
  type: 1 | 2,
  store_type: 1 | 2 // 1沙县仓库2毛条仓库
  manager_data: Array<string | number>,
  second_data: Array<{ name: string, id: number | null }>,
  desc: string | null
}
export interface StoreListParams {
  limit?: number,
  page?: number,
  store_type: number
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

// 入库
export interface StoreCreate {
  id?: string | number
  code?: string
  order_id?: string
  related_id?: string | number
  action_type: number | string
  select_id?: number[] | string
  desc: string
  complete_time: string
  client_id?: number | string
  client_name?: string
  store_id?: number | string
  store_name?: string
  second_store_id?: number | string
  second_store_name?: string
  child_data: StoreCreateChild[]
}

export interface StoreCreateChild {
  name: string | any[]
  move_second_store_id?: number | string // 移库时需要:移入仓库id
  move_store_id?: number | string
  action_weight: string | number
  color?: string
  attribute?: string
  color_code?: string
  vat_code?: string
  item: string // 件数
  related_info_id?: string
  desc?: string
}
