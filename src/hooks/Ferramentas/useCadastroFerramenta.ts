import { useCallback, useEffect, useState } from 'react';
import type { Produto } from '../../types/Ferramentas/produto.types';
import type { CadastroFerramentaFormState } from '../../pages/Ferramentas/CadastroFerramenta/CadastroFerramenta.types';
import { validateCEP } from '../../utils/Formatacao/masks';
import { normalizarUrlImagem, type FerramentaDisponivel } from '../../services/ferramentaservice';

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
  bairro: '',
  cidade: '',
  estado: '',
  usarMesmoEnderecoDevolucao: true,
};

function formatarMoedaFormulario(valor: number): string {
  return Number(valor ?? 0).toFixed(2).replace('.', ',');
}

/** Converte a resposta real do backend para o estado do formulário de edição. */
function ferramentaParaFormulario(ferramenta: FerramentaDisponivel): CadastroFerramentaFormState {
  return {
    ...ESTADO_INICIAL,
    fotos: ferramenta.fotos.map((foto) => normalizarUrlImagem(foto.urlImagem)),
    nome: ferramenta.nome,
    marca: ferramenta.marca,
    modelo: ferramenta.modelo,
    categoria: ferramenta.categoriaNome,
    estadoConservacao: ferramenta.estadoConservacao,
    quantidadeDisponivel: ferramenta.quantidadeDisponivel,
    fonteAlimentacao: ferramenta.fonteAlimentacao,
    descricao: ferramenta.descricao,
    especificacoes:
      ferramenta.especificacoesTecnicas.length > 0
        ? ferramenta.especificacoesTecnicas.map((esp, indice) => ({
            id: `esp-${indice}`,
            label: esp.label,
            valor: esp.valor,
          }))
        : [{ id: 'esp-inicial', label: '', valor: '' }],
    valorDiaria: formatarMoedaFormulario(ferramenta.diaria),
    caucao: formatarMoedaFormulario(ferramenta.caucao),
    acessorios: ferramenta.acessorios ?? [],
    diasIndisponiveis: ferramenta.diasIndisponiveis ?? [],
    tipoAprovacao: ferramenta.tipoAprovacao ?? '',
    cep: ferramenta.enderecoRetirada?.cep ?? '',
    ruaAvenida: ferramenta.enderecoRetirada?.logradouro ?? '',
    numero: ferramenta.enderecoRetirada?.numero ?? '',
    complemento: ferramenta.enderecoRetirada?.complemento ?? '',
    bairro: ferramenta.enderecoRetirada?.bairro ?? '',
    cidade: ferramenta.enderecoRetirada?.cidade ?? '',
    estado: ferramenta.enderecoRetirada?.estado ?? '',
    usarMesmoEnderecoDevolucao: true,
  };
}

function parseMoeda(valor: string): number {
  const numero = Number(valor.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(numero) ? numero : 0;
}

function validarDescricao(descricao: string): string | undefined {
  const descricaoLimpa = descricao.trim();

  if (!descricaoLimpa) return 'Descreva a ferramenta';
  if (descricaoLimpa.length < MIN_CARACTERES_DESCRICAO) {
    return `A descrição deve ter no mínimo ${MIN_CARACTERES_DESCRICAO} caracteres`;
  }

  return undefined;
}

function possuiEspecificacaoIncompleta(
  especificacoes: CadastroFerramentaFormState['especificacoes'],
): boolean {
  return especificacoes.some(
    (esp) => esp.label.trim() === '' || esp.valor.trim() === '',
  );
}

export function useCadastroFerramenta(ferramentaEmEdicao?: FerramentaDisponivel) {
  const [form, setForm] = useState<CadastroFerramentaFormState>(
    ferramentaEmEdicao ? ferramentaParaFormulario(ferramentaEmEdicao) : ESTADO_INICIAL,
  );

  // O cadastro abre vazio; a edição recebe os dados do backend de forma assíncrona.
  useEffect(() => {
    setForm(
      ferramentaEmEdicao
        ? ferramentaParaFormulario(ferramentaEmEdicao)
        : ESTADO_INICIAL,
    );
  }, [ferramentaEmEdicao?.ferramentaId]);

  const setCampo = useCallback(<K extends keyof CadastroFerramentaFormState>(
    campo: K,
    valor: CadastroFerramentaFormState[K],
  ) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }, []);

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
    bairro: !form.bairro.trim() ? 'Informe o bairro' : undefined,
    cidade: !form.cidade.trim() ? 'Informe a cidade' : undefined,
    estado: !form.estado.trim() ? 'Informe o estado' : undefined,
  };

  const formularioCompleto = Object.values(erros).every((valor) => valor === undefined);

  const montarProduto = (locadorInfo: { nome: string; locadorId: string }): Omit<Produto, 'id' | 'meuAnuncio'> => {
    const especificacoesPreenchidas = form.especificacoes
      .filter((esp) => esp.label.trim() && esp.valor.trim())
      .map((esp) => ({ label: esp.label.trim(), valor: esp.valor.trim() }));

    return {
      title: form.nome.trim(),
      marca: form.marca.trim(),
      price: form.valorDiaria || '0,00',
      images: form.fotos,
      imageVerificado: 'src/assets/verificadoAzul.png',
      imageNota: 'src/assets/StarFullYellow.png',
      rating: 0,
      reviewCount: 0,
      locador: locadorInfo.nome,
      locadorId: locadorInfo.locadorId,
      localizacao: 'São Paulo - SP',
      categoria: form.categoria,
      estoqueDisponivel: form.quantidadeDisponivel,
      paymentMethods: ['Cartão de Crédito', 'Pix'],
      available: true,
      status: 'disponivel',
      descricao: form.descricao.trim(),
      especificacoes: especificacoesPreenchidas,
      acessorios: form.acessorios,
      caucao: form.caucao || undefined,
      diasIndisponiveis: form.diasIndisponiveis,
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
