import styles from './CartaoSelecionavel.module.css';
import type { Cartao } from '../../../types/cartao.types';

import cartaoIconGenerico from '../../../assets/Cartoesbandeiras/cartao.svg';
import visaIcon from '../../../assets/Cartoesbandeiras/visa.png';
import masterIcon from '../../../assets/Cartoesbandeiras/master.png';
import eloIcon from '../../../assets/Cartoesbandeiras/elo.png';
import amexIcon from '../../../assets/Cartoesbandeiras/amex.png';
import dinersIcon from '../../../assets/Cartoesbandeiras/diners.png';
import discoverIcon from '../../../assets/Cartoesbandeiras/discover.png';

// Ícone da bandeira do cartão, com fallback para o ícone genérico de cartão
// usado na tela original quando a bandeira não é reconhecida.
function iconePorBandeira(bandeira: string): string {
  const nome = bandeira.trim().toLowerCase();

  if (nome.includes('visa')) return visaIcon;
  if (nome.includes('master')) return masterIcon;
  if (nome.includes('elo')) return eloIcon;
  if (nome.includes('amex') || nome.includes('american')) return amexIcon;
  if (nome.includes('diners')) return dinersIcon;
  if (nome.includes('discover')) return discoverIcon;

  return cartaoIconGenerico;
}

interface CartaoSelecionavelProps {
  cartao: Cartao;
  selecionado: boolean;
  onSelecionar: (id: number) => void;
}

export function CartaoSelecionavel({ cartao, selecionado, onSelecionar }: CartaoSelecionavelProps) {
  const inputId = `cartao-${cartao.id}`;

  return (
    <label
      htmlFor={inputId}
      className={`${styles.cartao} ${selecionado ? styles.ativo : ''}`}
    >
      <div className={styles.cartaoIcone}>
        <img src={iconePorBandeira(cartao.bandeira)} alt={`Bandeira ${cartao.bandeira}`} />
      </div>

      <div className={styles.cartaoInfo}>
        <h3>
          {cartao.bandeira} - Final {cartao.final}
        </h3>
        <p>{cartao.titular}</p>
      </div>

      <input
        type="radio"
        id={inputId}
        name="cartaoSelecionado"
        value={cartao.id}
        checked={selecionado}
        onChange={() => onSelecionar(cartao.id)}
      />
    </label>
  );
}
