import { mockPatients } from '../data/mockPatients.js';
import { isAccessAvailable } from './runtime.js';

let localMockPatients = [...mockPatients];

export async function findPatientByCns(cns) {
  if (isAccessAvailable()) {
    const result = await window.monitorAmb.pacientes.buscarPorCns(cns);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      patient: result.patient
    };
  }

  const patient = localMockPatients.find((item) => item.cns === cns);

  return {
    success: true,
    patient: patient || null
  };
}

export async function createPatient(patient) {
  if (isAccessAvailable()) {
    return window.monitorAmb.pacientes.cadastrar(patient);
  }

  const newPatient = {
    ...patient,
    idPaciente: Date.now()
  };

  localMockPatients = [newPatient, ...localMockPatients];

  return {
    success: true,
    patient: newPatient
  };
}