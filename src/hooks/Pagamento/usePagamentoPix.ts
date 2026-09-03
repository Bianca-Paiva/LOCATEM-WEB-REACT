import { useEffect, useMemo, useState } from 'react';
import type { Route } from '../../router/useRouter';
import type { PrazoPagamento } from '../../types/checkout';
import { lerMetodoPagamento, lerValorPagamento } from '../../utils/pagamentoStorage';

const MINUTOS_EXPIRACAO = 15;

/**
 * Gera um código "copia e cola" no estilo Pix (EMV) para fins de exibição.
 * Não é um payload Pix válido — não há integração com um PSP nesta SPA
 * (mesma abordagem mockada usada em outros pontos do checkout, como o
 * cálculo de frete). O valor entra no código só para o código variar
 * conforme a compra.
 */
function gerarCodigoPixMock(valor: number): string {
  const valorFormatado = valor.toFixed(2).replace('.', '');
  const timestamp = Date.now().toString(36).toUpperCase();

  return `00020126580014BR.GOV.BCB.PIX0136LOCATEM-${timestamp}5204000053039865406${valorFormatado}5802BR5913LOCATEM LTDA6009SAO PAULO62070503***6304`;
}

function formatarPrazo(dataLimite: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dataLimite);
}

/** Calcula o instante-limite a partir de agora — só deve ser chamada fora do render (init ou event handler). */
function calcularDataLimite(): Date {
  return new Date(Date.now() + MINUTOS_EXPIRACAO * 60 * 1000);
}

/** Calcula quantos segundos faltam até o instante-limite — só deve ser chamada fora do render. */
function calcularSegundosRestantes(dataLimite: Date): number {
  return Math.max(Math.round((dataLimite.getTime() - Date.now()) / 1000), 0);
}

interface UsePagamentoPixReturn {
  /** Valor total da compra, persistido pelo Carrinho — nunca recalculado aqui. */
  total: number;
  /** false enquanto a tela redireciona por método ausente/inválido (Pix é o único método válido aqui). */
  metodoValido: boolean;
  /** Código "copia e cola" do Pix, gerado a partir do valor. */
  codigoPix: string;
  /** true logo após copiar o código, usado para feedback visual do botão. */
  copiado: boolean;
  /** Copia o código Pix para a área de transferência. */
  copiarCodigo: () => void;
  /** Prazo de validade do QR Code/código Pix, para exibir no resumo do pedido. */
  prazoPagamento: PrazoPagamento;
  /** Segundos restantes até a expiração — fonte única usada por ResumoPedido e PagamentoPixCard. */
  tempoRestanteSegundos: number;
  /** Gera um novo código Pix e reinicia o prazo de expiração. */
  gerarNovoCodigo: () => void;
}

export function usePagamentoPix(navigate: (route: Route) => void): UsePagamentoPixReturn {
  const metodo = useMemo(() => lerMetodoPagamento(), []);
  const metodoValido = metodo === 'pix';

  // Redireciona caso o método seja ausente ou inválido — mesma regra usada em Selecionar Cartão.
  useEffect(() => {
    if (!metodoValido) {
      navigate('carrinho');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metodoValido]);

  // Valor total calculado e persistido pelo Carrinho — nunca recalculado aqui.
  const total = useMemo(() => lerValorPagamento(), []);

  // codigoPix e dataLimite vivem em estado próprio (em vez de serem derivados via useMemo)
  // porque "gerar novo código" é uma ação do usuário, não algo que decorre de props/estado
  // que mudam durante a renderização. As funções impuras (Date.now()) só são chamadas nos
  // inicializadores preguiçosos do useState (executam uma única vez, fora do fluxo de render)
  // e dentro de gerarNovoCodigo (um event handler) — nunca no corpo do componente.
  const [codigoPix, setCodigoPix] = useState(() => gerarCodigoPixMock(total));
  const [dataLimite, setDataLimite] = useState(() => calcularDataLimite());

  // Cronômetro regressivo — única fonte de verdade do tempo restante, usada tanto
  // pelo ResumoPedido (exibição do contador) quanto pelo PagamentoPixCard (estado expirado).
  const [tempoRestanteSegundos, setTempoRestanteSegundos] = useState(() =>
    calcularSegundosRestantes(dataLimite),
  );

  useEffect(() => {
    if (tempoRestanteSegundos <= 0) return;

    const interval = setInterval(() => {
      setTempoRestanteSegundos((atual) => Math.max(atual - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [tempoRestanteSegundos]);

  const expirado = tempoRestanteSegundos <= 0;

  const prazoPagamento: PrazoPagamento = useMemo(
    () => ({ texto: formatarPrazo(dataLimite), expirado }),
    [dataLimite, expirado],
  );

  function gerarNovoCodigo() {
    const novaDataLimite = calcularDataLimite();
    setCodigoPix(gerarCodigoPixMock(total));
    setDataLimite(novaDataLimite);
    setTempoRestanteSegundos(calcularSegundosRestantes(novaDataLimite));
  }

  const [copiado, setCopiado] = useState(false);

  function copiarCodigo() {
    navigator.clipboard
      ?.writeText(codigoPix)
      .then(() => {
        setCopiado(true);
        window.setTimeout(() => setCopiado(false), 3000);
      })
      .catch(() => {
        // Área de transferência indisponível (ex.: contexto não seguro) — sem feedback adicional.
      });
  }

  return {
    total,
    metodoValido,
    codigoPix,
    copiado,
    copiarCodigo,
    prazoPagamento,
    tempoRestanteSegundos,
    gerarNovoCodigo,
  };
}