import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockUsers } from '../data/mockUsers.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'monitoramb.session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);

    if (savedSession) {
      try {
        const parsedUser = JSON.parse(savedSession);

        if (parsedUser?.ativo) {
          setUser(parsedUser);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoadingSession(false);
  }, []);

  function login(usuario, senha, lembrarUsuario = true) {
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

    const sessionUser = {
      id: foundUser.id,
      nome: foundUser.nome,
      usuario: foundUser.usuario,
      perfil: foundUser.perfil,
      ativo: foundUser.ativo,
      medicoVinculado: foundUser.medicoVinculado
    };

    setUser(sessionUser);

    if (lembrarUsuario) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    }

    return {
      success: true,
      user: sessionUser
    };
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      loadingSession,
      isAuthenticated: Boolean(user)
    }),
    [user, loadingSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de AuthProvider.');
  }

  return context;
}