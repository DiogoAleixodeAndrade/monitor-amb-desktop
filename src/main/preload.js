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
  },

  admin: {
    listUsers: () => ipcRenderer.invoke('admin:list-users'),
    createUser: (payload) => ipcRenderer.invoke('admin:create-user', payload),
    updateUser: (payload) => ipcRenderer.invoke('admin:update-user', payload),

    listProfessionals: () => ipcRenderer.invoke('admin:list-professionals'),
    createProfessional: (payload) =>
      ipcRenderer.invoke('admin:create-professional', payload),
    updateProfessional: (payload) =>
      ipcRenderer.invoke('admin:update-professional', payload),

    listSpecialties: () => ipcRenderer.invoke('admin:list-specialties'),
    createSpecialty: (payload) =>
      ipcRenderer.invoke('admin:create-specialty', payload),
    updateSpecialty: (payload) =>
      ipcRenderer.invoke('admin:update-specialty', payload),

    listSettings: () => ipcRenderer.invoke('admin:list-settings'),
    createSetting: (payload) =>
      ipcRenderer.invoke('admin:create-setting', payload),
    updateSetting: (payload) =>
      ipcRenderer.invoke('admin:update-setting', payload)
  }
});