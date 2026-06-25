// FUNÇÕES AUXILIARES PARA VALIDAÇÃO DE SENHAS

import type { PasswordStrengthResult } from './usePasswordStrength'

interface PasswordValidationItem {
    label: string
    valid: boolean
}

export function getPasswordValidations(
    password: string
): PasswordValidationItem[] {
    return [
        {
            label: 'Pelo menos 8 caracteres',
            valid: password.length >= 8,
        },
        {
            label: 'Pelo menos uma letra maiúscula',
            valid: /[A-Z]/.test(password),
        },
        {
            label: 'Pelo menos uma letra minúscula',
            valid: /[a-z]/.test(password),
        },
        {
            label: 'Pelo menos um número',
            valid: /\d/.test(password),
        },
        {
            label: 'Pelo menos um caractere especial',
            valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        },
    ]
}

export function getConfirmPasswordStatus(
    password: string,
    confirmPassword: string
): 'erro' | 'sucesso' | '' {
    if (!confirmPassword) return ''

    return password === confirmPassword ? 'sucesso' : 'erro'
}

export function getConfirmPasswordError(
    password: string,
    confirmPassword: string
): string {
    if (!confirmPassword) return ''

    return password !== confirmPassword
        ? 'As senhas não coincidem'
        : ''
}

type PasswordValidationType =
    | 'required'
    | 'mismatch'
    | 'fraca'
    | 'media'
    | 'success'

interface PasswordValidationResult {
    type: PasswordValidationType
}

export function validatePasswordForm(
    password: string,
    confirmPassword: string,
    strength: PasswordStrengthResult
): PasswordValidationResult {
    if (!password || !confirmPassword) {
        return {
            type: 'required',
        }
    }

    if (password !== confirmPassword) {
        return {
            type: 'mismatch',
        }
    }

    if (!strength.isStrong) {
        return {
            type: strength.strength === 'media'
                ? 'media'
                : 'fraca',
        }
    }

    return {
        type: 'success',
    }
}