import styles from './InfoVendedor.module.css';
import verificadoImg from '../../../assets/verificado.png';

interface InfoVendedorProps {
  nome: string;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  locacoes: number;
  verificado: boolean;
  imageNota: string;
}

export function InfoVendedor({
  nome,
  logoUrl,
  rating,
  reviewCount,
  locacoes,
  verificado,
  imageNota,
}: InfoVendedorProps) {
  const initials = nome.slice(0, 2).toUpperCase();

  return (
    <div className={styles.vendedorCard}>
      <p className={styles.labelLoja}>Produto da loja</p>

      <div className={styles.vendedorHeader}>
        <div className={styles.avatar}>
          {logoUrl ? (
            <img src={logoUrl} alt={nome} className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarInitials}>{initials}</span>
          )}
        </div>
        <div className={styles.vendedorInfo}>
          <p className={styles.vendedorNome}>{nome}</p>
          <div className={styles.ratingRow}>
            <img src={imageNota} alt="estrela" className={styles.starIcon} />
            <span className={styles.ratingValor}>{rating.toFixed(1)}</span>
            <span className={styles.ratingCount}>Verificado · Multimarcas</span>
          </div>
          <p className={styles.locacoes}>+{locacoes} locações</p>
        </div>
        {verificado && (
  <div className={styles.verificadoBadge}>
   <img
  src={verificadoImg}
  alt="Verificado"
  className={styles.verificadoIcon}
/>
  </div>
)}
      </div>

      <button className={styles.btnVerPerfil}>Ver perfil da loja</button>
    </div>
  );
}