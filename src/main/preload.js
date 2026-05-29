import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('monitorAmb', {
  app: {
    getInfo: () => ipcRenderer.invoke('app:get-info')
  },

  panel: {
    openOnSecondScreen: () =>
      ipcRenderer.invoke('panel:open-on-second-screen'),

    close: () => ipcRenderer.invoke('panel:close')
  }
});