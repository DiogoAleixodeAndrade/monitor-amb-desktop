import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let mainWindow = null;
let panelWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: '#f3f6fb',
    title: 'Monitor Amb — IECAC',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function getSecondDisplayOrPrimary() {
  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();

  const secondaryDisplay = displays.find(
    (display) => display.id !== primaryDisplay.id
  );

  return secondaryDisplay || primaryDisplay;
}

function createPanelWindow() {
  const targetDisplay = getSecondDisplayOrPrimary();
  const { x, y, width, height } = targetDisplay.bounds;

  if (panelWindow && !panelWindow.isDestroyed()) {
    panelWindow.focus();
    panelWindow.setFullScreen(true);
    return {
      success: true,
      reused: true,
      display: {
        x,
        y,
        width,
        height
      }
    };
  }

  panelWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    fullscreen: true,
    kiosk: true,
    autoHideMenuBar: true,
    backgroundColor: '#031a3a',
    title: 'Monitor Amb — Painel de Chamada',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  if (isDev) {
    panelWindow.loadURL('http://127.0.0.1:5173/#/painel');
  } else {
    panelWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'), {
      hash: '/painel'
    });
  }

  panelWindow.once('ready-to-show', () => {
    panelWindow.show();
    panelWindow.setFullScreen(true);
    panelWindow.setKiosk(true);
  });

  panelWindow.on('closed', () => {
    panelWindow = null;
  });

  return {
    success: true,
    reused: false,
    display: {
      x,
      y,
      width,
      height
    }
  };
}

function closePanelWindow() {
  if (panelWindow && !panelWindow.isDestroyed()) {
    panelWindow.close();
    panelWindow = null;

    return {
      success: true
    };
  }

  return {
    success: false,
    message: 'Painel não está aberto.'
  };
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('app:get-info', async () => {
  return {
    name: 'Monitor Amb',
    institution: 'IECAC',
    environment: isDev ? 'development' : 'production',
    version: app.getVersion()
  };
});

ipcMain.handle('panel:open-on-second-screen', async () => {
  return createPanelWindow();
});

ipcMain.handle('panel:close', async () => {
  return closePanelWindow();
});