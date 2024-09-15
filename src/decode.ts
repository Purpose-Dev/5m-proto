import * as protobuf from "protobufjs";

/**
 * Converts a decoded protobuf message to a plain JavaScript object.
 *
 * @param {protobuf.Type} messageType - The protobuf type definition.
 * @param {protobuf.Message} message - The decoded protobuf message instance.
 * @return {object} The converted plain JavaScript object representation of the message.
 */
function convertDecodedToObject(
  messageType: protobuf.Type,
  message: protobuf.Message,
): object {
  return messageType.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
  });
}

/**
 * Decodes a buffer using the specified protobuf schema.
 *
 * @param {Uint8Array} buffer - The buffer containing the encoded data.
 * @param {string|string[]} protoFilePath - The path(s) to the protobuf file(s).
 * @param {string|string[]} messageTypeName - The name(s) of the protobuf message type(s) to decode.
 * @return {Promise<object>} - A promise that resolves to the decoded object.
 */
export async function decodeBuffer(
  buffer: Uint8Array,
  protoFilePath: string | string[],
  messageTypeName: string | string[],
): Promise<object> {
  try {
    const root = await protobuf.load(protoFilePath);
    const messageType = root.lookupType(messageTypeName);
    const message = messageType.decode(buffer);
    return convertDecodedToObject(messageType, message);
  } catch (err) {
    throw Error(err);
  }
}
