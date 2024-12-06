"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('API', {
    minimizeWindow: () => ipcRenderer.send('window:minimize'),
    maximizeWindow: () => ipcRenderer.send('window:maximize'),
    closeWindow: () => ipcRenderer.send('window:close'),
    createTask: (taskData) => ipcRenderer.invoke('task:create', taskData),
    deleteTask: (key) => ipcRenderer.invoke('task:delete', key),
    getTask: (key) => ipcRenderer.invoke('task:get-one', key),
    getAllTask: () => ipcRenderer.invoke('task:get-all'),
    getPreloadPath: () => ipcRenderer.invoke('preload:get-path'),
    getSelectors: (key) => ipcRenderer.invoke('selectors:get-one', key),
    getParserData: (key) => ipcRenderer.invoke('parser:get-data', key),
    postSelectors: (selector) => ipcRenderer.invoke('parser:get-selectors', selector),
    setCurrentTaskKey: (key) => ipcRenderer.invoke('task:set-current', key),
    startParser: (key) => ipcRenderer.invoke('parser:start', key),
});
