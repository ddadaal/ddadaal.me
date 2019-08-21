export default function containsChinese(content: string): boolean {
  return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(content);
}
