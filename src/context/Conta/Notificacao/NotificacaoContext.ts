import { createContext } from 'react';
import type { NotificacaoData } from '../../../pages/Conta/Notificacoes/Notificacoes.types';

export interface NotificacaoContextType {
    notificacao: NotificacaoData[];
    adicionarNotificacao: (notificacao: Omit<NotificacaoData, 'id'>) => NotificacaoData;
    removerNotificacao: (id: string) => void;
    limparNotificacoes: () => void;
}

export const NotificacaoContext = createContext<NotificacaoContextType | null>(null);
