import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../../types/Auth/usuario.types';
import { buscarUsuarioPorEmail, criarUsuarioFallback } from '../../mocks/usuarios.mock';
import { AuthContext, type AuthContextType } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Sem sessão por padrão — replica o comportamento atual do Header ("usuário
  // não autenticado -> manter comportamento atual") até que o login seja feito.
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login: AuthContextType['login'] = (email) => {
    // Login.tsx ainda não tem uma API real (services/authService.ts está comentado),
    // então resolvemos o usuário a partir do catálogo mockado, com fallback para um
    // usuário novo — assim o cálculo de conclusão do perfil continua realista mesmo
    // para e-mails fora da lista de testes.
    const usuarioEncontrado = buscarUsuarioPorEmail(email) ?? criarUsuarioFallback(email);
    setUsuario(usuarioEncontrado);
    return usuarioEncontrado;
  };

  const logout = () => setUsuario(null);

  const atualizarUsuario: AuthContextType['atualizarUsuario'] = (dados) => {
    setUsuario((atual) => (atual ? { ...atual, ...dados } : atual));
  };

  return (
    <AuthContext.Provider
      value={{ usuario, isAuthenticated: usuario !== null, login, logout, atualizarUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
}
