import Header from '../../../components/Header/Header';
import CabecalhoPagina from '../../../components/CabecalhoPagina/CabecalhoPagina';
import LocacaoAbas from '../../../components/MinhasLocacoes/LocacaoAbas/LocacaoAbas';
import LocacaoCard from '../../../components/MinhasLocacoes/LocacaoCard/LocacaoCard';
import EstadoVazio from '../../../components/MinhasLocacoes/EstadoVazio/EstadoVazio';
import { useMinhasLocacoes } from '../../../hooks/Locacoes/useMinhasLocacoes';
import { useLocacaoStore } from '../../../hooks/Locacoes/useLocacaoStore';
import styles from './MinhasLocacoes.module.css';

import type { Route } from '../../../router/useRouter';
// Certifique--se de importar LocacaoData aqui:
import type { FiltroLocacao, LocacaoData } from './MinhasLocacoes.types';
import type { Dispatch, SetStateAction } from 'react';

interface MinhasLocacoesProps {
  navigate: (route: Route) => void;
}

// Texto exibido no estado vazio de cada aba
const ESTADO_VAZIO_TEXTO: Record<FiltroLocacao, { titulo: string; descricao: string }> = {
  todas: {
    titulo: 'Nenhuma locação por aqui',
    descricao: 'Assim que você solicitar uma locação, ela aparecerá nesta tela.',
  },
  pendente: {
    titulo: 'Nenhuma locação aguardando aprovação',
    descricao: 'Você não possui solicitações aguardando aprovação do locador.',
  },
  aguardandoPagamento: {
    titulo: 'Nenhuma locação aguardando pagamento',
    descricao: 'Assim que uma locação for aceita pelo locador, ela aparecerá aqui.',
  },
  confirmada: {
    titulo: 'Nenhuma locação confirmada',
    descricao: 'Locações com pagamento confirmado aparecerão aqui.',
  },
  preparandoEntrega: {
    titulo: 'Nenhuma locação em preparação',
    descricao: 'Locacoes com pagamento confirmado, aguardando o envio, aparecerão aqui.',
  },
  emTransporte: {
    titulo: 'Nenhuma locação em transporte',
    descricao: 'Ferramentas a caminho do seu endereço aparecerão aqui.',
  },
  emAndamento: {
    titulo: 'Nenhuma locação em andamento',
    descricao: 'Locações que você já recebeu e estão no período de uso aparecerão aqui.',
  },
  aguardandoDevolucao: {
    titulo: 'Nenhuma locação aguardando devolução',
    descricao: 'Locacoes com o período de locação encerrando aparecerão aqui.',
  },
  devolucaoEmTransporte: {
    titulo: 'Nenhuma devolução em transporte',
    descricao: 'Ferramentas coletadas e a caminho do locador aparecerão aqui.',
  },
  finalizada: {
    titulo: 'Nenhuma locação finalizada',
    descricao: 'Locações concluídas com sucesso aparecerão aqui.',
  },
  recusada: {
    titulo: 'Nenhuma locação recusada',
    descricao: 'Você não possui solicitações recusadas pelo locador.',
  },
  cancelada: {
    titulo: 'Nenhuma locação cancelada',
    descricao: 'Locacoes canceladas por você ou pelo locador aparecerão aqui.',
  },
};

export default function MinhasLocacoes({ navigate }: MinhasLocacoesProps) {
  const { locacoesFiltradas, filtro, setFiltro, contagem } = useMinhasLocacoes();

  const { setLocacaoSelecionada } = useLocacaoStore() as { 
    setLocacaoSelecionada: Dispatch<SetStateAction<LocacaoData | null>> 
  };

  const handleVerDetalhes = (id: string) => {
    const locacaoClicada = locacoesFiltradas.find((locacao: LocacaoData) => locacao.id === id);

    if (locacaoClicada) {
      setLocacaoSelecionada(locacaoClicada);
      navigate('detalhesLocacao');
    };
  }

  const estadoVazio = ESTADO_VAZIO_TEXTO[filtro];

  return (
    <>
      <Header navigate={navigate} currentRoute="minhasLocacoes" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Minhas Locações"
          subtitulo="Acompanhe todas as suas solicitações de locação."
        />

        <LocacaoAbas filtro={filtro} onChange={setFiltro} contagem={contagem} />

        {locacoesFiltradas.length === 0 ? (
          <EstadoVazio titulo={estadoVazio.titulo} descricao={estadoVazio.descricao} />
        ) : (
          <div className={styles.lista}>
            {locacoesFiltradas.map((locacao: LocacaoData) => (
              <LocacaoCard key={locacao.id} locacao={locacao} onVerDetalhes={handleVerDetalhes} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}