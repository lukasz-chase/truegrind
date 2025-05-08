export const areObjectsDifferent = (obj1: any, obj2: any): boolean => {
  if (typeof obj1 !== "object" || obj1 === null) {
    return obj1 !== obj2; // Direct comparison for non-objects
  }

  if (typeof obj2 !== "object" || obj2 === null) {
    return true; // If one is object and the other is not
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if keys length differs
  if (keys1.length !== keys2.length) {
    return true;
  }

  // Check each key recursively
  return keys1.some((key) => areObjectsDifferent(obj1[key], obj2[key]));
};
