import { useEffect, useMemo, useState } from 'react';

import AppShell from '../components/AppShell.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { createPatient, findPatientByCns } from '../services/pacientesService.js';
import { listProfessionals } from '../services/profissionaisService.js';
import { priorities } from '../data/priorities.js';

const emptyPatient = {
  idPaciente: null,
  cns: '',
  nomePaciente: '',
  nomeSocial: '',
  prontuario: '',
  dataNascimento: ''
};

export default function Recepcao() {
  const { user } = useAuth();
  const { checkInPatient } = useQueue();
  const [professionals, setProfessionals] = useState([]);

  const [cnsBusca, setCnsBusca] = useState('');
  const [patient, setPatient] = useState(emptyPatient);
  const [pacienteEncontrado, setPacienteEncontrado] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);

  const [idProfissional, setIdProfissional] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [prioridadeId, setPrioridadeId] = useState('');
  const [observacaoPrioridade, setObservacaoPrioridade] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    async function loadProfessionals() {
      const result = await listProfessionals();

      if (result.success) {
        setProfessionals(result.professionals);
      }
    }

    loadProfessionals();
  }, []);

  const selectedProfessional = useMemo(() => {
    return professionals.find(
      (item) => String(item.idProfissional) === String(idProfissional)
    );
  }, [idProfissional]);

  const availableSpecialties = selectedProfessional?.especialidades || [];

  async function handleSearchPatient(event) {
    event.preventDefault();
    setFeedback('');

    const normalizedCns = cnsBusca.trim();

    if (!normalizedCns) {
      setFeedback('Digite o CNS do paciente para pesquisar.');
      return;
    }

    const result = await findPatientByCns(normalizedCns);

    if (!result.success) {
      setFeedback(result.message || 'Erro ao pesquisar paciente.');
      return;
    }

    if (result.patient) {
      setPatient(result.patient);
      setPacienteEncontrado(true);
      setModoCadastro(false);
      setFeedback('Paciente encontrado. Confira os dados antes do check-in.');
      return;
    }

    setPatient({
      ...emptyPatient,
      cns: normalizedCns
    });
    setPacienteEncontrado(false);
    setModoCadastro(true);
    setFeedback('Paciente não localizado na base interna. Cadastre para continuar.');
  }

  function handleProfessionalChange(event) {
    const value = event.target.value;

    setIdProfissional(value);

    const professional = mockProfessionals.find(
      (item) => String(item.idProfissional) === String(value)
    );

    if (professional?.especialidades?.length === 1) {
      setEspecialidade(professional.especialidades[0]);
    } else {
      setEspecialidade('');
    }
  }

  function updatePatientField(field, value) {
    setPatient((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleCreatePatient() {
    setFeedback('');

    if (!patient.cns || !patient.nomePaciente || !patient.prontuario) {
      setFeedback('Preencha CNS, nome do paciente e prontuário para cadastrar.');
      return;
    }

    const result = await createPatient(patient);

    if (!result.success) {
      setFeedback(result.message || 'Erro ao cadastrar paciente.');
      return;
    }

    setPatient(result.patient);
    setPacienteEncontrado(true);
    setModoCadastro(false);
    setFeedback('Paciente cadastrado com sucesso. Agora realize o check-in.');
  }

  async function handleCheckIn(event) {
    event.preventDefault();
    setFeedback('');

    if (!patient.cns || !patient.nomePaciente || !patient.prontuario) {
      setFeedback('Preencha CNS, nome do paciente e prontuário.');
      return;
    }

    if (!selectedProfessional) {
      setFeedback('Selecione o profissional de destino.');
      return;
    }

    if (!especialidade) {
      setFeedback('Selecione a especialidade do atendimento.');
      return;
    }

    await checkInPatient({
      patient,
      profissional: selectedProfessional,
      especialidade,
      prioridadeId,
      observacaoPrioridade,
      usuarioResponsavel: user?.usuario
    });

    setFeedback(
      `Check-in realizado. ${patient.nomePaciente} foi enviado para o Acolhimento.`
    );

    setCnsBusca('');
    setPatient(emptyPatient);
    setPacienteEncontrado(false);
    setModoCadastro(false);
    setIdProfissional('');
    setEspecialidade('');
    setPrioridadeId('');
    setObservacaoPrioridade('');
  }

  return (
    <AppShell
      title="Recepção"
      subtitle="Pesquisa, cadastro e check-in do paciente"
    >
      <div className="reception-grid">
        <section className="module-card">
          <p className="eyebrow">Pesquisa do paciente</p>
          <h2>Buscar por CNS</h2>

          <form className="search-row" onSubmit={handleSearchPatient}>
            <Input
              label="CNS do paciente"
              placeholder="Digite o CNS"
              value={cnsBusca}
              onChange={(event) => setCnsBusca(event.target.value)}
            />

            <Button type="submit">Pesquisar paciente</Button>
          </form>

          <div className="quick-cns">
            <strong>Teste rápido:</strong>
            <button onClick={() => setCnsBusca('898001234567890')}>
              898001234567890
            </button>
            <button onClick={() => setCnsBusca('898009876543210')}>
              898009876543210
            </button>
            <button onClick={() => setCnsBusca('111222333444555')}>
              CNS novo
            </button>
          </div>

          {feedback && <div className="action-feedback">{feedback}</div>}
        </section>

        <section className="module-card">
          <p className="eyebrow">
            {modoCadastro ? 'Cadastro novo' : 'Dados do paciente'}
          </p>

          <h2>
            {pacienteEncontrado
              ? 'Paciente encontrado'
              : modoCadastro
                ? 'Cadastrar paciente'
                : 'Aguardando pesquisa'}
          </h2>

          <form className="patient-form" onSubmit={handleCheckIn}>
            <div className="form-grid">
              <Input
                label="CNS"
                value={patient.cns}
                onChange={(event) => updatePatientField('cns', event.target.value)}
                placeholder="CNS"
              />

              <Input
                label="Prontuário"
                value={patient.prontuario}
                onChange={(event) =>
                  updatePatientField('prontuario', event.target.value)
                }
                placeholder="Ex: IECAC-001234"
              />

              <Input
                label="Nome completo"
                value={patient.nomePaciente}
                onChange={(event) =>
                  updatePatientField('nomePaciente', event.target.value)
                }
                placeholder="Nome do paciente"
              />

              <Input
                label="Nome social"
                value={patient.nomeSocial}
                onChange={(event) =>
                  updatePatientField('nomeSocial', event.target.value)
                }
                placeholder="Opcional"
              />

              <Input
                label="Data de nascimento"
                type="date"
                value={patient.dataNascimento}
                onChange={(event) =>
                  updatePatientField('dataNascimento', event.target.value)
                }
              />

              <label className="field">
                <span>Profissional</span>
                <select value={idProfissional} onChange={handleProfessionalChange}>
                  <option value="">Selecione o profissional</option>

                  {professionals.map((professional) => (
                    <option
                      key={professional.idProfissional}
                      value={professional.idProfissional}
                    >
                      {professional.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Especialidade</span>
                <select
                  value={especialidade}
                  onChange={(event) => setEspecialidade(event.target.value)}
                  disabled={!selectedProfessional}
                >
                  <option value="">Selecione a especialidade</option>

                  {availableSpecialties.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Prioridade do dia</span>
                <select
                  value={prioridadeId}
                  onChange={(event) => setPrioridadeId(event.target.value)}
                >
                  <option value="">Sem prioridade</option>

                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span>Observação da prioridade</span>
              <textarea
                value={observacaoPrioridade}
                onChange={(event) =>
                  setObservacaoPrioridade(event.target.value)
                }
                placeholder="Ex: paciente cadeirante, pós-operatório, dificuldade de locomoção..."
                rows={4}
              />
            </label>

            <div className="checkin-summary">
              <div>
                <span>Destino inicial</span>
                <strong>Acolhimento</strong>
              </div>

              <div>
                <span>Médico destino</span>
                <strong>{selectedProfessional?.nome || '-'}</strong>
              </div>

              <div>
                <span>Especialidade</span>
                <strong>{especialidade || '-'}</strong>
              </div>

              <div>
                <span>Prioridade</span>
                <strong>
                  {priorities.find((item) => item.id === prioridadeId)?.label ||
                    'Sem prioridade'}
                </strong>
              </div>
            </div>

            <div className="form-actions">
              {modoCadastro && !pacienteEncontrado && (
                <Button type="button" variant="secondary" onClick={handleCreatePatient}>
                  Cadastrar paciente
                </Button>
              )}

              <Button type="submit" disabled={modoCadastro && !pacienteEncontrado}>
                Realizar check-in
              </Button>
            </div>
          </form>
        </section>
      </div>
    </AppShell>
  );
}