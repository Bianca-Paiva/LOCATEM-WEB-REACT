import { useEffect } from 'react';
import Header from '../../../components/Header/Header';
import CabecalhoPagina from '../../../components/CabecalhoPagina/CabecalhoPagina';
import EtiquetaStatus from '../../../components/MinhasLocacoes/EtiquetaStatus/EtiquetaStatus';
import LocacaoResumoCard from '../../../components/DetalhesLocacao/LocacaoResumoCard/LocacaoResumoCard';
import PainelStatusLocacao from '../../../components/DetalhesLocacao/PainelStatusLocacao/PainelStatusLocacao';
import AcoesLocacao from '../../../components/DetalhesLocacao/AcoesLocacao/AcoesLocacao';
import { useLocacaoStore } from '../../../hooks/Locacoes/useLocacaoStore';
import styles from './DetalhesLocacao.module.css';

import type { Route } from '../../../router/useRouter';

interface DetalhesLocacaoProps {
  navigate: (route: Route) => void;
}

export default function DetalhesLocacao({ navigate }: DetalhesLocacaoProps) {
  const { locacaoSelecionada, atualizarLocacao } = useLocacaoStore();

  // Sem locacao selecionada (ex: acesso direto à rota), volta para a listagem.
  useEffect(() => {
    if (!locacaoSelecionada) {
      navigate('minhasLocacoes');
    }
  }, [locacaoSelecionada, navigate]);

  if (!locacaoSelecionada) {
    return null;
  }

  const { status, motivoRecusa, motivoCancelamento, horaInicio, horaFim } = locacaoSelecionada;

  const handleCancelarSolicitacao = () => {
    const mensagem = 'Esta locação foi cancelada por você.';
    atualizarLocacao(locacaoSelecionada.id, {
      status: 'cancelada',
      mensagemStatus: mensagem,
      motivoCancelamento: mensagem,
    });
  }

  const handleVerLocacoes = () => {
    // Integrar aqui com a tela de locações do usuário.
    navigate('minhasLocacoes');
  };

  const handleProsseguirAluguel = () => {
    // Integrar aqui com o fluxo de pagamento/retirada.
  };

  const handleVoltarLocacoes = () => {
    navigate('minhasLocacoes');
  };

  const handleAvaliacao = () => {
    // A locacao finalizada já está em `locacaoSelecionada` (contexto), então a
    // página de Avaliação consegue montar a ferramenta de avaliação com os
    // dados dela assim que a rota mudar.
    navigate('avaliacao');
  };

  const handleSolicitarNovaLocacao = () => {
    // Integrar aqui com a tela de busca/produto para uma nova solicitação.
    navigate('busca');
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="minhasLocacoes" />

      <main className={styles.pagina}>
        <CabecalhoPagina titulo="Detalhes da Locação" acao={<EtiquetaStatus status={status} />} />

        <LocacaoResumoCard locacao={locacaoSelecionada} />

        <PainelStatusLocacao
          status={status}
          motivoRecusa={motivoRecusa}
          motivoCancelamento={motivoCancelamento}
          horaInicio={horaInicio}
          horaFim={horaFim}
        />

        <AcoesLocacao
          status={status}
          onCancelarSolicitacao={handleCancelarSolicitacao}
          onVerLocacoes={handleVerLocacoes}
          onAvaliacao={handleAvaliacao}
          onProsseguirAluguel={handleProsseguirAluguel}
          onVoltarLocacoes={handleVoltarLocacoes}
          onSolicitarNovaLocacao={handleSolicitarNovaLocacao}
        />
      </main>
    </>
  );
}