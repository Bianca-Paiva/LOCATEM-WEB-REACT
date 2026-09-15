import { createContext } from 'react';
import type { Usuario } from '../../types/Auth/usuario.types';

export interface AuthContextType {
    /** Usuário autenticado, ou null quando não há sessão (mesmo comportamento atual do Header). */
    usuario: Usuario | null;
    isAuthenticated: boolean;
    /** Autentica pelo e-mail digitado no login (ver mocks/usuarios.mock.ts para os cenários cobertos). */
    login: () => Promise<void>;
    logout: () => void;
    /** Atualiza campos do usuário logado (usado pelo modal "Editar Perfil"). */
    atualizarUsuario: (dados: Partial<Usuario>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
