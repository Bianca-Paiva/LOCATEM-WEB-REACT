// CALCULA A FORÇA DA SENHA

export interface PasswordRequirements {
    tamanho: boolean
    minuscula: boolean
    maiuscula: boolean
    numero: boolean
    especial: boolean
}

export type PasswordStrength = 'fraca' | 'media' | 'forte' | ''

export interface PasswordStrengthResult {
    requirements: PasswordRequirements
    strength: PasswordStrength
    isStrong: boolean
}

export function checkPasswordStrength(value: string): PasswordStrengthResult {
    const requirements: PasswordRequirements = {
        tamanho: value.length >= 8,
        minuscula: /[a-z]/.test(value),
        maiuscula: /[A-Z]/.test(value),
        numero: /[0-9]/.test(value),
        especial: /[^A-Za-z0-9]/.test(value),
    }

    const score = Object.values(requirements).filter(Boolean).length

    let strength: PasswordStrength = ''
    if (value.length > 0) {
        if (score <= 2) strength = 'fraca'
        else if (score <= 4) strength = 'media'
        else strength = 'forte'
    }

    return { requirements, strength, isStrong: score === 5 }
}
