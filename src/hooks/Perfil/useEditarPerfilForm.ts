import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { perfilSchema, type PerfilFormData } from './perfilSchema'
import { CADASTRO_MESSAGES } from '../Cadastro/cadastroMessages'
import type { Usuario } from '../../types/Usuario/usuario.types'

interface ErrorState { active: boolean; shake: boolean }
const INITIAL_ERROR = { active: false, shake: false }

const FIELDS = ['nome', 'telefone', 'documento', 'cep', 'logradouro', 'numero'] as const

export function useEditarPerfilForm(usuario: Usuario) {
    const [alerta, setAlerta] = useState<{ titulo: string, mensagem?: string } | null>(null)
    const [enderecoResumo, setEnderecoResumo] = useState<string>('')

    const [shakes, setShakes] = useState<Record<string, ErrorState>>({
        nome: INITIAL_ERROR, telefone: INITIAL_ERROR, documento: INITIAL_ERROR,
        cep: INITIAL_ERROR, logradouro: INITIAL_ERROR, numero: INITIAL_ERROR
    })

    const { control, handleSubmit, trigger, getValues, setValue, formState: { errors, touchedFields } } = useForm<PerfilFormData>({
        resolver: zodResolver(perfilSchema),
        defaultValues: {
            tipo: usuario.tipo,
            nome: usuario.nome,
            telefone: usuario.telefone,
            documento: usuario.documento,
            cep: '',
            logradouro: usuario.endereco || '',
            numero: '',
        }
    })

    const isCNPJ = usuario.tipo === 'locador'

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

    const onInvalidSubmit = (formErrors: typeof errors) => {
        let hasEmptyFields = false

        FIELDS.forEach(field => {
            const val = getValues(field)

            if (!val || (typeof val === 'string' && !val.trim())) {
                triggerShake(field)
                hasEmptyFields = true
            }
            else if (formErrors[field]) {
                triggerShake(field)
            }
        })

        if (hasEmptyFields) {
            setAlerta(CADASTRO_MESSAGES.REQUIRED)
            return
        }

        if (formErrors.nome) return setAlerta(CADASTRO_MESSAGES.INVALID_NAME)
        if (formErrors.telefone) return setAlerta(CADASTRO_MESSAGES.INVALID_PHONE)
        if (formErrors.documento) return setAlerta(isCNPJ ? CADASTRO_MESSAGES.INVALID_CNPJ : CADASTRO_MESSAGES.INVALID_CPF)
        if (formErrors.cep) return setAlerta(CADASTRO_MESSAGES.INVALID_CEP)
    }

    const buscarCep = async (cep: string) => {
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            setEnderecoResumo('');
            return;
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            if (data.erro) {
                setEnderecoResumo('');
                setAlerta({
                    titulo: 'CEP não encontrado',
                    mensagem: 'Verifique o CEP informado e tente novamente.',
                });
                return;
            }

            setValue('logradouro', data.logradouro || '');
            
            // Monta o resumo bonitinho: UF, Cidade, Bairro
            if (data.localidade) {
                const partes = [data.uf, data.localidade, data.bairro].filter(Boolean);
                setEnderecoResumo(partes.join(', '));
            }
        } catch {
            setAlerta({
                titulo: 'Erro ao buscar CEP',
                mensagem: 'Não foi possível consultar o CEP. Tente novamente.',
            });
        }
    };

    const buildSubmit = (onValid: (data: PerfilFormData) => void) => handleSubmit(onValid, onInvalidSubmit)

    return {
        control,
        isCNPJ,
        alerta,
        setAlerta,
        shakes,
        clearShake,
        touchedFields,
        errors,
        trigger,
        buildSubmit,
        buscarCep,
        enderecoResumo
    }
}