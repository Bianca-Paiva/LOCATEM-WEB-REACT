import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cadastroSchema, type CadastroFormData } from './cadastroSchema'
import { CADASTRO_MESSAGES } from './cadastroMessages'
import { PASSWORD_MESSAGES } from './passwordMessages'
import { checkPasswordStrength } from './passwordStrength'
import { criarUsuario } from '../services/authService'

interface ErrorState { active: boolean; shake: boolean }
const INITIAL_ERROR = { active: false, shake: false }

export function useCadastroForm() {
    const [alerta, setAlerta] = useState<{ titulo: string, mensagem?: string } | null>(null)
    const [successModalOpen, setSuccessModalOpen] = useState(false)

    const [shakes, setShakes] = useState<Record<string, ErrorState>>({
        nome: INITIAL_ERROR, email: INITIAL_ERROR, telefone: INITIAL_ERROR,
        documento: INITIAL_ERROR, endereco: INITIAL_ERROR, senha: INITIAL_ERROR, confirmarSenha: INITIAL_ERROR
    })

    const { control, handleSubmit, setValue, trigger, getValues, formState: { errors, touchedFields } } = useForm<CadastroFormData>({
        resolver: zodResolver(cadastroSchema),
        defaultValues: { tipo: 'locatario', nome: '', email: '', telefone: '', documento: '', endereco: '', senha: '', confirmarSenha: '' }
    })

    const tipo = useWatch({ control, name: 'tipo' })
    const senha = useWatch({ control, name: 'senha' })
    const confirmarSenha = useWatch({ control, name: 'confirmarSenha' })

    const isCNPJ = tipo === 'locador'
    const strengthResult = checkPasswordStrength(senha || '')

    const triggerShake = (field: string) => {
        setShakes(prev => ({ ...prev, [field]: { ...prev[field], shake: false } }))

        setTimeout(() => {
            setShakes(prev => ({ ...prev, [field]: { active: true, shake: true } }))
        }, 10)

        setTimeout(() => {
            setShakes(prev => ({ ...prev, [field]: { ...prev[field], shake: false } }))
        }, 410)
    }

    const clearShake = (field: string) => {
        if (shakes[field]?.active) {
            setShakes(prev => ({ ...prev, [field]: INITIAL_ERROR }))
        }
    }

    const handleTipoChange = (value: 'locatario' | 'locador') => {
        setValue('tipo', value)
        setValue('documento', '')
        clearShake('documento')
    }

    const onValidSubmit = async (data: CadastroFormData) => {
        try {
            await criarUsuario({
                nome: data.nome,
                email: data.email,
                senha: data.senha,
                confirmarSenha: data.confirmarSenha,
                telefone: data.telefone,
                documento: data.documento.replace(/\D/g, ''),
                tipoUsuario: data.tipo === 'locador' ? 2 : 1,
            })
            setSuccessModalOpen(true)
        } catch {
            setAlerta(CADASTRO_MESSAGES.API_ERROR)
        }
    }

    const onInvalidSubmit = (formErrors: typeof errors) => {
        let hasEmptyFields = false

        const fields = ['nome', 'email', 'telefone', 'documento', 'endereco', 'senha', 'confirmarSenha'] as const
        fields.forEach(field => {
            const val = getValues(field)
            
            // Aciona o shake se o campo estiver vazio
            if (!val || (typeof val === 'string' && !val.trim())) {
                triggerShake(field)
                hasEmptyFields = true
            } 
            // Aciona o shake se o campo estiver preenchido, mas com erro de validação
            else if (formErrors[field]) {
                triggerShake(field)
            }
        })

        if (hasEmptyFields) {
            setAlerta(CADASTRO_MESSAGES.REQUIRED)
            return
        }

        if (formErrors.email) return setAlerta(CADASTRO_MESSAGES.INVALID_EMAIL)
        if (formErrors.nome) return setAlerta(CADASTRO_MESSAGES.INVALID_NAME)
        if (formErrors.telefone) return setAlerta(CADASTRO_MESSAGES.INVALID_PHONE)
        if (formErrors.documento) return setAlerta(isCNPJ ? CADASTRO_MESSAGES.INVALID_CNPJ : CADASTRO_MESSAGES.INVALID_CPF)

        if (formErrors.confirmarSenha?.message === 'As senhas não coincidem') {
            // O triggerShake('confirmarSenha') foi removido daqui pois já é acionado no loop acima
            return setAlerta(PASSWORD_MESSAGES.MISMATCH)
        }

        if (formErrors.senha) {
            // O triggerShake('senha') foi removido daqui pois já é acionado no loop acima
            return setAlerta(strengthResult.strength === 'media' ? PASSWORD_MESSAGES.MEDIUM : PASSWORD_MESSAGES.WEAK)
        }
    }

    return {
        control, tipo, senha: senha || '', confirmarSenha: confirmarSenha || '', isCNPJ, strengthResult,
        alerta, setAlerta, successModalOpen, setSuccessModalOpen, shakes, clearShake,
        touchedFields, errors, trigger, handleTipoChange,
        onSubmit: handleSubmit(onValidSubmit, onInvalidSubmit)
    }
}