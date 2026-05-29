export const mockUsers = [
  {
    id: 1,
    nome: 'Administrador',
    usuario: 'admin',
    senha: '123',
    perfil: 'ADM',
    ativo: true,
    medicoVinculado: null
  },
  {
    id: 2,
    nome: 'Recepção IECAC',
    usuario: 'recepcao',
    senha: '123',
    perfil: 'RECEPCAO',
    ativo: true,
    medicoVinculado: null
  },
  {
    id: 3,
    nome: 'Acolhimento IECAC',
    usuario: 'acolhimento',
    senha: '123',
    perfil: 'ACOLHIMENTO',
    ativo: true,
    medicoVinculado: null
  },
  {
    id: 4,
    nome: 'João Carlos',
    usuario: 'joao.silva',
    senha: '123',
    perfil: 'MEDICO',
    ativo: true,
    medicoVinculado: {
      id: 101,
      nome: 'João Carlos'
    }
  },
  {
    id: 5,
    nome: 'Sala de E.C.G.',
    usuario: 'ecg',
    senha: '123',
    perfil: 'ECG',
    ativo: true,
    medicoVinculado: null
  },
  {
    id: 6,
    nome: 'Sala de Medicação',
    usuario: 'medicacao',
    senha: '123',
    perfil: 'MEDICACAO',
    ativo: true,
    medicoVinculado: null
  },
  {
    id: 7,
    nome: 'Sala de Curativo',
    usuario: 'curativo',
    senha: '123',
    perfil: 'CURATIVO',
    ativo: true,
    medicoVinculado: null
  },
  {
    id: 8,
    nome: 'Sala de ECO',
    usuario: 'eco',
    senha: '123',
    perfil: 'ECO',
    ativo: true,
    medicoVinculado: null
  },
  {
    id: 9,
    nome: 'Painel de Chamadas',
    usuario: 'painel',
    senha: '123',
    perfil: 'PAINEL',
    ativo: true,
    medicoVinculado: null
  },
  {
  id: 10,
  nome: 'Mapa 24h',
  usuario: 'mapa.24h',
  senha: '123',
  perfil: 'MAPA_CIRURGICO',
  ativo: true,
  medicoVinculado: null
}
];