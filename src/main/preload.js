import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('monitorAmb', {
  app: {
    getInfo: () => ipcRenderer.invoke('app:get-info')
  }
});