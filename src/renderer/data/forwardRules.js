export const sectorLabels = {
  ACOLHIMENTO: 'Acolhimento',
  MEDICO: 'Médico',
  ECG: 'Sala de E.C.G.',
  MEDICACAO: 'Sala de Medicação',
  CURATIVO: 'Sala de Curativo',
  ECO: 'Sala de ECO',
  MAPA_CIRURGICO: 'Mapa 24h',
  FINALIZAR: 'Finalizar atendimento'
};

export const forwardRulesBySector = {
  ACOLHIMENTO: ['ECG', 'MEDICACAO', 'MEDICO', 'CURATIVO', 'MAPA_CIRURGICO'],

  MEDICO: ['CURATIVO', 'ECG', 'MEDICACAO', 'MAPA_CIRURGICO', 'FINALIZAR'],

  ECG: ['MEDICACAO', 'MEDICO', 'CURATIVO', 'MAPA_CIRURGICO', 'FINALIZAR'],

  MEDICACAO: ['ECG', 'MEDICO', 'CURATIVO', 'MAPA_CIRURGICO', 'FINALIZAR'],

  CURATIVO: ['ECG', 'MEDICACAO', 'MEDICO', 'MAPA_CIRURGICO', 'FINALIZAR'],

  MAPA_CIRURGICO: ['MEDICO', 'ECG', 'MEDICACAO', 'CURATIVO', 'FINALIZAR'],

  ECO: ['MEDICO']
};

export function getForwardOptionsBySector(currentSector) {
  const allowedSectors = forwardRulesBySector[currentSector] || [];

  return allowedSectors.map((sector) => ({
    value: sector,
    label: sectorLabels[sector] || sector
  }));
}