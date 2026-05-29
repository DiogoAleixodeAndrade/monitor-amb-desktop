import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { mockQueue } from '../data/mockQueue.js';
import { priorities } from '../data/priorities.js';

const QueueContext = createContext(null);

const CALL_DISPLAY_TIME = 10000;

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState(mockQueue);

  const [callQueue, setCallQueue] = useState([]);
  const [currentCall, setCurrentCall] = useState(null);
  const [lastCalls, setLastCalls] = useState([]);

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
    const dataHoraChamada = new Date().toISOString();

    const updatedPatient = {
      ...patient,
      statusAtendimento: 'CHAMADO',
      dataHoraChamada,
      usuarioResponsavel
    };

    updateQueueItem(patient.idFila, {
      statusAtendimento: 'CHAMADO',
      dataHoraChamada,
      usuarioResponsavel
    });

    const newCall = {
      idChamada: Date.now() + Math.random(),
      idFila: patient.idFila,
      nomePaciente: patient.nomeSocial || patient.nomePaciente,
      setorAtual: patient.setorAtual,
      destino: getCallDestination(patient),
      profissional: patient.nomeMedicoDestino || '',
      especialidade: patient.especialidade || '',
      dataHoraChamada
    };

    setCallQueue((currentCalls) => [...currentCalls, newCall]);

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
      return currentQueue.map((item) => {
        if (item.idFila !== patient.idFila) {
          return item;
        }

        return {
          ...item,
          statusAtendimento: 'NAO_COMPARECEU',
          dataHoraChamada: null,
          usuarioResponsavel,
          ordem: currentQueue.length + 1
        };
      });
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

  useEffect(() => {
    if (currentCall || callQueue.length === 0) {
      return;
    }

    const nextCall = callQueue[0];

    setCurrentCall(nextCall);
    setCallQueue((currentCalls) => currentCalls.slice(1));

    setLastCalls((currentLastCalls) => {
      const updatedLastCalls = [nextCall, ...currentLastCalls];

      return updatedLastCalls.slice(0, 6);
    });
  }, [currentCall, callQueue]);

  useEffect(() => {
    if (!currentCall) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentCall(null);
    }, CALL_DISPLAY_TIME);

    return () => clearTimeout(timer);
  }, [currentCall]);

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

      callQueue,
      currentCall,
      lastCalls,

      checkInPatient,
      callPatient,
      confirmPresence,
      registerAbsence,
      forwardPatient,
      finishPatient
    }),
    [queue, activeQueue, callQueue, currentCall, lastCalls]
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

function getCallDestination(patient) {
  if (patient.setorAtual === 'MEDICO') {
    return patient.nomeMedicoDestino || 'Consultório médico';
  }

  const sectorNames = {
    ACOLHIMENTO: 'Acolhimento',
    ECG: 'Sala de E.C.G.',
    MEDICACAO: 'Sala de Medicação',
    CURATIVO: 'Sala de Curativo',
    ECO: 'Sala de ECO',
    MAPA_CIRURGICO: 'Mapa Cirúrgico'
  };

  return sectorNames[patient.setorAtual] || patient.setorAtual;
}