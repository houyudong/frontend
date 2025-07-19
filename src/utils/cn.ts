/**
 * 类名合并工具函数
 * 
 * 用于合并和处理CSS类名
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
