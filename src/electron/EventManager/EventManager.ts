import { ipcMain, BrowserWindow } from 'electron';

export class EventManager {
  public registerWindowEvents(mainWindow: BrowserWindow): void {
    ipcMain.on('window:minimize', () => mainWindow.minimize());
    ipcMain.on('window:maximize', () => {
      if (mainWindow.isMaximized()) {
        mainWindow.restore();
      } else {
        mainWindow.maximize();
      }
    });
    ipcMain.on('window:close', () => mainWindow.close());
  }
}
