/**
 * 设置单位
 */
export const setUnit = (n: string | number, unit: string = 'px') => {
  if (n === undefined || n === null) return undefined
  return typeof n === 'number' ? `${n}${unit}` : n;
}

/**
 * 获取数字S
 */
export const splitString = (n: string) => {
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
