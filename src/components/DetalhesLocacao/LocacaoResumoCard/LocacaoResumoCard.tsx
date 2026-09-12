import { Calendar, User, MapPin, Star } from 'lucide-react';
import type { LocacaoData } from '../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import { formatarIntervaloHorario } from '../../../utils/Locacao/horario';
import styles from './LocacaoResumoCard.module.css';

interface LocacaoResumoCardProps {
  locacao: LocacaoData;
  /** De quem é o ponto de vista exibido: quem solicitou a locação ('locatario', padrão) ou quem a ofereceu ('locador'). */
  perspectiva?: 'locatario' | 'locador';
}

export default function LocacaoResumoCard({ locacao, perspectiva = 'locatario' }: LocacaoResumoCardProps) {
  const {
    produto,
    imagem,
    categoria,
    locador,
    locatario,
    avaliacaoLocador,
    numeroAvaliacoes,
    localizacao,
    dataInicio,
    horaInicio,
    dataFim,
    horaFim,
    quantidade,
    valor,
  } = locacao;

  const ehLocador = perspectiva === 'locador';
  // Na perspectiva do locador, mostramos quem solicitou a locação (locatário); na perspectiva do locatário, mostramos quem a ofereceu (locador), como já era feito.
  const rotuloPessoa = ehLocador ? 'Locatário' : 'Locador';
  const nomePessoa = ehLocador ? locatario : locador;

  return (
    <section className={styles.card}>
      <div className={styles.cabecalhoProduto}>
        <div className={styles.miniatura}>
          <img src={imagem} alt={produto} />
        </div>

        <div className={styles.infoProduto}>
          <h2 className={styles.titulo}>{produto}</h2>
          <p className={styles.categoria}>{categoria}</p>

          <p className={styles.locador}>
            <User className={styles.iconePequeno} aria-hidden="true" strokeWidth={2} />
            {rotuloPessoa}: <span>{nomePessoa}</span>
          </p>

          {/* A avaliação e a localização dizem respeito ao locador — só fazem sentido para quem está solicitando a locação, não para o próprio locador. */}
          {!ehLocador && (
            <div className={styles.linhaAvaliacaoLocalizacao}>
              <span className={styles.avaliacao}>
                <Star className={styles.iconePequenoStar} aria-hidden="true" fill="currentColor" strokeWidth={0} />
                {avaliacaoLocador.toFixed(1).replace('.', ',')}
                <span className={styles.numeroAvaliacoes}>({numeroAvaliacoes} avaliações)</span>
              </span>
              <span className={styles.separador}>•</span>
              <span className={styles.localizacao}>
                <MapPin className={styles.iconePequeno} aria-hidden="true" strokeWidth={2} />
                {localizacao}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.periodoBloco}>
        <p className={styles.periodoRotulo}>Período {ehLocador ? 'da locação' : 'solicitado'}</p>
        <div className={styles.periodoCaixa}>
          <Calendar className={styles.iconeCalendario} aria-hidden="true" strokeWidth={2} />
          <div className={styles.periodoTexto}>
            <p>
              <strong>{dataInicio}</strong> das {formatarIntervaloHorario(horaInicio)}
            </p>
            <p className={styles.ate}>até</p>
            <p>
              <strong>{dataFim}</strong> das {formatarIntervaloHorario(horaFim)}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.rodape}>
        <div>
          <p className={styles.rodapeRotulo}>Quantidade</p>
          <p className={styles.rodapeValor}>
            {quantidade} {quantidade === 1 ? 'unidade' : 'unidades'}
          </p>
        </div>

        <div className={styles.rodapeAlinhadoDireita}>
          <p className={styles.rodapeRotulo}>{ehLocador ? 'Valor total' : 'Valor estimado'}</p>
          <p className={styles.rodapeValorDestaque}>{valor}</p>
        </div>
      </div>
    </section>
  );
}