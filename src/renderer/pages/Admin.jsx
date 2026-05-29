import { useMemo, useState } from 'react';

import AdminSection from '../components/AdminSection.jsx';
import AdminTable from '../components/AdminTable.jsx';
import AppShell from '../components/AppShell.jsx';
import {
  adminProfessionals,
  adminSettings,
  adminSpecialties,
  adminUsers
} from '../data/adminMockData.js';

const tabs = [
  {
    id: 'USERS',
    label: 'Usuários'
  },
  {
    id: 'PROFESSIONALS',
    label: 'Profissionais'
  },
  {
    id: 'SPECIALTIES',
    label: 'Especialidades'
  },
  {
    id: 'SETTINGS',
    label: 'Configurações'
  }
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('USERS');
  const [search, setSearch] = useState('');

  const summary = useMemo(
    () => ({
      users: adminUsers.length,
      professionals: adminProfessionals.length,
      specialties: adminSpecialties.length,
      settings: adminSettings.length
    }),
    []
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredUsers = adminUsers.filter((item) =>
    [item.nome, item.usuario, item.perfil, item.vinculo]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch)
  );

  const filteredProfessionals = adminProfessionals.filter((item) =>
    [
      item.nome,
      item.usuario,
      item.crm,
      item.status,
      item.especialidades.join(' ')
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch)
  );

  const filteredSpecialties = adminSpecialties.filter((item) =>
    [item.nome, item.status].join(' ').toLowerCase().includes(normalizedSearch)
  );

  const filteredSettings = adminSettings.filter((item) =>
    [item.chave, item.nome, item.valor, item.descricao]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch)
  );

  return (
    <AppShell
      title="Administração"
      subtitle="Usuários, permissões, profissionais, especialidades e configurações"
    >
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Central administrativa</p>
          <h2>Gestão do Monitor Amb</h2>
          <p>
            Controle os acessos, vínculos médicos, especialidades e parâmetros
            do sistema.
          </p>
        </div>

        <div className="admin-hero-grid">
          <div>
            <span>Usuários</span>
            <strong>{summary.users}</strong>
          </div>

          <div>
            <span>Profissionais</span>
            <strong>{summary.professionals}</strong>
          </div>

          <div>
            <span>Especialidades</span>
            <strong>{summary.specialties}</strong>
          </div>

          <div>
            <span>Configurações</span>
            <strong>{summary.settings}</strong>
          </div>
        </div>
      </section>

      <section className="admin-toolbar">
        <div className="admin-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label className="field admin-search">
          <span>Buscar</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar na administração..."
          />
        </label>
      </section>

      {activeTab === 'USERS' && (
        <AdminSection
          title="Usuários do sistema"
          subtitle="Controle de login, perfil e vínculo operacional."
          actionLabel="Novo usuário"
        >
          <AdminTable
            columns={[
              {
                key: 'nome',
                label: 'Nome'
              },
              {
                key: 'usuario',
                label: 'Usuário'
              },
              {
                key: 'perfil',
                label: 'Perfil',
                render: (row) => <span className="admin-badge">{row.perfil}</span>
              },
              {
                key: 'vinculo',
                label: 'Vínculo'
              },
              {
                key: 'status',
                label: 'Status',
                render: (row) => (
                  <span className="admin-status active">{row.status}</span>
                )
              }
            ]}
            rows={filteredUsers}
            renderActions={() => (
              <div className="admin-row-actions">
                <button>Editar</button>
                <button>Permissões</button>
              </div>
            )}
          />
        </AdminSection>
      )}

      {activeTab === 'PROFESSIONALS' && (
        <AdminSection
          title="Profissionais"
          subtitle="Médicos e profissionais vinculados às filas de atendimento."
          actionLabel="Novo profissional"
        >
          <AdminTable
            columns={[
              {
                key: 'nome',
                label: 'Nome'
              },
              {
                key: 'usuario',
                label: 'Usuário vinculado'
              },
              {
                key: 'crm',
                label: 'CRM'
              },
              {
                key: 'especialidades',
                label: 'Especialidades',
                render: (row) => (
                  <div className="admin-tags">
                    {row.especialidades.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                )
              },
              {
                key: 'status',
                label: 'Status',
                render: (row) => (
                  <span className="admin-status active">{row.status}</span>
                )
              }
            ]}
            rows={filteredProfessionals}
            renderActions={() => (
              <div className="admin-row-actions">
                <button>Editar</button>
                <button>Vincular especialidade</button>
              </div>
            )}
          />
        </AdminSection>
      )}

      {activeTab === 'SPECIALTIES' && (
        <AdminSection
          title="Especialidades"
          subtitle="Especialidades disponíveis para agendamento e filas médicas."
          actionLabel="Nova especialidade"
        >
          <AdminTable
            columns={[
              {
                key: 'nome',
                label: 'Especialidade'
              },
              {
                key: 'profissionais',
                label: 'Profissionais'
              },
              {
                key: 'status',
                label: 'Status',
                render: (row) => (
                  <span className="admin-status active">{row.status}</span>
                )
              }
            ]}
            rows={filteredSpecialties}
            renderActions={() => (
              <div className="admin-row-actions">
                <button>Editar</button>
                <button>Inativar</button>
              </div>
            )}
          />
        </AdminSection>
      )}

      {activeTab === 'SETTINGS' && (
        <AdminSection
          title="Configurações"
          subtitle="Parâmetros importantes do painel e das regras de atendimento."
          actionLabel="Nova configuração"
        >
          <AdminTable
            columns={[
              {
                key: 'nome',
                label: 'Configuração'
              },
              {
                key: 'chave',
                label: 'Chave técnica'
              },
              {
                key: 'valor',
                label: 'Valor',
                render: (row) => <span className="admin-badge">{row.valor}</span>
              },
              {
                key: 'descricao',
                label: 'Descrição'
              }
            ]}
            rows={filteredSettings}
            renderActions={() => (
              <div className="admin-row-actions">
                <button>Editar</button>
              </div>
            )}
          />
        </AdminSection>
      )}
    </AppShell>
  );
}