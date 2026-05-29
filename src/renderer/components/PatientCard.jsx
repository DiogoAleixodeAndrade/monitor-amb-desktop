import { useEffect, useState } from 'react';

import PriorityBadge from './PriorityBadge.jsx';
import StatusBadge from './StatusBadge.jsx';
import Button from './Button.jsx';
import {
  canFinishAttendance,
  formatDateTime,
  formatRemainingTime
} from '../utils/queueRules.js';

export default function PatientCard({
  patient,
  position,
  context = 'DEFAULT',
  onCall,
  onAppeared,
  onMissing,
  onCheckout,
  onForward,
  onSendToEco,
  onStartEco,
  onFinishEco,
  onReturnFromEco
}) {
  const [now, setNow] = useState(Date.now());

  const displayName = patient.nomeSocial || patient.nomePaciente;

  const isCalled = patient.statusAtendimento === 'CHAMADO';
  const isInProgress = patient.statusAtendimento === 'EM_ATENDIMENTO';
  const isMissing = patient.statusAtendimento === 'NAO_COMPARECEU';
  const isPausedEco = patient.statusAtendimento === 'PAUSADO_ECO';
  const isWaitingEcoReturn =
    patient.statusAtendimento === 'AGUARDANDO_RETORNO_ECO';

  const finishValidation = canFinishAttendance(patient);
  const canFinish = isInProgress && finishValidation.allowed;

  useEffect(() => {
    if (!isInProgress || finishValidation.allowed) {
      return;
    }

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [isInProgress, finishValidation.allowed]);

  return (
    <article
      className={`patient-card ${
        patient.prioritario ? 'patient-priority' : ''
      } ${patient.retornoExame ? 'patient-eco-return' : ''} ${
        isInProgress ? 'patient-in-progress' : ''
      } ${isMissing ? 'patient-missing' : ''}`}
    >
      <div className="patient-position">
        <span>{position}</span>
      </div>

      <div className="patient-main">
        <div className="patient-topline">
          <div>
            <h3>{displayName}</h3>
            <p>
              CNS {patient.cns} • Prontuário {patient.prontuario}
            </p>
          </div>

          <div className="patient-badges">
            <PriorityBadge patient={patient} />
            <StatusBadge status={patient.statusAtendimento} />
          </div>
        </div>

        <div className="patient-meta">
          <div>
            <span>Entrada</span>
            <strong>{formatDateTime(patient.dataHoraEntrada)}</strong>
          </div>

          <div>
            <span>Chamada</span>
            <strong>{formatDateTime(patient.dataHoraChamada)}</strong>
          </div>

          <div>
            <span>Presença</span>
            <strong>{formatDateTime(patient.dataHoraApareceu)}</strong>
          </div>

          <div>
            <span>Setor atual</span>
            <strong>{patient.setorAtual}</strong>
          </div>
        </div>

        {(patient.obsPrioridade ||
          patient.retornoExame ||
          isMissing ||
          isPausedEco ||
          isWaitingEcoReturn ||
          (isInProgress && !finishValidation.allowed)) && (
          <div className="patient-alert">
            {isInProgress && !finishValidation.allowed
              ? `Finalização bloqueada. Tempo mínimo de atendimento: 1 minuto. Libera em ${formatRemainingTime(
                  finishValidation.remainingSeconds
                )}.`
              : isMissing
                ? 'Paciente registrado como ausente. Ele poderá ser chamado novamente após os próximos pacientes.'
                : isPausedEco
                  ? 'Paciente pausado para realização de ECO. O atendimento médico ficará suspenso até o retorno.'
                  : isWaitingEcoReturn
                    ? 'ECO realizado. Paciente aguardando retorno para a fila do mesmo médico.'
                    : patient.retornoExame
                      ? `Paciente retornou do ${patient.tipoExame} e deve voltar para o mesmo médico.`
                      : patient.obsPrioridade}
          </div>
        )}

        {context === 'ECO' ? (
          <div className="patient-actions">
            <Button
              variant="success"
              onClick={() => onStartEco(patient)}
              disabled={!isPausedEco}
            >
              Iniciar ECO
            </Button>

            <Button
              variant="secondary"
              onClick={() => onFinishEco(patient)}
              disabled={!isInProgress}
            >
              ECO realizado
            </Button>

            <Button
              variant="primary"
              onClick={() => onReturnFromEco(patient)}
              disabled={!isWaitingEcoReturn}
            >
              Retornar ao médico
            </Button>
          </div>
        ) : (
          <div className="patient-actions">
            <Button onClick={() => onCall(patient)} disabled={isInProgress}>
              Chamar paciente
            </Button>

            <Button
              variant="success"
              onClick={() => onAppeared(patient)}
              disabled={!isCalled}
            >
              Confirmar presença
            </Button>

            <Button
              variant="warning"
              onClick={() => onMissing(patient)}
              disabled={isInProgress}
            >
              Registrar ausência
            </Button>

            <Button
              variant="secondary"
              onClick={() => onForward(patient)}
              disabled={!isInProgress}
            >
              Encaminhar paciente
            </Button>

            {context === 'MEDICO' && (
              <Button
                variant="eco"
                onClick={() => onSendToEco(patient)}
                disabled={!isInProgress}
              >
                Enviar para ECO
              </Button>
            )}

            <Button
              variant="danger"
              onClick={() => onCheckout(patient)}
              disabled={!canFinish}
            >
              {isInProgress && !finishValidation.allowed
                ? `Finalizar em ${formatRemainingTime(
                    finishValidation.remainingSeconds
                  )}`
                : 'Finalizar atendimento'}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}