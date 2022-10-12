import { parentTo, relativeTo } from "./constants";

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
export type Resume<R> = (result: R) => void;

export type Performed<R> = {
  then(resume: Resume<R>): void;
};

/**
 * The `perform` operator of algebraic effects.
 */
export type Perform<P extends readonly unknown[], R> = (...args: P) => Performed<R>;

export const performAs =
  <P extends readonly unknown[], R>(handle: (resume: Resume<R>, ...args: P) => void): Perform<P, R> =>
  (...args: P) => ({
    then: (resume) => handle(resume, ...args),
  });

export const chainPerform = <P extends readonly unknown[], R>(
  ...args: [perform: Perform<P, R>, payloads: P[], stopOn: (result: R) => boolean, fallback?: R]
): Performed<R> => {
  const [perform, payloads, stopOn, fallback] = args;
  const hasFallback = args.length > 3;
  const _perform = performAs((resume: Resume<R>, index: number) => {
    if (index === payloads.length) {
      if (!hasFallback) {
        return;
      }
      return resume(fallback!);
    }
    const payload = payloads[index]!;
    perform(...payload).then((value) => {
      if (stopOn(value)) {
        return resume(value);
      }
      _perform(index + 1).then(resume);
    });
  });
  return _perform(0);
};

export const performAll = <P extends readonly unknown[], R>(
  ingredients: P[],
  perform: Perform<P, R>
): Performed<R[]> => {
  const result: R[] = [];
  const restIndexes = new Set(ingredients.map((_, i) => i));
  const _perform = performAs((resume: Resume<R[]>) => {
    const testDone = () => {
      if (restIndexes.size === 0) {
        resume(result);
      }
    };
    testDone();
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i]!;
      perform(...ingredient).then((performed) => {
        result[i] = performed;
        restIndexes.delete(i);
        testDone();
      });
    }
  });
  return _perform();
};

export const isRelative = (path: string) => path.startsWith(relativeTo) || path.startsWith(parentTo);
export const trimSlash = (path: string) => path.replace(/[\\\/]$/, "");

export const proxyGlobalVariableForCode =
  <Env extends {}, R = unknown>(code: string, env: Env): (() => R) =>
  () => {
    const entries = Object.entries(env);
    const keys = entries.map(([key]) => key);
    const values = entries.map(([, value]) => value);
    return new Function(`${keys.join(",")}`, code).apply(globalThis, values);
  };
