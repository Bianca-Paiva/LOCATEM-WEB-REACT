import styles from './ProgressoPerfil.module.css';

interface ProgressoPerfilProps {
    percentual: number;
    dica: string;
}

export default function ProgressoPerfil({ percentual, dica }: ProgressoPerfilProps) {
    const clamped = Math.min(100, Math.max(0, percentual));

    return (
        <div className={styles.card}>
            <div className={styles.linhaTitulo}>
                <h2 className={styles.titulo}>Complete seu Perfil</h2>
                <span className={styles.percentual}>{clamped}% concluído</span>
            </div>

            <div
                className={styles.barraFundo}
                role="progressbar"
                aria-valuenow={clamped}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div className={styles.barraPreenchida} style={{ width: `${clamped}%` }} />
            </div>

            <p className={styles.dica}>{dica}</p>
        </div>
    );
}
