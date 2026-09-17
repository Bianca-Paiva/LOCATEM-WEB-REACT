import { useContext } from 'react';
import { NotificacaoContext } from '../../../context/Conta/Notificacao/NotificacaoContext';

export function useNotificacaoStore() {
  const ctx = useContext(NotificacaoContext);

  if (!ctx) {
    throw new Error(
      'useNotificacaonStore deve ser usado dentro de NotificacaoProvider'
    );
  }

  return ctx;
}
