import { Icon } from '@iconify/react';
import { CreditCard } from 'lucide-react';

import BtnPrincipal from '../../../components/BtnPrincipal/BtnPrincipal';
import BtnSecundario from '../../../components/BtnSecundario/BtnSecundario';

import { usePagamentoAprovado } from '../../../hooks/Pagamento/usePagamentoAprovado';
import type { Route } from '../../../router/useRouter';

import styles from './PagamentoAprovado.module.css';

/* ============================================================
  Fluxo: Processando Pagamento -> Pagamento Aprovado
============================================================ */

interface PagamentoAprovadoProps {
  navigate: (route: Route) => void;
}

const formatarPreco = (valor: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

export default function PagamentoAprovado({ navigate }: PagamentoAprovadoProps) {
  const {
    acessoValido,
    total,
    metodo,
    metodoFormatado,
    dataHora,
    nomeUsuario,
    produtos,
    entrega,
    verDetalhesDoAluguel,
    voltarParaInicio,
  } = usePagamentoAprovado(navigate);

  // Acesso direto/indevido (sem passar por "Processando Pagamento"): o hook já disparou o redirecionamento para o Carrinho, então não há nada útil para renderizar aqui.
  if (!acessoValido) return null;

  return (
    <main className={styles.paymentSuccess}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.successIcon}>
            <Icon
              icon="fa6-solid:circle-check"
              className={styles.iconeConcluido}
              aria-hidden="true"
            />
          </div>

          <h1 className={styles.heroTitle}>Pagamento aprovado com sucesso</h1>
          <p className={styles.heroSubtitle}>Sua transação foi processada.</p>
          <p className={styles.heroPrice}>{formatarPreco(total)}</p>

          <div className={styles.heroDivider} />
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.pickupAlert}>
          <div className={styles.alertIcon}>
            <Icon
              icon="fa6-solid:circle-info"
              width="20"
              height="20"
              style={{ color: '#1B6D24' }}
              aria-hidden="true"
            />
          </div>
          <p>Seu aluguel será entregue em até 3 horas.</p>
        </div>

        <div className={styles.resumoCard}>
          <p className={styles.sectionTitle}>Resumo do pedido</p>

          <div className={styles.detailsList}>
            {nomeUsuario && (
              <div className={styles.detailRow}>
                <span className={styles.label}>
                  <Icon icon="fa6-solid:user" width="14" height="14" aria-hidden="true" />
                  Usuário
                </span>
                <span className={styles.value}>{nomeUsuario}</span>
              </div>
            )}

            <div className={styles.detailRow}>
              <span className={styles.label}>
                {metodo === 'pix' ? (
                  <Icon icon="ic:outline-pix" width="14" height="14" aria-hidden="true" />
                ) : (
                  <CreditCard size={14} aria-hidden="true" />
                )}
                Método de pagamento
              </span>
              <span className={styles.value}>{metodoFormatado}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.label}>
                <Icon icon="fa6-solid:calendar-days" width="14" height="14" aria-hidden="true" />
                Data e Hora
              </span>
              <span className={styles.value}>{dataHora}</span>
            </div>

            {entrega && (
              <div className={styles.detailRow}>
                <span className={styles.label}>
                  <Icon icon="fa6-solid:truck-fast" width="14" height="14" aria-hidden="true" />
                  Entrega
                </span>
                <span className={styles.value}>
                  {entrega.data} das {entrega.horario}
                  {entrega.todosOsItens ? ' — todos os itens' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {produtos.length > 0 && (
          <div className={styles.produtosSection}>
            <p className={styles.sectionTitle}>Itens alugados</p>

            <div className={styles.listaProdutos}>
              {produtos.map((produto) => {
                const labelUnid = produto.unidades === 1 ? 'unidade' : 'unidades';
                const labelDia = produto.dias === 1 ? 'dia' : 'dias';

                return (
                  <article key={produto.id} className={styles.productCard}>
                    <img src={produto.imagem} alt={produto.nome} />
                    <div className={styles.productInfo}>
                      <h2>{produto.nome}</h2>
                      <p>
                        Quantidade: {produto.unidades} {labelUnid} • Locação: {produto.dias} {labelDia}
                      </p>
                      {/* Só exibe a entrega por item quando o Resumo do pedido não tem uma janela única para todos os itens (ver `entrega` acima) — evita duplicar a mesma informação nos dois lugares. */}
                      {!entrega && (
                        <p className={styles.productEntrega}>
                          <Icon icon="fa6-solid:truck-fast" width="12" height="12" aria-hidden="true" />
                          Entrega: {produto.entrega.data} das {produto.entrega.horario}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <BtnPrincipal text="Ver detalhes do aluguel" onClick={verDetalhesDoAluguel} type="button" />

          <BtnSecundario 
            text="Voltar para a página inicial" 
            onClick={voltarParaInicio} 
            type="button" 
          />
        </div>
      </section>
    </main>
  );
}