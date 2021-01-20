export interface ListParam {
  page?: number
  limit?: number
  [propName: string]: any
}
export interface DetailParam {
  id?: number | string | number[] | string[]
  [propName: string]: any
}

export interface DeleteParam {
  id?: number | string
  [propName: string]: any
}
