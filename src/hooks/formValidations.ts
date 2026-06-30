import {
    validateFullName,
    validatePhone,
    validateDocument,
} from './masks'

/**
 * Valida o nome completo do usuário.
 * Retorna undefined se for válido ou uma string de erro caso contrário.
 */
export function getNomeError(nome: string) {
    // Utiliza a função externa para checar se o nome é completo
    return validateFullName(nome)
        ? undefined
        : 'Por favor, digite seu nome completo'
}

/**
 * Valida o formato e a obrigatoriedade do e-mail.
 * Retorna uma string com o erro ou uma string vazia ('') se estiver correto.
 */
export function getEmailError(email: string): string {
    // Regex simples para validar estrutura básica de e-mail (ex: texto@texto.texto)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // 1. Validação de Obrigatoriedade: Se o campo estiver vazio ou apenas com espaços
    if (!email.trim()) {
        return 'O e-mail é obrigatório.'
    }

    // 2. Validação de Formato: Se foi preenchido, mas não segue o padrão da Regex
    if (!emailRegex.test(email)) {
        return 'Digite um e-mail válido.'
    }

    // 3. Sucesso: Se passou por todas as checagens, não há erros
    return undefined
}

/**
 * Valida o número de telefone.
 * Retorna undefined se for válido ou uma string de erro caso contrário.
*/
export function getTelefoneError(telefone: string) {
    // Utiliza a função externa para checar o formato do telefone + DDD
    return validatePhone(telefone)
        ? undefined
        : 'Digite um telefone válido com DDD'
}

/**
 * Valida documentos fiscais brasileiros (CPF ou CNPJ).
 * documento O número do documento a ser validado
 * isCNPJ Booleano que define se a validação deve ser feita para CNPJ (true) ou CPF (false)
*/
export function getDocumentoError(
    documento: string,
    isCNPJ: boolean
) {
    // Utiliza a função externa passando o documento e a flag do tipo
    if (validateDocument(documento, isCNPJ)) {
        return undefined // Documento é válido
    }

    // Se for inválido, define a mensagem de erro dinamicamente com base no tipo
    return isCNPJ
        ? 'Digite seu CNPJ completo'
        : 'Digite seu CPF completo'
}