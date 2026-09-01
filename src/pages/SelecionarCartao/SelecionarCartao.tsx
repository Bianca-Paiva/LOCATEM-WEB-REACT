import type { FormEvent } from 'react';
import { Icon } from '@iconify/react';

import Header from '../../components/Header/Header';
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina';
import { CartaoSelecionavel } from '../../components/Pagamento/CartaoSelecionavel/CartaoSelecionavel';
import BtnPrincipal from '../../components/BtnPrincipal/BtnPrincipal';

import { useSelecionarCartao } from '../../hooks/Pagamento/useSelecionarCartao';
import type { Route } from '../../router/useRouter';

import styles from './SelecionarCartao.module.css';

interface SelecionarCartaoProps {
  navigate: (route: Route) => void;
}

export default function SelecionarCartao({ navigate }: SelecionarCartaoProps) {
  const {
    metodoPagamento,
    titulo,
    cartoesFiltrados,
    cartaoSelecionadoId,
    selecionarCartao,
    adicionarNovoCartao,
    confirmarPagamento,
    erro,
  } = useSelecionarCartao(navigate);

  // Método de pagamento ausente/inválido: o hook já disparou o redirecionamento para o Carrinho, então não há nada útil para renderizar aqui.
  if (!metodoPagamento) return null;

  function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    confirmarPagamento();
  }

  return (
    <>
      <Header navigate={navigate} currentRoute="carrinho" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo={titulo}
          subtitulo="Escolha o cartão que deseja utilizar para realizar o pagamento."
        />

        <form className={styles.formulario} onSubmit={handleSubmit}>
          <fieldset className={styles.grupoCartao}>
            <div className={styles.listaCartoes}>
              {cartoesFiltrados.length === 0 ? (
                <p className={styles.listaVazia}>
                  Nenhum cartão disponível para esta forma de pagamento.
                </p>
              ) : (
                cartoesFiltrados.map((cartao) => (
                  <CartaoSelecionavel
                    key={cartao.id}
                    cartao={cartao}
                    selecionado={cartao.id === cartaoSelecionadoId}
                    onSelecionar={selecionarCartao}
                  />
                ))
              )}
            </div>

            <button type="button" className={styles.btnAdicionar} onClick={adicionarNovoCartao}>
              <span className={styles.iconeAdd}>
                <Icon icon="mdi:plus" width={22} height={22} />
              </span>
              <span>Adicionar novo cartão</span>
            </button>
          </fieldset>

          {erro && <p className={styles.erro}>{erro}</p>}

          <BtnPrincipal text="Usar este cartão" type="submit" />
        </form>
      </main>
    </>
  );
}
