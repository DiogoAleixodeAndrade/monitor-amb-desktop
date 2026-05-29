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
    Entrada: item.dataHoraEntrada || '',
    Chamada: item.dataHoraChamada || '',
    Presenca: item.dataHoraApareceu || '',
    Pausa: item.dataHoraPausa || '',
    Retorno: item.dataHoraRetorno || '',
    Checkout: item.dataHoraCheckout || '',
    UsuarioResponsavel: item.usuarioResponsavel || ''
  }));
}