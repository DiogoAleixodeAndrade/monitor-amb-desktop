import { ipcMain } from 'electron';
import {
  createPatient,
  findPatientByCns
} from '../database/pacientesRepository.js';

export function registerPacientesIpc() {
  ipcMain.handle('pacientes:buscar-por-cns', async (_event, cns) => {
    try {
      const patient = await findPatientByCns(cns);

      return {
        success: true,
        patient
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao buscar paciente.'
      };
    }
  });

  ipcMain.handle('pacientes:cadastrar', async (_event, payload) => {
    try {
      const patient = await createPatient(payload);

      return {
        success: true,
        patient
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erro ao cadastrar paciente.'
      };
    }
  });
}