import { Star, StarHalf } from 'lucide-react';
import type { PerfilUsuario } from '../../../types/perfil.types';
import styles from './ReputacaoCard.module.css';

interface ReputacaoCardProps {
    usuario: PerfilUsuario;
    onVerAvaliacoes: () => void;
}

function LinhaEstrelas({ nota }: { nota: number }) {
    const estrelasCheias = Math.floor(nota);
    const temMeia = nota - estrelasCheias >= 0.25 && nota - estrelasCheias < 0.75;
    const estrelasVazias = 5 - estrelasCheias - (temMeia ? 1 : 0);

    return (
        <div className={styles.estrelas} aria-label={`Nota ${nota} de 5`}>
            {Array.from({ length: estrelasCheias }).map((_, i) => (
                <Star key={`cheia-${i}`} size={20} className={styles.estrelaCheia} />
            ))}
            {temMeia && <StarHalf size={20} className={styles.estrelaCheia} />}
            {Array.from({ length: Math.max(estrelasVazias, 0) }).map((_, i) => (
                <Star key={`vazia-${i}`} size={20} className={styles.estrelaVazia} />
            ))}
        </div>
    );
}

export default function ReputacaoCard({ usuario, onVerAvaliacoes }: ReputacaoCardProps) {
    const ehLocatario = usuario.tipo === 'locatario';
    const repLocatario = usuario.reputacaoLocatario;
    const repLocador = usuario.reputacaoLocador;
    const nota = ehLocatario ? repLocatario.nota : repLocador.nota;

    return (
        <div className={styles.card}>
            <h2 className={styles.titulo}>Reputação</h2>

            <div className={styles.notaBloco}>
                <span className={styles.nota}>{nota.toFixed(1)}</span>
                <LinhaEstrelas nota={nota} />
            </div>

            <div className={styles.estatisticas}>
                <p className={styles.baseadoEm}>Baseado em</p>
                {ehLocatario ? (
                    <>
                        <p className={styles.linhaForte}>{repLocatario.totalAvaliacoes} avaliações</p>
                        <p className={styles.linhaForte}>{repLocatario.totalLocacoes} locações</p>
                    </>
                ) : (
                    <>
                        <p className={styles.linhaForte}>{repLocador.totalAvaliacoes} avaliações</p>
                        <p className={styles.linhaForte}>{repLocador.totalLocacoesConcluidas} locações concluídas</p>
                        <p className={styles.linhaForte}>{repLocador.entregasNoPrazoPercentual}% entregas no prazo</p>
                    </>
                )}
            </div>

            <button type="button" className={styles.verAvaliacoes} onClick={onVerAvaliacoes}>
                Ver avaliações &gt;
            </button>
        </div>
    );
}
