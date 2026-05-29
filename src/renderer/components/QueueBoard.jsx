import { useMemo, useState } from 'react';

import PatientCard from './PatientCard.jsx';
import { canCallPatient, sortQueue } from '../utils/queueRules.js';

export default function QueueBoard({
  title,
  subtitle,
  patients,
  emptyMessage = 'Nenhum paciente aguardando neste setor.'
}) {
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

    setLastAction(`Chamando ${patient.nomeSocial || patient.nomePaciente}`);
  }

  function handleAppeared(patient) {
    setLastAction(`${patient.nomeSocial || patient.nomePaciente} apareceu.`);
  }

  function handleMissing(patient) {
    setLastAction(
      `${patient.nomeSocial || patient.nomePaciente} marcado como não apareceu.`
    );
  }

  function handleCheckout(patient) {
    setLastAction(`Check-out iniciado para ${patient.nomeSocial || patient.nomePaciente}.`);
  }

  function handleForward(patient) {
    setLastAction(`Encaminhamento iniciado para ${patient.nomeSocial || patient.nomePaciente}.`);
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