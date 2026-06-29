import { useState } from 'react'
import type { ChangeEvent } from 'react'

//css da página
import styles from './Cadastro.module.css'

// hooks
import { checkPasswordStrength } from '../../hooks/passwordStrength'
import {
    getConfirmPasswordError,
    getConfirmPasswordStatus,
    getPasswordValidations,
    validatePasswordForm,
} from '../../hooks/passwordValidation'
import { PASSWORD_MESSAGES } from '../../hooks/passwordMessages'
import PasswordStrengthMeter from '../../components/PasswordMedidor/PasswordStrengthMeter'

import {
    maskCPF,
    maskCNPJ,
    maskPhone,
} from '../../hooks/masks'

import {
    getNomeError,
    getTelefoneError,
    getDocumentoError,
} from '../../hooks/cadastroValidations'
import { CADASTRO_MESSAGES } from '../../hooks/cadastroMessages'

import { criarUsuario } from '../../services/authService'
import type { Route } from '../../router/useRouter'

// components
import FormInput from '../../components/FormInput/FormInput'
import PasswordInput from '../../components/PasswordInput/PasswordInput'
import AuthHeader from '../../components/Header/AuthHeader/AuthHeader'
import PageHeader from '../../components/RecuperarSenha/PageHeader/PageHeader'
import CardOpcaoConta from '../../components/CardOpcaoConta/CardOpcaoConta'
import BtnPricipal from '../../components/BtnPrincipal/BtnPrincipal'
import FooterLink from '../../components/RecuperarSenha/FooterLink/FooterLink'
import PasswordValidationList from '../../components/RecuperarSenha/PasswordValidationList/PasswordValidationList'
import Alerta from "../../components/RecuperarSenha/Alerta/Alerta";
import SuccessModal from "../../components/SuccessModal/SucessesModal";

// imagens/icones
import IconLocatario from '../../assets/IconLocatario.svg'
import IconLocador from '../../assets/IconLocador.svg'


interface CadastroProps {
    navigate: (route: Route) => void
}

type TipoConta = 'locador' | 'locatario'

interface FormErrors {
    nome?: string
    telefone?: string
    documento?: string
}

interface TouchedFields {
    nome: boolean
    telefone: boolean
    documento: boolean
}

