import { Icon } from "@iconify/react";
import { Star } from 'lucide-react';
import styles from './InfoVendedor.module.css';
import { getIniciais } from '../../../../utils/Conta/Avatar/iniciais';

interface InfoVendedorProps {
  nome: string;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  locacoes: number;
  verificado: boolean;
  imageNota?: string;
  onVerPerfil?: () => void;
}

export function InfoVendedor({
  nome,
  logoUrl,
  rating,
  reviewCount,
  locacoes,
  verificado,
  onVerPerfil,
}: InfoVendedorProps) {
  // Usa o mesmo utilitário de iniciais do resto do projeto (Avatar, AvaliacaoSection), em vez da lógica local que existia aqui antes (slice das 2 primeiras letras).
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
          {/* Novo wrapper agrupando o nome e o selo verificado */}
          <div className={styles.nomeWrapper}>
            <p className={styles.vendedorNome}>{nome}</p>
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

          <div className={styles.ratingRow}>
            <Star className={styles.starIcon} size={14} fill="#FFCA00" color="#FFCA00" strokeWidth={0} />
            <span className={styles.ratingValor}>{rating.toFixed(1)}</span>
            <span className={styles.ratingCount}>({reviewCount} avaliações)</span>
          </div>
          <p className={styles.locacoes}>+{locacoes} locações</p>
        </div>
      </div>

      <button type="button" className={styles.btnVerPerfil} onClick={onVerPerfil}>
        Ver perfil da loja
      </button>
    </div>
  );
}