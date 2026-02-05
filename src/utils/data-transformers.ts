import type { CamelToSnake, SnakeToCamel } from '@/types/utility_types'

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function transformKeys<T>(
  obj: T,
  keyTransformer: (key: string) => string,
  recurse: (value: unknown) => unknown,
): unknown {
  if (Array.isArray(obj)) return obj.map(recurse)
  if (obj === null || typeof obj !== 'object') return obj

  return Object.entries(obj as Record<string, unknown>).reduce<
    Record<string, unknown>
  >((acc, [key, value]) => {
    acc[keyTransformer(key)] = recurse(value)
    return acc
  }, {})
}

type Transformable = Record<string, unknown> | Record<string, unknown>[]

export const transformers = {
  fromDatabase: <T extends Transformable>(obj: T): SnakeToCamel<T> => {
    return transformKeys(
      obj,
      snakeToCamel,
      (value) =>
        typeof value === 'object' && value !== null
          ? transformers.fromDatabase(value as Record<string, unknown>)
          : value,
    ) as SnakeToCamel<T>
  },

  toDatabase: <T extends Transformable>(obj: T): CamelToSnake<T> => {
    return transformKeys(
      obj,
      camelToSnake,
      (value) =>
        typeof value === 'object' && value !== null
          ? transformers.toDatabase(value as Record<string, unknown>)
          : value,
    ) as CamelToSnake<T>
  },
}