export default function Cadastro({ navigate }: CadastroProps) {
    const [tipo, setTipo] = useState<TipoConta>('locador')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [documento, setDocumento] = useState('')
    const [endereco, setEndereco] = useState('')
    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<TouchedFields>({ nome: false, telefone: false, documento: false })

    const strengthResult = checkPasswordStrength(senha)
    const isCNPJ = tipo === 'locador'

    // Estado para controlar se o alerta deve aparecer
    const [alerta, setAlerta] = useState<{ titulo: string, mensagem: string } | null>(null)

    // faz os inputs de senha chacoalharem e ficar com as bordas vermelhas caso o usuario tente criar a conta com esses campos vazios
    const [senhaErroState, setSenhaErroState] = useState({ active: false, shake: false })
    const [confirmErroState, setConfirmErroState] = useState({ active: false, shake: false })

    const [fieldErrorState, setFieldErrorState] = useState({
        nome: { active: false, shake: false },
        email: { active: false, shake: false },
        telefone: { active: false, shake: false },
        documento: { active: false, shake: false },
        endereco: { active: false, shake: false },
    })

    const [successModalOpen, setSuccessModalOpen] = useState(false);


    function handleTipoChange(value: TipoConta) {
        setTipo(value)
        setDocumento('')
        setErrors(prev => ({ ...prev, documento: undefined }))
        setTouched(prev => ({ ...prev, documento: false }))
    }

    function handleNomeBlur() {
        setTouched(prev => ({ ...prev, nome: true }))
        setErrors(prev => ({
            ...prev,
            nome: getNomeError(nome),
        }))
    }

    function handleTelefoneChange(e: ChangeEvent<HTMLInputElement>) {
        setTelefone(maskPhone(e.target.value))
    }

    function handleTelefoneBlur() {
        setTouched(prev => ({ ...prev, telefone: true }))
        setErrors(prev => ({
            ...prev,
            telefone: getTelefoneError(telefone),
        }))
    }

    function handleDocumentoChange(e: ChangeEvent<HTMLInputElement>) {
        setDocumento(isCNPJ ? maskCNPJ(e.target.value) : maskCPF(e.target.value))
    }

    function handleDocumentoBlur() {
        setTouched(prev => ({ ...prev, documento: true }))
        setErrors(prev => ({
            ...prev,
            documento: getDocumentoError(documento, isCNPJ),
        }))
    }

    function triggerFieldError(field: keyof typeof fieldErrorState) {
        setFieldErrorState(prev => ({
            ...prev,
            [field]: { active: true, shake: true }
        }))

        setTimeout(() => {
            setFieldErrorState(prev => ({
                ...prev,
                [field]: { ...prev[field], shake: false }
            }))
        }, 400)
    }

    async function handleSubmit() {
        // Limpa os estados visuais
        setSenhaErroState({ active: false, shake: false })
        setConfirmErroState({ active: false, shake: false })

        // -------------------------
        // CAMPOS OBRIGATÓRIOS
        // -------------------------

        let hasEmptyFields = false

        if (!nome.trim()) {
            triggerFieldError('nome')
            hasEmptyFields = true
        }

        if (!email.trim()) {
            triggerFieldError('email')
            hasEmptyFields = true
        }

        if (!telefone.trim()) {
            triggerFieldError('telefone')
            hasEmptyFields = true
        }

        if (!documento.trim()) {
            triggerFieldError('documento')
            hasEmptyFields = true
        }

        if (!endereco.trim()) {
            triggerFieldError('endereco')
            hasEmptyFields = true
        }

        if (!senha) {
            setSenhaErroState({ active: true, shake: true })
            hasEmptyFields = true
        }

        if (!confirmarSenha) {
            setConfirmErroState({ active: true, shake: true })
            hasEmptyFields = true
        }

        if (hasEmptyFields) {
            setAlerta(CADASTRO_MESSAGES.REQUIRED)
            return
        }

        // -------------------------
        // CAMPOS INVÁLIDOS
        // -------------------------

        if (getNomeError(nome)) {
            setAlerta(CADASTRO_MESSAGES.INVALID_NAME)
            return
        }

        if (getTelefoneError(telefone)) {
            setAlerta(CADASTRO_MESSAGES.INVALID_PHONE)
            return
        }

        if (getDocumentoError(documento, isCNPJ)) {
            setAlerta(
                isCNPJ
                    ? CADASTRO_MESSAGES.INVALID_CNPJ
                    : CADASTRO_MESSAGES.INVALID_CPF
            )
            return
        }

        // -------------------------
        // SENHA
        // -------------------------

        const result = validatePasswordForm(
            senha,
            confirmarSenha,
            strengthResult
        )

        switch (result.type) {
            case 'mismatch':
                setConfirmErroState({ active: true, shake: true })
                setAlerta(PASSWORD_MESSAGES.MISMATCH)
                return

            case 'fraca':
                setSenhaErroState({ active: true, shake: true })
                setAlerta(PASSWORD_MESSAGES.WEAK)
                return

            case 'media':
                setSenhaErroState({ active: true, shake: true })
                setAlerta(PASSWORD_MESSAGES.MEDIUM)
                return
        }

        // -------------------------
        // API
        // -------------------------

        try {
            await criarUsuario({
                nome,
                email,
                senha,
                confirmarSenha,
                telefone: telefone.replace(/\D/g, ''),
                documento: documento.replace(/\D/g, ''),
                tipoUsuario: tipo === 'locador' ? 2 : 1,
            })

            setSuccessModalOpen(true)
        } catch {
            setAlerta(CADASTRO_MESSAGES.API_ERROR)
        }
    }

    return (
        <div>
            <AuthHeader navigate={navigate} />

            <main>
                <PageHeader
                    title="Crie sua conta"
                    subtitle="Escolha como você deseja usar o site"
                />

                <div className={styles.card}>
                    <div className={styles.tipoConta}>

                        <CardOpcaoConta
                            id="locatario"
                            name="tipo"
                            value="locatario"
                            selected={tipo === "locatario"}
                            title="Locatário"
                            description="Quero alugar ferramentas"
                            onChange={handleTipoChange}
                            icon={
                                <img src={IconLocatario} alt="Icone Locatário" />
                            }
                        />

                        <CardOpcaoConta
                            id="locador"
                            name="tipo"
                            value="locador"
                            selected={tipo === "locador"}
                            title="Locador"
                            description="Quero anunciar ferramentas"
                            onChange={handleTipoChange}
                            icon={
                                <img src={IconLocador} alt="Icone Locador" />
                            }
                        />
                    </div>


                    {alerta && (
                        <Alerta
                            titulo={alerta.titulo}
                            mensagem={alerta.mensagem}
                            onClose={() => setAlerta(null)}
                        />
                    )}

                    <SuccessModal
                        open={successModalOpen}
                        title="Conta criada!"
                        message="Sua conta foi criada com sucesso. Entre para continuar."
                        buttonText="Entrar"
                        onConfirm={() => {
                            setSuccessModalOpen(false);
                            navigate("login");
                        }}
                    />

                    <form onSubmit={(e) => e.preventDefault()}>
                        <FormInput
                            id="nome"
                            label="Nome completo"
                            type="text"
                            placeholder="Digite seu nome completo"
                            value={nome}
                            onBlur={handleNomeBlur}
                            required
                            onChange={e => {
                                setNome(e.target.value)

                                if (fieldErrorState.nome.active) {
                                    setFieldErrorState(prev => ({
                                        ...prev,
                                        nome: { active: false, shake: false }
                                    }))
                                }
                            }}
                            status={
                                fieldErrorState.nome.active
                                    ? 'erro'
                                    : touched.nome
                                        ? (errors.nome ? 'erro' : nome ? 'sucesso' : '')
                                        : ''
                            }
                            error={fieldErrorState.nome.active ? '' : errors.nome}
                            shake={fieldErrorState.nome.shake}
                        />

                        <FormInput
                            id="email"
                            label="E-mail"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value)

                                if (fieldErrorState.email.active) {
                                    setFieldErrorState(prev => ({
                                        ...prev,
                                        email: { active: false, shake: false }
                                    }))
                                }
                            }}
                            required
                            status={fieldErrorState.email.active ? 'erro' : ''}
                            error=""
                            shake={fieldErrorState.email.shake}
                        />

                        <FormInput
                            id="telefone"
                            label="Telefone"
                            type="tel"
                            inputMode="numeric"
                            placeholder="(11) 91234-5678"
                            value={telefone}
                            onChange={e => {
                                handleTelefoneChange(e)

                                if (fieldErrorState.telefone.active) {
                                    setFieldErrorState(prev => ({
                                        ...prev,
                                        telefone: { active: false, shake: false }
                                    }))
                                }
                            }}
                            onBlur={handleTelefoneBlur}
                            required
                            status={
                                fieldErrorState.telefone.active
                                    ? 'erro'
                                    : touched.telefone
                                        ? (errors.telefone ? 'erro' : telefone ? 'sucesso' : '')
                                        : ''
                            }
                            error={fieldErrorState.telefone.active ? '' : errors.telefone}
                            shake={fieldErrorState.telefone.shake}
                        />

                        <PasswordInput
                            id="senha"
                            label="Senha"
                            placeholder="Crie uma senha segura"
                            value={senha}
                            onChange={e => {
                                setSenha(e.target.value);
                                if (senhaErroState.active) setSenhaErroState({ active: false, shake: false });
                            }}
                            status={senhaErroState.active ? 'erro' : ''}
                            shake={senhaErroState.shake}
                            required
                        />

                        <PasswordStrengthMeter
                            strength={strengthResult.strength}
                            visible={senha.length > 0}
                        />

                        {senha.length > 0 && (
                            <PasswordValidationList
                                title="Dicas de segurança"
                                items={getPasswordValidations(senha)}
                            />
                        )}

                        <PasswordInput
                            id="confirmarSenha"
                            label="Confirmar senha"
                            placeholder="Digite a senha novamente"
                            value={confirmarSenha}
                            onChange={e => {
                                setConfirmarSenha(e.target.value);
                                if (confirmErroState.active) setConfirmErroState({ active: false, shake: false });
                            }}
                            status={
                                confirmErroState.active
                                    ? 'erro'
                                    : getConfirmPasswordStatus(senha, confirmarSenha)
                            }

                            error={
                                confirmErroState.active
                                    ? ''
                                    : getConfirmPasswordError(senha, confirmarSenha)
                            }
                            shake={confirmErroState.shake}
                            required
                        />

                        <FormInput
                            id="documento"
                            label={isCNPJ ? 'CNPJ' : 'CPF'}
                            type="text"
                            inputMode="numeric"
                            placeholder={isCNPJ ? '00.000.000/0000-00' : '000.000.000-00'}
                            value={documento}
                            onChange={e => {
                                handleDocumentoChange(e)

                                if (fieldErrorState.documento.active) {
                                    setFieldErrorState(prev => ({
                                        ...prev,
                                        documento: { active: false, shake: false }
                                    }))
                                }
                            }}
                            onBlur={handleDocumentoBlur}
                            required
                            status={
                                fieldErrorState.documento.active
                                    ? 'erro'
                                    : touched.documento
                                        ? (errors.documento ? 'erro' : documento ? 'sucesso' : '')
                                        : ''
                            }
                            error={fieldErrorState.documento.active ? '' : errors.documento}
                            shake={fieldErrorState.documento.shake}
                        />

                        <FormInput
                            id="endereco"
                            label="Endereço"
                            type="text"
                            placeholder="Digite seu endereço completo"
                            value={endereco}
                            onChange={e => {
                                setEndereco(e.target.value)

                                if (fieldErrorState.endereco.active) {
                                    setFieldErrorState(prev => ({
                                        ...prev,
                                        endereco: { active: false, shake: false }
                                    }))
                                }
                            }}
                            required
                            status={fieldErrorState.endereco.active ? 'erro' : ''}
                            error=""
                            shake={fieldErrorState.endereco.shake}
                        />

                        <BtnPricipal
                            text="Criar conta"
                            type="button"
                            onClick={handleSubmit}
                        />
                    </form>
                </div>

                <FooterLink
                    text='Já tem uma conta?'
                    linkText='Entrar'
                    onClick={e => {
                        e.preventDefault()
                        navigate('login')
                    }}
                />
            </main>
        </div>
    );
}