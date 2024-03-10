export function convertPixelsToBMP(pixels, width, height) {
  const headerSize = 14; // Velikost BMP file headeru
  const dibHeaderSize = 40; // Velikost DIB headeru pro BITMAPINFOHEADER
  const bytesPerPixel = 3; // BMP je 24 bitů na pixel, tedy 3 bajty
  const paddingPerRow = (4 - (width * bytesPerPixel % 4)) % 4; // Vypočet paddingu pro zarovnání řádků
  const pixelDataSize = height * (width * bytesPerPixel + paddingPerRow);
  const fileSize = headerSize + dibHeaderSize + pixelDataSize;

  const buffer = Buffer.alloc(fileSize);

  // BMP File Header
  buffer.write('BM'); // BM identifikátor
  buffer.writeUInt32LE(fileSize, 2); // Velikost souboru
  buffer.writeUInt32LE(headerSize + dibHeaderSize, 10); // Offset pixel data

  // DIB Header (BITMAPINFOHEADER)
  buffer.writeUInt32LE(dibHeaderSize, 14); // Velikost DIB headeru
  buffer.writeInt32LE(width, 18); // Šířka
  buffer.writeInt32LE(height, 22); // Výška
  buffer.writeUInt16LE(1, 26); // Planes
  buffer.writeUInt16LE(bytesPerPixel * 8, 28); // Bitů na pixel
  buffer.writeUInt32LE(0, 30); // Bez komprese
  buffer.writeUInt32LE(pixelDataSize, 34); // Velikost pixel dat
  // Další pole DIB headeru můžeme nastavit na nulové hodnoty

  // Pixel Data
  let pixelDataOffset = headerSize + dibHeaderSize;
  for (let y = height - 1; y >= 0; y--) { // BMP ukládá data od spodku
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4; // Index v RGBA poli
      buffer[pixelDataOffset++] = pixels[i + 2]; // Blue
      buffer[pixelDataOffset++] = pixels[i + 1]; // Green
      buffer[pixelDataOffset++] = pixels[i]; // Red
    }
    pixelDataOffset += paddingPerRow; // Přidání paddingu na konec řádku
  }

  return buffer;
}
