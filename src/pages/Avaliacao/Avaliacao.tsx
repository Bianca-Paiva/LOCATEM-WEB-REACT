import { useState } from 'react';
import type { Route } from '../../router/useRouter';

// components
import { CardProdutoAvaliacao } from '../../components/Avaliacao/CardProdutoAvaliacao/CardProdutoAvaliacao';
import { ModalAvaliacao } from '../../components/Avaliacao/ModalAvaliacao/ModalAvaliacao';
import { ToastConfirmacao } from '../../components/Avaliacao/ToastConfirmacao/ToastConfirmacao';
import { EstadoVazio } from '../../components/Avaliacao/EstadoVazio/EstadoVazio';
import Header from '../../components/Header/Header';

import { useAvaliacoes } from '../../hooks/Avaliacao/useAvaliacoes';
import type { AbaAvaliacao } from './Avaliacao.types';
import styles from './Avaliacao.module.css';

interface AvaliacaoProps {
    navigate: (route: Route) => void;
}

/**
 * Página "Minhas Avaliações".
 * Header, menu lateral e nav de navegação ficam fora daqui —
 * este componente cobre só o fluxo de avaliação em si.
 */
export default function Avaliacao({ navigate }: AvaliacaoProps) {
    const [abaAtiva, setAbaAtiva] = useState<AbaAvaliacao>('pendentes');

    const {
        produtosPendentes,
        produtosRealizados,
        produtoAtual,
        itensCarrossel,
        observacaoRascunho,
        camposComErro,
        erroVisivel,
        toastVisivel,
        setObservacaoRascunho,
        abrirModal,
        fecharModal,
        selecionarNotaGlobalEAbrir,
        selecionarSubNota,
        enviarAvaliacao,
    } = useAvaliacoes();

    return (
        <>
            <Header navigate={navigate} currentRoute='avaliacao'/>

            <div className={styles.contentArea}>
                <div className={styles.tituloPage}>
                    <h1>Minhas Avaliações</h1>
                    <p>Avalie os produtos que você locou e ajude outros locatários.</p>
                </div>

                <nav className={styles.tabs} role="tablist" aria-label="Filtro de avaliações">
                    <button
                        className={`${styles.tabBtn} ${abaAtiva === 'pendentes' ? styles.active : ''}`}
                        role="tab"
                        aria-selected={abaAtiva === 'pendentes'}
                        onClick={() => setAbaAtiva('pendentes')}
                    >
                        Pendentes
                    </button>
                    <button
                        className={`${styles.tabBtn} ${abaAtiva === 'realizadas' ? styles.active : ''}`}
                        role="tab"
                        aria-selected={abaAtiva === 'realizadas'}
                        onClick={() => setAbaAtiva('realizadas')}
                    >
                        Realizadas
                    </button>
                </nav>

                {abaAtiva === 'pendentes' && (
                    <section className={styles.tabPanel} role="tabpanel">
                        {produtosPendentes.length === 0 ? (
                            <EstadoVazio status="pendente" />
                        ) : (
                            produtosPendentes.map((produto) => (
                                <CardProdutoAvaliacao
                                    key={produto.id}
                                    produto={produto}
                                    aoClicarCard={abrirModal}
                                    aoSelecionarEstrela={selecionarNotaGlobalEAbrir}
                                />
                            ))
                        )}
                    </section>
                )}

                {abaAtiva === 'realizadas' && (
                    <section className={styles.tabPanel} role="tabpanel">
                        {produtosRealizados.length === 0 ? (
                            <EstadoVazio status="realizada" />
                        ) : (
                            produtosRealizados.map((produto) => (
                                <CardProdutoAvaliacao key={produto.id} produto={produto} aoClicarCard={abrirModal} />
                            ))
                        )}
                    </section>
                )}

                <ModalAvaliacao
                    produto={produtoAtual}
                    itensCarrossel={itensCarrossel}
                    observacao={observacaoRascunho}
                    camposComErro={camposComErro}
                    erroVisivel={erroVisivel}
                    aoFechar={fecharModal}
                    aoMudarObservacao={setObservacaoRascunho}
                    aoSelecionarSubNota={selecionarSubNota}
                    aoSelecionarProdutoCarrossel={abrirModal}
                    aoEnviar={enviarAvaliacao}
                />

                <ToastConfirmacao visivel={toastVisivel} />
            </div>
        </>
    );
}