export function maskCPF(value: string): string {
    const digits = value.replace(/\D/g, '').substring(0, 11)
    return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function maskCNPJ(value: string): string {
    const digits = value.replace(/\D/g, '').substring(0, 14)
    return digits
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
}

export function maskPhone(value: string): string {
    const digits = value.replace(/\D/g, '').substring(0, 11)
    return digits
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
}

export function validateFullName(value: string): boolean {
    const parts = value.trim().split(' ').filter(p => p.length > 0)
    return parts.length >= 2 && parts.every(p => p.length >= 2)
}

export function validatePhone(value: string): boolean {
    const digits = value.replace(/\D/g, '')
    return digits.length === 10 || digits.length === 11
}

export function validateDocument(value: string, isCNPJ: boolean): boolean {
    const digits = value.replace(/\D/g, '')
    return isCNPJ ? digits.length === 14 : digits.length === 11
}