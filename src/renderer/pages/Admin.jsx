import { useEffect, useMemo, useState } from 'react';

import AdminFormModal from '../components/AdminFormModal.jsx';
import AdminSection from '../components/AdminSection.jsx';
import AdminTable from '../components/AdminTable.jsx';
import AppShell from '../components/AppShell.jsx';
import {
  listAdminProfessionalsService,
  listAdminSettingsService,
  listAdminSpecialtiesService,
  listAdminUsersService,
  saveAdminProfessionalService,
  saveAdminSettingService,
  saveAdminSpecialtyService,
  saveAdminUserService
} from '../services/adminService.js';

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

  const [users, setUsers] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [settings, setSettings] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  const [modalState, setModalState] = useState({
    open: false,
    type: 'USER',
    mode: 'CREATE',
    data: null
  });

  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setLoadingAdmin(true);

    const [usersResult, professionalsResult, specialtiesResult, settingsResult] =
      await Promise.all([
        listAdminUsersService(),
        listAdminProfessionalsService(),
        listAdminSpecialtiesService(),
        listAdminSettingsService()
      ]);

    if (usersResult.success) {
      setUsers(usersResult.data);
    }

    if (professionalsResult.success) {
      setProfessionals(professionalsResult.data);
    }

    if (specialtiesResult.success) {
      setSpecialties(specialtiesResult.data);
    }

    if (settingsResult.success) {
      setSettings(settingsResult.data);
    }

    setLoadingAdmin(false);
  }

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

  async function handleSave(payload) {
    if (modalState.type === 'USER') {
      await saveUser(payload);
    }

    if (modalState.type === 'PROFESSIONAL') {
      await saveProfessional(payload);
    }

    if (modalState.type === 'SPECIALTY') {
      await saveSpecialty(payload);
    }

    if (modalState.type === 'SETTING') {
      await saveSetting(payload);
    }

    closeModal();
  }

  async function saveUser(payload) {
    const dataToSave =
      modalState.mode === 'EDIT'
        ? {
          ...modalState.data,
          ...payload
        }
        : payload;

    const result = await saveAdminUserService(dataToSave, modalState.mode);

    if (!result.success) {
      setFeedback(result.message || 'Erro ao salvar usuário.');
      return;
    }

    setUsers(result.data);
    setFeedback(
      modalState.mode === 'EDIT'
        ? 'Usuário atualizado com sucesso.'
        : 'Usuário cadastrado com sucesso.'
    );
  }

  async function saveProfessional(payload) {
    const dataToSave =
      modalState.mode === 'EDIT'
        ? {
          ...modalState.data,
          ...payload
        }
        : payload;

    const result = await saveAdminProfessionalService(
      dataToSave,
      modalState.mode
    );

    if (!result.success) {
      setFeedback(result.message || 'Erro ao salvar profissional.');
      return;
    }

    setProfessionals(result.data);
    setFeedback(
      modalState.mode === 'EDIT'
        ? 'Profissional atualizado com sucesso.'
        : 'Profissional cadastrado com sucesso.'
    );
  }

  async function saveSpecialty(payload) {
    const dataToSave =
      modalState.mode === 'EDIT'
        ? {
          ...modalState.data,
          ...payload
        }
        : payload;

    const result = await saveAdminSpecialtyService(dataToSave, modalState.mode);

    if (!result.success) {
      setFeedback(result.message || 'Erro ao salvar especialidade.');
      return;
    }

    setSpecialties(result.data);
    setFeedback(
      modalState.mode === 'EDIT'
        ? 'Especialidade atualizada com sucesso.'
        : 'Especialidade cadastrada com sucesso.'
    );
  }

  async function saveSetting(payload) {
    const dataToSave =
      modalState.mode === 'EDIT'
        ? {
          ...modalState.data,
          ...payload
        }
        : payload;

    const result = await saveAdminSettingService(dataToSave, modalState.mode);

    if (!result.success) {
      setFeedback(result.message || 'Erro ao salvar configuração.');
      return;
    }

    setSettings(result.data);
    setFeedback(
      modalState.mode === 'EDIT'
        ? 'Configuração atualizada com sucesso.'
        : 'Configuração cadastrada com sucesso.'
    );
  }

  async function toggleUserStatus(user) {
    const updatedUser = {
      ...user,
      status: user.status === 'Ativo' ? 'Inativo' : 'Ativo'
    };

    const result = await saveAdminUserService(updatedUser, 'EDIT');

    if (!result.success) {
      setFeedback(result.message || 'Erro ao alterar status do usuário.');
      return;
    }

    setUsers(result.data);

    setFeedback(
      `Usuário ${user.nome} ${user.status === 'Ativo' ? 'inativado' : 'ativado'
      } com sucesso.`
    );
  }

  return (
    <AppShell
      title="Administração"
      subtitle="Usuários, permissões, profissionais, especialidades e configurações"
    >
      {loadingAdmin && (
        <div className="admin-feedback">Carregando dados administrativos...</div>
      )}
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