import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('monitorAmb', {
  app: {
    getInfo: () => ipcRenderer.invoke('app:get-info')
  },

  panel: {
    openOnSecondScreen: () =>
      ipcRenderer.invoke('panel:open-on-second-screen'),

    close: () => ipcRenderer.invoke('panel:close')
  },

  auth: {
    login: (payload) => ipcRenderer.invoke('auth:login', payload)
  },

  pacientes: {
    buscarPorCns: (cns) => ipcRenderer.invoke('pacientes:buscar-por-cns', cns),
    cadastrar: (payload) => ipcRenderer.invoke('pacientes:cadastrar', payload)
  },

  profissionais: {
    listar: () => ipcRenderer.invoke('profissionais:listar')
  },

  fila: {
    listarAtiva: () => ipcRenderer.invoke('fila:listar-ativa'),

    checkIn: (payload) => ipcRenderer.invoke('fila:check-in', payload),

    atualizarStatus: (payload) =>
      ipcRenderer.invoke('fila:atualizar-status', payload)
  }
});