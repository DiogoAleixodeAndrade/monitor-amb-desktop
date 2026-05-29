import { createContext, useContext, useMemo, useState } from 'react';

import { mockQueue } from '../data/mockQueue.js';
import { priorities } from '../data/priorities.js';

const QueueContext = createContext(null);

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState(mockQueue);
  const [lastCall, setLastCall] = useState(null);

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

  function updateQueueItem(idFila, updates) {
    setQueue((currentQueue) =>
      currentQueue.map((item) =>
        item.idFila === idFila
          ? {
              ...item,
              ...updates
            }
          : item
      )
    );
  }

  function callPatient(patient, usuarioResponsavel) {
    const updatedPatient = {
      ...patient,
      statusAtendimento: 'CHAMADO',
      dataHoraChamada: new Date().toISOString(),
      usuarioResponsavel
    };

    updateQueueItem(patient.idFila, {
      statusAtendimento: updatedPatient.statusAtendimento,
      dataHoraChamada: updatedPatient.dataHoraChamada,
      usuarioResponsavel: updatedPatient.usuarioResponsavel
    });

    setLastCall({
      idChamada: Date.now(),
      idFila: patient.idFila,
      nomePaciente: patient.nomeSocial || patient.nomePaciente,
      setorAtual: patient.setorAtual,
      destino:
        patient.setorAtual === 'MEDICO'
          ? patient.nomeMedicoDestino
          : formatSectorName(patient.setorAtual),
      dataHoraChamada: updatedPatient.dataHoraChamada
    });

    return updatedPatient;
  }

  function confirmPresence(patient, usuarioResponsavel) {
    updateQueueItem(patient.idFila, {
      statusAtendimento: 'EM_ATENDIMENTO',
      dataHoraApareceu: new Date().toISOString(),
      usuarioResponsavel
    });
  }

  function registerAbsence(patient, usuarioResponsavel) {
    setQueue((currentQueue) => {
      const updatedQueue = currentQueue.map((item) => {
        if (item.idFila !== patient.idFila) {
          return item;
        }

        return {
          ...item,
          statusAtendimento: 'NAO_COMPARECEU',
          usuarioResponsavel,
          ordem: currentQueue.length + 1
        };
      });

      return updatedQueue;
    });
  }

  function forwardPatient(patient, setorDestino, usuarioResponsavel) {
    updateQueueItem(patient.idFila, {
      setorAtual: setorDestino,
      statusAtendimento: 'AGUARDANDO',
      dataHoraChamada: null,
      dataHoraApareceu: null,
      usuarioResponsavel,
      ordem: queue.length + 1
    });
  }

  function finishPatient(patient, usuarioResponsavel) {
    updateQueueItem(patient.idFila, {
      statusAtendimento: 'FINALIZADO',
      dataHoraCheckout: new Date().toISOString(),
      usuarioResponsavel
    });
  }

  const activeQueue = useMemo(() => {
    return queue.filter(
      (item) =>
        item.statusAtendimento !== 'FINALIZADO' &&
        item.statusAtendimento !== 'CANCELADO'
    );
  }, [queue]);

  const value = useMemo(
    () => ({
      queue,
      activeQueue,
      setQueue,
      lastCall,
      checkInPatient,
      callPatient,
      confirmPresence,
      registerAbsence,
      forwardPatient,
      finishPatient
    }),
    [queue, activeQueue, lastCall]
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

function formatSectorName(setor) {
  const sectorNames = {
    ACOLHIMENTO: 'Acolhimento',
    MEDICO: 'Médico',
    ECG: 'Sala de E.C.G.',
    MEDICACAO: 'Sala de Medicação',
    CURATIVO: 'Sala de Curativo',
    ECO: 'Sala de ECO',
    MAPA_CIRURGICO: 'Mapa Cirúrgico'
  };

  return sectorNames[setor] || setor;
}