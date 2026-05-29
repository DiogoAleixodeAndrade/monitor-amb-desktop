export function isElectronRuntime() {
  return Boolean(window.monitorAmb);
}

export function isAccessAvailable() {
  return Boolean(
    window.monitorAmb?.auth &&
      window.monitorAmb?.pacientes &&
      window.monitorAmb?.profissionais &&
      window.monitorAmb?.fila
  );
}