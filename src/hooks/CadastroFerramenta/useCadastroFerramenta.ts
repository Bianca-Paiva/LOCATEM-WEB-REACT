import { useState } from 'react';
import type { Produto } from '../../types/Produto/produto.types';
import type { CadastroFerramentaFormState } from '../../pages/CadastroFerramenta/CadastroFerramenta.types';
import { validateCEP } from '../Mascaras/masks';

const MIN_CARACTERES_DESCRICAO = 50;

const ESTADO_INICIAL: CadastroFerramentaFormState = {
  fotos: [],
  nome: '',
  marca: '',
  modelo: '',
  categoria: '',
  estadoConservacao: '',
  quantidadeDisponivel: 1,
  fonteAlimentacao: '',
  descricao: '',
  especificacoes: [{ id: 'esp-inicial', label: '', valor: '' }],
  valorDiaria: '',
  caucao: '',
  acessorios: [],
  diasIndisponiveis: [],
  tipoAprovacao: '',
  cep: '',
  ruaAvenida: '',
  numero: '',
  complemento: '',
  usarMesmoEnderecoDevolucao: true,
};

/**
 * Converte um Produto já cadastrado no formato do formulário — usado para
 * pré-preencher o Cadastro de Ferramenta quando aberto em modo de edição
 * (botão "Editar" em Minhas Ferramentas / Detalhe da Ferramenta).
 *
 * O endereço de retirada não é armazenado em `Produto` hoje (o formulário de
 * cadastro nunca persistiu esses campos), então a edição começa com o
 * endereço em branco — mesma limitação que já existia para novos cadastros.
 */
function produtoParaFormulario(produto: Produto): CadastroFerramentaFormState {
  return {
    ...ESTADO_INICIAL,
    fotos: produto.images,
    nome: produto.title,
    marca: produto.marca,
    categoria: produto.categoria,
    quantidadeDisponivel: produto.estoqueDisponivel,
    fonteAlimentacao: produto.voltagem ?? '',
    descricao: produto.descricao ?? '',
    especificacoes:
      produto.especificacoes && produto.especificacoes.length > 0
        ? produto.especificacoes.map((esp, indice) => ({ id: `esp-${indice}`, label: esp.label, valor: esp.valor }))
        : ESTADO_INICIAL.especificacoes,
    valorDiaria: produto.price,
    caucao: produto.caucao ?? '',
    acessorios: produto.acessorios ?? [],
    diasIndisponiveis: produto.diasIndisponiveis ?? [],
    tipoAprovacao: produto.tipoAprovacao ?? '',
  };
}

