import { useMemo, useState } from 'react';

import Header from '../../components/Header/Header';
import { CarrinhoVazio } from '../../components/Carrinho/CarrinhoVazio/CarrinhoVazio';
import { LojaGroup } from '../../components/Carrinho/LojaGroup/LojaGroup';
import { ResumoPedido } from '../../components/Carrinho/Resumo/ResumoPedido/ResumoPedido';
import { useCarrinhoStore } from '../../hooks/useCarrinhoStore';

import type { CarrinhoItemData, LojaGroupData } from '../../types/checkout';
import type { ItemCarrinho as ItemCarrinhoContexto } from '../../context/CarrinhoContext';
import type { Route } from '../../router/useRouter';

import styles from './Carrinho.module.css';
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina';
import { CheckoutLayout } from '../../components/Carrinho/Resumo/CheckoutLayout/CheckoutLayout';

/* ============================================================
   HELPERS
============================================================ */

// Preço do produto vem como string ("599,98") vinda do cadastro — mesma
// conversão usada em useSolicitarReservaModal.ts.
function precoDiariaDoProduto(price: string): number {
  const preco = Number(String(price).replace(',', '.'));
  return Number.isFinite(preco) ? preco : 0;
}

// Agrupa os itens do carrinho (contexto global, populado só via "Adicionar
// ao carrinho" na página do produto) por locador, no formato que
// LojaGroup/ItemCarrinho já sabem exibir.
function agruparPorLoja(itens: ItemCarrinhoContexto[]): LojaGroupData[] {
  const grupos = new Map<string, LojaGroupData>();

  itens.forEach((item) => {
    const nomeLoja = item.produto.locador;

    const itemData: CarrinhoItemData = {
      id: item.id,
      image: item.produto.images[0] ?? '',
      title: item.produto.title,
      dias: item.dados.resumo.diarias,
      precoUnitario: precoDiariaDoProduto(item.produto.price),
      quantidade: item.dados.quantidade,
      selecionado: item.selecionado,
      estoqueDisponivel: item.produto.estoqueDisponivel,
    };

    const grupoExistente = grupos.get(nomeLoja);
    if (grupoExistente) {
      grupoExistente.itens.push(itemData);
    } else {
      grupos.set(nomeLoja, {
        id: nomeLoja,
        nomeLoja: `Produto de ${nomeLoja}`,
        verificado: true,
        itens: [itemData],
      });
    }
  });

  return Array.from(grupos.values());
}

/* ============================================================
   PAGE
============================================================ */

interface CarrinhoPageProps {
  navigate: (route: Route) => void;
}

export default function CarrinhoPage({
  navigate,
}: CarrinhoPageProps) {
  return (
    <Carrinho
      navigate={navigate}
      onBack={() => navigate('busca')}
      onConferirProdutos={() => navigate('busca')}
      onContinuarParaPagamento={() =>
        navigate('pagamentoPix')
      }
    />
  );
}

/* ============================================================
   COMPONENT
============================================================ */

interface CarrinhoProps {
  navigate: (route: Route) => void;
  onBack?: () => void;
  onConferirProdutos?: () => void;
  onContinuarParaPagamento?: () => void;
}

