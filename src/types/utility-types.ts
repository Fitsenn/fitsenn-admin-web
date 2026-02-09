type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${P1}${Uppercase<P2>}${CamelCase<P3>}`
  : S;

type SnakeCase<S extends string> = S extends `${infer P1}${infer P2}`
  ? P2 extends Uncapitalize<P2>
    ? `${Lowercase<P1>}${SnakeCase<P2>}`
    : `${Lowercase<P1>}_${SnakeCase<P2>}`
  : S;

export type SnakeToCamel<T> = T extends Array<infer U>
  ? Array<SnakeToCamel<U>>
  : T extends Record<string, unknown>
    ? { [K in keyof T as K extends string ? CamelCase<K> : K]: SnakeToCamel<T[K]> }
    : T;

export type CamelToSnake<T> = T extends Array<infer U>
  ? Array<CamelToSnake<U>>
  : T extends Record<string, unknown>
    ? { [K in keyof T as K extends string ? SnakeCase<K> : K]: CamelToSnake<T[K]> }
    : T;

export type Replace<T, R> = Omit<T, keyof R> & R;

