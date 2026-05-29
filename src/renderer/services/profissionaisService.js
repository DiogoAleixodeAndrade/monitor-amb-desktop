import { mockProfessionals } from '../data/mockProfessionals.js';
import { isAccessAvailable } from './runtime.js';

export async function listProfessionals() {
  if (isAccessAvailable()) {
    return window.monitorAmb.profissionais.listar();
  }

  return {
    success: true,
    professionals: mockProfessionals
  };
}
