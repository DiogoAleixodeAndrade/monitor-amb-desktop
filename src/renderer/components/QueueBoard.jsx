import { useMemo, useState } from 'react';

import PatientCard from './PatientCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { canCallPatient, sortQueue } from '../utils/queueRules.js';

const sectorOptions = [
  {
    value: 'ACOLHIMENTO',
    label: 'Acolhimento'
  },
  {
    value: 'MEDICO',
    label: 'Médico'
  },
  {
    value: 'ECG',
    label: 'Sala de E.C.G.'
  },
  {
    value: 'MEDICACAO',
    label: 'Sala de Medicação'
  },
  {
    value: 'CURATIVO',
    label: 'Sala de Curativo'
  },
  {
    value: 'ECO',
    label: 'Sala de ECO'
  },
  {
    value: 'MAPA_CIRURGICO',
    label: 'Mapa Cirúrgico'
  }
];

export default function QueueBoard({
  title,
  subtitle,
  patients,
  emptyMessage = 'Nenhum paciente aguardando neste setor.'
}) {
  const { user } = useAuth();
  const {
    callPatient,
    confirmPresence,
    registerAbsence,
    forwardPatient,
    finishPatient
  } = useQueue();

  const [lastAction, setLastAction] = useState('');

  const orderedPatients = useMemo(() => sortQueue(patients), [patients]);

  function handleCall(patient) {
    const result = canCallPatient(patient, orderedPatients);

    if (!result.allowed) {
      const confirmCall = window.confirm(result.message);

      if (!confirmCall) {
        return;
      }
    }

    callPatient(patient, user?.usuario);

    setLastAction(
      `Chamada registrada para ${patient.nomeSocial || patient.nomePaciente}.`
    );
  }

  function handleAppeared(patient) {
    confirmPresence(patient, user?.usuario);

    setLastAction(
      `${patient.nomeSocial || patient.nomePaciente} está em atendimento.`
    );
  }

  function handleMissing(patient) {
    const confirmMissing = window.confirm(
      `Deseja registrar ausência de ${
        patient.nomeSocial || patient.nomePaciente
      }? O paciente voltará para depois na fila.`
    );

    if (!confirmMissing) {
      return;
    }

    registerAbsence(patient, user?.usuario);

    setLastAction(
      `${patient.nomeSocial || patient.nomePaciente} foi registrado como ausente.`
    );
  }

  function handleCheckout(patient) {
    const confirmFinish = window.confirm(
      `Deseja finalizar o atendimento de ${
        patient.nomeSocial || patient.nomePaciente
      }?`
    );

    if (!confirmFinish) {
      return;
    }

    finishPatient(patient, user?.usuario);

    setLastAction(
      `Atendimento finalizado para ${patient.nomeSocial || patient.nomePaciente}.`
    );
  }

  function handleForward(patient) {
    const optionsText = sectorOptions
      .map((item, index) => `${index + 1} - ${item.label}`)
      .join('\n');

    const selectedOption = window.prompt(
      `Encaminhar paciente para qual setor?\n\n${optionsText}\n\nDigite o número do setor:`
    );

    if (!selectedOption) {
      return;
    }

    const selectedSector = sectorOptions[Number(selectedOption) - 1];

    if (!selectedSector) {
      setLastAction('Setor inválido. Encaminhamento cancelado.');
      return;
    }

    forwardPatient(patient, selectedSector.value, user?.usuario);

    setLastAction(
      `${patient.nomeSocial || patient.nomePaciente} encaminhado para ${
        selectedSector.label
      }.`
    );
  }

  return (
    <section className="queue-board">
      <div className="queue-header">
        <div>
          <p className="eyebrow">Fila de atendimento</p>
          <h2>{title}</h2>
          {subtitle && <span>{subtitle}</span>}
        </div>

        <div className="queue-counter">
          <strong>{orderedPatients.length}</strong>
          <span>aguardando</span>
        </div>
      </div>

      {lastAction && <div className="action-feedback">{lastAction}</div>}

      <div className="queue-list">
        {orderedPatients.length === 0 ? (
          <div className="empty-state">
            <strong>Fila vazia</strong>
            <span>{emptyMessage}</span>
          </div>
        ) : (
          orderedPatients.map((patient, index) => (
            <PatientCard
              key={patient.idFila}
              patient={patient}
              position={index + 1}
              onCall={handleCall}
              onAppeared={handleAppeared}
              onMissing={handleMissing}
              onCheckout={handleCheckout}
              onForward={handleForward}
            />
          ))
        )}
      </div>
    </section>
  );
}