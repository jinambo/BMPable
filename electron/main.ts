import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import * as fs from 'fs';
import path from 'node:path'
import { convertPixelsToBMP } from './convertPixelsToBMP';
import { hslToRgb, rgbToHsl } from './rgbHsvConvert';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.handle('get-image-path', async (event) => {
  const imagePath = path.join(app.getAppPath(), 'public', 'opicak.bmp');
  return imagePath;
});

// Function to load the image from the file system
ipcMain.handle('load-image', async (event, filePath) => {
  try {
    const data = await fs.readFileSync(filePath);
    console.log('data:', data);

    // Get metadata from BMP header
    const headerSize = data.readUInt32LE(10);
    const width = data.readUInt32LE(18);
    const height = data.readUInt32LE(22);
    const bitsPerPixel = data.readUInt16LE(28);
    const imageSize = data.readUInt32LE(34);

    console.log('width: ', width);
    console.log('height: ', height);
    console.log('bits per pixel: ', bitsPerPixel);
    console.log('img size: ', imageSize);
    console.log('header size (offset): ', headerSize);

    if (bitsPerPixel !== 24) {
      throw new Error('Tento příklad podporuje pouze 24-bitové BMP obrázky.');
    }
    
    // Calculate size of one row in bytes including the padding
    const bytesPerPixel = bitsPerPixel / 8;
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

    // console.log(`Width: ${width}, Height: ${height}, Pixels length: ${pixels.length}`);
    return { width, height, pixels };
  } catch (error) {
    console.error('Failed to load image', error);
    throw error;
  }
});

// Function to invert image's colors
ipcMain.handle('invert-image-colors', async (event, imageData) => {
  const { width, height, pixels } = imageData;

  // Perform color inversion
  const invertedPixels = pixels.map((value, index) => {
    // Do not invert the alpha channel
    if ((index + 1) % 4 === 0) return value; // Alpha channel
    return 255 - value; // Invert color component
  });

  return { width, height, pixels: invertedPixels };
});

// Helper function to round and clamp pixels value
function clampAndRound(value) {
  return Math.min(255, Math.max(0, Math.round(value)));
}

// Function to adjust image saturation
ipcMain.handle('adjust-image-saturation', async (event, imageData, saturationAdjustment) => {
  const { width, height, pixels } = imageData;

  // Adjust saturation
  const adjustedPixels = [];
  
  for (let i = 0; i < pixels.length; i += 4) {
    // Extract RGB, alfa stays untouched
    let [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]];
    const a = pixels[i + 3];

    // Convert RGB to HSL
    let [h, s, l] = rgbToHsl(r, g, b);

    // Adjust saturation
    s *= saturationAdjustment;
    s = Math.max(0, Math.min(1, s)); // Limit saturation to values 0-1

    // Convert HSL back to RGB
    [r, g, b] = hslToRgb(h, s, l);

    // Save adjusted values of pixels
    adjustedPixels.push(clampAndRound(r), clampAndRound(g), clampAndRound(b), a);
  }

  // console.log(`Width: ${width}, Height: ${height}, Pixels length: ${adjustedPixels.length}`);
  return { width, height, pixels: adjustedPixels };
});

// Function to adjust contrast
ipcMain.handle('adjust-image-contrast', async (event, imageData, contrastAdjustment) => {
  const { pixels } = imageData;
  const factor = (259 * (contrastAdjustment + 255)) / (255 * (259 - contrastAdjustment));

  const adjustedPixels = pixels.map((value, index) => {
    if ((index + 1) % 4 === 0) return value; // Ignore alpha channel
    return clampAndRound(factor * (value - 128) + 128);
  });

  return { ...imageData, pixels: adjustedPixels };
});

// Function to adjust brightness
ipcMain.handle('adjust-image-brightness', async (event, imageData, brightnessAdjustment) => {
  const { pixels } = imageData;

  const adjustedPixels = pixels.map((value, index) => {
    if ((index + 1) % 4 === 0) return value; // Ignore alpha channel
    return clampAndRound(value + brightnessAdjustment * 255);
  });

  return { ...imageData, pixels: adjustedPixels };
});


// Function to rotate the image by 90 degrees
ipcMain.handle('rotate-image-90', async (event, imageData) => {
  const { width, height, pixels } = imageData;

  // Create a new array of pixels
  const rotatedPixels = new Uint8ClampedArray(width * height * 4);

  // Browse the original image and resize the pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate the index for the original and new pixel locations
      const originalIndex = (y * width + x) * 4;
      const rotatedIndex = ((width - x - 1) * height + y) * 4;

      // Přesun pixelů
      rotatedPixels[rotatedIndex] = pixels[originalIndex];         // R
      rotatedPixels[rotatedIndex + 1] = pixels[originalIndex + 1]; // G
      rotatedPixels[rotatedIndex + 2] = pixels[originalIndex + 2]; // B
      rotatedPixels[rotatedIndex + 3] = pixels[originalIndex + 3]; // A
    }
  }

  return { width: height, height: width, pixels: rotatedPixels };
});

// Function to flip the image vertically
ipcMain.handle('flip-image-vertical', async (event, imageData) => {
  const { width, height, pixels } = imageData;

  const flippedPixels = new Uint8ClampedArray(pixels.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const originalIndex = (y * width + x) * 4;
      const flippedIndex = ((height - 1 - y) * width + x) * 4;

      for (let i = 0; i < 4; i++) { // For R, G, B, A
        flippedPixels[flippedIndex + i] = pixels[originalIndex + i];
      }
    }
  }

  return { width, height, pixels: flippedPixels };
});

// Function to flip the image vertically
ipcMain.handle('flip-image-horizontal', async (event, imageData) => {
  const { width, height, pixels } = imageData;

  const flippedPixels = new Uint8ClampedArray(pixels.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const originalIndex = (y * width + x) * 4;
      const flippedIndex = (y * width + (width - 1 - x)) * 4;

      for (let i = 0; i < 4; i++) { // For R, G, B, A
        flippedPixels[flippedIndex + i] = pixels[originalIndex + i];
      }
    }
  }

  return { width, height, pixels: flippedPixels };
});

// Function to convert pixels to the BMP image back and save
ipcMain.handle('save-image', async (event, { pixels, width, height }) => {
  console.log('saving image: ', pixels);
  console.log(`width: ${width}px x height: ${height}px`);

  // Dialog window to select location
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save Image',
    defaultPath: path.join(app.getPath('downloads'), 'image.bmp'),
    filters: [
      { name: 'Images', extensions: ['bmp'] }
    ]
  });

  if (filePath) {
    try {
      // Convert RGBA pixel data back to BMP format and save as file
      const imageData = convertPixelsToBMP(pixels, width, height);
      fs.writeFileSync(filePath, imageData);
      return { success: true, path: filePath };
    } catch (error) {
      console.error('Error saving image:', error);
      return { success: false, error: error.message };
    }
  } else {
    // User closed the dialog window
    return { success: false, error: 'Dialog cancelled by the user.' };
  }
});