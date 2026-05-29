import { query } from './connection.js';

export async function listActiveProfessionals() {
  const result = await query(
    `
      SELECT
        P.ID_PROFISSIONAL,
        P.NOME,
        P.USUARIO_VINCULADO,
        E.NOME_ESPECIALIDADE
      FROM
        (AMB_PROFISSIONAIS AS P
        LEFT JOIN AMB_PROFISSIONAL_ESPECIALIDADE AS PE
          ON P.ID_PROFISSIONAL = PE.ID_PROFISSIONAL)
        LEFT JOIN AMB_ESPECIALIDADES AS E
          ON PE.ID_ESPECIALIDADE = E.ID_ESPECIALIDADE
      WHERE
        P.ATIVO = TRUE
      ORDER BY
        P.NOME ASC,
        E.NOME_ESPECIALIDADE ASC
    `
  );

  const grouped = new Map();

  for (const row of result || []) {
    const id = row.ID_PROFISSIONAL;

    if (!grouped.has(id)) {
      grouped.set(id, {
        idProfissional: row.ID_PROFISSIONAL,
        nome: row.NOME,
        usuario: row.USUARIO_VINCULADO,
        especialidades: []
      });
    }

    if (row.NOME_ESPECIALIDADE) {
      grouped.get(id).especialidades.push(row.NOME_ESPECIALIDADE);
    }
  }

  return Array.from(grouped.values());
}