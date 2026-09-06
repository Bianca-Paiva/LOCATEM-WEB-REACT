import Header from '../../../components/Header/Header';
import CabecalhoPagina from '../../../components/CabecalhoPagina/CabecalhoPagina';
import { CheckoutLayout } from '../../../components/Carrinho/Resumo/CheckoutLayout/CheckoutLayout';
import { ResumoPedido } from '../../../components/Carrinho/Resumo/ResumoPedido/ResumoPedido';
import { AdicionarCartaoForm } from '../../../components/Pagamento/AdicionarCartaoForm/AdicionarCartaoForm';

import { useAdicionarCartao } from '../../../hooks/Pagamento/useAdicionarCartao';
import type { Route } from '../../../router/useRouter';

import styles from './AdicionarCartaoCredito.module.css';

interface AdicionarCartaoCreditoProps {
  navigate: (route: Route) => void;
}

export default function AdicionarCartaoCredito({ navigate }: AdicionarCartaoCreditoProps) {
  const {
    valor,
    dados,
    bandeira,
    erros,
    processando,
    onNumeroChange,
    onNomeTitularChange,
    onValidadeChange,
    onValidadeBlur,
    onCvvChange,
    onParcelamentoChange,
    onSalvarCartaoChange,
    confirmar,
  } = useAdicionarCartao('credito', navigate);

  return (
    <>
      <Header navigate={navigate} currentRoute="carrinho" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Pagamento com Cartão de Crédito"
          subtitulo="Insira os dados do seu cartão para continuar o pagamento."
        />

        <CheckoutLayout
          aside={
            <ResumoPedido
              variant="pagamento"
              total={valor}
              ctaLabel={processando ? 'Processando pagamento...' : 'Continuar Pagamento'}
              onCtaClick={confirmar}
              ctaDisabled={processando}
              mostrarSeguro
            />
          }
        >
          <AdicionarCartaoForm
            dados={dados}
            bandeira={bandeira}
            erros={erros}
            mostrarParcelamento
            onNumeroChange={onNumeroChange}
            onNomeTitularChange={onNomeTitularChange}
            onValidadeChange={onValidadeChange}
            onValidadeBlur={onValidadeBlur}
            onCvvChange={onCvvChange}
            onParcelamentoChange={onParcelamentoChange}
            onSalvarCartaoChange={onSalvarCartaoChange}
          />
        </CheckoutLayout>
      </main>
    </>
  );
}
