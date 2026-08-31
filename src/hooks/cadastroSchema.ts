// src/hooks/formValidations.ts
import { z } from 'zod'
import { cpf, cnpj } from 'cpf-cnpj-validator'
import { validatePhone } from './masks'

export const cadastroSchema = z.object({
    tipo: z.enum(['locatario', 'locador']),
    nome: z.string()
        .min(1, 'O nome é obrigatório')
        .refine(val => {
            const parts = val.trim().split(' ').filter(p => p.length > 0)
            return parts.length >= 2 && parts.every(p => p.length >= 2)
        }, 'Por favor, digite seu nome completo'),
    
    email: z.string()
        .min(1, 'O e-mail é obrigatório.')
        .email('Digite um e-mail válido.'),
        
    telefone: z.string()
        .min(1, 'O telefone é obrigatório')
        // Validação delegada à libphonenumber-js (DDD, prefixo, quantidade de dígitos, etc.)
        .refine(validatePhone, 'Digite um telefone válido com DDD')
        // Mantém apenas os dígitos ao final, para envio à API
        .transform(val => val.replace(/\D/g, '')),
        
    documento: z.string().min(1, 'O documento é obrigatório'),
    endereco: z.string().min(1, 'O endereço é obrigatório'),
    
    senha: z.string()
        .min(1, 'A senha é obrigatória')
        .refine(val => {
            // Valida se a senha atende aos 5 requisitos matemáticos de força do passwordStrength
            const hasTamanho = val.length >= 8
            const hasMinuscula = /[a-z]/.test(val)
            const hasMaiuscula = /[A-Z]/.test(val)
            const hasNumero = /[0-9]/.test(val)
            const hasEspecial = /[^A-Za-z0-9]/.test(val)
            return hasTamanho && hasMinuscula && hasMaiuscula && hasNumero && hasEspecial
        }, ''), // <-- Texto longo substituído por string vazia
        
    confirmarSenha: z.string().min(1, 'A confirmação de senha é obrigatória')
})
.refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha']
})
.refine((data) => {
    const cleanDoc = data.documento.replace(/\D/g, '')
    const isCNPJ = data.tipo === 'locador'
    return isCNPJ ? cnpj.isValid(cleanDoc) : cpf.isValid(cleanDoc)
}, {
    message: 'Documento inválido',
    path: ['documento']
})

export type CadastroFormData = z.infer<typeof cadastroSchema>