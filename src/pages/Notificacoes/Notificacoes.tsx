import { useState } from 'react';
import { BellOff, Trash } from 'lucide-react';
import NotificationCard from '../../components/Notificacoes/NotificationCard/NotificationCard';
import FilterDropdown from '../../components/Notificacoes/FilterDropdown/FilterDropdown';
import Pagination from '../../components/Notificacoes/Pagination/Pagination';
import NotificationDetailsModal from '../../components/Notificacoes/NotificationModal/NotificationDetailsModal';
import { useNotifications } from '../../hooks/useNotifications';
import { useReservaStore } from '../../hooks/Reservas/useReservaStore';
import styles from './Notificacoes.module.css';
import Header from '../../components/Header/Header';
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina';

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

  // Fonte das reservas reais (mesma usada em 'Minhas Reservas' e 'Detalhes da Reserva')
  const { reservas, setReservaSelecionada } = useReservaStore();

  // Notificação atualmente aberta no modal; null = modal fechado
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);

  const handleVerDetalhes = (id: string) => {
    const notification = pageItems.find((item) => item.id === id) ?? null;
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => setSelectedNotification(null);

  // Seleciona a reserva vinculada (mesmo padrão usado em MinhasReservas ao abrir uma
  // reserva) e leva o usuário para a tela de Detalhes da Reserva. Usado pelos botões
  // "Ver locação", "Efetuar pagamento", "Tentar pagamento novamente" e "Ver detalhes".
  const handleVerReserva = (reservaId: string) => {
    const reserva = reservas.find((item) => item.id === reservaId);
    if (!reserva) return;

    setReservaSelecionada(reserva);
    navigate('detalhesReserva');
  };

  // Seleciona a reserva finalizada e leva o usuário direto para o fluxo de avaliação.
  const handleAvaliar = (reservaId: string) => {
    const reserva = reservas.find((item) => item.id === reservaId);
    if (!reserva) return;

    setReservaSelecionada(reserva);
    navigate('avaliacao');
  };

  // Notificações de promoção levam o usuário para a busca de ferramentas.
  const handleVerOfertas = () => {
    navigate('busca');
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="notificacoes" />

      <main className={styles.page}>
        <CabecalhoPagina
          titulo="Notificações"
          acao={
            <div className={styles.controls}>
              <FilterDropdown value={filter} onChange={setFilter} />

              <button
                type="button"
                className={styles.clearButton}
                onClick={clearAll}
                disabled={notifications.length === 0}
              >
                <Trash size={16} />
                Limpar tudo
              </button>
            </div>
          }
        />

        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <BellOff size={40} className={styles.emptyIcon} />
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
        onVerReserva={handleVerReserva}
        onAvaliar={handleAvaliar}
        onVerOfertas={handleVerOfertas}
      />
    </>
  );
}
