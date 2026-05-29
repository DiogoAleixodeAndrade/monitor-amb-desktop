import { execute, query } from './connection.js';
import { hashPassword } from '../security/password.js';

export async function listAdminUsers() {
  const result = await query(`
    SELECT
      ID_USUARIO,
      NOME,
      USUARIO,
      PERFIL,
      ID_PROFISSIONAL,
      ATIVO
    FROM AMB_USUARIOS
    ORDER BY NOME ASC
  `);

  return (result || []).map((row) => ({
    id: row.ID_USUARIO,
    nome: row.NOME,
    usuario: row.USUARIO,
    perfil: row.PERFIL,
    status: row.ATIVO ? 'Ativo' : 'Inativo',
    vinculo: row.ID_PROFISSIONAL ? `Profissional ID ${row.ID_PROFISSIONAL}` : '-'
  }));
}

export async function createAdminUser(payload) {
  const senhaInicial = payload.senha || '123456';
  const senhaHash = await hashPassword(senhaInicial);

  await execute(
    `
      INSERT INTO AMB_USUARIOS
      (
        NOME,
        USUARIO,
        SENHA_HASH,
        PERFIL,
        ID_PROFISSIONAL,
        ATIVO,
        DATA_CRIACAO
      )
      VALUES (?, ?, ?, ?, ?, ?, Now())
    `,
    [
      payload.nome,
      payload.usuario,
      senhaHash,
      payload.perfil,
      payload.idProfissional || null,
      payload.status !== 'Inativo'
    ]
  );

  return listAdminUsers();
}

export async function updateAdminUser(payload) {
  await execute(
    `
      UPDATE AMB_USUARIOS
      SET
        NOME = ?,
        USUARIO = ?,
        PERFIL = ?,
        ID_PROFISSIONAL = ?,
        ATIVO = ?
      WHERE ID_USUARIO = ?
    `,
    [
      payload.nome,
      payload.usuario,
      payload.perfil,
      payload.idProfissional || null,
      payload.status !== 'Inativo',
      payload.id
    ]
  );

  return listAdminUsers();
}

export async function listAdminProfessionals() {
  const result = await query(`
    SELECT
      ID_PROFISSIONAL,
      NOME,
      USUARIO_VINCULADO,
      CRM,
      ATIVO
    FROM AMB_PROFISSIONAIS
    ORDER BY NOME ASC
  `);

  return (result || []).map((row) => ({
    id: row.ID_PROFISSIONAL,
    nome: row.NOME,
    usuario: row.USUARIO_VINCULADO || '',
    crm: row.CRM || '',
    especialidades: [],
    status: row.ATIVO ? 'Ativo' : 'Inativo'
  }));
}

export async function createAdminProfessional(payload) {
  await execute(
    `
      INSERT INTO AMB_PROFISSIONAIS
      (
        NOME,
        USUARIO_VINCULADO,
        CRM,
        ATIVO
      )
      VALUES (?, ?, ?, ?)
    `,
    [
      payload.nome,
      payload.usuario || '',
      payload.crm || '',
      payload.status !== 'Inativo'
    ]
  );

  return listAdminProfessionals();
}

export async function updateAdminProfessional(payload) {
  await execute(
    `
      UPDATE AMB_PROFISSIONAIS
      SET
        NOME = ?,
        USUARIO_VINCULADO = ?,
        CRM = ?,
        ATIVO = ?
      WHERE ID_PROFISSIONAL = ?
    `,
    [
      payload.nome,
      payload.usuario || '',
      payload.crm || '',
      payload.status !== 'Inativo',
      payload.id
    ]
  );

  return listAdminProfessionals();
}

export async function listAdminSpecialties() {
  const result = await query(`
    SELECT
      ID_ESPECIALIDADE,
      NOME_ESPECIALIDADE,
      ATIVO
    FROM AMB_ESPECIALIDADES
    ORDER BY NOME_ESPECIALIDADE ASC
  `);

  return (result || []).map((row) => ({
    id: row.ID_ESPECIALIDADE,
    nome: row.NOME_ESPECIALIDADE,
    profissionais: 0,
    status: row.ATIVO ? 'Ativa' : 'Inativa'
  }));
}

export async function createAdminSpecialty(payload) {
  await execute(
    `
      INSERT INTO AMB_ESPECIALIDADES
      (
        NOME_ESPECIALIDADE,
        ATIVO
      )
      VALUES (?, ?)
    `,
    [payload.nome, payload.status !== 'Inativa']
  );

  return listAdminSpecialties();
}

export async function updateAdminSpecialty(payload) {
  await execute(
    `
      UPDATE AMB_ESPECIALIDADES
      SET
        NOME_ESPECIALIDADE = ?,
        ATIVO = ?
      WHERE ID_ESPECIALIDADE = ?
    `,
    [payload.nome, payload.status !== 'Inativa', payload.id]
  );

  return listAdminSpecialties();
}

export async function listAdminSettings() {
  const result = await query(`
    SELECT
      ID_CONFIG,
      CHAVE,
      VALOR,
      DESCRICAO,
      ATIVO
    FROM AMB_CONFIGURACOES
    ORDER BY CHAVE ASC
  `);

  return (result || []).map((row) => ({
    id: row.ID_CONFIG,
    chave: row.CHAVE,
    nome: row.CHAVE,
    valor: row.VALOR || '',
    descricao: row.DESCRICAO || ''
  }));
}

export async function createAdminSetting(payload) {
  await execute(
    `
      INSERT INTO AMB_CONFIGURACOES
      (
        CHAVE,
        VALOR,
        DESCRICAO,
        ATIVO
      )
      VALUES (?, ?, ?, TRUE)
    `,
    [payload.chave, payload.valor || '', payload.descricao || '']
  );

  return listAdminSettings();
}

export async function updateAdminSetting(payload) {
  await execute(
    `
      UPDATE AMB_CONFIGURACOES
      SET
        CHAVE = ?,
        VALOR = ?,
        DESCRICAO = ?
      WHERE ID_CONFIG = ?
    `,
    [payload.chave, payload.valor || '', payload.descricao || '', payload.id]
  );

  return listAdminSettings();
}