import { useMemo, useState } from 'react';

import Header from '../../components/Header/Header';
import { CarrinhoVazio } from '../../components/Carrinho/CarrinhoVazio/CarrinhoVazio';
import { LojaGroup } from '../../components/Carrinho/LojaGroup/LojaGroup';
import { ResumoPedido } from '../../components/Carrinho/Resumo/ResumoPedido/ResumoPedido';

import type { LojaGroupData } from '../../types/checkout';
import type { Route } from '../../router/useRouter';

import styles from './Carrinho.module.css';
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina';
import { CheckoutLayout } from '../../components/Carrinho/Resumo/CheckoutLayout/CheckoutLayout';

/* ============================================================
   MOCK
============================================================ */

const LOJAS_MOCK: LojaGroupData[] = [
  {
    id: 'jb',
    nomeLoja: 'Produto de JB Ferramentas',
    lojaOficialDe: 'Dewalt',
    verificado: true,
    itens: [
      {
        id: 'jb-1',
        image: 'src/assets/ProdutosImg/FuradeiraWapCinza.png',
        title: 'Furadeira Elétrica de Impacto',
        dias: 1,
        voltagem: '220V',
        quantidade: 1,
        precoUnitario: 599.98,
      },
      {
        id: 'jb-2',
        image: 'src/assets/ProdutosImg/FuradeiraWapCinza.png',
        title: 'Furadeira Elétrica de Impacto',
        dias: 1,
        voltagem: '220V',
        quantidade: 1,
        precoUnitario: 599.98,
      },
      {
        id: 'jb-3',
        image: 'src/assets/ProdutosImg/FuradeiraWapCinza.png',
        title: 'Furadeira Elétrica de Impacto',
        dias: 1,
        voltagem: '220V',
        quantidade: 1,
        precoUnitario: 599.98,
      },
    ],
  },
  {
    id: 'wz',
    nomeLoja: 'Produto de WZ Ferramentas',
    lojaOficialDe: 'Wap',
    verificado: true,
    itens: [
      {
        id: 'wz-1',
        image: 'src/assets/ProdutosImg/FuradeiraWapCinza.png',
        title: 'Furadeira Elétrica de Impacto',
        dias: 1,
        voltagem: '220V',
        quantidade: 1,
        precoUnitario: 599.98,
      },
      {
        id: 'wz-2',
        image: 'src/assets/ProdutosImg/FuradeiraWapCinza.png',
        title: 'Furadeira Elétrica de Impacto',
        dias: 1,
        voltagem: '220V',
        quantidade: 1,
        precoUnitario: 599.98,
      },
    ],
  },
];

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
  forcarVazio?: boolean;
  onBack?: () => void;
  onConferirProdutos?: () => void;
  onContinuarParaPagamento?: () => void;
}

export function Carrinho({
  navigate,
  forcarVazio = false,
  onBack,
  onConferirProdutos,
  onContinuarParaPagamento,
}: CarrinhoProps) {
  const [lojas, setLojas] = useState<LojaGroupData[]>(
    forcarVazio ? [] : LOJAS_MOCK,
  );

  const [freteValor, setFreteValor] =
    useState<number | null>(null);

  const [cupomAplicado, setCupomAplicado] =
    useState<string | null>(null);

  /*
   * O preço unitário está sendo considerado como o valor
   * de uma unidade por dia.
   *
   * Fórmula:
   * preço unitário × quantidade × dias
   */
  const subtotal = useMemo(
    () =>
      lojas.reduce(
        (totalDasLojas, loja) =>
          totalDasLojas +
          loja.itens.reduce(
            (totalDosItens, item) =>
              totalDosItens +
              item.precoUnitario *
              item.quantidade *
              item.dias,
            0,
          ),
        0,
      ),
    [lojas],
  );

  const total = useMemo(
    () => subtotal + (freteValor ?? 0),
    [subtotal, freteValor],
  );

  const carrinhoVazio = useMemo(
    () =>
      lojas.length === 0 ||
      lojas.every(
        (loja) => loja.itens.length === 0,
      ),
    [lojas],
  );

  function handleQuantidadeChange(
    id: string,
    quantidade: number,
  ) {
    if (quantidade < 1) {
      return;
    }

    setLojas((lojasAtuais) =>
      lojasAtuais.map((loja) => ({
        ...loja,

        itens: loja.itens.map((item) =>
          item.id === id
            ? {
              ...item,
              quantidade,
            }
            : item,
        ),
      })),
    );
  }

  function handleDiasChange(
    id: string,
    dias: number,
  ) {
    if (dias < 1) {
      return;
    }

    setLojas((lojasAtuais) =>
      lojasAtuais.map((loja) => ({
        ...loja,

        itens: loja.itens.map((item) =>
          item.id === id
            ? {
              ...item,
              dias,
            }
            : item,
        ),
      })),
    );
  }

  function handleRemoveItem(id: string) {
    setLojas((lojasAtuais) =>
      lojasAtuais
        .map((loja) => ({
          ...loja,

          itens: loja.itens.filter(
            (item) => item.id !== id,
          ),
        }))
        .filter(
          (loja) => loja.itens.length > 0,
        ),
    );
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
     * Depois, este trecho pode chamar a API de frete.
     */
    setFreteValor(0);
  }

  function handleAplicarCupom(
    codigo: string,
  ) {
    const codigoNormalizado = codigo
      .trim()
      .toUpperCase();

    if (!codigoNormalizado) {
      return;
    }

    setCupomAplicado(codigoNormalizado);
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

        <CheckoutLayout
          titulo="Carrinho"
          onBack={onBack}
          aside={
            <ResumoPedido
              variant={
                carrinhoVazio
                  ? 'vazio'
                  : 'carrinho'
              }
              subtotal={subtotal}
              total={total}
              freteValor={freteValor}
              onCalcularFrete={
                handleCalcularFrete
              }
              onAplicarCupom={
                handleAplicarCupom
              }
              cupomAplicado={cupomAplicado}
              ctaLabel="Continuar para Pagamento"
              onCtaClick={
                onContinuarParaPagamento
              }
              ctaDisabled={carrinhoVazio}
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
            lojas.map((loja) => (
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
              />
            ))
          )}
        </CheckoutLayout>
      </main>
    </>
  );
}
