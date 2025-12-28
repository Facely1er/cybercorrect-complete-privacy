import clsx from 'clsx';
import type { ClassValue } from 'clsx/types';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  // Deep-flatten arrays and filter out empty/whitespace-only strings
  const flatten = (values: unknown[]): unknown[] => {
    const result: unknown[] = [];
    for (const v of values) {
      if (Array.isArray(v)) {
        result.push(...flatten(v));
      } else if (typeof v === 'string') {
        const trimmed = v.trim();
        if (trimmed) result.push(trimmed);
      } else if (v != null) {
        result.push(v);
      }
    }
    return result;
  };

  return twMerge(clsx(...(flatten(inputs) as ClassValue[])));
}
