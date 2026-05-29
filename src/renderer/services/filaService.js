import { isAccessAvailable } from './runtime.js';

export async function listActiveQueue() {
  if (isAccessAvailable()) {
    return window.monitorAmb.fila.listarAtiva();
  }

  return {
    success: false,
    message: 'Access indisponível. Usando fila mockada em memória.',
    queue: []
  };
}

export async function checkInQueue(payload) {
  if (isAccessAvailable()) {
    return window.monitorAmb.fila.checkIn(payload);
  }

  return {
    success: false,
    message: 'Access indisponível. Check-in será feito em memória.'
  };
}

export async function updateQueueStatus(payload) {
  if (isAccessAvailable()) {
    return window.monitorAmb.fila.atualizarStatus(payload);
  }

  return {
    success: false,
    message: 'Access indisponível. Atualização será feita em memória.'
  };
}