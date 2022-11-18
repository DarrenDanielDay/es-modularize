import { parentTo, relativeTo } from "./constants.js";

export type Static<T extends {}> = Pick<T, keyof T>;
export type Func<T extends (...args: readonly never[]) => unknown> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>;
export type DeepPartial<T> = T extends string | number | boolean | undefined | null | symbol | bigint
  ? T
  : T extends Static<infer S> & Func<infer F>
  ? DeepPartial<S> & F
  : { -readonly [K in keyof T]?: DeepPartial<T[K]> };

export const die = (message?: string, ErrorCtor: new (message?: string) => Error = Error) => {
  throw create(ErrorCtor, message);
};

export const warn = <T extends unknown>(message: string, value: T): T => {
  console.warn(message);
  return value;
};

export const create = <C extends new (...args: never[]) => unknown>(
  ctor: C,
  ...args: ConstructorParameters<C>
): InstanceType<C> =>
  // @ts-expect-error Dynamic Implementation
  new ctor(...args);

export const virgin = () => Object.create(null);

export const getStringTag = (content: unknown) => Object.prototype.toString.call(content);
export const isRelative = (path: string) => path.startsWith(relativeTo) || path.startsWith(parentTo);
export const toRelative = (base: string, full: string) => full.replace(create(RegExp, `^${base}/`), relativeTo);
export const trimSlash = (path: string) => path.replace(/[\\\/]$/, "");

export const proxyGlobalVariableForCode = <Env extends {}, R = unknown>(code: string, env: Env): (() => R) => {
  const entries = Object.entries(env);
  const keys = entries.map(([key]) => key);
  const values = entries.map(([, value]) => value);
  const func = create(Function, `${keys.join(",")}`, code);
  return () => {
    return func.apply(globalThis, values);
  };
};
