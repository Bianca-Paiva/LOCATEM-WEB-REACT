import { useMemo, useState } from 'react';
import type { FilterOption, NotificationData } from '../pages/Notificacoes/Notificacoes.types';
import { PAGE_SIZE, mockNotifications } from '../pages/Notificacoes/data';

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

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationData[]>(mockNotifications);
  const [filter, setFilterState] = useState<FilterOption>('Hoje');
  const [currentPage, setCurrentPage] = useState(1);

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

  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  const clearAll = () => {
    setNotifications([]);
    setCurrentPage(1);
  };

  const renovar = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
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
