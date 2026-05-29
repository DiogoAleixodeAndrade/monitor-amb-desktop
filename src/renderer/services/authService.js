import { mockUsers } from '../data/mockUsers.js';
import { isAccessAvailable } from './runtime.js';

export async function loginUser({ usuario, senha }) {
  if (isAccessAvailable()) {
    return window.monitorAmb.auth.login({
      usuario,
      senha
    });
  }

  const normalizedUser = usuario.trim().toLowerCase();

  const foundUser = mockUsers.find(
    (item) =>
      item.usuario.toLowerCase() === normalizedUser && item.senha === senha
  );

  if (!foundUser) {
    return {
      success: false,
      message: 'Usuário ou senha inválidos.'
    };
  }

  if (!foundUser.ativo) {
    return {
      success: false,
      message: 'Usuário inativo. Procure a administração.'
    };
  }

  return {
    success: true,
    user: {
      id: foundUser.id,
      nome: foundUser.nome,
      usuario: foundUser.usuario,
      perfil: foundUser.perfil,
      ativo: foundUser.ativo,
      medicoVinculado: foundUser.medicoVinculado
    }
  };
}