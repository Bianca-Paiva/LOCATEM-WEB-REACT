import { createContext } from 'react';
import type { AvaliacaoProduto } from '../../../pages/Ferramentas/ProdutoDetalhe/ProdutoDetalhe.types';

export interface ProdutoSelecionado {
  id?: number;
  title: string;
  marca: string;
  modelo?: string;
  price: string;
  images: string[];
  imageVerificado: string;
  imageNota: string;
  rating: number;
  reviewCount: number;
  locador: string; /** Nome do locador/anunciante do produto */
  locadorId?: string;
  locadorFotoUrl?: string; /** Identificador único do locador dono do anúncio — usado para ligar a solicitação de locação criada a partir desta página ao locador correto (ver Produto.locadorId). */
  localizacao: string; /** Localização do locador, ex: "São Paulo - SP" */
  categoria: string; /** Categoria da ferramenta, ex: "Elétrica • Parafusadeira/Furadeira" */
  categoriaId?: number;
  estoqueDisponivel: number; /** Quantidade máxima disponível para reserva */
  diasIndisponiveis?: string[]; /** Datas ("yyyy-mm-dd") em que a ferramenta não está disponível */
  voltagem?: string; /** Fonte de alimentação/voltagem informada no cadastro */
  estadoConservacao?: string;
  tipoAprovacao?: 'manual' | 'automatica'; /** Forma como as solicitações de locação são aprovadas por este locador */
  enderecoRetirada?: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  descricao?: string; /** Descrição livre da ferramenta, escrita pelo locador no cadastro */
  especificacoes?: { label: string; valor: string }[]; /** Especificações técnicas em pares chave/valor */
  acessorios?: string[]; /** Itens inclusos que acompanham a ferramenta */
  caucao?: string; /** Valor de caução da ferramenta */
  avaliacoes?: AvaliacaoProduto[]; /** Avaliações específicas desta ferramenta */
  distribuicaoAvaliacoes?: number[]; /** Distribuição percentual das notas [5,4,3,2,1] estrelas */
}

export interface ProdutoContextType {
  produtoSelecionado: ProdutoSelecionado | null;
  setProdutoSelecionado: (p: ProdutoSelecionado) => void;
}

export const ProdutoContext = createContext<ProdutoContextType | null>(null);
