/**
 * Consulta endereço pelo ViaCEP.
 * Usado para preencher automaticamente campos de endereço a partir de um CEP válido.
 */
export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function buscarEnderecoPorCEP(cep: string): Promise<EnderecoViaCep> {
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    throw new Error('Informe um CEP com 8 dígitos.');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

  if (!response.ok) {
    throw new Error('Não foi possível consultar o CEP.');
  }

  const dados = (await response.json()) as EnderecoViaCep;

  if (dados.erro) {
    throw new Error('CEP não encontrado.');
  }

  return dados;
}
