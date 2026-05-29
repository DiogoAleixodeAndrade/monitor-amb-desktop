import { dashboardSectorLabels } from './dashboardAnalytics.js';

const statusLabels = {
  AGUARDANDO: 'Aguardando',
  CHAMADO: 'Chamado',
  EM_ATENDIMENTO: 'Em atendimento',
  PAUSADO_ECO: 'Pausado ECO',
  AGUARDANDO_RETORNO_ECO: 'Retorno ECO',
  NAO_COMPARECEU: 'Não apareceu',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado'
};

export function buildAttendanceExportRows(data) {
  return data.map((item) => ({
    Paciente: item.nomeSocial || item.nomePaciente || '',
    CNS: item.cns || '',
    Prontuario: item.prontuario || '',
    Setor: dashboardSectorLabels[item.setorAtual] || item.setorAtual || '',
    Medico: item.nomeMedicoDestino || '',
    Especialidade: item.especialidade || '',
    Status: statusLabels[item.statusAtendimento] || item.statusAtendimento || '',
    Prioritario: item.prioritario ? 'Sim' : 'Não',
    TipoPrioridade: item.tipoPrioridade || '',
    RetornoExame: item.retornoExame ? 'Sim' : 'Não',
    TipoExame: item.tipoExame || '',
    Entrada: formatExportDate(item.dataHoraEntrada),
    Chamada: formatExportDate(item.dataHoraChamada),
    Presenca: formatExportDate(item.dataHoraApareceu),
    Pausa: formatExportDate(item.dataHoraPausa),
    Retorno: formatExportDate(item.dataHoraRetorno),
    Checkout: formatExportDate(item.dataHoraCheckout),
    UsuarioResponsavel: item.usuarioResponsavel || ''
  }));
}

export function exportRowsToCsv(rows, filename = 'relatorio-monitor-amb.csv') {
  if (!rows || rows.length === 0) {
    return {
      success: false,
      message: 'Não existem dados para exportar.'
    };
  }

  const headers = Object.keys(rows[0]);

  const csvLines = [
    headers.join(';'),
    ...rows.map((row) =>
      headers.map((header) => sanitizeCsvValue(row[header])).join(';')
    )
  ];

  const csvContent = '\uFEFF' + csvLines.join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  const url = URL.createObjectURL(blob);

  const temporaryLink = document.createElement('a');
  temporaryLink.href = url;
  temporaryLink.download = filename;
  temporaryLink.style.display = 'none';

  document.body.appendChild(temporaryLink);
  temporaryLink.click();
  document.body.removeChild(temporaryLink);

  URL.revokeObjectURL(url);

  return {
    success: true,
    message: 'Relatório exportado com sucesso.'
  };
}

export function generateReportFilename(prefix = 'relatorio-monitor-amb') {
  const now = new Date();

  const date = now.toISOString().slice(0, 10);

  const time = now
    .toTimeString()
    .slice(0, 8)
    .replaceAll(':', '-');

  return `${prefix}-${date}-${time}.csv`;
}

function sanitizeCsvValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value).replaceAll('"', '""');

  return `"${stringValue}"`;
}

function formatExportDate(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
}