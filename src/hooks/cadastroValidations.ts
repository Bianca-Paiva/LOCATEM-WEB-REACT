import {
    validateFullName,
    validatePhone,
    validateDocument,
} from './masks'

export function getNomeError(nome: string) {
    return validateFullName(nome)
        ? undefined
        : 'Por favor, digite seu nome completo'
}

export function getTelefoneError(telefone: string) {
    return validatePhone(telefone)
        ? undefined
        : 'Digite um telefone válido com DDD'
}

export function getDocumentoError(
    documento: string,
    isCNPJ: boolean
) {
    if (validateDocument(documento, isCNPJ))
        return undefined

    return isCNPJ
        ? 'Digite seu CNPJ completo'
        : 'Digite seu CPF completo'
}