// Converte "45,00" -> 45. Aceita tanto vírgula quanto ponto decimal.
function parseMoeda(valor: string): number {
  const numero = Number(valor.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(numero) ? numero : 0;
}

function validarDescricao(descricao: string): string | undefined {
  const descricaoLimpa = descricao.trim();

  if (!descricaoLimpa) {
    return 'Descreva a ferramenta';
  }

  if (descricaoLimpa.length < MIN_CARACTERES_DESCRICAO) {
    return `A descrição deve ter no mínimo ${MIN_CARACTERES_DESCRICAO} caracteres`;
  }

  return undefined;
}

// Uma especificação é considerada incompleta quando falta o rótulo ou o valor.
function possuiEspecificacaoIncompleta(especificacoes: CadastroFerramentaFormState['especificacoes']): boolean {
  return especificacoes.some((esp) => esp.label.trim() === '' || esp.valor.trim() === '');
}

export function useCadastroFerramenta(produtoEmEdicao?: Produto) {
  const [form, setForm] = useState<CadastroFerramentaFormState>(
    produtoEmEdicao ? produtoParaFormulario(produtoEmEdicao) : ESTADO_INICIAL,
  );

  const setCampo = <K extends keyof CadastroFerramentaFormState>(
    campo: K,
    valor: CadastroFerramentaFormState[K],
  ) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  };

  const toggleDiaIndisponivel = (dataIso: string) => {
    setForm((atual) => {
      const jaMarcado = atual.diasIndisponiveis.includes(dataIso);

      return {
        ...atual,
        diasIndisponiveis: jaMarcado
          ? atual.diasIndisponiveis.filter((d) => d !== dataIso)
          : [...atual.diasIndisponiveis, dataIso],
      };
    });
  };

  // Erros de validação, calculados a cada render a partir do form atual.
  const erros = {
    fotos: form.fotos.length === 0 ? 'Adicione ao menos 1 foto da ferramenta' : undefined,
    nome: !form.nome.trim() ? 'Informe o nome da ferramenta' : undefined,
    marca: !form.marca.trim() ? 'Informe a marca' : undefined,
    modelo: !form.modelo.trim() ? 'Informe o modelo' : undefined,
    categoria: !form.categoria ? 'Selecione uma categoria' : undefined,
    estadoConservacao: !form.estadoConservacao ? 'Selecione o estado de conservação' : undefined,
    fonteAlimentacao: !form.fonteAlimentacao ? 'Selecione a fonte de alimentação' : undefined,
    descricao: validarDescricao(form.descricao),
    especificacoes: possuiEspecificacaoIncompleta(form.especificacoes)
      ? 'O campo Especificações técnicas é obrigatório.'
      : undefined,
    valorDiaria: parseMoeda(form.valorDiaria) <= 0 ? 'Informe o valor da diária' : undefined,
    tipoAprovacao: !form.tipoAprovacao ? 'Selecione uma opção' : undefined,
    cep: !validateCEP(form.cep) ? 'Informe um CEP válido' : undefined,
    ruaAvenida: !form.ruaAvenida.trim() ? 'Informe a rua/avenida' : undefined,
    numero: !form.numero.trim() ? 'Informe o número' : undefined,
  };

  const formularioCompleto = Object.values(erros).every((valor) => valor === undefined);

  // Monta o objeto Produto pronto para entrar no catálogo (CatalogoContext).
  // `locadorInfo` vem do usuário autenticado (useAuth) — garante que a ferramenta
  // publicada/editada fica corretamente ligada ao locador logado (Produto.locadorId),
  // em vez do "Você" fixo usado anteriormente.
  const montarProduto = (locadorInfo: { nome: string; locadorId: string }): Omit<Produto, 'id' | 'meuAnuncio'> => {
    const especificacoesPreenchidas = form.especificacoes
      .filter((esp) => esp.label.trim() && esp.valor.trim())
      .map((esp) => ({
        label: esp.label.trim(),
        valor: esp.valor.trim(),
      }));

    return {
      title: form.nome.trim(),
      marca: form.marca.trim(),
      price: form.valorDiaria || '0,00',
      images: form.fotos.length > 0 ? form.fotos : [],
      imageVerificado: 'src/assets/verificadoAzul.png',
      imageNota: 'src/assets/StarFullYellow.png',
      rating: produtoEmEdicao?.rating ?? 0,
      reviewCount: produtoEmEdicao?.reviewCount ?? 0,
      locador: locadorInfo.nome,
      locadorId: locadorInfo.locadorId,
      localizacao: 'São Paulo - SP',
      categoria: form.categoria,
      estoqueDisponivel: form.quantidadeDisponivel,
      paymentMethods: ['Cartão de Crédito', 'Pix'],
      available: produtoEmEdicao ? produtoEmEdicao.status === 'disponivel' : true,
      status: produtoEmEdicao?.status ?? 'disponivel',
      cadastradoEm:
        produtoEmEdicao?.cadastradoEm ??
        new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      descricao: form.descricao.trim(),
      especificacoes: especificacoesPreenchidas,
      acessorios: form.acessorios,
      caucao: form.caucao || undefined,
      diasIndisponiveis: form.diasIndisponiveis,
      // Neste ponto o formulário já foi validado (formularioCompleto === true),
      // então tipoAprovacao nunca será '' — o cast reflete essa garantia.
      tipoAprovacao: form.tipoAprovacao as 'manual' | 'automatica',
      avaliacoes: produtoEmEdicao?.avaliacoes,
      distribuicaoAvaliacoes: produtoEmEdicao?.distribuicaoAvaliacoes,
    };
  };

  return {
    form,
    setCampo,
    toggleDiaIndisponivel,
    erros,
    formularioCompleto,
    montarProduto,
  };
}