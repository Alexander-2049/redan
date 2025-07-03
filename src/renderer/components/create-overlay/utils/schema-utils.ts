/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { GameSchema } from '@/shared/types/GameSchema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeSchemas(schemas: GameSchema[]): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const merged: Record<string, any> = {};

  schemas.forEach(schema => {
    // Remove the 'game' field and merge the rest
    const { game, ...schemaData } = schema;
    deepMerge(merged, schemaData);
  });

  return merged;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(target: Record<string, any>, source: Record<string, any>): void {
  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (Array.isArray(sourceValue)) {
      // Handle arrays - merge array schemas
      if (!target[key]) {
        target[key] = [...sourceValue];
      } else if (Array.isArray(targetValue) && sourceValue.length > 1 && targetValue.length > 1) {
        // Merge array item schemas
        const mergedArrayItem = {};
        deepMerge(mergedArrayItem, targetValue[1]);
        deepMerge(mergedArrayItem, sourceValue[1]);
        target[key] = [sourceValue[0], mergedArrayItem];
      }
    } else if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      // Handle objects
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
        target[key] = {};
      }
      deepMerge(target[key], sourceValue);
    } else {
      // Handle primitives - source takes precedence
      target[key] = sourceValue;
    }
  });
}
