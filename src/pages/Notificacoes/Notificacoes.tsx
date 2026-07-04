import { useState } from 'react';
import NotificationCard from '../../components/Notificacoes/NotificationCard/NotificationCard';
import FilterDropdown from '../../components/Notificacoes/FilterDropdown/FilterDropdown';
import Pagination from '../../components/Notificacoes/Pagination/Pagination';
import NotificationDetailsModal from '../../components/Notificacoes/NotificationModal/NotificationDetailsModal';
import { BellOffIcon, TrashIcon } from '../../components/Notificacoes/icons/NotificationIcons';
import { useNotifications } from '../../hooks/useNotifications';
import styles from './Notificacoes.module.css';
import Header from '../../components/Header/Header';

import type { Route } from '../../router/useRouter';
import type { NotificationData } from './Notificacoes.types';

interface NotificacoesProps {
  navigate: (route: Route) => void;
}

export default function Notificacoes({ navigate }: NotificacoesProps) {
  const {
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
  } = useNotifications();

  // Notificação atualmente aberta no modal; null = modal fechado
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);

  const handleVerDetalhes = (id: string) => {
    const notification = pageItems.find((item) => item.id === id) ?? null;
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => setSelectedNotification(null);

  const handlePagar = (id: string) => {
    // Integre aqui com o fluxo de pagamento/checkout.
    console.log('Pagar notificação', id);
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="notificacoes" />

      <main className={styles.page}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Notificações</h1>

          <div className={styles.controls}>
            <FilterDropdown value={filter} onChange={setFilter} />

            <button
              type="button"
              className={styles.clearButton}
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              <TrashIcon />
              Limpar tudo
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <BellOffIcon className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Nenhuma notificação por aqui</p>
            <p className={styles.emptyDescription}>
              Assim que houver novidades sobre suas reservas e entregas, elas aparecem nesta tela.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {pageItems.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onRenovar={renovar}
                  onVerDetalhes={handleVerDetalhes}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              onPrev={goToPrevPage}
              onNext={goToNextPage}
            />
          </>
        )}
      </main>

      <NotificationDetailsModal
        notification={selectedNotification}
        onClose={handleCloseModal}
        onRenovar={renovar}
        onPagar={handlePagar}
      />
    </>
  );
}