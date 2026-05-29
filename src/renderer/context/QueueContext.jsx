import { createContext, useContext, useMemo, useState } from 'react';

import { mockQueue } from '../data/mockQueue.js';
import { priorities } from '../data/priorities.js';

const QueueContext = createContext(null);

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState(mockQueue);

  function checkInPatient({
    patient,
    profissional,
    especialidade,
    prioridadeId,
    observacaoPrioridade,
    usuarioResponsavel
  }) {
    const priorityData = priorities.find((item) => item.id === prioridadeId);

    const newQueueItem = {
      idFila: Date.now(),
      idPaciente: patient.idPaciente || Date.now(),
      cns: patient.cns,
      nomePaciente: patient.nomePaciente,
      nomeSocial: patient.nomeSocial || '',
      prontuario: patient.prontuario,
      dataNascimento: patient.dataNascimento,
      setorAtual: 'ACOLHIMENTO',
      statusAtendimento: 'AGUARDANDO',
      idMedicoDestino: profissional.idProfissional,
      nomeMedicoDestino: profissional.nome,
      especialidade,
      prioritario: Boolean(priorityData),
      tipoPrioridade: priorityData?.label || '',
      obsPrioridade: observacaoPrioridade || '',
      nivelPrioridade: priorityData?.nivel || 0,
      retornoExame: false,
      tipoExame: '',
      motivoPausa: '',
      dataHoraEntrada: new Date().toISOString(),
      dataHoraChamada: null,
      dataHoraApareceu: null,
      dataHoraPausa: null,
      dataHoraRetorno: null,
      dataHoraCheckout: null,
      ordem: queue.length + 1,
      usuarioResponsavel
    };

    setQueue((currentQueue) => [newQueueItem, ...currentQueue]);

    return newQueueItem;
  }

  const value = useMemo(
    () => ({
      queue,
      setQueue,
      checkInPatient
    }),
    [queue]
  );

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}

export function useQueue() {
  const context = useContext(QueueContext);

  if (!context) {
    throw new Error('useQueue precisa ser usado dentro de QueueProvider.');
  }

  return context;
}