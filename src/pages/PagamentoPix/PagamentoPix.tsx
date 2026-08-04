import { useState } from 'react';
import { CheckoutLayout } from '../../components/Compartilhados/CheckoutLayout/CheckoutLayout';
import { HeaderPagamento } from '../../components/Pagamento/HeaderPagamento/HeaderPagamento';
import { PagamentoPix as PagamentoPixCard } from '../../components/Pagamento/PagamentoPix/PagamentoPix';
import { PagamentoExpirado } from '../../components/Pagamento/PagamentoExpirado/PagamentoExpirado';
import { ResumoPedido } from '../../components/Compartilhados/ResumoPedido/ResumoPedido';

interface PagamentoPixPageProps {
  total?: number;
  onBack?: () => void;
}

export function PagamentoPix({ total = 380, onBack }: PagamentoPixPageProps) {
  const [expirado, setExpirado] = useState(false);

  const prazoTexto = '17 de abril 2026, 15:41';

  return (
    <CheckoutLayout
      header={<HeaderPagamento />}
      titulo="Pagamento com Pix"
      onBack={onBack}
      aside={
        <ResumoPedido
          variant="pagamento"
          total={total}
          prazoPagamento={{ texto: prazoTexto, expirado }}
          mostrarSeguro
        />
      }
    >
      {expirado ? (
        <PagamentoExpirado onGerarNovoQrCode={() => setExpirado(false)} />
      ) : (
        <PagamentoPixCard
          pixCode="00020126580014BR.GOV.BCB.PIX0136f7de9e80-27eb-4b3a-9b8c-9c6dc1d0a1e25204000053039865405380.005802BR5913LOCATEM LTDA6009SAO PAULO62070503***6304ABCD"
          duracaoSegundos={600}
          onCopiarCodigo={codigo => navigator.clipboard?.writeText(codigo)}
        />
      )}
    </CheckoutLayout>
  );
}
