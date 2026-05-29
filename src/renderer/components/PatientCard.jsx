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

  return (
    <article
      className={`patient-card ${patient.prioritario ? 'patient-priority' : ''
        } ${patient.retornoExame ? 'patient-eco-return' : ''}`}
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
            <span>Médico</span>
            <strong>{patient.nomeMedicoDestino || '-'}</strong>
          </div>

          <div>
            <span>Especialidade</span>
            <strong>{patient.especialidade || '-'}</strong>
          </div>

          <div>
            <span>Setor atual</span>
            <strong>{patient.setorAtual}</strong>
          </div>
        </div>

        {(patient.obsPrioridade || patient.retornoExame) && (
          <div className="patient-alert">
            {patient.retornoExame
              ? `Paciente retornou do ${patient.tipoExame} e deve voltar para o mesmo médico.`
              : patient.obsPrioridade}
          </div>
        )}

        <div className="patient-actions">
          <Button onClick={() => onCall(patient)}>Chamar paciente</Button>

          <Button variant="success" onClick={() => onAppeared(patient)}>
            Confirmar presença
          </Button>

          <Button variant="warning" onClick={() => onMissing(patient)}>
            Registrar ausência
          </Button>

          <Button variant="secondary" onClick={() => onForward(patient)}>
            Encaminhar paciente
          </Button>

          <Button variant="danger" onClick={() => onCheckout(patient)}>
            Finalizar atendimento
          </Button>
        </div>
      </div>
    </article>
  );
}