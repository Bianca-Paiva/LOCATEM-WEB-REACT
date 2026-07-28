import {
    Wrench,
    History,
    Heart,
    CreditCard,
    FileText,
    MapPin,
    Bell,
    Settings,
    Headset,
    type LucideIcon,
} from 'lucide-react';
import type { Route } from '../../../router/useRouter';

export interface PainelItem {
    id: string;
    titulo: string;
    descricao: string;
    icon: LucideIcon;
    route?: Route;
}

/**
 * Itens do grid "Painel de Controle". Os mesmos 9 itens aparecem para
 * Locatário e Locador; o que muda é o papel do usuário logado, não a lista
 * de atalhos em si (reflete o mockup original de ambas as telas de perfil).
 */
export const PAINEL_ITENS: PainelItem[] = [
    {
        id: 'alugueis-ativos',
        titulo: 'Aluguéis Ativos',
        descricao: 'Visualize seus equipamentos alugados atualmente.',
        icon: Wrench,
        route: 'minhasReservas',
    },
    {
        id: 'historico-locacoes',
        titulo: 'Histórico de Locações',
        descricao: 'Consulte todas as suas locações anteriores.',
        icon: History,
        route: 'minhasReservas',
    },
    {
        id: 'favoritos',
        titulo: 'Favoritos',
        descricao: 'Ferramentas e equipamentos salvos.',
        icon: Heart,
        route: 'busca',
    },
    {
        id: 'pagamentos',
        titulo: 'Pagamentos',
        descricao: 'Visualize pagamentos, cauções e reembolsos.',
        icon: CreditCard,
    },
    {
        id: 'contratos',
        titulo: 'Contratos',
        descricao: 'Acesse todos os contratos digitais.',
        icon: FileText,
    },
    {
        id: 'enderecos',
        titulo: 'Endereços',
        descricao: 'Gerencie seus endereços cadastrados.',
        icon: MapPin,
    },
    {
        id: 'notificacoes',
        titulo: 'Notificações',
        descricao: 'Confira atualizações importantes.',
        icon: Bell,
        route: 'notificacoes',
    },
    {
        id: 'configuracoes',
        titulo: 'Configurações',
        descricao: 'Altere senha, dados pessoais e preferências.',
        icon: Settings,
    },
    {
        id: 'suporte',
        titulo: 'Suporte',
        descricao: 'Central de ajuda e atendimento.',
        icon: Headset,
    },
];
