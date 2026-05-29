import {
  adminProfessionals,
  adminSettings,
  adminSpecialties,
  adminUsers
} from '../data/adminMockData.js';
import { isAccessAvailable } from './runtime.js';

let localUsers = [...adminUsers];
let localProfessionals = [...adminProfessionals];
let localSpecialties = [...adminSpecialties];
let localSettings = [...adminSettings];

function isAdminAccessAvailable() {
  return Boolean(isAccessAvailable() && window.monitorAmb?.admin);
}

export async function listAdminUsersService() {
  if (isAdminAccessAvailable()) {
    return window.monitorAmb.admin.listUsers();
  }

  return {
    success: true,
    data: localUsers
  };
}

export async function saveAdminUserService(payload, mode) {
  if (isAdminAccessAvailable()) {
    return mode === 'EDIT'
      ? window.monitorAmb.admin.updateUser(payload)
      : window.monitorAmb.admin.createUser(payload);
  }

  if (mode === 'EDIT') {
    localUsers = localUsers.map((item) =>
      item.id === payload.id ? { ...item, ...payload } : item
    );
  } else {
    localUsers = [{ ...payload, id: Date.now() }, ...localUsers];
  }

  return {
    success: true,
    data: localUsers
  };
}

export async function listAdminProfessionalsService() {
  if (isAdminAccessAvailable()) {
    return window.monitorAmb.admin.listProfessionals();
  }

  return {
    success: true,
    data: localProfessionals
  };
}

export async function saveAdminProfessionalService(payload, mode) {
  if (isAdminAccessAvailable()) {
    return mode === 'EDIT'
      ? window.monitorAmb.admin.updateProfessional(payload)
      : window.monitorAmb.admin.createProfessional(payload);
  }

  if (mode === 'EDIT') {
    localProfessionals = localProfessionals.map((item) =>
      item.id === payload.id ? { ...item, ...payload } : item
    );
  } else {
    localProfessionals = [{ ...payload, id: Date.now() }, ...localProfessionals];
  }

  return {
    success: true,
    data: localProfessionals
  };
}

export async function listAdminSpecialtiesService() {
  if (isAdminAccessAvailable()) {
    return window.monitorAmb.admin.listSpecialties();
  }

  return {
    success: true,
    data: localSpecialties
  };
}

export async function saveAdminSpecialtyService(payload, mode) {
  if (isAdminAccessAvailable()) {
    return mode === 'EDIT'
      ? window.monitorAmb.admin.updateSpecialty(payload)
      : window.monitorAmb.admin.createSpecialty(payload);
  }

  if (mode === 'EDIT') {
    localSpecialties = localSpecialties.map((item) =>
      item.id === payload.id ? { ...item, ...payload } : item
    );
  } else {
    localSpecialties = [{ ...payload, id: Date.now() }, ...localSpecialties];
  }

  return {
    success: true,
    data: localSpecialties
  };
}

export async function listAdminSettingsService() {
  if (isAdminAccessAvailable()) {
    return window.monitorAmb.admin.listSettings();
  }

  return {
    success: true,
    data: localSettings
  };
}

export async function saveAdminSettingService(payload, mode) {
  if (isAdminAccessAvailable()) {
    return mode === 'EDIT'
      ? window.monitorAmb.admin.updateSetting(payload)
      : window.monitorAmb.admin.createSetting(payload);
  }

  if (mode === 'EDIT') {
    localSettings = localSettings.map((item) =>
      item.id === payload.id ? { ...item, ...payload } : item
    );
  } else {
    localSettings = [{ ...payload, id: Date.now() }, ...localSettings];
  }

  return {
    success: true,
    data: localSettings
  };
}