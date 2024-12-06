var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { app, ipcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import * as fs from 'fs';
import { EventManager } from './EventManager/EventManager.js';
import { WindowManager } from './WindowManager/WindowManager.js';
import Database from './Database/Database.js';
import puppeteer from 'puppeteer';
export class MainApp {
    constructor() {
        this.currentTaskKey = null;
        this.initializeApp = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.TasksDb.open();
                const mainWindow = yield this.windowManager.createMainWindow(isDev() ? 'http://localhost:5123' : path.join(app.getAppPath(), '/dist-react/index.html'));
                this.eventManager.registerWindowEvents(mainWindow);
                return 'Database open';
            }
            catch (err) {
                console.error('Initialization failed:', err);
                app.quit();
            }
        });
        this.windowManager = new WindowManager();
        this.eventManager = new EventManager();
        this.TasksDb = new Database(path.join('/dist-electron/data/tasks'));
        this.SelectorsDb = new Database(path.join('/dist-electron/data/selectors'));
        this.ParserDb = new Database(path.join('/dist-electron/data/parser'));
        this.userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        app.on('ready', this.initializeApp);
        this.registerHandlers();
    }
    registerHandlers() {
        return __awaiter(this, void 0, void 0, function* () {
            ipcMain.handle('task:create', (event, data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (yield this.TasksDb.isEmpty()) {
                        const key = this.TasksDb.create32BitKey(0);
                        const createdDate = new Date().toLocaleString(undefined, { timeZone: this.userTimeZone });
                        const taskData = Object.assign(Object.assign({}, data), { createdDate, status: 'Pending' });
                        yield this.TasksDb.put(key, taskData);
                        yield this.SelectorsDb.put(key, []);
                        return {
                            key: key,
                            data: yield this.TasksDb.get(key),
                        };
                    }
                    else {
                        const lastRecord = yield this.TasksDb.getLastRecord();
                        let lastKey = this.TasksDb.decode32BitKey(lastRecord.key);
                        const key = this.TasksDb.create32BitKey(lastKey + 1);
                        const createdDate = new Date().toLocaleString(undefined, { timeZone: this.userTimeZone });
                        const taskData = Object.assign(Object.assign({}, data), { createdDate, status: 'Pending' });
                        yield this.TasksDb.put(key, taskData);
                        yield this.SelectorsDb.put(key, []);
                        return {
                            key: key,
                            data: yield this.TasksDb.get(key),
                        };
                    }
                }
                catch (error) {
                    return error;
                }
            }));
            ipcMain.handle('task:delete', (event, key) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const deleteTask = yield this.TasksDb.delete(key);
                    yield this.SelectorsDb.delete(key);
                    yield this.ParserDb.delete(key);
                    return deleteTask;
                }
                catch (error) {
                    return false;
                }
            }));
            ipcMain.handle('task:get-one', (event, key) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const task = yield this.TasksDb.get(key);
                    return task;
                }
                catch (error) {
                    return false;
                }
            }));
            ipcMain.handle('task:get-all', (event) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const allTasks = yield this.TasksDb.readAll();
                    return allTasks;
                }
                catch (error) {
                    return false;
                }
            }));
            ipcMain.handle('task:set-current', (event, key) => __awaiter(this, void 0, void 0, function* () {
                try {
                    this.currentTaskKey = key;
                    return this.currentTaskKey;
                }
                catch (error) {
                    return false;
                }
            }));
            ipcMain.handle('selectors:get-one', (event, key) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const selector = yield this.SelectorsDb.get(key);
                    return selector;
                }
                catch (error) {
                    return false;
                }
            }));
            ipcMain.handle('preload:get-path', (event, key) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const preloadPath = getPreloadPath();
                    const formattedPath = preloadPath.replace(/\\/g, '/');
                    const fullPath = 'file://' + formattedPath;
                    if (fs.existsSync(preloadPath)) {
                        return fullPath;
                    }
                    else {
                        return null;
                    }
                }
                catch (error) {
                    console.error(error);
                    return false;
                }
            }));
            ipcMain.handle('parser:get-selectors', (event, selectors) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (this.currentTaskKey === null) {
                        console.error('currentTaskKey is null');
                        return false;
                    }
                    const storedSelectors = yield this.SelectorsDb.get(this.currentTaskKey);
                    if (!Array.isArray(storedSelectors)) {
                        console.error('Stored selectors are not an array');
                        return false;
                    }
                    const index = storedSelectors.indexOf(selectors);
                    if (index === -1 && selectors !== undefined) {
                        storedSelectors.push(selectors);
                    }
                    else if (index !== -1) {
                        storedSelectors.splice(index, 1);
                    }
                    yield this.SelectorsDb.put(this.currentTaskKey, storedSelectors);
                    const task = yield this.TasksDb.get(this.currentTaskKey);
                    yield this.TasksDb.put(this.currentTaskKey, Object.assign(Object.assign({}, task), { status: 'Ready', message: 'Selectors are ready for parsing.' }));
                    return storedSelectors;
                }
                catch (error) {
                    console.error(error);
                    return false;
                }
            }));
            ipcMain.handle('parser:start', (event, key) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const selectors = yield this.SelectorsDb.get(key);
                    if (!selectors || !Array.isArray(selectors)) {
                        console.error('No valid selectors found for task.');
                        const task = yield this.TasksDb.get(key);
                        yield this.TasksDb.put(key, Object.assign(Object.assign({}, task), { status: 'Error', message: 'No valid selectors found.' }));
                        return false;
                    }
                    const task = yield this.TasksDb.get(key);
                    if (!task || !task.url) {
                        console.error('No valid task URL found.');
                        yield this.TasksDb.put(key, Object.assign(Object.assign({}, task), { status: 'Error', message: 'No valid task URL found.' }));
                        return false;
                    }
                    yield this.TasksDb.put(key, Object.assign(Object.assign({}, task), { status: 'Running', message: 'Task is in progress.' }));
                    const browser = yield puppeteer.launch({ headless: false, slowMo: 200 });
                    const page = yield browser.newPage();
                    yield page.goto(task.url, { waitUntil: 'domcontentloaded' });
                    const data = yield Promise.all(selectors.map((selector, index) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const keyName = `field_${index + 1}`;
                            const texts = yield page.$$eval(selector, (elements) => {
                                return elements.map((el) => (el instanceof HTMLElement ? el.innerText.trim() : null));
                            });
                            const filteredTexts = texts.filter(text => text && text.trim().length > 0);
                            return { [keyName]: filteredTexts };
                        }
                        catch (error) {
                            console.error(`Error processing selector "${selector}":`, error);
                            return { selector, texts: [] };
                        }
                    })));
                    yield this.ParserDb.put(key, data);
                    yield this.TasksDb.put(key, Object.assign(Object.assign({}, task), { status: 'Completed', message: 'Task completed successfully.' }));
                    yield browser.close();
                    return data;
                }
                catch (error) {
                    console.error('Error in parser:start:', error);
                    const task = yield this.TasksDb.get(key);
                    yield this.TasksDb.put(key, Object.assign(Object.assign({}, task), { status: 'Error', message: 'Error' }));
                    return false;
                }
            }));
            ipcMain.handle('parser:get-data', (event, key) => __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield this.ParserDb.get(key);
                }
                catch (error) {
                    console.error(error);
                    return false;
                }
            }));
        });
    }
}
new MainApp();
