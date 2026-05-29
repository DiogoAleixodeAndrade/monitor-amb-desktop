export function sortQueue(patients) {
  return [...patients].sort((a, b) => {
    if (a.prioritario !== b.prioritario) {
      return a.prioritario ? -1 : 1;
    }

    if ((a.nivelPrioridade || 0) !== (b.nivelPrioridade || 0)) {
      return (b.nivelPrioridade || 0) - (a.nivelPrioridade || 0);
    }

    if (a.retornoExame !== b.retornoExame) {
      return a.retornoExame ? -1 : 1;
    }

    if ((a.ordem || 0) !== (b.ordem || 0)) {
      return (a.ordem || 0) - (b.ordem || 0);
    }

    const dateA = new Date(a.dataHoraEntrada).getTime();
    const dateB = new Date(b.dataHoraEntrada).getTime();

    return dateA - dateB;
  });
}

export function filterQueueBySector(patients, setorAtual) {
  return patients.filter((patient) => patient.setorAtual === setorAtual);
}

export function filterMedicalQueue(patients, medicoId) {
  return patients.filter(
    (patient) =>
      patient.setorAtual === 'MEDICO' && patient.idMedicoDestino === medicoId
  );
}

export function canCallPatient(selectedPatient, orderedQueue) {
  if (!selectedPatient || orderedQueue.length === 0) {
    return {
      allowed: false,
      message: 'Nenhum paciente selecionado.'
    };
  }

  const firstPatient = orderedQueue[0];

  if (firstPatient.idFila === selectedPatient.idFila) {
    return {
      allowed: true,
      message: ''
    };
  }

  if (firstPatient.prioritario) {
    return {
      allowed: false,
      message: 'Existe paciente prioritário aguardando. Deseja continuar mesmo assim?'
    };
  }

  if (firstPatient.retornoExame) {
    return {
      allowed: false,
      message: 'Existe paciente de retorno ECO aguardando. Deseja continuar mesmo assim?'
    };
  }

  return {
    allowed: false,
    message: 'Existe outro paciente antes na fila. Deseja continuar mesmo assim?'
  };
}

export function formatDateTime(value) {
  if (!value) return '-';

  const date = new Date(value);

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}