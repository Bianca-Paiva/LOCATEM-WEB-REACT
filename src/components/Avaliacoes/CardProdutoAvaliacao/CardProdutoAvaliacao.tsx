import type { ProdutoAvaliacao } from '../../../pages/Avaliacao/Avaliacao.types';
import { BadgeLoja } from '../BadgeLoja/BadgeLoja';
import { EstrelasAvaliacao } from '../EstrelaAvaliacao/EstrelaAvaliacao';
import styles from './CardProdutoAvaliacao.module.css';

interface CardProdutoAvaliacaoProps {
    produto: ProdutoAvaliacao;
    /** Abre o modal ao clicar em qualquer parte do card. */
    aoClicarCard: (id: string) => void;
    /**
     * Clique direto numa estrela: salva a nota global e abre o modal.
     * Só é passado quando o card está na aba "Pendentes".
     */
    aoSelecionarEstrela?: (id: string, valor: number) => void;
}

/** Card clicável de um produto, com badge da loja + estrelas de nota global. */
export function CardProdutoAvaliacao({
    produto,
    aoClicarCard,
    aoSelecionarEstrela,
}: CardProdutoAvaliacaoProps) {
    return (
        <div className={styles.grupo}>
            <BadgeLoja loja={produto.loja} />

            <article
                className={styles.card}
                role="button"
                tabIndex={0}
                aria-label={`Avaliar ${produto.nome}`}
                onClick={() => aoClicarCard(produto.id)}
                onKeyDown={(evento) => {
                    if (evento.key === 'Enter') aoClicarCard(produto.id);
                }}
            >
                <div className={styles.conteudo}>
                    <img
                        className={styles.imagem}
                        src={produto.imagem}
                        alt={produto.nome}
                        loading="lazy"
                    />

                    <div className={styles.info}>
                        <p className={styles.nome}>{produto.nome}</p>
                        <p className={styles.data}>{produto.dataLocacao}</p>

                        <div
                            onClick={(evento) => {
                                // Evita abrir o modal duas vezes quando o clique é numa estrela.
                                if (aoSelecionarEstrela) evento.stopPropagation();
                            }}
                        >
                            <EstrelasAvaliacao
                                notaAtual={produto.notaGlobal}
                                descricaoContexto={produto.nome}
                                aoSelecionar={
                                    aoSelecionarEstrela
                                        ? (valor) => aoSelecionarEstrela(produto.id, valor)
                                        : undefined
                                }
                            />
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}