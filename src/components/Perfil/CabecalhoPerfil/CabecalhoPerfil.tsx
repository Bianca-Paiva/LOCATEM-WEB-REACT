import { Pencil, User, Wrench, ArrowLeftRight } from 'lucide-react';
import type { PerfilUsuario } from '../../../types/perfil.types';
import styles from './CabecalhoPerfil.module.css';

interface CabecalhoPerfilProps {
    usuario: PerfilUsuario;
    onEditarPerfil: () => void;
    onAlternarPapel: () => void;
}

export default function CabecalhoPerfil({ usuario, onEditarPerfil, onAlternarPapel }: CabecalhoPerfilProps) {
    const ehLocatario = usuario.tipo === 'locatario';

    return (
        <div className={styles.card}>
            <div className={styles.linhaPrincipal}>
                <img src={usuario.fotoUrl} alt={usuario.nome} className={styles.avatar} />

                <div className={styles.identificacao}>
                    <h1 className={styles.nome}>{usuario.nome}</h1>

                    <span className={styles.badge}>
                        {ehLocatario ? <User size={13} /> : <Wrench size={13} />}
                        {ehLocatario ? 'LOCATÁRIO' : 'LOCADOR'} DESDE {usuario.desde}
                    </span>
                </div>

                <button type="button" className={styles.btnEditar} onClick={onEditarPerfil}>
                    <Pencil size={15} />
                    Editar Perfil
                </button>
            </div>

            <button type="button" className={styles.btnAlternarPapel} onClick={onAlternarPapel}>
                <ArrowLeftRight size={13} />
                {ehLocatario
                    ? 'Também sou Locador — ver como Locador'
                    : 'Também sou Locatário — ver como Locatário'}
            </button>
        </div>
    );
}
