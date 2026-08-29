import { useState } from 'react';
import { BellOff, Trash2 } from 'lucide-react';
import NotificationCard from '../../components/Notificacoes/NotificationCard/NotificationCard';
import FilterDropdown from '../../components/Notificacoes/FilterDropdownNotificacao/FilterDropdown';
import Pagination from '../../components/Notificacoes/Pagination/Pagination';
import NotificationDetailsModal from '../../components/Notificacoes/NotificationModal/NotificationDetailsModal';
import { useNotifications } from '../../hooks/useNotifications';
import { useLocacaoStore } from '../../hooks/Locacoes/useLocacaoStore';
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

  // Fonte das locacoes reais (mesma usada em 'Minhas Locações' e 'Detalhes da Locacao')
  const { locacoes, setLocacaoSelecionada } = useLocacaoStore();

  // Notificação atualmente aberta no modal; null = modal fechado
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);

  const handleVerDetalhes = (id: string) => {
    const notification = pageItems.find((item) => item.id === id) ?? null;
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => setSelectedNotification(null);

  // Seleciona a locacao vinculada (mesmo padrão usado em MinhasLocacoes ao abrir uma
  // locacao) e leva o usuário para a tela de Detalhes da Locacao. Usado pelos botões
  // "Ver locação", "Efetuar pagamento", "Tentar pagamento novamente" e "Ver detalhes".
  const handleVerLocacao = (locacaoId: string) => {
    const locacao = locacoes.find((item) => item.id === locacaoId);
    if (!locacao) return;

    setLocacaoSelecionada(locacao);
    navigate('detalhesLocacao');
  };

  // Seleciona a locacao finalizada e leva o usuário direto para o fluxo de avaliação.
  const handleAvaliar = (locacaoId: string) => {
    const locacao = locacoes.find((item) => item.id === locacaoId);
    if (!locacao) return;

    setLocacaoSelecionada(locacao);
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
                <Trash2 size={16} />
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
              Assim que houver novidades sobre suas locacoes e entregas, elas aparecem nesta tela.
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
        onVerLocacao={handleVerLocacao}
        onAvaliar={handleAvaliar}
        onVerOfertas={handleVerOfertas}
      />
    </>
  );
}
