import { BrowserWindow } from 'electron';
import { getPreloadPath } from '../pathResolver.js';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  public async createMainWindow(loadURL: string): Promise<BrowserWindow> {
    if (this.mainWindow) return this.mainWindow;

    this.mainWindow = new BrowserWindow({
      frame: false,
      width: 1024,
      minWidth: 1024,
      height: 768,
      minHeight: 768,
      webPreferences: {
        preload: getPreloadPath(),
        webviewTag: true,
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
      },
    });

    await this.mainWindow.loadURL(loadURL);

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    return this.mainWindow;
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
}
