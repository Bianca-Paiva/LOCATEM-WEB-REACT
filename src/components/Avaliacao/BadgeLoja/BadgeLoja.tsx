import { ImageOff } from 'lucide-react';
import type { LojaProduto } from '../../../pages/Avaliacao/Avaliacao.types';
import styles from './BadgeLoja.module.css';

interface BadgeLojaProps {
    loja: LojaProduto;
}

/** Linha com logo da loja, nome e ícone de "verificado". */
export function BadgeLoja({ loja }: BadgeLojaProps) {
    return (
        <div className={styles.badge}>
            <span className={`${styles.logoContainer} ${!loja.logo ? styles.logoAusente : ''}`}>
                {loja.logo ? (
                    <img src={loja.logo} alt={loja.nome} />
                ) : (
                    <ImageOff size={16} aria-label="Loja sem logo cadastrada" />
                )}
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