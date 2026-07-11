import { useMemo, useState } from 'react';
import type { FilterOption, NotificationData } from '../pages/Notificacoes/Notificacoes.types';
import { PAGE_SIZE, mockNotifications } from '../pages/Notificacoes/Notificacao.mock';

interface UseNotificationsReturn {
  notifications: NotificationData[];
  pageItems: NotificationData[];
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

// Compara apenas ano/mês/dia, ignorando o horário
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Retorna a segunda-feira da semana da data informada, zerando o horário
function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = domingo
  const diff = (day === 0 ? -6 : 1) - day; // considera segunda como início da semana
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Decide se uma notificação pertence ao período selecionado no filtro
function matchesFilter(notification: NotificationData, filter: FilterOption, now: Date): boolean {
  const notifDate = new Date(notification.date);

  switch (filter) {
    case 'Todas':
      return true;

    case 'Hoje':
      return isSameDay(notifDate, now);

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
      return (
        notifDate.getFullYear() === now.getFullYear() &&
        notifDate.getMonth() === now.getMonth()
      );

    default:
      return true;
  }
}

export function useNotifications(): UseNotificationsReturn {
  // Fonte da verdade: todas as notificações, sem filtro de período
  const [allNotifications, setAllNotifications] = useState<NotificationData[]>(mockNotifications);
  const [filter, setFilterState] = useState<FilterOption>('Todas');
  const [currentPage, setCurrentPage] = useState(1);

  // Lista já filtrada pelo período selecionado
  const notifications = useMemo(() => {
    const now = new Date();
    return allNotifications.filter((n) => matchesFilter(n, filter, now));
  }, [allNotifications, filter]);

  const totalPages = Math.max(1, Math.ceil(notifications.length / PAGE_SIZE));

  // Fatia da lista filtrada correspondente à página atual
  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return notifications.slice(start, start + PAGE_SIZE);
  }, [notifications, currentPage]);

  const setFilter = (next: FilterOption) => {
    setFilterState(next);
    setCurrentPage(1); // evita ficar em página inexistente após trocar o filtro
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Limpa a lista completa, não apenas o que está filtrado no momento
  const clearAll = () => {
    setAllNotifications([]);
    setCurrentPage(1);
  };

  const renovar = (id: string) => {
    setAllNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return {
    notifications,
    pageItems,
    filter,
    setFilter,
    currentPage,
    totalPages,
    goToPage,
    goToPrevPage,
    goToNextPage,
    clearAll,
    renovar,
  };
}