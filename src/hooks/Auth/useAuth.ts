/**
 * Acesso seguro ao AuthContext.
 * Falha explicitamente quando usado fora do AuthProvider, facilitando detectar erro de composição.
 */
import { useContext } from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return ctx;
}
