import { ipcMain } from 'electron';
import {
  createAdminProfessional,
  createAdminSetting,
  createAdminSpecialty,
  createAdminUser,
  listAdminProfessionals,
  listAdminSettings,
  listAdminSpecialties,
  listAdminUsers,
  updateAdminProfessional,
  updateAdminSetting,
  updateAdminSpecialty,
  updateAdminUser
} from '../database/adminRepository.js';

export function registerAdminIpc() {
  ipcMain.handle('admin:list-users', async () => safeRun(listAdminUsers));

  ipcMain.handle('admin:create-user', async (_event, payload) =>
    safeRun(() => createAdminUser(payload))
  );

  ipcMain.handle('admin:update-user', async (_event, payload) =>
    safeRun(() => updateAdminUser(payload))
  );

  ipcMain.handle('admin:list-professionals', async () =>
    safeRun(listAdminProfessionals)
  );

  ipcMain.handle('admin:create-professional', async (_event, payload) =>
    safeRun(() => createAdminProfessional(payload))
  );

  ipcMain.handle('admin:update-professional', async (_event, payload) =>
    safeRun(() => updateAdminProfessional(payload))
  );

  ipcMain.handle('admin:list-specialties', async () =>
    safeRun(listAdminSpecialties)
  );

  ipcMain.handle('admin:create-specialty', async (_event, payload) =>
    safeRun(() => createAdminSpecialty(payload))
  );

  ipcMain.handle('admin:update-specialty', async (_event, payload) =>
    safeRun(() => updateAdminSpecialty(payload))
  );

  ipcMain.handle('admin:list-settings', async () => safeRun(listAdminSettings));

  ipcMain.handle('admin:create-setting', async (_event, payload) =>
    safeRun(() => createAdminSetting(payload))
  );

  ipcMain.handle('admin:update-setting', async (_event, payload) =>
    safeRun(() => updateAdminSetting(payload))
  );
}

async function safeRun(callback) {
  try {
    const data = await callback();

    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Erro na área administrativa.',
      data: []
    };
  }
}