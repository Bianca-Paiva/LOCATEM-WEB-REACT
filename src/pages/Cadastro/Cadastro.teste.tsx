import { useState } from 'react'
import type { ChangeEvent } from 'react'

// CSS da página
import styles from './Cadastro.module.css'

// Hooks e funções de validação
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
    getEmailError,
} from '../../hooks/formValidations'
import { CADASTRO_MESSAGES } from '../../hooks/cadastroMessages'

// Serviço responsável pelo cadastro do usuário
import { criarUsuario } from '../../services/authService'
import type { Route } from '../../router/useRouter'

// Componentes reutilizáveis
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

// Ícones
import IconLocatario from '../../assets/IconLocatario.svg'
import IconLocador from '../../assets/IconLocador.svg'


// Propriedades recebidas pelo componente
interface CadastroProps {
    navigate: (route: Route) => void
}

// Tipos de conta disponíveis durante o cadastro
type TipoConta = 'locatario' | 'locador'

// Armazena as mensagens de erro das validações dos campos
interface FormErrors {
    nome?: string
    email?: string
    telefone?: string
    documento?: string
}

// Controla quais campos já perderam o foco (onBlur),
// evitando exibir erros antes da primeira interação do usuário.
interface TouchedFields {
    nome: boolean
    email: boolean
    telefone: boolean
    documento: boolean
}

// Estado padrão utilizado para controlar
// a borda vermelha e a animação de erro dos campos.
interface ErrorState {
    active: boolean
    shake: boolean
}

// Estado padrão (sem erro)
const INITIAL_ERROR_STATE: ErrorState = {
    active: false,
    shake: false,
}

// Estado utilizado para ativar
// a borda vermelha e a animação de erro.
const ACTIVE_ERROR_STATE: ErrorState = {
    active: true,
    shake: true,
}

