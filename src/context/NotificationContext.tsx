import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { NotificationData } from '../pages/Notificacoes/Notificacoes.types';
import { mockNotifications } from '../pages/Notificacoes/Notificacao.mock';

interface NotificationContextType {
  notifications: NotificationData[];
  adicionarNotificacao: (notificacao: Omit<NotificationData, 'id'>) => NotificationData;
  removerNotificacao: (id: string) => void;
  limparNotificacoes: () => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Fonte única de verdade de todas as notificações (futuramente virá da API).
  // Começa com o mock para as telas continuarem exibindo conteúdo de exemplo.
  const [notifications, setNotifications] = useState<NotificationData[]>(mockNotifications);

  const adicionarNotificacao = (notificacao: Omit<NotificationData, 'id'>): NotificationData => {
    const nova: NotificationData = { ...notificacao, id: `n-${Date.now()}` };
    setNotifications((atuais) => [nova, ...atuais]);
    return nova;
  };

  const removerNotificacao = (id: string) => {
    setNotifications((atuais) => atuais.filter((n) => n.id !== id));
  };

  const limparNotificacoes = () => setNotifications([]);

  return (
    <NotificationContext.Provider
      value={{ notifications, adicionarNotificacao, removerNotificacao, limparNotificacoes }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
