import { useEffect, useRef, useState } from 'react';
import calendarioIcon from '../../../assets/iconCalendarioReservas.png';
import CalendarioReserva from '../CalendarioReserva/CalendarioReserva';
import { formatarDataBr, parseDataIso } from '../../../utils/dataReserva';
import styles from './CampoData.module.css';

interface CampoDataProps {
  id: string;
  label: string;
  /** Data selecionada deste campo (yyyy-mm-dd) */
  value: string;
  onChange: (value: string) => void;
  /** Menor data selecionável (yyyy-mm-dd) — datas anteriores aparecem bloqueadas no calendário */
  min?: string;
  /** Datas reservadas/indisponíveis (yyyy-mm-dd) para este produto */
  diasIndisponiveis?: string[];
  /** As duas pontas do período (entrega/devolução), usadas só para destacar o intervalo no calendário */
  dataEntrega?: string;
  dataDevolucao?: string;
  required?: boolean;
  error?: string;
  shake?: boolean;
  /** Controle de abertura do popover elevado ao componente pai, para que só um calendário fique aberto por vez */
  aberto: boolean;
  onAbrir: () => void;
  onFechar: () => void;
  /** Lado ao qual o popover se alinha — usa 'direita' em campos na coluna direita do grid para não vazar do modal */
  alinharPopover?: 'esquerda' | 'direita';
}

export default function CampoData({
  id,
  label,
  value,
  onChange,
  min,
  diasIndisponiveis = [],
  dataEntrega = '',
  dataDevolucao = '',
  required = false,
  error,
  shake = false,
  aberto,
  onAbrir,
  onFechar,
  alinharPopover = 'esquerda',
}: CampoDataProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mesReferencia, setMesReferencia] = useState<Date>(
    () => parseDataIso(value) || parseDataIso(min ?? '') || new Date(),
  );

  // Sempre que o popover abre, volta a exibir o mês da data já selecionada
  // (ou da data mínima permitida, se nada foi escolhido ainda).
  useEffect(() => {
    if (!aberto) return;
    setMesReferencia(parseDataIso(value) || parseDataIso(min ?? '') || new Date());
  }, [aberto, value, min]);

  // Fecha ao clicar fora do campo/popover
  useEffect(() => {
    if (!aberto) return;
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onFechar();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [aberto, onFechar]);

  const diasIndisponiveisSet = new Set(diasIndisponiveis);

  const handleSelecionar = (dataIso: string) => {
    onChange(dataIso);
  };

  return (
    <div className={`${styles.wrapper} ${shake ? styles.shake : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>

      <div className={styles.campoWrapper} ref={wrapperRef}>
        <button
          id={id}
          type="button"
          className={`${styles.input} ${error ? styles.erro : ''}`}
          onClick={() => (aberto ? onFechar() : onAbrir())}
          aria-haspopup="dialog"
          aria-expanded={aberto}
        >
          <span className={value ? styles.valor : styles.placeholder}>
            {value ? formatarDataBr(value) : 'dd/mm/aaaa'}
          </span>
        </button>
        <img src={calendarioIcon} alt="" className={styles.icone} />

        {aberto && (
          <div className={`${styles.popover} ${alinharPopover === 'direita' ? styles.popoverDireita : ''}`}>
            <CalendarioReserva
              mesReferencia={mesReferencia}
              onMudarMes={setMesReferencia}
              dataEntrega={dataEntrega}
              dataDevolucao={dataDevolucao}
              dataMinima={min ?? ''}
              diasIndisponiveis={diasIndisponiveisSet}
              onSelecionar={handleSelecionar}
            />
          </div>
        )}
      </div>
      {error && <small className={styles.error}>{error}</small>}
    </div>
  );
}