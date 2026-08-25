import { getIniciais } from '../../utils/iniciais';
import styles from './Avatar.module.css';

interface AvatarProps {
  nome: string;
  fotoUrl?: string;
  /** Diâmetro do avatar em px. Default 40 (tamanho usado no Header). */
  size?: number;
  className?: string;
}

/**
 * Avatar único e reutilizável do projeto: mostra a foto do usuário quando existe,
 * ou cai para as iniciais do nome quando não existe (mesmo padrão visual que já
 * era usado em InfoVendedor, agora centralizado aqui para não duplicar em cada
 * lugar que precisa exibir um usuário/locador — Header, Perfil, InfoVendedor).
 */
export default function Avatar({ nome, fotoUrl, size = 40, className }: AvatarProps) {
  const iniciais = getIniciais(nome);

  return (
    <div
      className={`${styles.avatar}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.36) }}
    >
      {fotoUrl ? (
        <img src={fotoUrl} alt={nome} className={styles.avatarImg} />
      ) : (
        <span className={styles.avatarInitials}>{iniciais}</span>
      )}
    </div>
  );
}
