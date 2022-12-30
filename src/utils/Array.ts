export default function range(start = 0, end = 0): number[] {
  const result = [] as number[];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
