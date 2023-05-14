import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export const omitProps = <Obj extends object, Key extends PropertyKey>(
  obj: Obj,
  ...keys: Array<Key>
) => {
  const keyArray = new Set<PropertyKey>(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keyArray.has(k))
  ) as Prettify<DistributiveOmit<Obj, Key>>;
};
