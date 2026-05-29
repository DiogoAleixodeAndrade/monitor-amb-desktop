import AppShell from '../components/AppShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Medico() {
  const { user } = useAuth();

  return (
    <AppShell
      title="Médico"
      subtitle="Fila individual do profissional logado"
    >
      <div className="module-card">
        <p className="eyebrow">Fila médica</p>
        <h2>{user?.medicoVinculado?.nome || user?.nome}</h2>

        <p>
          O médico logado verá somente os pacientes destinados a ele. Depois
          vamos adicionar chamada, início de atendimento, check-out,
          encaminhamentos e pausa para ECO.
        </p>

        <div className="rule-box">
          <strong>Regra importante</strong>
          <span>
            Médico não pode visualizar fila de outro médico. Esse filtro será
            aplicado no banco e também na interface.
          </span>
        </div>
      </div>
    </AppShell>
  );
}