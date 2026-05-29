import AppShell from '../components/AppShell.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <AppShell
      title="Dashboard"
      subtitle="Visão geral do atendimento ambulatorial"
    >
      <div className="stats-grid">
        <article className="stat-card">
          <span>Pacientes aguardando</span>
          <strong>24</strong>
          <small>Filas ativas no momento</small>
        </article>

        <article className="stat-card">
          <span>Prioridades</span>
          <strong>06</strong>
          <small>Cadeirante, idoso ou pós-operatório</small>
        </article>

        <article className="stat-card">
          <span>Em atendimento</span>
          <strong>11</strong>
          <small>Setores assistenciais</small>
        </article>

        <article className="stat-card">
          <span>Retorno ECO</span>
          <strong>03</strong>
          <small>Pacientes aguardando retorno médico</small>
        </article>
      </div>

      <div className="welcome-card">
        <p className="eyebrow">Sessão atual</p>
        <h2>Bem-vindo, {user?.nome}</h2>
        <p>
          Perfil ativo: <strong>{user?.perfil}</strong>
        </p>

        {user?.perfil === 'MEDICO' && (
          <p>
            Médico vinculado:{' '}
            <strong>{user?.medicoVinculado?.nome || 'não informado'}</strong>
          </p>
        )}
      </div>
    </AppShell>
  );
}