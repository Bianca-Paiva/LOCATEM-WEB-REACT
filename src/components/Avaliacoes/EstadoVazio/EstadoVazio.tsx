import type { StatusAvaliacao } from '../../../pages/Avaliacao/Avaliacao.types';
import styles from './EstadoVazio.module.css';

interface EstadoVazioProps {
    status: StatusAvaliacao;
}

const TEXTOS_POR_STATUS: Record<StatusAvaliacao, { titulo: string; texto: string }> = {
    pendente: {
        titulo: 'Parabéns, você está em dia!',
        texto: 'Nenhuma avaliação pendente por aqui.',
    },
    realizada: {
        titulo: 'Ainda sem avaliações realizadas.',
        texto: 'Suas avaliações enviadas aparecerão aqui.',
    },
};

/** Exibido quando a aba (Pendentes ou Realizadas) não tem nenhum item. */
export function EstadoVazio({ status }: EstadoVazioProps) {
    const { titulo, texto } = TEXTOS_POR_STATUS[status];

    return (
        <div className={styles.container}>
            <div className={styles.titulo}>{titulo}</div>
            <p>{texto}</p>
        </div>
    );
}