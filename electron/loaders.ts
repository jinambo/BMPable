
export const load1BitImage = async (data: Buffer, width: number, height: number, headerSize: number) => {
  console.log('Loading 1bit image ..');
  
  const pixels = [];
  const bytesPerRow = Math.ceil(width / 32) * 4;
  const paletteOffset = 14 + 40; // BITMAPINFOHEADER

  // Load pallete
  const black = [data[paletteOffset], data[paletteOffset+1], data[paletteOffset+2], 255];
  const white = [data[paletteOffset+4], data[paletteOffset+5], data[paletteOffset+6], 255];

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const byteIndex = headerSize + y * bytesPerRow + Math.floor(x / 8);
      const bitPosition = 7 - (x % 8); // Bit's position in byte bitu v byte
      const bitValue = (data[byteIndex] >> bitPosition) & 1; // Get bit
      const color = bitValue ? white : black; // Assign color from pallete
      pixels.push(...color);
    }
  }

  return pixels;
}

export const load4BitImage = (data: Buffer, width: number, height: number, headerSize: number) => {
  console.log('Loading 4bit image ..');

  const pixels = [];
  const bytesPerRowWithoutPadding = Math.ceil(width / 2);
  const bytesPerRow = Math.ceil((bytesPerRowWithoutPadding) / 4) * 4;
  const paletteOffset = 14 + 40; // BITMAPINFOHEADER

  // Load pallete
  const palette = [];
  for (let i = 0; i < 16; i++) {
    const offset = paletteOffset + i * 4;
    palette.push([data[offset + 2], data[offset + 1], data[offset], 255]); // BMP uses BGR
  }

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      // Calc byte index which contains pixel
      const byteIndex = headerSize + y * bytesPerRow + Math.floor(x / 2);
      const isHighNibble = x % 2 === 0;
      // Divide byte to two 4bit pixels
      const colorIndex = isHighNibble ? (data[byteIndex] >> 4) & 0xF : data[byteIndex] & 0xF;
      pixels.push(...palette[colorIndex]);
    }
  }

  return pixels;
}

export const load8BitImage = (data: Buffer, width: number, height: number, headerSize: number) => {
  console.log('Loading 8bit image ..');

  const pixels = [];
  const bytesPerRow = Math.ceil(width + (width % 4)); // Add padding
  const paletteOffset = 14 + 40; // BITMAPINFOHEADER

  // Load pallete
  const palette = [];
  for (let i = 0; i < 256; i++) {
    const offset = paletteOffset + i * 4;
    palette.push([data[offset+2], data[offset+1], data[offset], 255]); // BMP uses BGR
  }

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const colorIndex = data[headerSize + y * bytesPerRow + x];
      pixels.push(...palette[colorIndex]);
    }
  }

  return pixels;
}

export const load16BitImage = (data: Buffer, width: number, height: number, headerSize: number) => {
  console.log('Loading 16bit image ..');

  const pixels = [];
  const bytesPerRow = Math.ceil((width * 2) + ((width * 2) % 4)); // Add padding
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const offset = headerSize + y * bytesPerRow + x * 2;
      const value = data.readUInt16LE(offset);
      const red = ((value >> 11) & 0x1F) * 8; // 5 bits
      const green = ((value >> 5) & 0x3F) * 4; // 6 bits
      const blue = (value & 0x1F) * 8; // 5 bits
      pixels.push(red, green, blue, 255);
    }
  }

  return pixels;
}


export const load24BitImage = async (data: Buffer, imageSize: number, width: number, height: number, headerSize: number) => {
  console.log('Loading 24bit image ..');

  // Calculate size of one row in bytes including the padding
  const bytesPerPixel = 24 / 8;
  const bytesPerRowWithoutPadding = width * bytesPerPixel;
  const padding = (4 - (bytesPerRowWithoutPadding % 4)) % 4;
  const bytesPerRow = bytesPerRowWithoutPadding + padding;

  // Verify that the data size matches the expected size (width * height * 3 bajty na pixel + padding)
  if (imageSize !== height * bytesPerRow) {
    throw new Error('Velikost obrazových dat neodpovídá očekávané velikosti z metadat.');
  }

  // Read the image data
  const pixels = [];
  for (let y = height - 1; y >= 0; y--) { // The image is saved from the bottom rows
    const rowStart = headerSize + y * bytesPerRow;
    const rowEnd = rowStart + bytesPerRowWithoutPadding;
    for (let x = rowStart; x < rowEnd; x += bytesPerPixel) {
      const blue = data[x];
      const green = data[x + 1];
      const red = data[x + 2];
      pixels.push(red, green, blue, 255); // Pixel in RGBA format
    }
  }

  return pixels;
}

