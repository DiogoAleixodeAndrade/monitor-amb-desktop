export function getHomeByRole(perfil) {
  const routes = {
    ADM: '/dashboard',
    RECEPCAO: '/recepcao',
    ACOLHIMENTO: '/acolhimento',
    MEDICO: '/medico',
    ECG: '/ecg',
    MEDICACAO: '/medicacao',
    CURATIVO: '/curativo',
    ECO: '/eco',
    MAPA_CIRURGICO: '/mapa-cirurgico',
    PAINEL: '/painel'
  };

  return routes[perfil] || '/login';
}