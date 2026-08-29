import { createContext, useEffect, useState } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { LocacaoData } from '../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import { mockLocacoes } from '../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.mock';

interface LocacaoContextType {
  locacoes: LocacaoData[];
  locacaoSelecionada: LocacaoData | null;
  // Ajuste: Tipagem nativa do React para funções de atualização de estado
  setLocacaoSelecionada: Dispatch<SetStateAction<LocacaoData | null>>;
  atualizarLocacao: (id: string, dadosAtualizados: Partial<LocacaoData>) => void;
  adicionarLocacao: (dadosLocacao: Omit<LocacaoData, 'id'>) => LocacaoData;
}

export const LocacaoContext = createContext<LocacaoContextType | null>(null);

// Mensagem exibida (na listagem e nos detalhes) quando o prazo de pagamento
// expira sem o pagamento ser efetuado
const MENSAGEM_CANCELAMENTO_AUTOMATICO =
  'Locação cancelada automaticamente por falta de pagamento dentro do prazo.';

// Frequência de verificação do prazo de pagamento das locacoes
const INTERVALO_VERIFICACAO_MS = 60 * 1000; // 1 minuto

export function LocacaoProvider({ children }: { children: ReactNode }) {
  // Fonte única de verdade de todas as locacoes (futuramente virá da API)
  const [locacoes, setLocacoes] = useState<LocacaoData[]>(mockLocacoes);
  const [locacaoSelecionada, setLocacaoSelecionada] = useState<LocacaoData | null>(null);

  // Atualiza uma locacao na lista e, se for a mesma, também na locacao selecionada
  const atualizarLocacao = (id: string, dadosAtualizados: Partial<LocacaoData>) => {
    setLocacoes((atuais) =>
      atuais.map((locacao) =>
        locacao.id === id ? { ...locacao, ...dadosAtualizados } : locacao
      )
    );

    setLocacaoSelecionada((atual) =>
      atual && atual.id === id ? { ...atual, ...dadosAtualizados } : atual
    );
  };

  // Cria uma nova locacao (fluxo de Solicitar Locacao) e a insere no topo da lista
  const adicionarLocacao = (dadosLocacao: Omit<LocacaoData, 'id'>): LocacaoData => {
    const novaLocacao: LocacaoData = {
      ...dadosLocacao,
      id: `r-${Date.now()}`,
    };

    setLocacoes((atuais) => [novaLocacao, ...atuais]);

    return novaLocacao;
  };

  // Verifica periodicamente se alguma locacao "Aguardando pagamento" teve seu
  // prazo expirado e, se sim, cancela automaticamente — atualizando tanto o
  // status quanto a mensagem exibida na listagem e nos detalhes da locacao.
  useEffect(() => {
    const cancelarLocacoesComPagamentoVencido = () => {
      const agora = Date.now();

      const prazoExpirou = (locacao: LocacaoData) =>
        locacao.status === 'aguardandoPagamento' &&
        !!locacao.prazoPagamento &&
        agora > new Date(locacao.prazoPagamento).getTime();

      const cancelarSeVencida = (locacao: LocacaoData): LocacaoData =>
        prazoExpirou(locacao)
          ? {
              ...locacao,
              status: 'cancelada',
              mensagemStatus: MENSAGEM_CANCELAMENTO_AUTOMATICO,
              motivoCancelamento: MENSAGEM_CANCELAMENTO_AUTOMATICO,
            }
          : locacao;

      setLocacoes((atuais) => atuais.map(cancelarSeVencida));
      setLocacaoSelecionada((atual) => (atual ? cancelarSeVencida(atual) : atual));
    };

    cancelarLocacoesComPagamentoVencido(); // verifica imediatamente ao montar
    const intervalo = setInterval(cancelarLocacoesComPagamentoVencido, INTERVALO_VERIFICACAO_MS);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <LocacaoContext.Provider
      value={{ locacoes, locacaoSelecionada, setLocacaoSelecionada, atualizarLocacao, adicionarLocacao }}
    >
      {children}
    </LocacaoContext.Provider>
  );
}