export function snakeToCamel<T extends Record<string, unknown>>(obj: T): unknown {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()), v]),
  );
}

export function camelToSnake<T extends Record<string, unknown>>(obj: T): unknown {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`), v]),
  );
}
