/**
 * Extracts data from a nested object, preserving the structure.
 *
 * @param {object} obj - The input object to extract data from.
 * @return {Record<string, any>} A new object with the same data but reconstructed to remove any nested references.
 */
export function extractData(obj: object): Record<string, any> {
  const result: Record<string, any> = {};

  function recursiveExtract(currentObject: any, path: string[] = []): any {
    if (Array.isArray(currentObject)) {
      const tempObject: Record<string, any> = {};
      currentObject.forEach((item, index) => {
        tempObject[index] = recursiveExtract(item, path.concat(String(index)));
      });
      return tempObject;
    } else if (typeof currentObject === "object" && currentObject !== null) {
      const tempObject: Record<string, any> = {};
      for (const key of Object.keys(currentObject)) {
        const value = currentObject[key];
        tempObject[key] = recursiveExtract(value, path.concat(key));
      }
      return tempObject;
    } else {
      return currentObject;
    }
  }

  const extractedObject = recursiveExtract(obj);
  Object.assign(result, extractedObject);

  return result;
}
