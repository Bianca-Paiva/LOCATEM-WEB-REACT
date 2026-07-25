export interface EspecificacaoForm {
  id: string;
  label: string;
  valor: string;
}

export interface CadastroFerramentaFormState {
  // Fotos
  fotos: string[]; // data URLs

  // Informações básicas
  nome: string;
  marca: string;
  modelo: string;
  categoria: string;
  estadoConservacao: string;
  quantidadeDisponivel: number;
  fonteAlimentacao: string;

  // Descrição
  descricao: string;

  // Especificações técnicas
  especificacoes: EspecificacaoForm[];

  // Precificação
  valorDiaria: string;
  caucao: string;

  // Acessórios inclusos
  acessorios: string[];

  // Disponibilidade
  diasIndisponiveis: string[]; // "yyyy-mm-dd"

  // Endereço de retirada e devolução
  cep: string;
  ruaAvenida: string;
  numero: string;
  complemento: string;
  usarMesmoEnderecoDevolucao: boolean;
}

export const CATEGORIAS_FERRAMENTA = [
  'Ferramentas Elétricas • Parafusadeira/Furadeira',
  'Ferramentas Elétricas • Corte e Desgaste',
  'Ferramentas Elétricas • Pintura',
  'Ferramentas Manuais',
  'Jardinagem e Paisagismo',
  'Construção e Alvenaria',
  'Elevação e Transporte',
  'Limpeza e Lavagem',
];

export const ESTADOS_CONSERVACAO = [
  'Novo',
  'Seminovo',
  'Usado - Bom estado',
  'Usado - Estado regular',
];

export const OPCOES_FONTE_ALIMENTACAO = [
  '127V',
  '220V',
  'Bivolt',
  'À bateria',
  'Pneumática',
  'Manual',
  'Trifásica (380V)',
];