export default function Cadastro({ navigate }: CadastroProps) {

    // ==============================================
    // ↓ DADOS DO FORMULÁRIO ↓
    // Armazena os valores digitados pelo usuário.
    // ==============================================
    const [tipo, setTipo] = useState<TipoConta>('locatario')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [documento, setDocumento] = useState('')
    const [endereco, setEndereco] = useState('')


    // ===================================================
    // ↓ VALIDAÇÕES ↓
    // Controla regras de validação e estados auxiliares.
    // ===================================================
    const [errors, setErrors] = useState<FormErrors>({})
    const [touched, setTouched] = useState<TouchedFields>({
        nome: false,
        email: false,
        telefone: false,
        documento: false,
    })

    // Calcula, em tempo real, a força da senha digitada.
    const strengthResult = checkPasswordStrength(senha)

    // Define se o documento esperado deve ser CNPJ ou CPF.
    const isCNPJ = tipo === 'locador'


    // ==========================================
    // ↓ ESTADOS VISUAIS ↓
    // Controla elementos exibidos na interface.
    // ==========================================
    const [alerta, setAlerta] = useState<{ titulo: string, mensagem: string } | null>(null)

    const [senhaErroState, setSenhaErroState] =
        useState(INITIAL_ERROR_STATE)
    const [confirmErroState, setConfirmErroState] =
        useState(INITIAL_ERROR_STATE)

    const [fieldErrorState, setFieldErrorState] = useState({
        nome: INITIAL_ERROR_STATE,
        email: INITIAL_ERROR_STATE,
        telefone: INITIAL_ERROR_STATE,
        documento: INITIAL_ERROR_STATE,
        endereco: INITIAL_ERROR_STATE,
    })

    const [successModalOpen, setSuccessModalOpen] = useState(false);


    // ============================
    // ↓ MANIPULAÇÃO DOS CAMPOS ↓
    // ============================

    // Atualiza o tipo da conta e reinicia o campo de documento, pois o formato muda entre CPF e CNPJ.
    function handleTipoChange(value: TipoConta) {
        setTipo(value)
        setDocumento('')
        setErrors(prev => ({ ...prev, documento: undefined }))
        setTouched(prev => ({ ...prev, documento: false }))
    }

    // Marca o campo como visitado (touched) e executa sua validação.
    function handleNomeBlur() {
        setTouched(prev => ({ ...prev, nome: true }))
        setErrors(prev => ({
            ...prev,
            nome: getNomeError(nome),
        }))
    }

    function handleEmailBlur() {
        setTouched(prev => ({
            ...prev,
            email: true,
        }))

        setErrors(prev => ({
            ...prev,
            email: getEmailError(email),
        }))
    }

    // Aplica automaticamente a máscara enquanto o usuário digita.
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

    // Aplica automaticamente a máscara enquanto o usuário digita.
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

    // ===============================
    // ↓ CONTROLE DE ERROS VISUAIS ↓
    // ===============================

    // Remove o estado visual de erro de um campo específico assim que o usuário voltar a digitá-lo.
    function clearFieldError(field: keyof typeof fieldErrorState) {
        setFieldErrorState(prev => ({
            ...prev,
            [field]: INITIAL_ERROR_STATE
        }))
    }

    // Remove o estado visual de erro dos campos de senha.
    function clearError(
        setState: React.Dispatch<React.SetStateAction<ErrorState>>
    ) {
        setState(INITIAL_ERROR_STATE)
    }

    // Ativa a borda vermelha e a animação de "shake" para um campo obrigatório.
    // Após alguns milissegundos, apenas a animação é removida, mantendo a borda.
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

    // Ativa a borda vermelha e a animação de "shake" para um campo obrigatório.
    // Após alguns milissegundos, apenas a animação é removida, mantendo a borda.
    function triggerPasswordError(
        setState: React.Dispatch<React.SetStateAction<ErrorState>>
    ) {
        setState(ACTIVE_ERROR_STATE)

        setTimeout(() => {
            setState(prev => ({
                ...prev,
                shake: false
            }))
        }, 400)
    }

    // =========================
    // ↓ ENVIO DO FORMULÁRIO ↓
    // =========================

    // Executa todas as validações antes de enviar os dados para a API.
    async function handleSubmit() {

        // =========================
        // ↓ CAMPOS OBRIGATÓRIOS ↓
        // =========================

        // Indica se algum campo obrigatório foi encontrado vazio durante a validação.
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

        if (getEmailError(email)) {
            setAlerta(CADASTRO_MESSAGES.INVALID_EMAIL)
            return
        }

        if (!senha) {
            triggerPasswordError(setSenhaErroState)
            hasEmptyFields = true
        }

        if (!confirmarSenha) {
            triggerPasswordError(setConfirmErroState)
            hasEmptyFields = true
        }

        if (hasEmptyFields) {
            setAlerta(CADASTRO_MESSAGES.REQUIRED)
            return
        }

        // =========================
        // VALIDAÇÕES
        // =========================

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

        // =========================
        // SENHA
        // =========================

        const result = validatePasswordForm(
            senha,
            confirmarSenha,
            strengthResult
        )

        switch (result.type) {
            case 'mismatch':
                triggerPasswordError(setConfirmErroState)
                setAlerta(PASSWORD_MESSAGES.MISMATCH)
                return

            case 'fraca':
                triggerPasswordError(setSenhaErroState)
                setAlerta(PASSWORD_MESSAGES.WEAK)
                return

            case 'media':
                triggerPasswordError(setSenhaErroState)
                setAlerta(PASSWORD_MESSAGES.MEDIUM)
                return
        }

        // =========================
        // CRIAÇÃO DO USUÁRIO (API)
        // =========================

        // Envia os dados para a API.
        // Máscaras são removidas antes do envio.
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

                        {/* Seleção do tipo de conta */}
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

                    {/* Alerta exibido quando ocorre alguma validação ou erro */}
                    {alerta && (
                        <Alerta
                            titulo={alerta.titulo}
                            mensagem={alerta.mensagem}
                            onClose={() => setAlerta(null)}
                        />
                    )}

                    {/* Modal exibido após o cadastro ser realizado com sucesso */}
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

                    {/* Formulário de cadastro */}
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
                                    clearFieldError('nome')
                                }
                            }}
                            status={
                                fieldErrorState.nome.active
                                    ? 'erro'
                                    : touched.nome
                                        ? (errors.nome ? 'erro' : nome ? 'sucesso' : '')
                                        : ''
                            }

                            // Quando o erro é apenas "campo obrigatório", exibimos apenas a borda vermelha.
                            // Mensagens textuais ficam reservadas para validações específicas.
                            error={fieldErrorState.nome.active ? '' : errors.nome}

                            shake={fieldErrorState.nome.shake}
                        />

                        <FormInput
                            id="email"
                            label="E-mail"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onBlur={handleEmailBlur}
                            onChange={e => {
                                setEmail(e.target.value)

                                if (fieldErrorState.email.active) {
                                    clearFieldError('email')
                                }
                            }}
                            required
                            status={
                                fieldErrorState.email.active
                                    ? 'erro'
                                    : touched.email
                                        ? (errors.email ? 'erro' : email ? 'sucesso' : '')
                                        : ''
                            }

                            error={
                                fieldErrorState.email.active
                                    ? ''
                                    : errors.email
                            }
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
                                    clearFieldError('telefone')
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
                                if (senhaErroState.active) {
                                    clearError(setSenhaErroState)
                                }
                            }}
                            status={senhaErroState.active ? 'erro' : ''}
                            error=""
                            shake={senhaErroState.shake}
                            required
                        />

                        {/* Indicador visual da força da senha */}
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

                        {/* Lista de requisitos da senha atualizada em tempo real */}
                        <PasswordInput
                            id="confirmarSenha"
                            label="Confirmar senha"
                            placeholder="Digite a senha novamente"
                            value={confirmarSenha}
                            onChange={e => {
                                setConfirmarSenha(e.target.value);
                                if (confirmErroState.active) {
                                    clearError(setConfirmErroState)
                                }
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
                                    clearFieldError('documento')
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
                                    clearFieldError('endereco')
                                }
                            }}
                            required
                            status={fieldErrorState.endereco.active ? 'erro' : ''}
                            error=""
                            shake={fieldErrorState.endereco.shake}
                        />

                        {/* Botão responsável por iniciar todas as validações */}
                        <BtnPricipal
                            text="Criar conta"
                            type="button"
                            onClick={handleSubmit}
                        />
                    </form>
                </div>

                {/* Link para a tela de login */}
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