export function Carrinho({
  navigate,
  onBack,
  onConferirProdutos,
  onContinuarParaPagamento,
}: CarrinhoProps) {
  const {
    itens,
    removerItem,
    atualizarQuantidade,
    atualizarDias,
    alternarSelecao,
    selecionarTodos,
  } = useCarrinhoStore();

  const lojas = useMemo(() => agruparPorLoja(itens), [itens]);

  const [freteValor, setFreteValor] =
    useState<number | null>(null);

  const [cupomAplicado, setCupomAplicado] =
    useState<string | null>(null);

  const [cupomAviso, setCupomAviso] =
    useState<string | null>(null);

  const [percentualDesconto, setPercentualDesconto] =
    useState(0);

  const carrinhoVazio = itens.length === 0;

  const todosSelecionados =
    itens.length > 0 && itens.every((item) => item.selecionado);

  const nenhumSelecionado =
    itens.length === 0 || itens.every((item) => !item.selecionado);

  /*
   * O preço unitário está sendo considerado como o valor
   * de uma unidade por dia.
   *
   * Fórmula:
   * preço unitário × quantidade × dias
   *
   * Apenas os itens selecionados (checkbox) entram no subtotal.
   */
  const subtotal = useMemo(
    () =>
      lojas.reduce(
        (totalDasLojas, loja) =>
          totalDasLojas +
          loja.itens.reduce(
            (totalDosItens, item) =>
              totalDosItens +
              (item.selecionado
                ? item.precoUnitario *
                  item.quantidade *
                  item.dias
                : 0),
            0,
          ),
        0,
      ),
    [lojas],
  );

  const desconto = useMemo(
    () => subtotal * percentualDesconto,
    [subtotal, percentualDesconto],
  );

  const freteComCupom =
    cupomAplicado === 'FRETEGRATIS' ? 0 : freteValor;

  const total = useMemo(
    () => subtotal - desconto + (freteComCupom ?? 0),
    [subtotal, desconto, freteComCupom],
  );

  function handleQuantidadeChange(
    id: string,
    quantidade: number,
  ) {
    atualizarQuantidade(id, quantidade);
  }

  function handleDiasChange(
    id: string,
    dias: number,
  ) {
    atualizarDias(id, dias);
  }

  function handleRemoveItem(id: string) {
    removerItem(id);
  }

  function handleSelecionarItem(id: string) {
    alternarSelecao(id);
  }

  function handleSelecionarTodos(selecionado: boolean) {
    selecionarTodos(selecionado);
  }

  function handleCalcularFrete(cep: string) {
    const cepNormalizado = cep.replace(
      /\D/g,
      '',
    );

    if (cepNormalizado.length !== 8) {
      return;
    }

    /*
     * Frete gratuito temporário.
     * Depois, este trecho deve chamar a API de frete.
     */
    setFreteValor(10);
  }

  function handleAplicarCupom(
    codigo: string,
  ) {
    const codigoNormalizado = codigo
      .trim()
      .toUpperCase();

    if (codigoNormalizado === 'LOCATEM10') {
      setCupomAplicado(codigoNormalizado);
      setCupomAviso(codigoNormalizado);
      setPercentualDesconto(0.1);
      return;
    }

    if (codigoNormalizado === 'FRETEGRATIS') {
      setCupomAplicado(codigoNormalizado);
      setCupomAviso(codigoNormalizado);
      setPercentualDesconto(0);
      return;
    }

    setCupomAplicado(null);
    setCupomAviso(null);
    setPercentualDesconto(0);
  }

  function handleOcultarCupomAviso() {
    setCupomAviso(null);
  }

  return (
    <>
      <Header
        navigate={navigate}
        currentRoute="carrinho"
      />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Carrinho"
        />

        <div className={styles.checkout}>
        <CheckoutLayout
          onBack={onBack}
          aside={
            <ResumoPedido
              variant={
                carrinhoVazio
                  ? 'vazio'
                  : 'carrinho'
              }
              subtotal={subtotal}
              desconto={desconto}
              total={total}
              freteValor={freteComCupom}
              onCalcularFrete={
                handleCalcularFrete
              }
              onAplicarCupom={
                handleAplicarCupom
              }
              cupomAviso={cupomAviso}
              onOcultarCupomAviso={handleOcultarCupomAviso}
              ctaLabel="Continuar para Pagamento"
              onCtaClick={
                onContinuarParaPagamento
              }
              ctaDisabled={carrinhoVazio || nenhumSelecionado}
            />
          }
        >
          {carrinhoVazio ? (
            <CarrinhoVazio
              onConferirProdutos={
                onConferirProdutos
              }
            />
          ) : (
            <>
              <label className={styles.selecionarTodos}>
                <input
                  type="checkbox"
                  checked={todosSelecionados}
                  onChange={(e) =>
                    handleSelecionarTodos(e.target.checked)
                  }
                />
                Selecionar todos
              </label>

              {lojas.map((loja) => (
                <LojaGroup
                  key={loja.id}
                  loja={loja}
                  onQuantidadeChange={
                    handleQuantidadeChange
                  }
                  onDiasChange={
                    handleDiasChange
                  }
                  onRemoveItem={
                    handleRemoveItem
                  }
                  onSelecionarItem={
                    handleSelecionarItem
                  }
                />
              ))}
            </>
          )}
        </CheckoutLayout>
        </div>
      </main>
    </>
  );
}
