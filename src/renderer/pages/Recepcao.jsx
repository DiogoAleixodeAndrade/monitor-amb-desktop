import AppShell from '../components/AppShell.jsx';

export default function Recepcao() {
  return (
    <AppShell
      title="Recepção"
      subtitle="Pesquisa, cadastro e check-in do paciente"
    >
      <div className="module-card">
        <p className="eyebrow">Módulo da recepção</p>
        <h2>Check-in do paciente</h2>
        <p>
          Aqui vamos criar a busca por CNS, cadastro de paciente, seleção de
          médico, especialidade, prioridade e envio para a fila do acolhimento.
        </p>
      </div>
    </AppShell>
  );
}