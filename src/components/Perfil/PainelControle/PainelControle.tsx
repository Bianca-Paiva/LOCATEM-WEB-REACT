import type { ReactNode } from 'react';
import {
  Wrench,
  Clock,
  Heart,
  Wallet,
  FileText,
  MapPin,
  Bell,
  Settings,
  Headset,
  ChevronRight,
} from 'lucide-react';
import type { Route } from '../../../router/useRouter';
import type { TipoUsuario } from '../../../types/usuario.types';
import styles from './PainelControle.module.css';

interface PainelControleProps {
  tipo: TipoUsuario;
  navigate: (route: Route) => void;
}

interface OpcaoPainel {
  icone: ReactNode;
  titulo: string;
  descricao: string;
  /** Ausente quando a página correspondente ainda não existe no projeto (ver Observações do resumo final). */
  route?: Route;
}

// Opções comuns às duas variantes do protótipo (Locatário e Locador).
const OPCOES_BASE: OpcaoPainel[] = [
  { icone: <Wrench size={20} />, titulo: 'Aluguéis Ativos', descricao: 'Visualize seus equipamentos alugados atualmente.', route: 'minhasReservas' },
  { icone: <Clock size={20} />, titulo: 'Histórico de Locações', descricao: 'Consulte todas as suas locações anteriores.', route: 'minhasReservas' },
  { icone: <Heart size={20} />, titulo: 'Favoritos', descricao: 'Ferramentas e equipamentos salvos.' },
  { icone: <Wallet size={20} />, titulo: 'Pagamentos', descricao: 'Visualize pagamentos, cauções e reembolsos.' },
  { icone: <FileText size={20} />, titulo: 'Contratos', descricao: 'Acesse todos os contratos digitais.' },
  { icone: <MapPin size={20} />, titulo: 'Endereços', descricao: 'Gerencie seus endereços cadastrados.' },
  { icone: <Bell size={20} />, titulo: 'Notificações', descricao: 'Confira atualizações importantes.', route: 'notificacoes' },
  { icone: <Settings size={20} />, titulo: 'Configurações', descricao: 'Altere senha, dados pessoais e preferências.' },
  { icone: <Headset size={20} />, titulo: 'Suporte', descricao: 'Central de ajuda e atendimento.' },
];

/**
 * Painel de Controle. As opções são as mesmas nos dois protótipos (Locatário e
 * Locador), então mantemos uma única lista em vez de duas implementações
 * paralelas — só o parâmetro `tipo` fica disponível para o dia em que Locador
 * precisar de uma opção exclusiva (ex: "Meus Anúncios").
 */
export default function PainelControle({ navigate }: PainelControleProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.titulo}>Painel de Controle</h2>

      <div className={styles.grade}>
        {OPCOES_BASE.map((opcao) => (
          <button
            key={opcao.titulo}
            type="button"
            className={styles.opcao}
            disabled={!opcao.route}
            onClick={() => opcao.route && navigate(opcao.route)}
          >
            <span className={styles.icone}>{opcao.icone}</span>
            <span className={styles.textos}>
              <span className={styles.opcaoTitulo}>{opcao.titulo}</span>
              <span className={styles.opcaoDescricao}>{opcao.descricao}</span>
            </span>
            {opcao.route && <ChevronRight size={18} className={styles.seta} />}
          </button>
        ))}
      </div>
    </section>
  );
}
