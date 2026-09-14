import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../../types/Usuario/usuario.types';
import { buscarUsuarioLogado, atualizarPerfilUsuario } from '../../services/authService';


interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  // Altera aqui para Promise<void>
  atualizarUsuario: (dados: Partial<Usuario>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Sem sessão por padrão — replica o comportamento atual do Header ("usuário
  // não autenticado -> manter comportamento atual") até que o login seja feito.
  const [usuario, setUsuario] = useState<Usuario | null>(null);
const login: AuthContextType['login'] = async () => {
    const dados = await buscarUsuarioLogado();

    const usuario: Usuario = {
        id: dados.id,
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        documento: dados.documento,
        endereco: dados.endereco ?? '',
        tipo: dados.tipoUsuario.toLowerCase() as 'locatario' | 'locador',
        fotoUrl: dados.fotoUrl ?? undefined,
        desde: dados.desde,
        reputacao: dados.reputacao,
    };

    setUsuario(usuario);
};
 

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
};

 const atualizarUsuario: AuthContextType['atualizarUsuario'] = async (dados) => {
    try {
      if (!usuario) return;

      // Monta o payload garantindo que se veio algum campo parcial, completa com o atual
      const payload = {
        nome: dados.nome ?? usuario.nome,
        telefone: dados.telefone ?? usuario.telefone,
        documento: dados.documento ?? usuario.documento,
        endereco: dados.endereco ?? usuario.endereco,
      };

      // 1. Manda pro backend de verdade via PUT /api/Usuarios/me
      await atualizarPerfilUsuario(payload);

      // 2. Atualiza o estado local do React pra refletir na tela na hora
      setUsuario((atual) => (atual ? { ...atual, ...dados } : atual));
      
      console.log("Perfil atualizado no banco e na tela com sucesso!");
    } catch (error) {
      console.error("Deu ruim ao atualizar o perfil:", error);
      throw error; // Joga o erro pro modal saber que falhou
    }
  };

  return (
    <AuthContext.Provider
      value={{ usuario, isAuthenticated: usuario !== null, login, logout, atualizarUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
}
