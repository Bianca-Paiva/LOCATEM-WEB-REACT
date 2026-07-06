import { useHoverEstrelas } from '../../../hooks/Avaliacao/useHoverEstrelas';
import styles from './EstrelaAvaliacao.module.css';

type VarianteEstrelas = 'lista' | 'modal' | 'carrossel';

interface EstrelasAvaliacaoProps {
    /** Nota atualmente salva (0 a 5). */
    notaAtual: number;
    /** Quando ausente, as estrelas ficam somente leitura (ex: card em "Realizadas"). */
    aoSelecionar?: (valor: number) => void;
    /** Ajusta o tamanho das estrelas conforme onde estão sendo usadas. */
    variante?: VarianteEstrelas;
    /** Usado para compor o aria-label de cada estrela (ex: nome do produto). */
    descricaoContexto?: string;
}

const QUANTIDADE_ESTRELAS = 5;

/**
 * Fileira de 5 estrelas. Interativa (clique + hover de preview) quando
 * `aoSelecionar` é passado, ou apenas ilustrativa quando não é.
 */
export function EstrelasAvaliacao({
    notaAtual,
    aoSelecionar,
    variante = 'lista',
    descricaoContexto = 'produto',
}: EstrelasAvaliacaoProps) {
    const interativo = Boolean(aoSelecionar);
    const { valorHover, aoPassarMouse, aoSairMouse } = useHoverEstrelas();

    const notaExibida = valorHover ?? notaAtual;

    return (
        <div
            className={`${styles.fileira} ${styles[variante]}`}
            onMouseLeave={interativo ? aoSairMouse : undefined}
        >
            {Array.from({ length: QUANTIDADE_ESTRELAS }, (_, indice) => {
                const preenchida = indice < notaExibida;

                return (
                    <span
                        key={indice}
                        className={`${styles.estrela} ${preenchida ? styles.ativa : ''}`}
                        role={interativo ? 'button' : undefined}
                        tabIndex={interativo ? 0 : undefined}
                        aria-label={`Nota ${indice + 1} para ${descricaoContexto}`}
                        onMouseEnter={interativo ? () => aoPassarMouse(indice) : undefined}
                        onClick={interativo ? () => aoSelecionar?.(indice + 1) : undefined}
                        onKeyDown={
                            interativo
                                ? (evento) => {
                                    if (evento.key === 'Enter' || evento.key === ' ') {
                                        evento.preventDefault();
                                        aoSelecionar?.(indice + 1);
                                    }
                                }
                                : undefined
                        }
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}