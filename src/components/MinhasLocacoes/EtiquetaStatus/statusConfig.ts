import {
  Clock3,
  CreditCard,
  Package,
  Truck,
  Wrench,
  PackageCheck,
  Check,
  Ban,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { StatusLocacao } from '../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';

export interface StatusVisualConfig {
  label: string;
  tabLabel: string;
  icon: LucideIcon;
  cor: string;
  borda: string;
  fundo: string;
}

// Configuração visual/textual de cada status: cores, ícone (Lucide) e rótulos
export const STATUS_CONFIG: Record<StatusLocacao, StatusVisualConfig> = {
  pendente: {
    label: 'Aguardando aprovação',
    tabLabel: 'Aguardando aprovação',
    icon: Clock3,
    cor: '#7A5A00',
    borda: 'rgba(122, 90, 0, 0.25)',
    fundo: '#FFF4DD',
  },
  aguardandoPagamento: {
    label: 'Aguardando pagamento',
    tabLabel: 'Aguardando Pagamento',
    icon: CreditCard,
    cor: '#A74B00',
    borda: 'rgba(167, 75, 0, 0.25)',
    fundo: '#FFEBCF',
  },
  preparandoEntrega: {
    label: 'Preparando entrega',
    tabLabel: 'Preparando entrega',
    icon: Package,
    cor: '#005D75',
    borda: 'rgba(0, 93, 117, 0.25)',
    fundo: '#EAF6FF',
  },
  emTransporte: {
    label: 'Em transporte',
    tabLabel: 'Em transporte',
    icon: Truck,
    cor: '#005D75',
    borda: 'rgba(0, 93, 117, 0.25)',
    fundo: '#EAF6FF',
  },
  emAndamento: {
    label: 'Em andamento',
    tabLabel: 'Em andamento',
    icon: Wrench,
    cor: '#005D75',
    borda: 'rgba(0, 93, 117, 0.25)',
    fundo: '#EAF6FF',
  },
  aguardandoDevolucao: {
    label: 'Aguardando devolução',
    tabLabel: 'Aguardando devolução',
    icon: PackageCheck,
    cor: '#005D75',
    borda: 'rgba(0, 93, 117, 0.25)',
    fundo: '#EAF6FF',
  },
  devolucaoEmTransporte: {
    label: 'Devolução em transporte',
    tabLabel: 'Devolução em transporte',
    icon: Truck,
    cor: '#005D75',
    borda: 'rgba(0, 93, 117, 0.25)',
    fundo: '#EAF6FF',
  },
  finalizada: {
    label: 'Finalizada',
    tabLabel: 'Finalizada',
    icon: Check,
    cor: '#137333',
    borda: 'rgba(19, 115, 51, 0.25)',
    fundo: '#E6F4EA',
  },
  recusada: {
    label: 'Recusada',
    tabLabel: 'Recusada',
    icon: Ban,
    cor: '#BA1A1A',
    borda: 'rgba(186, 26, 26, 0.25)',
    fundo: '#FFDAD6',
  },
  cancelada: {
    label: 'Cancelada',
    tabLabel: 'Cancelada',
    icon: X,
    cor: '#546E7A',
    borda: '#B0BEC5',
    fundo: '#ECEFF1',
  },
};
