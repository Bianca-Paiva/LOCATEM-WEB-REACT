import type { TipoAprovacao } from '../../../pages/CadastroFerramenta/CadastroFerramenta.types';
import styles from './AprovacaoLocacao.module.css';

interface OpcaoAprovacao {
  valor: TipoAprovacao;
  titulo: string;
  descricao: string;
  recomendado?: boolean;
}

const OPCOES_APROVACAO: OpcaoAprovacao[] = [
  {
    valor: 'manual',
    titulo: 'Aprovação manual',
    descricao: 'O locador analisa cada solicitação antes da confirmação.',
    recomendado: true,
  },
  {
    valor: 'automatica',
    titulo: 'Aprovação automática',
    descricao: 'As locacoes são confirmadas automaticamente quando houver disponibilidade.',
  },
];

interface AprovacaoLocacaoProps {
  tipoAprovacao: TipoAprovacao;
  onChange: (valor: TipoAprovacao) => void;
  error?: string;
  shake?: boolean;
}

export default function AprovacaoLocacao({ tipoAprovacao, onChange, error, shake = false }: AprovacaoLocacaoProps) {
  const possuiErro = Boolean(error);

  return (
    <div className={styles.wrapper}>
      <div
        id="tipoAprovacao"
        className={`${styles.grupo}${shake ? ` ${styles.shake}` : ''}`}
        role="radiogroup"
        aria-label="Aprovação da locação"
        aria-invalid={possuiErro}
      >
        {OPCOES_APROVACAO.map((opcao) => {
          const selecionado = tipoAprovacao === opcao.valor;

          const classeOpcao = [
            styles.opcao,
            selecionado ? styles.opcaoSelecionada : '',
            possuiErro ? styles.opcaoErro : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <label key={opcao.valor} className={classeOpcao}>
              <input
                type="radio"
                name="tipoAprovacao"
                value={opcao.valor}
                checked={selecionado}
                onChange={() => onChange(opcao.valor)}
                className={styles.radio}
              />

              <span className={styles.textos}>
                <span className={styles.linhaTitulo}>
                  <span className={styles.titulo}>{opcao.titulo}</span>
                  {opcao.recomendado && <span className={styles.badge}>Recomendado</span>}
                </span>
                <span className={styles.descricao}>{opcao.descricao}</span>
              </span>
            </label>
          );
        })}
      </div>

      {error && <small className={styles.error}>{error}</small>}
    </div>
  );
}