export const isFunction = (func: unknown): func is (...args: any[]) => boolean => typeof func === 'function';

export const isClass = (func: unknown) => typeof func === 'function' && /^class\s/.test(func.toString());
