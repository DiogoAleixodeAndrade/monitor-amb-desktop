import AppShell from '../components/AppShell.jsx';

export default function Admin() {
  return (
    <AppShell
      title="Administração"
      subtitle="Usuários, permissões, profissionais e configurações"
    >
      <div className="module-card">
        <p className="eyebrow">Área administrativa</p>
        <h2>Configurações do sistema</h2>
        <p>
          Aqui vamos gerenciar usuários, perfis, médicos, especialidades,
          setores, permissões e configurações do painel.
        </p>
      </div>
    </AppShell>
  );
}