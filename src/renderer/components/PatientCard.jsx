import PriorityBadge from './PriorityBadge.jsx';
import StatusBadge from './StatusBadge.jsx';
import Button from './Button.jsx';
import { formatDateTime } from '../utils/queueRules.js';

export default function PatientCard({
  patient,
  position,
  onCall,
  onAppeared,
  onMissing,
  onCheckout,
  onForward
}) {
  const displayName = patient.nomeSocial || patient.nomePaciente;

  const isCalled = patient.statusAtendimento === 'CHAMADO';
  const isInProgress = patient.statusAtendimento === 'EM_ATENDIMENTO';
  const isMissing = patient.statusAtendimento === 'NAO_COMPARECEU';

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
            <span>Médico</span>
            <strong>{patient.nomeMedicoDestino || '-'}</strong>
          </div>

          <div>
            <span>Setor atual</span>
            <strong>{patient.setorAtual}</strong>
          </div>
        </div>

        {(patient.obsPrioridade || patient.retornoExame || isMissing) && (
          <div className="patient-alert">
            {isMissing
              ? 'Paciente registrado como ausente. Ele poderá ser chamado novamente após os próximos pacientes.'
              : patient.retornoExame
                ? `Paciente retornou do ${patient.tipoExame} e deve voltar para o mesmo médico.`
                : patient.obsPrioridade}
          </div>
        )}

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

          <Button
            variant="danger"
            onClick={() => onCheckout(patient)}
            disabled={!isInProgress}
          >
            Finalizar atendimento
          </Button>
        </div>
      </div>
    </article>
  );
}