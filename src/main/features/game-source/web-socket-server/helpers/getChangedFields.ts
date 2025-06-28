import { extractFieldsFromObject } from './extractFieldsFromObject';

export function getChangedFields(
  fields: string[],
  oldObj: unknown,
  newObj: unknown,
): [string, unknown][] {
  // Ensure fields is a valid array
  if (!Array.isArray(fields)) {
    throw new Error('Fields must be an array of strings.');
  }

  // Treat non-object or null values as empty objects
  const oldFields = extractFieldsFromObject(fields, isObject(oldObj) ? oldObj : {});
  const newFields = extractFieldsFromObject(fields, isObject(newObj) ? newObj : {});

  const changedFields: [string, unknown][] = [];

  fields.forEach(field => {
    const oldValue = oldFields.find(([key]) => key === field)?.[1];
    const newValue = newFields.find(([key]) => key === field)?.[1];

    // Perform a deep equality check
    if (!deepEqual(oldValue, newValue)) {
      changedFields.push([field, newValue]);
    }
  });

  return changedFields;
}

// Helper function to check if a value is an object
function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

// Helper function to perform deep equality check
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
      return false;
    }

    return aKeys.every(key => deepEqual(a[key], b[key]));
  }

  return false;
}
