import { useState } from 'react';
import styles from './AvaliacaoSection.module.css';
import IconLike from '../../../assets/IconLike.png';
import IconLikePreenchido from '../../../assets/IconLikePreenchido.png';
import { getIniciais } from '../../../utils/iniciais';

interface Avaliacao {
  nome: string;
  rating: number;
  tempo: string;
  texto: string;
  fotos?: string[];
  utilCount: number;
}

interface AvaliacaoSectionProps {
  mediaGeral: number;
  totalAvaliacoes: number;
  distribuicao: number[]; // [5estrelas%, 4%, 3%, 2%, 1%]
  avaliacoes: Avaliacao[];
  imageNota: string;
}

function Estrelas({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className={styles.estrelasRow} style={{ gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          style={{
            fontSize: size,
            color: n <= Math.round(rating) ? '#F9C01A' : '#e5e7eb',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function AvaliacaoSection({
  mediaGeral,
  totalAvaliacoes,
  distribuicao,
  avaliacoes,
}: AvaliacaoSectionProps) {
  const [showAll, setShowAll] = useState(false);

  // Estado para armazenar os índices das avaliações curtidas
  const [curtidas, setCurtidas] = useState<number[]>([]);

  const visiveis = showAll ? avaliacoes : avaliacoes.slice(0, 3);

  // Função para alternar o status de "curtido"
  const toggleCurtida = (index: number) => {
    setCurtidas(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index) // Remove o like se já estiver curtido
        : [...prev, index] // Adiciona o like se não estiver
    );
  };

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.titulo}>Avaliações</h2>

      <div className={styles.resumoContainer}>
        {/* Média geral */}
        <div className={styles.mediaBox}>
          <span className={styles.mediaNumero}>{mediaGeral.toFixed(1)}</span>
          <div className={styles.mediaEstrelasRow}>
            <Estrelas rating={mediaGeral} size={18} />
          </div>
          <span className={styles.totalText}>({totalAvaliacoes} avaliações)</span>
        </div>

        {/* Barras de distribuição */}
        <div className={styles.distribuicaoContainer}>
          {[5, 4, 3, 2, 1].map((star, i) => (
            <div key={star} className={styles.barraLinha}>
              <span className={styles.barraLabel}>{star}</span>
              <div className={styles.barraTrack}>
                <div
                  className={styles.barraFill}
                  style={{ width: `${distribuicao[i]}%` }}
                />
              </div>
              <span className={styles.barraPercent}>{distribuicao[i]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de avaliações */}
      <div className={styles.listaAvaliacoes}>
        {visiveis.map((av, i) => {
          const isCurtido = curtidas.includes(i); // Verifica se este item está curtido

          return (
            <div key={i} className={styles.avaliacaoItem}>
              {/* ... (cabeçalho, estrelas, texto e fotos) */}
              <div className={styles.avaliacaoHeader}>
                <div className={styles.avatarCircle}>{getIniciais(av.nome)}</div>
                <div className={styles.avaliacaoMeta}>
                  <span className={styles.avaliacaoNome}>{av.nome}</span>
                  <span className={styles.avaliacaoTempo}>{av.tempo}</span>
                </div>
              </div>

              <Estrelas rating={av.rating} size={13} />
              <p className={styles.avaliacaoTexto}>{av.texto}</p>

              {av.fotos && av.fotos.length > 0 && (
                <div className={styles.fotosRow}>
                  {av.fotos.map((foto, fi) => (
                    <img key={fi} src={foto} alt={`Foto ${fi + 1}`} className={styles.fotoThumb} />
                  ))}
                </div>
              )}

              <div className={styles.avaliacaoFooter}>
                <button
                  // Se isCurtido for true, adiciona a classe btnUtilAtivo. Se false, não adiciona nada.
                  className={`${styles.btnUtil} ${isCurtido ? styles.btnUtilAtivo : ''}`}
                  onClick={() => toggleCurtida(i)}
                >
                  <img
                    src={isCurtido ? IconLikePreenchido : IconLike} // Troca o ícone
                    alt="Like"
                    className={styles.likeIcon}
                  />
                  Foi útil
                </button>
                <p className={styles.utilCount}>
                  {/* Incrementa +1 se estiver curtido */}
                  · {av.utilCount + (isCurtido ? 1 : 0)} pessoas acharam útil
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {avaliacoes.length > 3 && (
        <button
          className={styles.btnVerMais}
          onClick={() => setShowAll(prev => !prev)}
        >
          {showAll ? 'Ver menos ▲' : 'Ver mais ▾'}
        </button>
      )}
    </section>
  );
}