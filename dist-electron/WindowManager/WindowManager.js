var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BrowserWindow } from 'electron';
import { getPreloadPath } from '../pathResolver.js';
export class WindowManager {
    constructor() {
        this.mainWindow = null;
    }
    createMainWindow(loadURL) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mainWindow)
                return this.mainWindow;
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
            yield this.mainWindow.loadURL(loadURL);
            this.mainWindow.on('closed', () => {
                this.mainWindow = null;
            });
            return this.mainWindow;
        });
    }
    getMainWindow() {
        return this.mainWindow;
    }
}
