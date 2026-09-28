import { useMemo, useState } from 'react';
import type { FilterOption, NotificacaoData } from '../../../pages/Conta/Notificacoes/Notificacoes.types';
import { useNotificacaoStore } from './useNotificationStore';

const PAGE_SIZE = 6;

interface UseNotificationsReturn {
  notifications: NotificacaoData[];
  pageItems: NotificacaoData[];
  filter: FilterOption;
  setFilter: (filter: FilterOption) => void;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  clearAll: () => void;
  renovar: (id: string) => void;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function matchesFilter(notification: NotificacaoData, filter: FilterOption, now: Date): boolean {
  const notifDate = new Date(notification.date);

  switch (filter) {
    case 'Todas': return true;
    case 'Hoje': return isSameDay(notifDate, now);
    case 'Ontem': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return isSameDay(notifDate, yesterday);
    }
    case 'Esta semana': {
      const start = startOfWeek(now);
      return notifDate >= start && notifDate <= now;
    }
    case 'Este mês':
      return notifDate.getFullYear() === now.getFullYear() && notifDate.getMonth() === now.getMonth();
    default: return true;
  }
}

export function useNotifications(): UseNotificationsReturn {
  const { notificacao, limparNotificacoes, removerNotificacao } = useNotificacaoStore();
  const [filter, setFilterState] = useState<FilterOption>('Todas');
  const [currentPage, setCurrentPage] = useState(1);

  const notifications = useMemo(() => {
    const now = new Date();
    return notificacao.filter((notification) => matchesFilter(notification, filter, now));
  }, [notificacao, filter]);

  const totalPages = Math.max(1, Math.ceil(notifications.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return notifications.slice(start, start + PAGE_SIZE);
  }, [notifications, currentPage]);

  const setFilter = (next: FilterOption) => {
    setFilterState(next);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return {
    notifications,
    pageItems,
    filter,
    setFilter,
    currentPage,
    totalPages,
    goToPage,
    goToPrevPage: () => goToPage(currentPage - 1),
    goToNextPage: () => goToPage(currentPage + 1),
    clearAll: () => { limparNotificacoes(); setCurrentPage(1); },
    renovar: (id) => removerNotificacao(id),
  };
}
