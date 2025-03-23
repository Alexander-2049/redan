/* eslint-disable @typescript-eslint/no-explicit-any */
export default function checkRequestedFields(
  obj: any,
  requestedFields: string[],
): boolean {
  // Helper function to check if a nested property exists
  const checkField = (fieldPath: string, obj: any): boolean => {
    const fieldParts = fieldPath.split(".");
    let currentObject = obj;

    for (const part of fieldParts) {
      if (
        currentObject &&
        typeof currentObject === "object" &&
        part in currentObject
      ) {
        currentObject = currentObject[part];
      } else {
        return false;
      }
    }

    return true;
  };

  // Iterate over the requested fields and check each one
  for (const field of requestedFields) {
    if (!checkField(field, obj)) {
      return false;
    }
  }

  return true;
}
