/**
 * Represents a generic payload object.
 * The Payload interface allows any string key with any value type.
 *
 * This can be used to define objects that have dynamic keys and values,
 * providing flexibility in various situations where the shape of the object
 * is not known beforehand.
 *
 * @interface Payload
 * @property {any} [key: string] - A key-value pair where the key is of type string and the value can be of any type.
 */
export interface Payload {
  [key: string]: any;
}
