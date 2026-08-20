import { CheckoutLayout } from '../../components/Carrinho/Resumo/CheckoutLayout/CheckoutLayout';
import { HeaderPagamento } from '../../components/Pagamento/HeaderPagamento/HeaderPagamento';
import { PagamentoCartaoForm } from '../../components/Pagamento/PagamentoCartaoForm/PagamentoCartaoForm';
import { ResumoPedido } from '../../components/Carrinho/Resumo/ResumoPedido/ResumoPedido';

interface PagamentoCartaoProps {
  total?: number;
  onBack?: () => void;
  onConfirmarPagamento?: () => void;
}

export function PagamentoCartao({
  total = 380,
  onBack,
  onConfirmarPagamento,
}: PagamentoCartaoProps) {
  return (
    <CheckoutLayout
      header={<HeaderPagamento />}
      titulo="Pagamento com Cartão de Crédito"
      onBack={onBack}
      aside={
        <ResumoPedido
          variant="pagamento"
          total={total}
          ctaLabel="Confirmar Pagamento"
          onCtaClick={onConfirmarPagamento}
          mostrarSeguro
        />
      }
    >
      <PagamentoCartaoForm />
    </CheckoutLayout>
  );
}
