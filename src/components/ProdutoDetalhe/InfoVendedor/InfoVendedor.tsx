import { Icon } from "@iconify/react";
import { Star } from 'lucide-react';
import styles from './InfoVendedor.module.css';
import { getIniciais } from '../../../utils/iniciais';

interface InfoVendedorProps {
  nome: string;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  locacoes: number;
  verificado: boolean;
  imageNota?: string;
}

export function InfoVendedor({
  nome,
  logoUrl,
  rating,
  reviewCount,
  locacoes,
  verificado,
}: InfoVendedorProps) {
  // Usa o mesmo utilitário de iniciais do resto do projeto (Avatar, AvaliacaoSection),
  // em vez da lógica local que existia aqui antes (slice das 2 primeiras letras).
  const initials = getIniciais(nome);

  return (
    <div className={styles.vendedorCard}>

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
            <Star className={styles.starIcon} size={14} fill="#FFCA00" color="#FFCA00" strokeWidth={0} />
            <span className={styles.ratingValor}>{rating.toFixed(1)}</span>
            <span className={styles.ratingCount}>({reviewCount})</span>
          </div>
          <p className={styles.locacoes}>+{locacoes} locações</p>
        </div>
        {verificado && (
          <div className={styles.verificadoBadge} title="Loja Verificada">
            <Icon 
              icon="codicon:verified-filled" 
              className={styles.verificadoIcon}
              color="#007BFF"
            />
          </div>
        )}
      </div>

      <button className={styles.btnVerPerfil}>
        Ver perfil da loja
      </button>
    </div>
  );
}