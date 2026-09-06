/**
 * Gera as iniciais de um nome para uso em avatares sem foto (ex: "João da Silva" -> "JS").
 *
 * Extraído de components/ProdutoDetalhe/AvaliacaoSection (que tinha essa mesma lógica
 * duplicada localmente) para virar um utilitário único, reutilizado por qualquer
 * avatar do projeto (componente Avatar, InfoVendedor, Header, Perfil).
 */
export function getIniciais(nome: string): string {
  if (!nome) return '';

  // Remove espaços extras no início/fim e divide o nome pelos espaços
  const partes = nome.trim().split(/\s+/);

  // Se tiver só um nome, continua pegando as duas primeiras letras como garantia
  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase();
  }

  // Pega a 1ª letra do primeiro nome e a 1ª letra do último sobrenome
  const primeiraLetra = partes[0][0];
  const ultimaLetra = partes[partes.length - 1][0];

  return (primeiraLetra + ultimaLetra).toUpperCase();
}
