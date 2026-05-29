import { useEffect, useState } from 'react';

import Button from './Button.jsx';
import Modal from './Modal.jsx';

const initialForms = {
  USER: {
    nome: '',
    usuario: '',
    perfil: 'RECEPCAO',
    status: 'Ativo',
    vinculo: ''
  },

  PROFESSIONAL: {
    nome: '',
    usuario: '',
    crm: '',
    especialidades: '',
    status: 'Ativo'
  },

  SPECIALTY: {
    nome: '',
    profissionais: 0,
    status: 'Ativa'
  },

  SETTING: {
    nome: '',
    chave: '',
    valor: '',
    descricao: ''
  }
};

const modalTitles = {
  USER: 'Usuário',
  PROFESSIONAL: 'Profissional',
  SPECIALTY: 'Especialidade',
  SETTING: 'Configuração'
};

export default function AdminFormModal({
  open,
  type,
  mode = 'CREATE',
  initialData = null,
  onClose,
  onSave
}) {
  const [form, setForm] = useState(initialForms[type] || {});

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      if (type === 'PROFESSIONAL') {
        setForm({
          ...initialData,
          especialidades: Array.isArray(initialData.especialidades)
            ? initialData.especialidades.join(', ')
            : initialData.especialidades || ''
        });

        return;
      }

      setForm(initialData);
      return;
    }

    setForm(initialForms[type] || {});
  }, [open, initialData, type]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      ...form
    };

    if (type === 'PROFESSIONAL') {
      payload.especialidades = String(form.especialidades || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (type === 'SPECIALTY') {
      payload.profissionais = Number(form.profissionais || 0);
    }

    onSave(payload);
  }

  const titlePrefix = mode === 'EDIT' ? 'Editar' : 'Novo';

  return (
    <Modal
      open={open}
      title={`${titlePrefix} ${modalTitles[type] || ''}`}
      subtitle="Preencha as informações para atualizar a área administrativa."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit}>
            {mode === 'EDIT' ? 'Salvar alterações' : 'Cadastrar'}
          </Button>
        </>
      }
    >
      <form className="admin-form" onSubmit={handleSubmit}>
        {type === 'USER' && (
          <>
            <div className="form-grid">
              <label className="field">
                <span>Nome</span>
                <input
                  value={form.nome || ''}
                  onChange={(event) => updateField('nome', event.target.value)}
                  placeholder="Nome do usuário"
                />
              </label>

              <label className="field">
                <span>Usuário de login</span>
                <input
                  value={form.usuario || ''}
                  onChange={(event) =>
                    updateField('usuario', event.target.value)
                  }
                  placeholder="ex: joao.silva"
                />
              </label>

              <label className="field">
                <span>Perfil</span>
                <select
                  value={form.perfil || 'RECEPCAO'}
                  onChange={(event) => updateField('perfil', event.target.value)}
                >
                  <option value="ADM">ADM</option>
                  <option value="RECEPCAO">RECEPÇÃO</option>
                  <option value="ACOLHIMENTO">ACOLHIMENTO</option>
                  <option value="MEDICO">MÉDICO</option>
                  <option value="ECG">ECG</option>
                  <option value="MEDICACAO">MEDICAÇÃO</option>
                  <option value="CURATIVO">CURATIVO</option>
                  <option value="ECO">ECO</option>
                  <option value="MAPA_CIRURGICO">MAPA 24H</option>
                  <option value="PAINEL">PAINEL</option>
                </select>
              </label>

              <label className="field">
                <span>Status</span>
                <select
                  value={form.status || 'Ativo'}
                  onChange={(event) => updateField('status', event.target.value)}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span>Vínculo operacional</span>
              <input
                value={form.vinculo || ''}
                onChange={(event) => updateField('vinculo', event.target.value)}
                placeholder="Ex: Recepção, Médico João Carlos, E.C.G. + Mapa 24h"
              />
            </label>

            <div className="admin-form-note">
              A senha real será criada depois com hash no Access. Nesta etapa,
              estamos montando o CRUD visual.
            </div>
          </>
        )}

        {type === 'PROFESSIONAL' && (
          <>
            <div className="form-grid">
              <label className="field">
                <span>Nome do profissional</span>
                <input
                  value={form.nome || ''}
                  onChange={(event) => updateField('nome', event.target.value)}
                  placeholder="Nome completo"
                />
              </label>

              <label className="field">
                <span>Usuário vinculado</span>
                <input
                  value={form.usuario || ''}
                  onChange={(event) =>
                    updateField('usuario', event.target.value)
                  }
                  placeholder="ex: joao.silva"
                />
              </label>

              <label className="field">
                <span>CRM</span>
                <input
                  value={form.crm || ''}
                  onChange={(event) => updateField('crm', event.target.value)}
                  placeholder="CRM do profissional"
                />
              </label>

              <label className="field">
                <span>Status</span>
                <select
                  value={form.status || 'Ativo'}
                  onChange={(event) => updateField('status', event.target.value)}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span>Especialidades</span>
              <input
                value={form.especialidades || ''}
                onChange={(event) =>
                  updateField('especialidades', event.target.value)
                }
                placeholder="Separe por vírgula. Ex: Cardiologia, Arritmia"
              />
            </label>
          </>
        )}

        {type === 'SPECIALTY' && (
          <div className="form-grid">
            <label className="field">
              <span>Nome da especialidade</span>
              <input
                value={form.nome || ''}
                onChange={(event) => updateField('nome', event.target.value)}
                placeholder="Ex: Cardiologia"
              />
            </label>

            <label className="field">
              <span>Quantidade de profissionais</span>
              <input
                type="number"
                min="0"
                value={form.profissionais || 0}
                onChange={(event) =>
                  updateField('profissionais', event.target.value)
                }
              />
            </label>

            <label className="field">
              <span>Status</span>
              <select
                value={form.status || 'Ativa'}
                onChange={(event) => updateField('status', event.target.value)}
              >
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
              </select>
            </label>
          </div>
        )}

        {type === 'SETTING' && (
          <>
            <div className="form-grid">
              <label className="field">
                <span>Nome da configuração</span>
                <input
                  value={form.nome || ''}
                  onChange={(event) => updateField('nome', event.target.value)}
                  placeholder="Ex: Tempo de exibição no painel"
                />
              </label>

              <label className="field">
                <span>Chave técnica</span>
                <input
                  value={form.chave || ''}
                  onChange={(event) => updateField('chave', event.target.value)}
                  placeholder="Ex: TEMPO_EXIBICAO_CHAMADA_MS"
                />
              </label>

              <label className="field">
                <span>Valor</span>
                <input
                  value={form.valor || ''}
                  onChange={(event) => updateField('valor', event.target.value)}
                  placeholder="Ex: 10000"
                />
              </label>
            </div>

            <label className="field">
              <span>Descrição</span>
              <textarea
                value={form.descricao || ''}
                onChange={(event) =>
                  updateField('descricao', event.target.value)
                }
                placeholder="Explique para que essa configuração serve"
                rows={4}
              />
            </label>
          </>
        )}
      </form>
    </Modal>
  );
}