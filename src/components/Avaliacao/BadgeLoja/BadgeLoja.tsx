import type { LojaProduto } from '../../../pages/Avaliacao/Avaliacao.types';
import styles from './BadgeLoja.module.css';

interface BadgeLojaProps {
    loja: LojaProduto;
}

/** Linha com logo da loja, nome e ícone de "verificado". */
export function BadgeLoja({ loja }: BadgeLojaProps) {
    return (
        <div className={styles.badge}>
            <span className={styles.logoContainer}>
                <img src={loja.logo} alt={loja.nome} />
            </span>

            <div className={styles.container}>
                Loja oficial{' '}
                <a href="#" className={styles.link}>
                    {loja.nome}
                </a>

                <span className={styles.verificado}>
                    <img src="/src/assets/verificadoAzul.png" alt="Verificado" />
                </span>
            </div>
        </div>
    );
}