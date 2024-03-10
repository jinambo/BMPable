import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import * as fs from 'fs';
import path from 'node:path'
import { convertPixelsToBMP } from './convertPixelsToBMP';

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

ipcMain.handle('load-image', async (event, filePath) => {
  try {
    // Předpokládáme, že 'filePath' je absolutní cesta k souboru.
    const data = await fs.readFileSync(filePath);

    console.log('data:', data);

    // Získání metadat z hlavičky BMP
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
    
    // Výpočet velikosti jednoho řádku v bajtech včetně paddingu
    const bytesPerPixel = bitsPerPixel / 8;
    const bytesPerRowWithoutPadding = width * bytesPerPixel;
    const padding = (4 - (bytesPerRowWithoutPadding % 4)) % 4;
    const bytesPerRow = bytesPerRowWithoutPadding + padding;

    // Ověření, že velikost dat odpovídá očekávané velikosti (width * height * 3 bajty na pixel + padding)
    if (imageSize !== height * bytesPerRow) {
      throw new Error('Velikost obrazových dat neodpovídá očekávané velikosti z metadat.');
    }

    // Čtení dat obrázku
    const pixels = [];
    for (let y = height - 1; y >= 0; y--) { // Obrázek je uložen od spodních řádků
      const rowStart = headerSize + y * bytesPerRow;
      const rowEnd = rowStart + bytesPerRowWithoutPadding;
      for (let x = rowStart; x < rowEnd; x += bytesPerPixel) {
        const blue = data[x];
        const green = data[x + 1];
        const red = data[x + 2];
        pixels.push(red, green, blue, 255); // Pixel v RGBA formátu
      }
    }

    return { width, height, pixels };
  } catch (error) {
    console.error('Failed to load image', error);
    throw error;
  }
});

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

ipcMain.handle('save-image', async (event, { pixels, width, height }) => {
  console.log('saving image: ', pixels);
  console.log(`width: ${width}px x height: ${height}px`);

  // Dialog pro výběr umístění souboru
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save Image',
    defaultPath: path.join(app.getPath('downloads'), 'image.bmp'),
    filters: [
      { name: 'Images', extensions: ['bmp'] }
    ]
  });

  if (filePath) {
    try {
      // Převod pixelů RGBA zpět na formát BMP a uložení souboru
      const imageData = convertPixelsToBMP(pixels, width, height);
      fs.writeFileSync(filePath, imageData);
      return { success: true, path: filePath };
    } catch (error) {
      console.error('Error saving image:', error);
      return { success: false, error: error.message };
    }
  } else {
    // Uživatel zrušil dialog
    return { success: false, error: 'Dialog cancelled by the user.' };
  }
});