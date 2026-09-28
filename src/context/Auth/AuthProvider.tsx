/**
 * Mantém a sessão do usuário autenticado.
 * Lê o token salvo, busca o perfil atual e expõe login, logout e atualização de dados.
 */
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../../types/Auth/usuario.types';
import { atualizarPerfilUsuario, buscarUsuarioLogado, type UsuarioDaApi } from '../../services/authService';
import { AuthContext, type AuthContextType } from './AuthContext';

function mapearUsuario(dados: UsuarioDaApi): Usuario {
  // A API envia o tipo em formato próprio; o app trabalha com os perfis normalizados.
  return {
    id: dados.id,
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    documento: dados.documento,
    endereco: dados.endereco ?? '',
    tipo: dados.tipoUsuario.toLowerCase() as 'locatario' | 'locador',
    fotoUrl: dados.fotoUrl ?? undefined,
    locadorId: dados.locadorId,
    emailVerificado: dados.emailVerificado,
    desde: dados.desde,
    reputacao: dados.reputacao,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const carregarUsuarioSalvo = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setUsuario(mapearUsuario(await buscarUsuarioLogado()));
      } catch {
        localStorage.removeItem('token');
        setUsuario(null);
      }
    };

    carregarUsuarioSalvo();
  }, []);

  const login: AuthContextType['login'] = async () => {
    setUsuario(mapearUsuario(await buscarUsuarioLogado()));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const atualizarUsuario: AuthContextType['atualizarUsuario'] = async (dados) => {
    if (!usuario) return;

    const payload = {
      nome: dados.nome ?? usuario.nome,
      telefone: dados.telefone ?? usuario.telefone,
      documento: dados.documento ?? usuario.documento,
      endereco: dados.endereco ?? usuario.endereco,
    };

    await atualizarPerfilUsuario(payload);
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
