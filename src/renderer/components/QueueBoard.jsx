import { useMemo, useState } from 'react';

import ConfirmModal from './ConfirmModal.jsx';
import ForwardPatientModal from './ForwardPatientModal.jsx';
import PatientCard from './PatientCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { sectorLabels } from '../data/forwardRules.js';
import {
  canCallPatient,
  canFinishAttendance,
  sortQueue
} from '../utils/queueRules.js';

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

  const [confirmState, setConfirmState] = useState({
    open: false,
    type: '',
    patient: null,
    title: '',
    subtitle: '',
    message: '',
    confirmLabel: 'Confirmar',
    variant: 'primary',
    extra: null
  });

  const orderedPatients = useMemo(() => sortQueue(patients), [patients]);

  function closeConfirmModal() {
    setConfirmState({
      open: false,
      type: '',
      patient: null,
      title: '',
      subtitle: '',
      message: '',
      confirmLabel: 'Confirmar',
      variant: 'primary',
      extra: null
    });
  }

  function openConfirmModal(config) {
    setConfirmState({
      open: true,
      type: config.type,
      patient: config.patient,
      title: config.title,
      subtitle: config.subtitle,
      message: config.message,
      confirmLabel: config.confirmLabel || 'Confirmar',
      variant: config.variant || 'primary',
      extra: config.extra || null
    });
  }

  function handleCall(patient) {
    const result = canCallPatient(patient, orderedPatients);

    if (!result.allowed) {
      openConfirmModal({
        type: 'CALL_OUT_OF_ORDER',
        patient,
        title: 'Chamar fora da ordem?',
        subtitle: 'Atenção à regra de prioridade da fila.',
        message: result.message,
        confirmLabel: 'Chamar mesmo assim',
        variant: 'warning'
      });

      return;
    }

    executeCall(patient);
  }

  function executeCall(patient) {
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
    openConfirmModal({
      type: 'MISSING',
      patient,
      title: 'Registrar ausência?',
      subtitle: 'Confirme antes de alterar a posição na fila.',
      message: `Deseja registrar ausência de ${patient.nomeSocial || patient.nomePaciente
        }? O paciente ficará marcado como ausente e poderá ser chamado novamente depois.`,
      confirmLabel: 'Registrar ausência',
      variant: 'warning'
    });
  }

  function executeMissing(patient) {
    registerAbsence(patient, user?.usuario);

    setLastAction(
      `${patient.nomeSocial || patient.nomePaciente} foi registrado como ausente.`
    );
  }

  function handleCheckout(patient) {
    const finishValidation = canFinishAttendance(patient);

    if (!finishValidation.allowed) {
      setLastAction(finishValidation.message);
      return;
    }

    openConfirmModal({
      type: 'FINISH',
      patient,
      title: 'Finalizar atendimento?',
      subtitle: 'Essa ação remove o paciente da fila ativa.',
      message: `Deseja finalizar o atendimento de ${patient.nomeSocial || patient.nomePaciente
        }?`,
      confirmLabel: 'Finalizar atendimento',
      variant: 'danger'
    });
  }

  function executeFinish(patient) {
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

  if (setorDestino === 'FINALIZAR') {
    const finishValidation = canFinishAttendance(patient);

    if (!finishValidation.allowed) {
      setLastAction(finishValidation.message);
      handleCloseForwardModal();
      return;
    }

    finishPatient(patient, user?.usuario);

    setLastAction(
      `Atendimento finalizado para ${patient.nomeSocial || patient.nomePaciente}.`
    );

    handleCloseForwardModal();
    return;
  }

  function handleSendToEco(patient) {
    openConfirmModal({
      type: 'SEND_ECO',
      patient,
      title: 'Enviar para ECO?',
      subtitle: 'O atendimento médico ficará pausado.',
      message: `Deseja enviar ${patient.nomeSocial || patient.nomePaciente
        } para ECO e pausar o atendimento até o retorno do exame?`,
      confirmLabel: 'Enviar para ECO',
      variant: 'eco'
    });
  }

  function executeSendToEco(patient) {
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

  function handleConfirmAction() {
    const { type, patient } = confirmState;

    if (!patient) {
      closeConfirmModal();
      return;
    }

    if (type === 'CALL_OUT_OF_ORDER') {
      executeCall(patient);
    }

    if (type === 'MISSING') {
      executeMissing(patient);
    }

    if (type === 'FINISH') {
      executeFinish(patient);
    }

    if (type === 'SEND_ECO') {
      executeSendToEco(patient);
    }

    closeConfirmModal();
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

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        subtitle={confirmState.subtitle}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        variant={confirmState.variant}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
      />
    </section>
  );
}