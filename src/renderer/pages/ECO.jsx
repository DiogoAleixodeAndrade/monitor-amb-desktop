import AppShell from '../components/AppShell.jsx';

export default function ECO() {
  return (
    <AppShell
      title="Sala de ECO"
      subtitle="Controle de pacientes pausados para ecocardiograma"
    >
      <div className="module-card">
        <p className="eyebrow">Fluxo ECO</p>
        <h2>Pacientes enviados para ECO</h2>
        <p>
          Aqui vamos controlar exame em andamento, ECO realizado e retorno do
          paciente para a fila do mesmo médico com sinalização RETORNO ECO.
        </p>
      </div>
    </AppShell>
  );
}