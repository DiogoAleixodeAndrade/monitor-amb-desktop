export const adminUsers = [
  {
    id: 1,
    nome: 'Administrador',
    usuario: 'admin',
    perfil: 'ADM',
    status: 'Ativo',
    vinculo: 'Administração'
  },
  {
    id: 2,
    nome: 'Recepção IECAC',
    usuario: 'recepcao',
    perfil: 'RECEPCAO',
    status: 'Ativo',
    vinculo: 'Recepção'
  },
  {
    id: 3,
    nome: 'Acolhimento IECAC',
    usuario: 'acolhimento',
    perfil: 'ACOLHIMENTO',
    status: 'Ativo',
    vinculo: 'Acolhimento'
  },
  {
    id: 4,
    nome: 'João Carlos',
    usuario: 'joao.silva',
    perfil: 'MEDICO',
    status: 'Ativo',
    vinculo: 'Médico João Carlos'
  },
  {
    id: 5,
    nome: 'Sala de E.C.G.',
    usuario: 'ecg',
    perfil: 'ECG',
    status: 'Ativo',
    vinculo: 'E.C.G. + Mapa 24h'
  },
  {
    id: 6,
    nome: 'Mapa 24h',
    usuario: 'mapa.24h',
    perfil: 'MAPA_CIRURGICO',
    status: 'Ativo',
    vinculo: 'Mapa 24h'
  }
];

export const adminProfessionals = [
  {
    id: 101,
    nome: 'João Carlos',
    usuario: 'joao.silva',
    crm: 'CRM-000001',
    especialidades: ['Cardiologia', 'Arritmia'],
    status: 'Ativo'
  },
  {
    id: 102,
    nome: 'Fernanda Almeida',
    usuario: 'fernanda.almeida',
    crm: 'CRM-000002',
    especialidades: ['Cardiologia Clínica'],
    status: 'Ativo'
  },
  {
    id: 103,
    nome: 'Roberto Vasconcelos',
    usuario: 'roberto.vasconcelos',
    crm: 'CRM-000003',
    especialidades: ['Cirurgia Cardiovascular'],
    status: 'Ativo'
  },
  {
    id: 104,
    nome: 'Marina Costa',
    usuario: 'marina.costa',
    crm: 'CRM-000004',
    especialidades: ['Ecocardiografia'],
    status: 'Ativo'
  }
];

export const adminSpecialties = [
  {
    id: 1,
    nome: 'Cardiologia',
    profissionais: 2,
    status: 'Ativa'
  },
  {
    id: 2,
    nome: 'Arritmia',
    profissionais: 1,
    status: 'Ativa'
  },
  {
    id: 3,
    nome: 'Cardiologia Clínica',
    profissionais: 1,
    status: 'Ativa'
  },
  {
    id: 4,
    nome: 'Cirurgia Cardiovascular',
    profissionais: 1,
    status: 'Ativa'
  },
  {
    id: 5,
    nome: 'Ecocardiografia',
    profissionais: 1,
    status: 'Ativa'
  }
];

export const adminSettings = [
  {
    id: 1,
    chave: 'TEMPO_EXIBICAO_CHAMADA_MS',
    nome: 'Tempo de exibição no painel',
    valor: '10000',
    descricao: 'Cada chamada fica visível por 10 segundos no painel.'
  },
  {
    id: 2,
    chave: 'TEMPO_MINIMO_ATENDIMENTO_SEG',
    nome: 'Tempo mínimo de atendimento',
    valor: '60',
    descricao: 'Finalização liberada apenas após 1 minuto.'
  },
  {
    id: 3,
    chave: 'PAINEL_SEGUNDA_TELA',
    nome: 'Painel em segunda tela',
    valor: 'Automático',
    descricao: 'Abre o painel na TV quando houver monitor secundário.'
  },
  {
    id: 4,
    chave: 'SOM_CHAMADA',
    nome: 'Som de chamada',
    valor: 'chamada.mp3',
    descricao: 'Arquivo de áudio usado no painel.'
  }
];