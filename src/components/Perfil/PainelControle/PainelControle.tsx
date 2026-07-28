import { ChevronRight, Plus } from 'lucide-react';
import type { Route } from '../../../router/useRouter';
import type { TipoUsuario } from '../../../types/perfil.types';
import { PAINEL_ITENS } from './painelItens';
import styles from './PainelControle.module.css';

interface PainelControleProps {
    tipoUsuario: TipoUsuario;
    navigate: (route: Route) => void;
}

export default function PainelControle({ tipoUsuario, navigate }: PainelControleProps) {
    return (
        <section className={styles.secao}>
            <h2 className={styles.titulo}>Painel de Controle</h2>

            <div className={styles.grid}>
                {PAINEL_ITENS.map((item) => {
                    const Icone = item.icon;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={styles.cardItem}
                            onClick={() => item.route && navigate(item.route)}
                        >
                            <span className={styles.iconeWrapper}>
                                <Icone size={20} />
                            </span>

                            <span className={styles.texto}>
                                <span className={styles.itemTitulo}>{item.titulo}</span>
                                <span className={styles.itemDescricao}>{item.descricao}</span>
                            </span>

                            <ChevronRight size={18} className={styles.seta} />
                        </button>
                    );
                })}

                {tipoUsuario === 'locador' && (
                    <button
                        type="button"
                        className={`${styles.cardItem} ${styles.cardDestaque}`}
                        onClick={() => navigate('publicarFerramenta')}
                    >
                        <span className={`${styles.iconeWrapper} ${styles.iconeDestaque}`}>
                            <Plus size={20} />
                        </span>

                        <span className={styles.texto}>
                            <span className={styles.itemTitulo}>Publicar Ferramenta</span>
                            <span className={styles.itemDescricao}>Anuncie uma nova ferramenta para alugar.</span>
                        </span>

                        <ChevronRight size={18} className={styles.seta} />
                    </button>
                )}
            </div>
        </section>
    );
}
