import Header from '../../../components/Header/Header';
import CabecalhoPagina from '../../../components/CabecalhoPagina/CabecalhoPagina';
import ReservaAbas from '../../../components/MinhasReservas/ReservaAbas/ReservaAbas';
import ReservaCard from '../../../components/MinhasReservas/ReservaCard/ReservaCard';
import EstadoVazio from '../../../components/MinhasReservas/EstadoVazio/EstadoVazio';
import { useMinhasReservas } from '../../../hooks/Reservas/useMinhasReservas';
import { useReservaStore } from '../../../hooks/Reservas/useReservaStore';
import styles from './MinhasReservas.module.css';

import type { Route } from '../../../router/useRouter';
import type { FiltroReserva } from './MinhasReservas.types';

interface MinhasReservasProps {
  navigate: (route: Route) => void;
}

// Texto exibido no estado vazio de cada aba
const ESTADO_VAZIO_TEXTO: Record<FiltroReserva, { titulo: string; descricao: string }> = {
  todas: {
    titulo: 'Nenhuma reserva por aqui',
    descricao: 'Assim que você solicitar uma locação, ela aparecerá nesta tela.',
  },
  pendente: {
    titulo: 'Nenhuma reserva aguardando aprovação',
    descricao: 'Você não possui solicitações aguardando aprovação do locador.',
  },
  aguardandoPagamento: {
    titulo: 'Nenhuma reserva aguardando pagamento',
    descricao: 'Assim que uma reserva for aceita pelo locador, ela aparecerá aqui.',
  },
  preparandoEntrega: {
    titulo: 'Nenhuma reserva em preparação',
    descricao: 'Reservas com pagamento confirmado, aguardando o envio, aparecerão aqui.',
  },
  emTransporte: {
    titulo: 'Nenhuma reserva em transporte',
    descricao: 'Ferramentas a caminho do seu endereço aparecerão aqui.',
  },
  emAndamento: {
    titulo: 'Nenhuma reserva em andamento',
    descricao: 'Locações que você já recebeu e estão no período de uso aparecerão aqui.',
  },
  aguardandoDevolucao: {
    titulo: 'Nenhuma reserva aguardando devolução',
    descricao: 'Reservas com o período de locação encerrando aparecerão aqui.',
  },
  devolucaoEmTransporte: {
    titulo: 'Nenhuma devolução em transporte',
    descricao: 'Ferramentas coletadas e a caminho do locador aparecerão aqui.',
  },
  finalizada: {
    titulo: 'Nenhuma reserva finalizada',
    descricao: 'Locações concluídas com sucesso aparecerão aqui.',
  },
  recusada: {
    titulo: 'Nenhuma reserva recusada',
    descricao: 'Você não possui solicitações recusadas pelo locador.',
  },
  cancelada: {
    titulo: 'Nenhuma reserva cancelada',
    descricao: 'Reservas canceladas por você ou pelo locador aparecerão aqui.',
  },
};

export default function MinhasReservas({ navigate }: MinhasReservasProps) {
  const { reservasFiltradas, filtro, setFiltro, contagem } = useMinhasReservas();

  const { setReservaSelecionada } = useReservaStore();

  const handleVerDetalhes = (id: string) => {
    const reservaClicada = reservasFiltradas.find((reserva) => reserva.id === id);

    if (reservaClicada) {
      setReservaSelecionada(reservaClicada);
      navigate('detalhesReserva');
    };
  }

  const estadoVazio = ESTADO_VAZIO_TEXTO[filtro];

  return (
    <>
      <Header navigate={navigate} currentRoute="minhasReservas" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Minhas Reservas"
          subtitulo="Acompanhe todas as suas solicitações de reserva."
        />

        <ReservaAbas filtro={filtro} onChange={setFiltro} contagem={contagem} />

        {reservasFiltradas.length === 0 ? (
          <EstadoVazio titulo={estadoVazio.titulo} descricao={estadoVazio.descricao} />
        ) : (
          <div className={styles.lista}>
            {reservasFiltradas.map((reserva) => (
              <ReservaCard key={reserva.id} reserva={reserva} onVerDetalhes={handleVerDetalhes} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}