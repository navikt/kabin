/** Checks if the given object has the given property. */
export const hasOwn = <T extends object, K extends PropertyKey>(obj: T, key: K): obj is T & Record<K, unknown> =>
  Object.hasOwn(obj, key);
