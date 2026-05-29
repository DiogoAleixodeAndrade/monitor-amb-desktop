import { useMemo, useState } from 'react';

import AdminFormModal from '../components/AdminFormModal.jsx';
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

const tabToModalType = {
  USERS: 'USER',
  PROFESSIONALS: 'PROFESSIONAL',
  SPECIALTIES: 'SPECIALTY',
  SETTINGS: 'SETTING'
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState('USERS');
  const [search, setSearch] = useState('');

  const [users, setUsers] = useState(adminUsers);
  const [professionals, setProfessionals] = useState(adminProfessionals);
  const [specialties, setSpecialties] = useState(adminSpecialties);
  const [settings, setSettings] = useState(adminSettings);

  const [modalState, setModalState] = useState({
    open: false,
    type: 'USER',
    mode: 'CREATE',
    data: null
  });

  const [feedback, setFeedback] = useState('');

  const summary = useMemo(
    () => ({
      users: users.length,
      professionals: professionals.length,
      specialties: specialties.length,
      settings: settings.length
    }),
    [users, professionals, specialties, settings]
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredUsers = users.filter((item) =>
    [item.nome, item.usuario, item.perfil, item.vinculo]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch)
  );

  const filteredProfessionals = professionals.filter((item) =>
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

  const filteredSpecialties = specialties.filter((item) =>
    [item.nome, item.status].join(' ').toLowerCase().includes(normalizedSearch)
  );

  const filteredSettings = settings.filter((item) =>
    [item.chave, item.nome, item.valor, item.descricao]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch)
  );

  function openCreateModal() {
    setFeedback('');

    setModalState({
      open: true,
      type: tabToModalType[activeTab],
      mode: 'CREATE',
      data: null
    });
  }

  function openEditModal(type, data) {
    setFeedback('');

    setModalState({
      open: true,
      type,
      mode: 'EDIT',
      data
    });
  }

  function closeModal() {
    setModalState((current) => ({
      ...current,
      open: false,
      data: null
    }));
  }

  function handleSave(payload) {
    if (modalState.type === 'USER') {
      saveUser(payload);
    }

    if (modalState.type === 'PROFESSIONAL') {
      saveProfessional(payload);
    }

    if (modalState.type === 'SPECIALTY') {
      saveSpecialty(payload);
    }

    if (modalState.type === 'SETTING') {
      saveSetting(payload);
    }

    closeModal();
  }

  function saveUser(payload) {
    if (modalState.mode === 'EDIT') {
      setUsers((current) =>
        current.map((item) =>
          item.id === modalState.data.id
            ? {
                ...item,
                ...payload
              }
            : item
        )
      );

      setFeedback('Usuário atualizado com sucesso.');
      return;
    }

    setUsers((current) => [
      {
        ...payload,
        id: Date.now()
      },
      ...current
    ]);

    setFeedback('Usuário cadastrado com sucesso.');
  }

  function saveProfessional(payload) {
    if (modalState.mode === 'EDIT') {
      setProfessionals((current) =>
        current.map((item) =>
          item.id === modalState.data.id
            ? {
                ...item,
                ...payload
              }
            : item
        )
      );

      setFeedback('Profissional atualizado com sucesso.');
      return;
    }

    setProfessionals((current) => [
      {
        ...payload,
        id: Date.now()
      },
      ...current
    ]);

    setFeedback('Profissional cadastrado com sucesso.');
  }

  function saveSpecialty(payload) {
    if (modalState.mode === 'EDIT') {
      setSpecialties((current) =>
        current.map((item) =>
          item.id === modalState.data.id
            ? {
                ...item,
                ...payload
              }
            : item
        )
      );

      setFeedback('Especialidade atualizada com sucesso.');
      return;
    }

    setSpecialties((current) => [
      {
        ...payload,
        id: Date.now()
      },
      ...current
    ]);

    setFeedback('Especialidade cadastrada com sucesso.');
  }

  function saveSetting(payload) {
    if (modalState.mode === 'EDIT') {
      setSettings((current) =>
        current.map((item) =>
          item.id === modalState.data.id
            ? {
                ...item,
                ...payload
              }
            : item
        )
      );

      setFeedback('Configuração atualizada com sucesso.');
      return;
    }

    setSettings((current) => [
      {
        ...payload,
        id: Date.now()
      },
      ...current
    ]);

    setFeedback('Configuração cadastrada com sucesso.');
  }

  function toggleUserStatus(user) {
    setUsers((current) =>
      current.map((item) =>
        item.id === user.id
          ? {
              ...item,
              status: item.status === 'Ativo' ? 'Inativo' : 'Ativo'
            }
          : item
      )
    );

    setFeedback(
      `Usuário ${user.nome} ${
        user.status === 'Ativo' ? 'inativado' : 'ativado'
      } com sucesso.`
    );
  }

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
              onClick={() => {
                setActiveTab(tab.id);
                setSearch('');
                setFeedback('');
              }}
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

      {feedback && <div className="admin-feedback">{feedback}</div>}

      {activeTab === 'USERS' && (
        <AdminSection
          title="Usuários do sistema"
          subtitle="Controle de login, perfil e vínculo operacional."
          actionLabel="Novo usuário"
          onAction={openCreateModal}
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
                  <span
                    className={
                      row.status === 'Ativo'
                        ? 'admin-status active'
                        : 'admin-status inactive'
                    }
                  >
                    {row.status}
                  </span>
                )
              }
            ]}
            rows={filteredUsers}
            renderActions={(row) => (
              <div className="admin-row-actions">
                <button onClick={() => openEditModal('USER', row)}>
                  Editar
                </button>

                <button onClick={() => toggleUserStatus(row)}>
                  {row.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                </button>
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
          onAction={openCreateModal}
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
            renderActions={(row) => (
              <div className="admin-row-actions">
                <button onClick={() => openEditModal('PROFESSIONAL', row)}>
                  Editar
                </button>
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
          onAction={openCreateModal}
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
            renderActions={(row) => (
              <div className="admin-row-actions">
                <button onClick={() => openEditModal('SPECIALTY', row)}>
                  Editar
                </button>
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
          onAction={openCreateModal}
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
            renderActions={(row) => (
              <div className="admin-row-actions">
                <button onClick={() => openEditModal('SETTING', row)}>
                  Editar
                </button>
              </div>
            )}
          />
        </AdminSection>
      )}

      <AdminFormModal
        open={modalState.open}
        type={modalState.type}
        mode={modalState.mode}
        initialData={modalState.data}
        onClose={closeModal}
        onSave={handleSave}
      />
    </AppShell>
  );
}