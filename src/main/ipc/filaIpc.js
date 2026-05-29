import { ipcMain } from 'electron';
import {
  checkInPatientToQueue,
  listActiveQueue,
  updateQueueStatus
} from '../database/filaRepository.js';

export function registerFilaIpc() {
  ipcMain.handle('fila:listar-ativa', async () => {
    try {
      const queue = await listActiveQueue();

      return {
        success: true,
        queue
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao listar fila.',
        queue: []
      };
    }
  });

  ipcMain.handle('fila:check-in', async (_event, payload) => {
    try {
      const queue = await checkInPatientToQueue(payload);

      return {
        success: true,
        queue
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao realizar check-in.'
      };
    }
  });

  ipcMain.handle('fila:atualizar-status', async (_event, payload) => {
    try {
      const queue = await updateQueueStatus(payload.idFila, payload.updates);

      return {
        success: true,
        queue
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao atualizar fila.'
      };
    }
  });
}