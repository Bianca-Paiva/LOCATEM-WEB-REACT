import type { ProdutoAvaliacao } from '../../../pages/Avaliacao/Avaliacao.types';
import { EstrelasAvaliacao } from '../EstrelaAvaliacao/EstrelaAvaliacao';
import styles from './CarroselAvaliacoesPendentes.module.css';

interface CarrosselAvaliacoesPendentesProps {
    itens: ProdutoAvaliacao[];
    aoSelecionarItem: (id: number) => void;
}

/** Faixa horizontal com os outros produtos ainda pendentes, dentro do modal. */
export function CarrosselAvaliacoesPendentes({
    itens,
    aoSelecionarItem,
}: CarrosselAvaliacoesPendentesProps) {
    if (itens.length === 0) return null;

    return (
        <>
            <p className={styles.titulo}>Outros itens para avaliar</p>

            <div className={styles.carrossel}>
                {itens.map((item) => (
                    <div
                        key={item.id}
                        className={styles.card}
                        role="button"
                        tabIndex={0}
                        onClick={() => aoSelecionarItem(item.id)}
                        onKeyDown={(evento) => {
                            if (evento.key === 'Enter') aoSelecionarItem(item.id);
                        }}
                    >
                        <img src={item.imagem} alt={item.nome} loading="lazy" />
                        <p className={styles.nome}>{item.nome}</p>
                        <p className={styles.data}>{item.dataLocacao}</p>
                        <EstrelasAvaliacao
                            notaAtual={item.notaGlobal}
                            variante="carrossel"
                            descricaoContexto={item.nome}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}