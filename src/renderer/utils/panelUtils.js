export function formatPanelTime(value) {
  if (!value) return '--:--';

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(value));
}

export function getPanelSectorLabel(setor) {
  const labels = {
    ACOLHIMENTO: 'Acolhimento',
    MEDICO: 'Consultório Médico',
    ECG: 'Sala de E.C.G.',
    MEDICACAO: 'Sala de Medicação',
    CURATIVO: 'Sala de Curativo',
    ECO: 'Sala de ECO',
    MAPA_CIRURGICO: 'Mapa 24h'
  };

  return labels[setor] || setor || '---';
}