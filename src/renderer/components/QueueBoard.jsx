import { useMemo, useState } from 'react';

import ForwardPatientModal from './ForwardPatientModal.jsx';
import PatientCard from './PatientCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { sectorLabels } from '../data/forwardRules.js';
import { canCallPatient, sortQueue } from '../utils/queueRules.js';

export default function QueueBoard({
  title,
  subtitle,
  patients,
  context = 'DEFAULT',
  emptyMessage = 'Nenhum paciente aguardando neste setor.'
}) {
  const { user } = useAuth();

  const {
    callPatient,
    confirmPresence,
    registerAbsence,
    forwardPatient,
    finishPatient,
    sendToEco,
    startEcoExam,
    finishEcoExam,
    returnFromEcoToDoctor
  } = useQueue();

  const [lastAction, setLastAction] = useState('');
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  function handleOpenForwardModal(patient) {
    setSelectedPatient(patient);
    setForwardModalOpen(true);
  }

  function handleCloseForwardModal() {
    setSelectedPatient(null);
    setForwardModalOpen(false);
  }

  function handleConfirmForward({ patient, setorDestino, observacao }) {
    if (setorDestino === 'FINALIZAR') {
      finishPatient(patient, user?.usuario);

      setLastAction(
        `Atendimento finalizado para ${patient.nomeSocial || patient.nomePaciente}.`
      );

      handleCloseForwardModal();
      return;
    }

    forwardPatient(patient, setorDestino, user?.usuario, observacao);

    setLastAction(
      `${patient.nomeSocial || patient.nomePaciente} encaminhado para ${
        sectorLabels[setorDestino] || setorDestino
      }.`
    );

    handleCloseForwardModal();
  }

  function handleSendToEco(patient) {
    const confirmEco = window.confirm(
      `Deseja enviar ${
        patient.nomeSocial || patient.nomePaciente
      } para ECO e pausar o atendimento médico?`
    );

    if (!confirmEco) {
      return;
    }

    sendToEco(patient, user?.usuario);

    setLastAction(
      `${patient.nomeSocial || patient.nomePaciente} foi enviado para ECO. Atendimento pausado.`
    );
  }

  function handleStartEco(patient) {
    startEcoExam(patient, user?.usuario);

    setLastAction(
      `ECO iniciado para ${patient.nomeSocial || patient.nomePaciente}.`
    );
  }

  function handleFinishEco(patient) {
    finishEcoExam(patient, user?.usuario);

    setLastAction(
      `ECO realizado para ${patient.nomeSocial || patient.nomePaciente}.`
    );
  }

  function handleReturnFromEco(patient) {
    returnFromEcoToDoctor(patient, user?.usuario);

    setLastAction(
      `${patient.nomeSocial || patient.nomePaciente} retornou para a fila do médico ${patient.nomeMedicoDestino}.`
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
              context={context}
              onCall={handleCall}
              onAppeared={handleAppeared}
              onMissing={handleMissing}
              onCheckout={handleCheckout}
              onForward={handleOpenForwardModal}
              onSendToEco={handleSendToEco}
              onStartEco={handleStartEco}
              onFinishEco={handleFinishEco}
              onReturnFromEco={handleReturnFromEco}
            />
          ))
        )}
      </div>

      <ForwardPatientModal
        open={forwardModalOpen}
        patient={selectedPatient}
        onClose={handleCloseForwardModal}
        onConfirm={handleConfirmForward}
      />
    </section>
  );
}