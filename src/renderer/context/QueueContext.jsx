import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { mockQueue } from '../data/mockQueue.js';
import { priorities } from '../data/priorities.js';
import {
  checkInQueue,
  listActiveQueue,
  updateQueueStatus
} from '../services/filaService.js';

const QueueContext = createContext(null);

const CALL_DISPLAY_TIME = 10000;

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState(mockQueue);

  const [callQueue, setCallQueue] = useState([]);
  const [currentCall, setCurrentCall] = useState(null);
  const [lastCalls, setLastCalls] = useState([]);

  useEffect(() => {
    async function loadAccessQueueIfAvailable() {
      const result = await listActiveQueue();

      if (result.success) {
        setQueue(result.queue);
      }
    }

    loadAccessQueueIfAvailable();
  }, []);

  async function checkInPatient({
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
      dataHoraEcoInicio: null,
      dataHoraEcoRealizado: null,
      ordem: queue.length + 1,
      usuarioResponsavel
    };

    setQueue((currentQueue) => [newQueueItem, ...currentQueue]);

    const accessResult = await checkInQueue({
      patient,
      profissional,
      especialidade,
      prioridade: priorityData || null,
      observacaoPrioridade,
      usuarioResponsavel
    });

    if (accessResult.success) {
      setQueue(accessResult.queue);
    }

    return newQueueItem;
  }

  async function updateQueueItem(idFila, updates) {
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

    const result = await updateQueueStatus({
      idFila,
      updates: convertUpdatesToAccessFields(updates)
    });

    if (result.success) {
      setQueue(result.queue);
    }
  }

  async function callPatient(patient, usuarioResponsavel) {
    const dataHoraChamada = new Date().toISOString();

    await updateQueueItem(patient.idFila, {
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

    return {
      ...patient,
      statusAtendimento: 'CHAMADO',
      dataHoraChamada,
      usuarioResponsavel
    };
  }

  async function confirmPresence(patient, usuarioResponsavel) {
    await updateQueueItem(patient.idFila, {
      statusAtendimento: 'EM_ATENDIMENTO',
      dataHoraApareceu: new Date().toISOString(),
      usuarioResponsavel
    });
  }

  async function registerAbsence(patient, usuarioResponsavel) {
    await updateQueueItem(patient.idFila, {
      statusAtendimento: 'NAO_COMPARECEU',
      dataHoraChamada: null,
      usuarioResponsavel,
      ordem: queue.length + 1
    });
  }

  async function forwardPatient(
    patient,
    setorDestino,
    usuarioResponsavel,
    observacao = ''
  ) {
    await updateQueueItem(patient.idFila, {
      setorAtual: setorDestino,
      statusAtendimento: 'AGUARDANDO',
      dataHoraChamada: null,
      dataHoraApareceu: null,
      observacaoEncaminhamento: observacao,
      usuarioResponsavel,
      ordem: queue.length + 1
    });
  }

  async function finishPatient(patient, usuarioResponsavel) {
    await updateQueueItem(patient.idFila, {
      statusAtendimento: 'FINALIZADO',
      dataHoraCheckout: new Date().toISOString(),
      usuarioResponsavel
    });
  }

  async function sendToEco(patient, usuarioResponsavel) {
    await updateQueueItem(patient.idFila, {
      setorAtual: 'ECO',
      statusAtendimento: 'PAUSADO_ECO',
      tipoExame: 'ECO',
      motivoPausa: 'Paciente encaminhado para ECO durante atendimento médico.',
      dataHoraPausa: new Date().toISOString(),
      dataHoraChamada: null,
      dataHoraApareceu: null,
      retornoExame: false,
      usuarioResponsavel,
      ordem: queue.length + 1
    });
  }

  async function startEcoExam(patient, usuarioResponsavel) {
    await updateQueueItem(patient.idFila, {
      statusAtendimento: 'EM_ATENDIMENTO',
      dataHoraEcoInicio: new Date().toISOString(),
      usuarioResponsavel
    });
  }

  async function finishEcoExam(patient, usuarioResponsavel) {
    await updateQueueItem(patient.idFila, {
      statusAtendimento: 'AGUARDANDO_RETORNO_ECO',
      dataHoraEcoRealizado: new Date().toISOString(),
      usuarioResponsavel
    });
  }

  async function returnFromEcoToDoctor(patient, usuarioResponsavel) {
    await updateQueueItem(patient.idFila, {
      setorAtual: 'MEDICO',
      statusAtendimento: 'AGUARDANDO_RETORNO_ECO',
      retornoExame: true,
      tipoExame: 'ECO',
      dataHoraRetorno: new Date().toISOString(),
      dataHoraChamada: null,
      dataHoraApareceu: null,
      usuarioResponsavel,
      ordem: 0
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
      finishPatient,

      sendToEco,
      startEcoExam,
      finishEcoExam,
      returnFromEcoToDoctor
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

function convertUpdatesToAccessFields(updates) {
  const fieldMap = {
    setorAtual: 'SETOR_ATUAL',
    statusAtendimento: 'STATUS_ATENDIMENTO',
    dataHoraChamada: 'DATA_HORA_CHAMADA',
    dataHoraApareceu: 'DATA_HORA_APARECEU',
    dataHoraPausa: 'DATA_HORA_PAUSA',
    dataHoraRetorno: 'DATA_HORA_RETORNO',
    dataHoraCheckout: 'DATA_HORA_CHECKOUT',
    dataHoraEcoInicio: 'DATA_HORA_ECO_INICIO',
    dataHoraEcoRealizado: 'DATA_HORA_ECO_REALIZADO',
    retornoExame: 'RETORNO_EXAME',
    tipoExame: 'TIPO_EXAME',
    motivoPausa: 'MOTIVO_PAUSA',
    observacaoEncaminhamento: 'OBSERVACAO_ENCAMINHAMENTO',
    usuarioResponsavel: 'USUARIO_RESPONSAVEL',
    ordem: 'ORDEM'
  };

  return Object.entries(updates).reduce((acc, [key, value]) => {
    const accessField = fieldMap[key];

    if (accessField) {
      acc[accessField] = value;
    }

    return acc;
  }, {});
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
    MAPA_CIRURGICO: 'Mapa 24h'
  };

  return sectorNames[patient.setorAtual] || patient.setorAtual;
}