export function convertPixelsToBMP(pixels, width, height) {
  const headerSize = 14; // Size of BMP file header
  const dibHeaderSize = 40; // Size of DIB header for BITMAPINFOHEADER
  const bytesPerPixel = 3; // BMP is 24 bit per pixel -> 3 bytes
  const paddingPerRow = (4 - (width * bytesPerPixel % 4)) % 4; // Padding calc
  const pixelDataSize = height * (width * bytesPerPixel + paddingPerRow);
  const fileSize = headerSize + dibHeaderSize + pixelDataSize;

  const buffer = Buffer.alloc(fileSize);

  // BMP File Header
  buffer.write('BM'); // BM identifier
  buffer.writeUInt32LE(fileSize, 2);
  buffer.writeUInt32LE(headerSize + dibHeaderSize, 10); // Offset pixel data

  // DIB Header (BITMAPINFOHEADER)
  buffer.writeUInt32LE(dibHeaderSize, 14);
  buffer.writeInt32LE(width, 18);
  buffer.writeInt32LE(height, 22);
  buffer.writeUInt16LE(1, 26); 
  buffer.writeUInt16LE(bytesPerPixel * 8, 28);
  buffer.writeUInt32LE(0, 30); // No compression
  buffer.writeUInt32LE(pixelDataSize, 34); // Size of pixel data

  // Pixel Data
  let pixelDataOffset = headerSize + dibHeaderSize;
  for (let y = height - 1; y >= 0; y--) { // BMP saves data from bottom
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4; // Index in RGBA array
      buffer[pixelDataOffset++] = pixels[i + 2]; // Blue
      buffer[pixelDataOffset++] = pixels[i + 1]; // Green
      buffer[pixelDataOffset++] = pixels[i]; // Red
    }
    pixelDataOffset += paddingPerRow; // Add padding
  }

  return buffer;
}
