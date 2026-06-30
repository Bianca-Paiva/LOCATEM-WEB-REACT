/**
 * Aplica a máscara de CPF (999.999.999-99) em tempo de digitação.
 * value String bruta contendo o texto digitado pelo usuário.
 */
export function maskCPF(value: string): string {
    // 1. Remove tudo que não for número (\D) e limita a string a 11 dígitos
    const digits = value.replace(/\D/g, '').substring(0, 11)
    
    // 2. Aplica a pontuação progressivamente conforme o usuário digita
    return digits
        .replace(/(\d{3})(\d)/, '$1.$2')       // Coloca o primeiro ponto: 123.4
        .replace(/(\d{3})(\d)/, '$1.$2')       // Coloca o segundo ponto: 123.456.7
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Coloca o hífen no final: 123.456.789-10
}

/**
 * Aplica a máscara de CNPJ (99.999.999/9999-99) em tempo de digitação.
 * value String bruta contendo o texto digitado pelo usuário.
 */
export function maskCNPJ(value: string): string {
    // 1. Remove tudo que não for número (\D) e limita a string a 14 dígitos
    const digits = value.replace(/\D/g, '').substring(0, 14)
    
    // 2. Aplica a pontuação do CNPJ de forma progressiva
    return digits
        .replace(/^(\d{2})(\d)/, '$1.$2')             // Coloca o primeiro ponto: 12.3
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Coloca o segundo ponto: 12.345.6
        .replace(/\.(\d{3})(\d)/, '.$1/$2')           // Coloca a barra: 12.345.678/9
        .replace(/(\d{4})(\d)/, '$1-$2')              // Coloca o hífen nos últimos 2 dígitos: 12.345.678/0001-99
}

/**
 * Aplica a máscara de Telefone fixo ou celular: (99) 9999-9999 ou (99) 99999-9999.
 * value String bruta contendo o texto digitado pelo usuário.
 */
export function maskPhone(value: string): string {
    // 1. Remove tudo que não for número e limita a 11 dígitos (DDD + 9 dígitos)
    const digits = value.replace(/\D/g, '').substring(0, 11)
    
    // 2. Formata com parênteses e hífen dinamicamente
    return digits
        .replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca o DDD entre parênteses: (11) 9
        .replace(/(\d{5})(\d)/, '$1-$2')     // Coloca o hífen após o 5º dígito do número (para celular): (11) 99999-9999
}

/**
 * Valida se o texto inserido é um nome completo.
 * Critério: Ter pelo menos 2 palavras e cada palavra ter pelo menos 2 letras.
 */
export function validateFullName(value: string): boolean {
    // Limpa espaços nas pontas (.trim), quebra a string por espaços e remove itens vazios do array
    const parts = value.trim().split(' ').filter(p => p.length > 0)
    
    // Retorna verdadeiro se tiver 2 ou mais partes E todas as partes tiverem 2 ou mais caracteres
    return parts.length >= 2 && parts.every(p => p.length >= 2)
}

/**
 * Valida o tamanho numérico de um telefone.
 * Critério: Deve conter exatamente 10 dígitos (fixo com DDD) ou 11 dígitos (celular com DDD).
 */
export function validatePhone(value: string): boolean {
    // Remove qualquer máscara (parênteses, hífens, espaços) sobrando só os números
    const digits = value.replace(/\D/g, '')
    
    // Retorna true se o tamanho for válido para o padrão brasileiro
    return digits.length === 10 || digits.length === 11
}

/**
 * Valida a quantidade de dígitos de um documento brasileiro.
 *  value O documento com ou sem máscara.
 *  isCNPJ Flag indicando se deve validar como CNPJ (true) ou CPF (false).
 */
export function validateDocument(value: string, isCNPJ: boolean): boolean {
    // Remove qualquer formatação, deixando apenas os números isolados
    const digits = value.replace(/\D/g, '')
    
    // Retorna true se tiver 14 dígitos para CNPJ ou 11 dígitos para CPF
    return isCNPJ ? digits.length === 14 : digits.length === 11
}