const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('API', {
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  createTask: (taskData: any) => ipcRenderer.invoke('task:create', taskData),
  deleteTask: (key: any) => ipcRenderer.invoke('task:delete', key),
  getTask: (key: string) => ipcRenderer.invoke('task:get-one', key),
  getAllTask: () => ipcRenderer.invoke('task:get-all'),
  getPreloadPath: () => ipcRenderer.invoke('preload:get-path'),
  getSelectors: (key: string) => ipcRenderer.invoke('selectors:get-one', key),
  getParserData: (key: string) => ipcRenderer.invoke('parser:get-data', key),
  postSelectors: (selector: [string]) => ipcRenderer.invoke('parser:get-selectors', selector),
  setCurrentTaskKey: (key: string) => ipcRenderer.invoke('task:set-current', key),
  startParser: (key: string) => ipcRenderer.invoke('parser:start', key),
})