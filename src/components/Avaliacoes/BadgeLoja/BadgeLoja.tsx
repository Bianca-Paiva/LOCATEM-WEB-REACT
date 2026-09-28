import { Icon } from "@iconify/react";
import { ImageOff } from 'lucide-react';
import Avatar from '../../Shared/Avatar/Avatar';
import type { LojaProduto } from '../../../pages/Avaliacao/Avaliacao.types';
import styles from './BadgeLoja.module.css';

interface BadgeLojaProps {
    loja: LojaProduto;
    locatario?: boolean;
}

/** Linha com logo da loja, nome e ícone de "verificado". */
export function BadgeLoja({ loja, locatario = false }: BadgeLojaProps) {
    if (locatario) {
        return (
            <div className={styles.badge}>
                <Avatar nome={loja.nome} size={28} />
                <div className={styles.container}>
                    Locatário:
                    <span className={styles.nomeLocatario}>{loja.nome}</span>
                </div>
            </div>
        );
    }

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

                <span className={styles.verificado} title="Verificado">
                    <Icon 
                        icon="codicon:verified-filled" 
                        color="#007BFF" 
                        width="13" 
                    />
                </span>
            </div>
        </div>
    );
}
