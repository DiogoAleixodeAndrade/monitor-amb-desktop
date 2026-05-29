import AppShell from '../components/AppShell.jsx';

export default function Curativo() {
  return (
    <AppShell
      title="Sala de Curativo"
      subtitle="Fila de pacientes encaminhados para curativo"
    >
      <div className="module-card">
        <p className="eyebrow">Curativo</p>
        <h2>Pacientes aguardando curativo</h2>
        <p>
          Aqui vamos montar a fila da sala de curativo com chamada, presença,
          ausência, check-out e encaminhamentos.
        </p>
      </div>
    </AppShell>
  );
}