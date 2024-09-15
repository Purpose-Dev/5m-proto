import * as protobuf from "protobufjs";
import { Payload } from "./Payload";

/**
 * Verifies the given payload against the specified protobuf message type and
 * creates a new message if the payload is valid.
 *
 * @param {protobuf.Type} messageType - The protobuf message type to validate against.
 * @param {Payload} payload - The payload to be verified and used for creating the message.
 * @return {protobuf.Message} - The created protobuf message if the payload is valid.
 * @throws {Error} - If the payload does not conform to the protobuf message type.
 */
function verifyAndCreateMessage(
  messageType: protobuf.Type,
  payload: Payload,
): protobuf.Message {
  const errMsg = messageType.verify(payload);
  if (errMsg) throw Error(errMsg);
  return messageType.create(payload);
}

/**
 * Processes the given message by verifying and encoding it into a Uint8Array.
 *
 * @param {protobuf.Type} messageType - The protobuf message type to process.
 * @param {Payload} payload - The payload to be encoded into the protobuf message.
 * @return {Uint8Array} The encoded message as a Uint8Array.
 */
function processMessage(
  messageType: protobuf.Type,
  payload: Payload,
): Uint8Array {
  const message = verifyAndCreateMessage(messageType, payload);
  return messageType.encode(message).finish();
}

/**
 * Loads a protobuf file and encodes a message according to a specified message type.
 *
 * @param {string | string[]} protoFilePath - Path to the protobuf file(s) to be loaded.
 * @param {string | string[]} messageTypeName - The name(s) of the message type(s) to be encoded.
 * @param {Payload} payload - Object containing the data to be encoded.
 * @return {Promise<Uint8Array>} A Promise that resolves to the encoded message as a Uint8Array.
 */
export function loadAndEncodeMessage(
  protoFilePath: string | string[],
  messageTypeName: string | string[],
  payload: Payload,
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    protobuf.load(protoFilePath, (err: Error, root: protobuf.Root): void => {
      if (err) {
        reject(err);
      } else {
        try {
          const messageType = root.lookupType(messageTypeName);
          const buffer = processMessage(messageType, payload);
          resolve(buffer);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}
