import { CheckCircle2, PackageCheck, Ban, Wrench, type LucideIcon } from 'lucide-react';
import type { StatusFerramenta } from '../../../types/produto.types';

export interface StatusFerramentaVisualConfig {
  label: string;
  tabLabel: string;
  icon: LucideIcon;
  cor: string;
  borda: string;
  fundo: string;
}

// Configuração visual/textual de cada status de ferramenta: cores, ícone (Lucide) e rótulos.
// Mesmo espírito de components/MinhasLocacoes/EtiquetaStatus/statusConfig.ts.
export const STATUS_FERRAMENTA_CONFIG: Record<StatusFerramenta, StatusFerramentaVisualConfig> = {
  disponivel: {
    label: 'Disponível',
    tabLabel: 'Disponíveis',
    icon: CheckCircle2,
    cor: '#137333',
    borda: 'rgba(19, 115, 51, 0.25)',
    fundo: '#E6F4EA',
  },
  locada: {
    label: 'Locada',
    tabLabel: 'Locadas',
    icon: PackageCheck,
    cor: '#005D75',
    borda: 'rgba(0, 93, 117, 0.25)',
    fundo: '#EAF6FF',
  },
  indisponivel: {
    label: 'Indisponível',
    tabLabel: 'Indisponíveis',
    icon: Ban,
    cor: '#546E7A',
    borda: '#B0BEC5',
    fundo: '#ECEFF1',
  },
  manutencao: {
    label: 'Em manutenção',
    tabLabel: 'Em manutenção',
    icon: Wrench,
    cor: '#A74B00',
    borda: 'rgba(167, 75, 0, 0.25)',
    fundo: '#FFEBCF',
  },
};
