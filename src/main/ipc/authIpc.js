import { ipcMain } from 'electron';
import { authenticateUser } from '../database/usuariosRepository.js';

export function registerAuthIpc() {
  ipcMain.handle('auth:login', async (_event, payload) => {
    try {
      return authenticateUser(payload.usuario, payload.senha);
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao autenticar usuário.'
      };
    }
  });
}