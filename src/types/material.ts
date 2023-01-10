export interface MaterialInfo {
  id?: number | string
  type_id?: string
  name: string | string[]
  rel_type?: any[]
  price: string | number
  store?: string | number
  attribute?: string
  user_name?: string
  weight?: string
  desc?: string
  batch_code?: string
  push_weight?: number | string
}

export interface CraftInfo {
  push_weight?: string | number
  code?: string
  id?: number
  is_draft: number
  client_id: number | string
  order_time: string
  yarn_name?: string
  yarn_id: number | string | string[]
  color: string
  attribute: string
  weight: string
  date: string // 原料供应日期
  desc: string // 原料供应说明
  mass_demand: string // 质量要求
  shifangzhishu: string // 实纺支数
  danshaniandu: string // 单绞捻度
  dansha_deviation_desc: string // 单绞捻度备注
  shuangshaniandu: string // 双绞捻度
  shuangsha_deviation_desc: string // 双绞捻度备注
  kuangchang: string // 框长
  kuangchang_desc: string // 框长备注
  meijiao: string // 每绞克重
  yaojiao_net_weight: string | number // 摇纱净重
  yaojiao_gross_weight: string // 摇纱毛重
  tongsha_net_weight: string // 筒纱净重
  tongsha_gross_weight: string // 筒纱毛重
  pack_desc: string // 包装备注
  complete_rate: string // 支撑率
  complete_rate_desc: string // 支撑率备注
  process_fee: string // 加工费
  process_fee_desc: string // 加工费备注
  delivery_time: string // 交货时间
  delivery_desc: string // 交货备注
  special_desc: string // 特别备注
  material_info: Array<{
    material_type_id: string | number
    material_id: string[] | string
    proportion1: string
    proportion2: string
  }>
}

// 额外费用
interface AditionalFee {
  name: string
  price: string
  desc: string
}

export interface OrderMaterialInfo {
  id?: string
  code?: string // 系统生成
  client_name?: string
  client_id: number | string
  child_data: MaterialInfo[]
  order_time: string
  delivery_time: string
  total_additional_fee?: string | number
  additional_fee?: string | AditionalFee[]// 额外费用的JSON字符串
  total_price?: string | number
  file_url?: string
  is_check?: string | number
  desc: string
}
