import AppShell from '../components/AppShell.jsx';

export default function Acolhimento() {
  return (
    <AppShell
      title="Acolhimento"
      subtitle="Fila de pacientes aguardando classificação/encaminhamento"
    >
      <div className="module-card">
        <p className="eyebrow">Fila do acolhimento</p>
        <h2>Pacientes aguardando</h2>
        <p>
          Aqui vamos listar apenas pacientes no setor ACOLHIMENTO, com destaque
          para prioridade e botões de chamada, apareceu, não apareceu,
          check-out e encaminhamento.
        </p>
      </div>
    </AppShell>
  );
}