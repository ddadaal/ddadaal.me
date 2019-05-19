export function groupBy<T, K>(data: T[], keyFn: (t: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  data.forEach((data) => {
    const key = keyFn(data);
    if (map.has(key)) {
      map.get(key)!!.push(data);
    } else {
      map.set(key, [data]);
    }
  });

  return map;
}
