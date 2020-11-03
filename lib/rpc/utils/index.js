export const arrayBufferToString = buffer => String.fromCharCode.apply(null, new Uint8Array(buffer))

export const stringToArrayBuffer = string => {
  const buffer = new ArrayBuffer(string.length * 2)
  const bufferView = new Uint8Array(buffer)
  for (let i = 0, stringLength = string.length; i < stringLength; i++) {
    bufferView[i] = string.charCodeAt(i)
  }
  return buffer
}
