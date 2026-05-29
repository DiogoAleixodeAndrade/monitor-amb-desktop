import { execute, query } from './connection.js';

export async function findPatientByCns(cns) {
  const result = await query(
    `
      SELECT *
      FROM AMB_PACIENTES
      WHERE CNS = ? AND ATIVO = TRUE
    `,
    [cns]
  );

  const patient = result?.[0];

  if (!patient) {
    return null;
  }

  return normalizePatient(patient);
}

export async function createPatient(patient) {
  await execute(
    `
      INSERT INTO AMB_PACIENTES
      (
        CNS,
        NOME_PACIENTE,
        NOME_SOCIAL,
        PRONTUARIO,
        DATA_NASCIMENTO,
        TELEFONE,
        OBSERVACAO,
        DATA_CADASTRO,
        ATIVO
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, Now(), TRUE)
    `,
    [
      patient.cns,
      patient.nomePaciente,
      patient.nomeSocial || '',
      patient.prontuario || '',
      patient.dataNascimento || null,
      patient.telefone || '',
      patient.observacao || ''
    ]
  );

  return findPatientByCns(patient.cns);
}

function normalizePatient(patient) {
  return {
    idPaciente: patient.ID_PACIENTE,
    cns: patient.CNS,
    nomePaciente: patient.NOME_PACIENTE,
    nomeSocial: patient.NOME_SOCIAL || '',
    prontuario: patient.PRONTUARIO || '',
    dataNascimento: formatAccessDate(patient.DATA_NASCIMENTO),
    telefone: patient.TELEFONE || '',
    observacao: patient.OBSERVACAO || ''
  };
}

function formatAccessDate(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}