/**
 * Adapters entre DTOs da API de ferramentas e modelos consumidos pela interface.
 * Mantêm as telas independentes do formato exato retornado pelo backend.
 */
import type { ProdutoSelecionado } from '../context/Ferramentas/Produto/ProdutoContext';
import type { ProdutoHome } from '../pages/Home/HomeLocatario/HomeLocatario.types';
import { normalizarUrlImagem, type FerramentaDisponivel } from './ferramentaservice';

const formatarMoeda = (valor: number) =>
  Number(valor ?? 0).toFixed(2).replace('.', ',');

const formatarDataCadastro = (valor: string) => {
  if (!valor) return '';

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return '';

  return data.toLocaleDateString('pt-BR');
};

export function obterImagensFerramenta(ferramenta: FerramentaDisponivel): string[] {
  return ferramenta.fotos
    .map((foto) => normalizarUrlImagem(foto.urlImagem))
    .filter(Boolean);
}

export function ferramentaParaProdutoSelecionado(
  ferramenta: FerramentaDisponivel,
): ProdutoSelecionado {
  return {
    id: ferramenta.ferramentaId,
    title: ferramenta.nome,
    marca: ferramenta.marca,
    modelo: ferramenta.modelo,
    price: formatarMoeda(ferramenta.diaria),
    images: obterImagensFerramenta(ferramenta),
    imageVerificado: '/icon-verified.png',
    imageNota: '/icon-star.png',
    rating: Number(ferramenta.avaliacaoMedia ?? 0),
    reviewCount: ferramenta.totalAvaliacoes ?? 0,
    locador: ferramenta.usuarioNome || 'Locador não informado',
    locadorId: String(ferramenta.usuarioId),
    locadorFotoUrl: ferramenta.usuarioFotoUrl ?? undefined,
    localizacao: ferramenta.localizacao || '',
    categoria: ferramenta.categoriaNome || `Categoria ${ferramenta.categoriaId}`,
    categoriaId: ferramenta.categoriaId,
    estoqueDisponivel: ferramenta.quantidadeDisponivel,
    diasIndisponiveis: ferramenta.diasIndisponiveis,
    tipoAprovacao: ferramenta.tipoAprovacao,
    voltagem: ferramenta.fonteAlimentacao,
    estadoConservacao: ferramenta.estadoConservacao,
    enderecoRetirada: ferramenta.enderecoRetirada
      ? {
          logradouro: ferramenta.enderecoRetirada.logradouro,
          numero: ferramenta.enderecoRetirada.numero,
          complemento: ferramenta.enderecoRetirada.complemento,
          bairro: ferramenta.enderecoRetirada.bairro,
          cidade: ferramenta.enderecoRetirada.cidade,
          estado: ferramenta.enderecoRetirada.estado,
          cep: ferramenta.enderecoRetirada.cep,
        }
      : undefined,
    descricao: ferramenta.descricao,
    especificacoes: ferramenta.especificacoesTecnicas,
    acessorios: ferramenta.acessorios,
    caucao: formatarMoeda(ferramenta.caucao),
  };
}

export function ferramentaParaProdutoHome(
  ferramenta: FerramentaDisponivel,
): ProdutoHome {
  return {
    id: ferramenta.ferramentaId,
    title: ferramenta.nome,
    marca: ferramenta.marca || 'Sem marca',
    locador: ferramenta.usuarioNome || 'Locador não informado',
    price: formatarMoeda(ferramenta.diaria),
    images: obterImagensFerramenta(ferramenta),
    imageVerificado: '/icon-verified.png',
    imageNota: '/icon-star.png',
    rating: Number(ferramenta.avaliacaoMedia ?? 0),
    reviewCount: ferramenta.totalAvaliacoes ?? 0,
    tipoAprovacao: ferramenta.tipoAprovacao,
  };
}

export { formatarMoeda, formatarDataCadastro };
