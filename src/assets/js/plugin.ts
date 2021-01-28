import store from '../../store/index'
interface MapTitle {
  title: string
  key: string
}
interface CheckCommonInfo {
  checkWhich: string // 需要的公告数据
  getInfoMethed?: string // commit or dispatch,api一般都是异步，用dispatch调用，status一般是同步，用commit调用,默认就是dispatch
  getInfoApi: string // 没有公共数据的时候需要调用的函数
}
const plugin = {
  getDataType(data: any) {
    if (data === null) {
      return 'Null'
    } else if (data === undefined) {
      return 'Undefined'
    }
    return Object.prototype.toString.call(data).split(' ')[1].split(']')[0]
  },
  clone<T extends any[]>(data: T): T {
    const selfThis = plugin
    const type = selfThis.getDataType(data)
    let newData = null
    if (type === 'Array') {
      newData = [] as any
      data.forEach((item: any, index: any) => {
        newData[index] = selfThis.clone(item)
      })
    } else if (type === 'Object') {
      newData = {} as any
      let index: any
      for (index of Object.keys(data)) {
        newData[index] = selfThis.clone(data[index])
      }
    } else {
      newData = data ? JSON.parse(JSON.stringify(data)) : data
    }
    return newData
  },
  getHash(hashStr: string): object {
    const json = {} as any
    const params = hashStr.split('&&')
    params.forEach((item) => {
      const arr = item.split('=')
      json[arr[0]] = arr[1]
    })
    return json
  },
  mergeData: (datas: any[], rule: any) => {
    const selfThis = plugin
    const data = selfThis.clone(datas)
    const newData: any[] = []
    if (selfThis.getDataType(data) === 'Array') {
      data.forEach((item: any) => {
        const ruleType = selfThis.getDataType(rule.mainRule)
        const flag = newData.find((value: any) => {
          if (ruleType === 'Array') { // 处理根据多个key合并的情况
            const itemStr: any[] = []
            const valueStr: any[] = []
            rule.mainRule.forEach((itemMain: string) => {
              const mainName = itemMain.split('/')
              itemStr.push(item[mainName[0]])
              valueStr.push(value[mainName[1] || mainName[0]])
            })
            return itemStr.join('/') === valueStr.join('/')
          } else if (ruleType === 'String') {
            const mainName = rule.mainRule.split('/')
            return value[mainName[1] || mainName[0]] === item[mainName[0]]
          }
        }) as any
        const cloneItem = selfThis.clone(item) // clone其他项数据以方便保留
        if (!flag) {
          const obj = {} as any
          if (ruleType === 'Array') {
            rule.mainRule.forEach((itemRule: any) => {
              const mainName = itemRule.split('/')
              obj[mainName[1] || mainName[0]] = item[mainName[0]]
              delete cloneItem[mainName[0]]
            })
          } else if (ruleType === 'String') {
            const mainName = rule.mainRule.split('/')
            obj[mainName[1] || mainName[0]] = item[mainName[0]]
            delete cloneItem[mainName[0]]
          }
          if (selfThis.getDataType(rule.otherRule) === 'Array' && rule.otherRule.length > 0) {
            rule.otherRule.forEach((itemRule: any) => {
              const otherName = itemRule.name.split('/')
              obj[otherName[1] || otherName[0]] = item[otherName[0]]
              delete cloneItem[otherName[0]]
            })
          }
          if (rule.childrenName) {
            obj[rule.childrenName] = [cloneItem]
          } else {
            obj.childrenMergeInfo = [cloneItem]
          }
          newData.push(obj)
        } else {
          if (ruleType === 'Array') {
            rule.mainRule.forEach((itemMain: any) => {
              const mainName = itemMain.split('/')
              delete cloneItem[mainName[0]]
            })
          } else if (ruleType === 'String') {
            const mainName = rule.mainRule.split('/')
            delete cloneItem[mainName[0]]
          }
          if (selfThis.getDataType(rule.otherRule) === 'Array' && rule.otherRule.length > 0) {
            rule.otherRule.forEach((itemRule: any) => {
              const otherName = itemRule.name.split('/')
              delete cloneItem[otherName[0]]
              if (itemRule.type === 'add') {
                flag[otherName[1] || otherName[0]] = (Number(flag[otherName[1] || otherName[0]]) || 0) +
                  (Number(item[otherName[0]]) || 0)
              } else if (itemRule.type === 'concat') {
                flag[otherName[1] || otherName[0]] = flag[otherName[1] || otherName[0]].concat(item[otherName[0]])
              }
            })
          }
          if (rule.childrenName) {
            flag[rule.childrenName].push(cloneItem)
          } else {
            flag.childrenMergeInfo.push(cloneItem)
          }
        }
      })
      if (rule.childrenRule) {
        newData.forEach((item: any) => {
          item[rule.childrenName || 'childrenMergeInfo'] = selfThis.mergeData(item[rule.childrenName || 'childrenMergeInfo'], rule.childrenRule)
        })
      }
    } else {
      const type = selfThis.getDataType(data)
      throw new TypeError('An unknown error occurred from the mergeData function, and the parameter "data" expects to get an "array" but gets an "' + type + '"')
    }
    return newData
  },
  // 日期相差时间
  diffDate(date: DateConstructor): string {
    if (!date) {
      return '日期格式错误'
    }
    const now = Date.parse(new Date().toString())
    const past = Date.parse(date.toString())
    const diff = now - past
    if ((diff / (24 * 60 * 60 * 1000)) > 30) {
      return '超过30天'
    } else if ((diff / (24 * 60 * 60 * 1000)) <= 30 && (diff / (24 * 60 * 60 * 1000)) > 1) {
      return parseInt((diff / (24 * 60 * 60 * 1000)).toString(), 0) + '天前'
    } else {
      if (diff / (60 * 60 * 1000) > 1) {
        return parseInt((diff / (60 * 60 * 1000)).toString(), 0) + '小时前'
      } else {
        if (diff / (60 * 1000) > 3) {
          return parseInt((diff / (60 * 1000)).toString(), 0) + '分钟前'
        } else {
          return '刚刚'
        }
      }
    }
  },
  getDate(date: Date): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day)
  },
  downloadExcel(data: any[], mapTitle: MapTitle[], excelName: string) {
    const orderElement = ''
    const aLink = document.createElement('a')
    const excelHeader = '<tr>' + mapTitle.map((item) =>
      '<td style="text-align:left">' + item.title + '</td>').join('') + '</tr>'
    const excelContent = data.map((itemData) => {
      return '<tr>' + mapTitle.map((itemTitle) =>
        '<td style="text-align:left">' + ((itemData[itemTitle.key] !== 0 && !itemData[itemTitle.key]) ?
          '' : itemData[itemTitle.key]) + '</td>').join('') + '</tr>'
    })
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
                      xmlns:x="urn:schemas-microsoft-com:office:excel"
                      xmlns="http://www.w3.org/TR/REC-html40">
                <meta http-equiv="content-type" content="application/vnd.ms-excel; charset="UTF-8">
                <head>
                  <!--[if gte mso 9]>
                  <xml>
                  <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                      <x:ExcelWorksheet>
                        <x:Name>${excelName || 'worksheet1'}</x:Name>
                        <x:WorksheetOptions>
                          <x:DisplayGridlines/>
                        </x:WorksheetOptions>
                      </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                  </x:ExcelWorkbook>
                  </xml>
                  <![endif]-->
                </head>
                <body>
                  ${orderElement}
                  <table>${excelHeader}${excelContent.join('')}</table>
                </body>
              </html>`
    const url = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html)
    aLink.href = url
    aLink.download = (excelName ? excelName + '-' : '') + new Date().getTime() + '.xls'
    aLink.click()
  },
  checkCommonInfo(info: CheckCommonInfo[]) {
    info.forEach((item) => {
      const checkInfo = item.checkWhich.split('/')
      if (!store.state[checkInfo[0]][checkInfo[1]].status) {
        if (item.getInfoMethed && item.getInfoMethed === 'commit') {
          store.commit(checkInfo[0] + '/' + item.getInfoApi)
        } else {
          store.dispatch(checkInfo[0] + '/' + item.getInfoApi)
        }
      }
    })
  },
  addItem<T>(father: T[], son: T): void {
    father.push(son)
  },
  deleteItem(father: any[], index: number) {
    father.splice(index, 1)
  }
}

export default {
  install: (Vue: any) => {
    Vue.prototype.$getHash = plugin.getHash
    Vue.prototype.$clone = plugin.clone
    Vue.prototype.$getDataType = plugin.getDataType
    Vue.prototype.$mergeData = plugin.mergeData
    Vue.prototype.$diffDate = plugin.diffDate
    Vue.prototype.$getDate = plugin.getDate
    Vue.prototype.$downloadExcel = plugin.downloadExcel
    Vue.prototype.$checkCommonInfo = plugin.checkCommonInfo
    Vue.prototype.$addItem = plugin.addItem
    Vue.prototype.$deleteItem = plugin.deleteItem
  }
}
