export const permissionsByRole = {
  ADM: [
    'DASHBOARD',
    'RECEPCAO',
    'ACOLHIMENTO',
    'MEDICO',
    'ECG',
    'MEDICACAO',
    'CURATIVO',
    'ECO',
    'MAPA_CIRURGICO',
    'PAINEL',
    'ADMIN'
  ],

  RECEPCAO: ['DASHBOARD', 'RECEPCAO'],

  ACOLHIMENTO: ['DASHBOARD', 'ACOLHIMENTO'],

  MEDICO: ['DASHBOARD', 'MEDICO'],

  ECG: ['DASHBOARD', 'ECG'],

  MEDICACAO: ['DASHBOARD', 'MEDICACAO'],

  CURATIVO: ['DASHBOARD', 'CURATIVO'],

  ECO: ['DASHBOARD', 'ECO'],

  MAPA_CIRURGICO: ['DASHBOARD', 'MAPA_CIRURGICO'],

  PAINEL: ['PAINEL']
};

export function canAccess(user, permission) {
  if (!user) return false;

  const permissions = permissionsByRole[user.perfil] || [];

  return permissions.includes(permission);
}