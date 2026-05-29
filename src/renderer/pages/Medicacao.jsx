import AppShell from '../components/AppShell.jsx';

export default function Medicacao() {
  return (
    <AppShell
      title="Sala de Medicação"
      subtitle="Fila de pacientes encaminhados para medicação"
    >
      <div className="module-card">
        <p className="eyebrow">Medicação</p>
        <h2>Pacientes aguardando medicação</h2>
        <p>
          Aqui vamos montar a fila da sala de medicação com chamada, presença,
          ausência, check-out e encaminhamentos.
        </p>
      </div>
    </AppShell>
  );
}