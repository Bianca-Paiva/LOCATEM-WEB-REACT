import type { ReactNode } from 'react';
import styles from './CabecalhoPagina.module.css';

interface CabecalhoPaginaProps {
    /** Título principal da página (ex: "Minhas Reservas") */
    titulo: string;
    /** Texto de apoio abaixo do título (opcional) */
    subtitulo?: string;
    /** Conteúdo extra exibido à direita do título, na mesma linha (ex: uma EtiquetaStatus) */
    acao?: ReactNode;
    /** Classe extra para ajustes pontuais (ex: margem diferente em uma página específica) */
    className?: string;
}

// Cabeçalho padrão usado no topo das páginas internas (título + subtítulo opcional).
// Baseado no cabeçalho original da página "Minhas Reservas".
export default function CabecalhoPagina({ titulo, subtitulo, acao, className }: CabecalhoPaginaProps) {
    return (
        <div className={`${styles.cabecalho}${className ? ` ${className}` : ''}`}>
            <div className={styles.linhaTitulo}>
                <h1 className={styles.titulo}>{titulo}</h1>
                {acao}
            </div>

            {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
        </div>
    );
}