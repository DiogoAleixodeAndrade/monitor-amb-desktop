import { ipcMain } from 'electron';
import { listActiveProfessionals } from '../database/profissionaisRepository.js';

export function registerProfissionaisIpc() {
  ipcMain.handle('profissionais:listar', async () => {
    try {
      const professionals = await listActiveProfessionals();

      return {
        success: true,
        professionals
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao listar profissionais.',
        professionals: []
      };
    }
  });
}