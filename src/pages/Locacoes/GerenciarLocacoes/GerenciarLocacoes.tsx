import { useEffect, useState } from 'react';

import Header from '../../../components/Header/Header';
import CabecalhoPagina from '../../../components/CabecalhoPagina/CabecalhoPagina';
import EstadoVazio from '../../../components/MinhasLocacoes/EstadoVazio/EstadoVazio';
import Abas from '../../../components/MinhasFerramentas/Abas/Abas';
import LocacaoLocadorCard from '../../../components/MinhasFerramentas/GerenciarLocacoes/LocacaoLocadorCard/LocacaoLocadorCard';
import ModalAprovacaoLocacao from '../../../components/MinhasFerramentas/GerenciarLocacoes/ModalAprovacaoLocacao/ModalAprovacaoLocacao';

import { useAuth } from '../../../hooks/Auth/useAuth';
import { useLocacaoStore } from '../../../hooks/Locacoes/useLocacaoStore';
import { useGerenciarLocacoes, ABAS_GERENCIAR_LOCACAO } from '../../../hooks/Locacoes/useGerenciarLocacoes';
import styles from './GerenciarLocacoes.module.css';

import type { Route } from '../../../router/useRouter';
import type { LocacaoData } from '../MinhasLocacoes/MinhasLocacoes.types';

const PRAZO_PADRAO_PAGAMENTO_HORAS = 24;

interface GerenciarLocacoesProps {
  navigate: (route: Route) => void;
}

export default function GerenciarLocacoes({ navigate }: GerenciarLocacoesProps) {
  const { usuario } = useAuth();
  const { atualizarLocacao } = useLocacaoStore();
  const { filtro, setFiltro, contagem, locacoesFiltradas } = useGerenciarLocacoes();
  const [locacaoModal, setLocacaoModal] = useState<LocacaoData | null>(null);

  useEffect(() => {
    if (!usuario || usuario.tipo !== 'locador') {
      navigate('home');
    }
  }, [usuario, navigate]);

  if (!usuario || usuario.tipo !== 'locador') {
    return null;
  }

  const handleClickLocacao = (locacao: LocacaoData) => {
    if (locacao.status === 'pendente') {
      setLocacaoModal(locacao);
    }
  };

  const handleAprovar = (locacao: LocacaoData) => {
    const prazoPagamento = new Date(
      Date.now() + PRAZO_PADRAO_PAGAMENTO_HORAS * 60 * 60 * 1000,
    ).toISOString();

    atualizarLocacao(locacao.id, {
      status: 'aguardandoPagamento',
      mensagemStatus: 'Locação aceita, aguardando o pagamento do locatário',
      prazoPagamento,
    });
    setLocacaoModal(null);
  };

  const handleRecusar = (locacao: LocacaoData) => {
    atualizarLocacao(locacao.id, {
      status: 'recusada',
      mensagemStatus: 'Solicitação recusada pelo locador',
      motivoRecusa: 'Solicitação recusada pelo locador',
    });
    setLocacaoModal(null);
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="gerenciarLocacoes" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Gerenciar Locações"
          subtitulo="Acompanhe e responda às solicitações feitas às suas ferramentas."
        />

        <Abas abas={ABAS_GERENCIAR_LOCACAO} ativo={filtro} onChange={setFiltro} contagem={contagem} />

        {locacoesFiltradas.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma locação encontrada"
            descricao="Locações das suas ferramentas aparecerão aqui."
          />
        ) : (
          <div className={styles.lista}>
            {locacoesFiltradas.map((locacao) => (
              <LocacaoLocadorCard key={locacao.id} locacao={locacao} onClick={handleClickLocacao} />
            ))}
          </div>
        )}
      </main>

      <ModalAprovacaoLocacao
        locacao={locacaoModal}
        onAprovar={handleAprovar}
        onRecusar={handleRecusar}
        onFechar={() => setLocacaoModal(null)}
      />
    </>
  );
}
