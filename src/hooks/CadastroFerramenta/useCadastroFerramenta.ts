import { useState } from 'react';
import type { Produto } from '../../types/produto.types';
import type { CadastroFerramentaFormState } from '../../pages/CadastroFerramenta/CadastroFerramenta.types';
import { validateCEP } from '../masks';

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

export function useCadastroFerramenta() {
  const [form, setForm] = useState<CadastroFerramentaFormState>(ESTADO_INICIAL);

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
  const montarProduto = (): Omit<Produto, 'id' | 'meuAnuncio'> => {
    const especificacoesPreenchidas = form.especificacoes
      .filter((esp) => esp.label.trim() && esp.valor.trim())
      .map((esp) => ({
        label: esp.label.trim(),
        valor: esp.valor.trim(),
      }));

    return {
      title: form.nome.trim(),
      brand: form.marca.trim(),
      price: form.valorDiaria || '0,00',
      images: form.fotos.length > 0 ? form.fotos : [],
      imageVerificado: 'src/assets/verificadoAzul.png',
      imageNota: 'src/assets/StarFullYellow.png',
      rating: 0,
      reviewCount: 0,
      locador: 'Você',
      localizacao: 'São Paulo - SP',
      categoria: form.categoria,
      estoqueDisponivel: form.quantidadeDisponivel,
      paymentMethods: ['Cartão de Crédito', 'Pix'],
      available: true,
      descricao: form.descricao.trim(),
      especificacoes: especificacoesPreenchidas,
      acessorios: form.acessorios,
      caucao: form.caucao || undefined,
      diasIndisponiveis: form.diasIndisponiveis,
      // Neste ponto o formulário já foi validado (formularioCompleto === true),
      // então tipoAprovacao nunca será '' — o cast reflete essa garantia.
      tipoAprovacao: form.tipoAprovacao as 'manual' | 'automatica',
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