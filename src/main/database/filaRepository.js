import { execute, query } from './connection.js';

export async function listActiveQueue() {
  const result = await query(
    `
      SELECT *
      FROM AMB_FILA
      WHERE STATUS_ATENDIMENTO NOT IN ('FINALIZADO', 'CANCELADO')
      ORDER BY
        PRIORITARIO DESC,
        NIVEL_PRIORIDADE DESC,
        RETORNO_EXAME DESC,
        ORDEM ASC,
        DATA_HORA_ENTRADA ASC
    `
  );

  return (result || []).map(normalizeQueueItem);
}

export async function checkInPatientToQueue(payload) {
  const priority = payload.prioridade || null;

  await execute(
    `
      INSERT INTO AMB_FILA
      (
        ID_PACIENTE,
        CNS,
        NOME_PACIENTE,
        NOME_SOCIAL,
        PRONTUARIO,
        DATA_NASCIMENTO,
        SETOR_ATUAL,
        STATUS_ATENDIMENTO,
        ID_MEDICO_DESTINO,
        NOME_MEDICO_DESTINO,
        ESPECIALIDADE,
        PRIORITARIO,
        TIPO_PRIORIDADE,
        OBS_PRIORIDADE,
        NIVEL_PRIORIDADE,
        RETORNO_EXAME,
        TIPO_EXAME,
        MOTIVO_PAUSA,
        DATA_HORA_ENTRADA,
        ORDEM,
        USUARIO_RESPONSAVEL
      )
      VALUES (?, ?, ?, ?, ?, ?, 'ACOLHIMENTO', 'AGUARDANDO', ?, ?, ?, ?, ?, ?, ?, FALSE, '', '', Now(), ?, ?)
    `,
    [
      payload.patient.idPaciente,
      payload.patient.cns,
      payload.patient.nomePaciente,
      payload.patient.nomeSocial || '',
      payload.patient.prontuario || '',
      payload.patient.dataNascimento || null,
      payload.profissional.idProfissional,
      payload.profissional.nome,
      payload.especialidade,
      Boolean(priority),
      priority?.label || '',
      payload.observacaoPrioridade || '',
      priority?.nivel || 0,
      Date.now(),
      payload.usuarioResponsavel || ''
    ]
  );

  return listActiveQueue();
}

export async function updateQueueStatus(idFila, updates) {
  const setParts = [];
  const params = [];

  for (const [key, value] of Object.entries(updates)) {
    setParts.push(`${key} = ?`);
    params.push(value);
  }

  params.push(idFila);

  await execute(
    `
      UPDATE AMB_FILA
      SET ${setParts.join(', ')}
      WHERE ID_FILA = ?
    `,
    params
  );

  return listActiveQueue();
}

function normalizeQueueItem(row) {
  return {
    idFila: row.ID_FILA,
    idPaciente: row.ID_PACIENTE,
    cns: row.CNS,
    nomePaciente: row.NOME_PACIENTE,
    nomeSocial: row.NOME_SOCIAL || '',
    prontuario: row.PRONTUARIO || '',
    dataNascimento: formatDate(row.DATA_NASCIMENTO),
    setorAtual: row.SETOR_ATUAL,
    statusAtendimento: row.STATUS_ATENDIMENTO,
    idMedicoDestino: row.ID_MEDICO_DESTINO,
    nomeMedicoDestino: row.NOME_MEDICO_DESTINO || '',
    especialidade: row.ESPECIALIDADE || '',
    prioritario: Boolean(row.PRIORITARIO),
    tipoPrioridade: row.TIPO_PRIORIDADE || '',
    obsPrioridade: row.OBS_PRIORIDADE || '',
    nivelPrioridade: row.NIVEL_PRIORIDADE || 0,
    retornoExame: Boolean(row.RETORNO_EXAME),
    tipoExame: row.TIPO_EXAME || '',
    motivoPausa: row.MOTIVO_PAUSA || '',
    dataHoraEntrada: formatDateTime(row.DATA_HORA_ENTRADA),
    dataHoraChamada: formatDateTime(row.DATA_HORA_CHAMADA),
    dataHoraApareceu: formatDateTime(row.DATA_HORA_APARECEU),
    dataHoraPausa: formatDateTime(row.DATA_HORA_PAUSA),
    dataHoraRetorno: formatDateTime(row.DATA_HORA_RETORNO),
    dataHoraCheckout: formatDateTime(row.DATA_HORA_CHECKOUT),
    dataHoraEcoInicio: formatDateTime(row.DATA_HORA_ECO_INICIO),
    dataHoraEcoRealizado: formatDateTime(row.DATA_HORA_ECO_REALIZADO),
    ordem: row.ORDEM || 0,
    observacaoEncaminhamento: row.OBSERVACAO_ENCAMINHAMENTO || '',
    usuarioResponsavel: row.USUARIO_RESPONSAVEL || ''
  };
}

function formatDate(value) {
  if (!value) return '';

  return new Date(value).toISOString().slice(0, 10);
}

function formatDateTime(value) {
  if (!value) return null;

  return new Date(value).toISOString();
}