import { User, Pencil } from 'lucide-react';
import { Icon } from '@iconify/react';
import Avatar from '../../Avatar/Avatar';
import type { Usuario } from '../../../types/usuario.types';
import styles from './PerfilHeader.module.css';

interface PerfilHeaderProps {
  usuario: Usuario;
  onEditar: () => void;
}

/** Cabeçalho da tela de Perfil: avatar (foto ou iniciais), nome e badge "Locador/Locatário desde {ano}". */
export default function PerfilHeader({ usuario, onEditar }: PerfilHeaderProps) {
  const rotuloTipo = usuario.tipo === 'locador' ? 'Locador' : 'Locatário';

  return (
    <section className={styles.card}>
      <div className={styles.info}>
        <Avatar nome={usuario.nome} fotoUrl={usuario.fotoUrl} size={72} />

        <div className={styles.textos}>
          <h1 className={styles.nome}>{usuario.nome}</h1>
          <span className={styles.badge}>
            {usuario.tipo === 'locador' ? (
              <Icon icon="mdi:tools" width={13} height={13} />
            ) : (
              <User size={13} />
            )}
            {rotuloTipo} desde {usuario.desde}
          </span>
        </div>
      </div>

      <button type="button" className={styles.btnEditar} onClick={onEditar}>
        <Pencil size={15} />
        Editar Perfil
      </button>
    </section>
  );
}
