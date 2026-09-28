import { useState } from 'react';
import type { ReactNode } from 'react';
import type { NotificacaoData } from '../../../pages/Conta/Notificacoes/Notificacoes.types';
import { NotificacaoContext } from './NotificacaoContext';

export function NotificacaoProvider({ children }: { children: ReactNode }) {
  const [notificacao, setNotifications] = useState<NotificacaoData[]>([]);

  const adicionarNotificacao = (dados: Omit<NotificacaoData, 'id'>): NotificacaoData => {
    const nova: NotificacaoData = { ...dados, id: `n-${Date.now()}` };
    setNotifications((atuais) => [nova, ...atuais]);
    return nova;
  };

  const removerNotificacao = (id: string) => {
    setNotifications((atuais) => atuais.filter((n) => n.id !== id));
  };

  const limparNotificacoes = () => setNotifications([]);

  return (
    <NotificacaoContext.Provider
      value={{ notificacao, adicionarNotificacao, removerNotificacao, limparNotificacoes }}
    >
      {children}
    </NotificacaoContext.Provider>
  );
}
