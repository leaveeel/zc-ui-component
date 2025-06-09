/**
 * 判断是否为闰年
 * @param year 年份
 * @returns 是否为闰年
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * 获取指定年份和月份的天数 (月份从 1 开始)
 * @param year 年份
 * @param month 月份 (1-12)
 * @returns 天数
 */
export function getDaysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    throw new Error('Invalid month');
  }
  const days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeapYear(year)) {
    days[2] = 29;
  }
  return days[month];
}

/**
 * 获取指定日期的星期几 (0-6, 0为周日)
 * @param year 年份
 * @param month 月份 (1-12)
 * @param day 日期
 * @returns 星期几 (0-6)
 */
export function getDayOfWeek(year: number, month: number, day: number): number {
  const date = new Date(year, month - 1, day);
  return date.getDay();
}