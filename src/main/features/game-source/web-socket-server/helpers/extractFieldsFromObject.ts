export function extractFieldsFromObject(fields: string[], obj: unknown): [string, unknown][] {
  const result: [string, unknown][] = [];

  // Ensure obj is an object; otherwise, treat it as an empty object
  if (!isObject(obj)) {
    return result;
  }

  fields.forEach(field => {
    if (typeof field !== 'string') {
      return;
    }
    const keys = field.split('.');
    let value: unknown = obj;

    for (const key of keys) {
      if (key.endsWith('[]')) {
        // Handle array fields
        const arrayKey = key.slice(0, -2);
        if (value && typeof value === 'object' && arrayKey in value) {
          const array = (value as Record<string, unknown>)[arrayKey];
          if (Array.isArray(array)) {
            const remainingKeys = keys.slice(keys.indexOf(key) + 1).join('.');
            const extractedArray = array.map(item =>
              extractFieldsFromObject([remainingKeys], item as Record<string, unknown>),
            );
            value = extractedArray.flat().map(([, v]) => v); // Flatten and extract values
          } else {
            value = undefined;
          }
        } else {
          value = undefined;
        }
        break;
      } else if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        value = undefined;
        break;
      }
    }

    if (value !== undefined) {
      result.push([field, value]);
    }
  });

  return result;
}

// Helper function to check if a value is an object
function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}
