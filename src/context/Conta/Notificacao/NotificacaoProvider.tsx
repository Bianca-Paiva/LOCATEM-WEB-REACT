import { useState } from 'react';
import type { ReactNode } from 'react';
import type { NotificacaoData } from '../../../pages/Conta/Notificacoes/Notificacoes.types';
import { mockNotificacoes } from '../../../pages/Conta/Notificacoes/Notificacao.mock';
import { NotificacaoContext } from './NotificacaoContext';

export function NotificacaoProvider({ children }: { children: ReactNode }) {
  // Fonte única de verdade de todas as notificações (futuramente virá da API).
  // Começa com o mock para as telas continuarem exibindo conteúdo de exemplo.
  const [notificacao, setNotifications] = useState<NotificacaoData[]>(mockNotificacoes);

  const adicionarNotificacao = (notificacao: Omit<NotificacaoData, 'id'>): NotificacaoData => {
    const nova: NotificacaoData = { ...notificacao, id: `n-${Date.now()}` };
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
