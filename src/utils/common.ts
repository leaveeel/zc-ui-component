/**
 * 设置单位
 */
export const setUnit = (n: string | number, unit: string = 'px') => {
  const reg = /^[-]?\d+(\.\d+)?$/i
  return reg.test(n.toString()) ? n.toString() + unit : n
}

/**
 * 获取数字S
 */
export const splitString = (n: string | number) => {
  if (typeof n === 'number') return { num: n, unit: ''}

  const num = parseFloat(n)
  const unit = n.replace(num.toString(), '')
  return { num, unit: unit || 'px' }
}

export const useDocument = () => {
  if (typeof window !== 'undefined') {
    return document
  }
  return null
}


export const DateFormat = (date: Date | string, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  if (!date) return ''
  const opt: {[propName: string]: string} = {
    'y+': new Date(date).getFullYear().toString(),
    'M+': (new Date(date).getMonth() + 1).toString(),
    'd+': new Date(date).getDate().toString(),
    'h+': new Date(date).getHours().toString(),
    'm+': new Date(date).getMinutes().toString(),
    's+': new Date(date).getSeconds().toString()
  }
  for (const k in opt) {
    const ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      if (/(y+)/.test(k)) {
        fmt = fmt.replace(ret[1], opt[k].substring(4 - ret[1].length))
      } else {
        fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
      }
    }
  }
  return fmt
}