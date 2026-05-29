import { query, execute } from './connection.js';
import { comparePassword } from '../security/password.js';

export async function findUserByUsername(username) {
  const sql = `
    SELECT 
      U.ID_USUARIO,
      U.NOME,
      U.USUARIO,
      U.SENHA_HASH,
      U.PERFIL,
      U.ID_PROFISSIONAL,
      U.ATIVO,
      P.NOME AS NOME_PROFISSIONAL
    FROM AMB_USUARIOS AS U
    LEFT JOIN AMB_PROFISSIONAIS AS P
      ON U.ID_PROFISSIONAL = P.ID_PROFISSIONAL
    WHERE U.USUARIO = ?
  `;

  const result = await query(sql, [username]);

  return result?.[0] || null;
}

export async function authenticateUser(username, password) {
  const user = await findUserByUsername(username);

  if (!user) {
    return {
      success: false,
      message: 'Usuário ou senha inválidos.'
    };
  }

  if (!user.ATIVO) {
    return {
      success: false,
      message: 'Usuário inativo. Procure a administração.'
    };
  }

  const passwordOk = await comparePassword(password, user.SENHA_HASH);

  if (!passwordOk) {
    return {
      success: false,
      message: 'Usuário ou senha inválidos.'
    };
  }

  await execute(
    `
      UPDATE AMB_USUARIOS
      SET ULTIMO_LOGIN = Now()
      WHERE ID_USUARIO = ?
    `,
    [user.ID_USUARIO]
  );

  return {
    success: true,
    user: {
      id: user.ID_USUARIO,
      nome: user.NOME,
      usuario: user.USUARIO,
      perfil: user.PERFIL,
      ativo: Boolean(user.ATIVO),
      medicoVinculado: user.ID_PROFISSIONAL
        ? {
            id: user.ID_PROFISSIONAL,
            nome: user.NOME_PROFISSIONAL
          }
        : null
    }
  };
}