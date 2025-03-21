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
export const splitString = (n: string) => {
  const num = parseFloat(n)
  const unit = n.replace(num.toString(), '')
  return { num, unit: unit || 'px' }
}
