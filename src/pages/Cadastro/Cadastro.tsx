import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import FormInput from '../../components/FormInput/FormInput'
import PasswordField from '../../components/PasswordField/PasswordField'
import { checkPasswordStrength } from '../../hooks/usePasswordStrength'
import {
    maskCPF,
    maskCNPJ,
    maskPhone,
    validateFullName,
    validatePhone,
    validateDocument,
} from '../../hooks/useMasks'
import { criarUsuario } from '../../services/authService'
import type { Route } from '../../router/useRouter'
import AuthHeader from '../../components/Header/AuthHeader/AuthHeader'
import styles from './Cadastro.module.css'

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
    const [submitting, setSubmitting] = useState(false)

    const strengthResult = checkPasswordStrength(senha)
    const isCNPJ = tipo === 'locador'
    const senhasIguais = senha === confirmarSenha
    const senhaForte = strengthResult.isStrong

    const confirmStatus = (): 'erro' | 'sucesso' | '' => {
        if (!confirmarSenha) return ''
        return senhasIguais && senhaForte ? 'sucesso' : 'erro'
    }

    const confirmError = (): string => {
        if (!confirmarSenha) return ''
        if (!senhasIguais) return 'As senhas não coincidem'
        if (!senhaForte) return 'A senha precisa ser mais forte'
        return ''
    }

    const btnDisabled =
        !nome || !email || !telefone || !senha || !confirmarSenha || !documento || !endereco ||
        !senhasIguais || !senhaForte || submitting

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
            nome: validateFullName(nome) ? undefined : 'Por favor, digite seu nome completo',
        }))
    }

    function handleTelefoneChange(e: ChangeEvent<HTMLInputElement>) {
        setTelefone(maskPhone(e.target.value))
    }

    function handleTelefoneBlur() {
        setTouched(prev => ({ ...prev, telefone: true }))
        setErrors(prev => ({
            ...prev,
            telefone: validatePhone(telefone) ? undefined : 'Digite um telefone válido com DDD',
        }))
    }

    function handleDocumentoChange(e: ChangeEvent<HTMLInputElement>) {
        setDocumento(isCNPJ ? maskCNPJ(e.target.value) : maskCPF(e.target.value))
    }

    function handleDocumentoBlur() {
        setTouched(prev => ({ ...prev, documento: true }))
        setErrors(prev => ({
            ...prev,
            documento: validateDocument(documento, isCNPJ)
                ? undefined
                : isCNPJ ? 'Digite seu CNPJ completo' : 'Digite seu CPF completo',
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (btnDisabled) return
        setSubmitting(true)
        try {
            await criarUsuario({
                nome, email, senha, confirmarSenha,
                telefone: telefone.replace(/\D/g, ''),
                documento: documento.replace(/\D/g, ''),
                tipoUsuario: tipo === 'locador' ? 2 : 1,
            })
            alert('Conta criada com sucesso!')
            navigate('login')
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Erro ao conectar com a API')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <AuthHeader navigate={navigate} />

            <main>
                <div className={styles.topo}>
                    <h1 className={styles.titulo}>Crie sua conta</h1>
                    <p className={styles.paragrafo}>Escolha como você deseja usar o site</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.tipoConta}>
                        <input type="radio" id="locador" name="tipo" value="locador"
                            checked={tipo === 'locador'} onChange={() => handleTipoChange('locador')}
                            className={styles.radioHidden} />
                        <label htmlFor="locador"
                            className={`${styles.cardTipo} ${tipo === 'locador' ? styles.cardTipoSelected : ''}`}>
                            <div className={`${styles.icone} ${tipo === 'locador' ? styles.iconeSelected : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z" />
                                </svg>
                            </div>
                            <h3>Locador</h3>
                            <p>Quero anunciar ferramentas</p>
                        </label>

                        <input type="radio" id="locatario" name="tipo" value="locatario"
                            checked={tipo === 'locatario'} onChange={() => handleTipoChange('locatario')}
                            className={styles.radioHidden} />
                        <label htmlFor="locatario"
                            className={`${styles.cardTipo} ${tipo === 'locatario' ? styles.cardTipoSelected : ''}`}>
                            <div className={`${styles.icone} ${tipo === 'locatario' ? styles.iconeSelected : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                </svg>
                            </div>
                            <h3>Locatário</h3>
                            <p>Quero alugar ferramentas</p>
                        </label>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <FormInput
                            id="nome"
                            label="Nome completo"
                            type="text"
                            placeholder="Digite seu nome completo"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            onBlur={handleNomeBlur}
                            required
                            status={touched.nome ? (errors.nome ? 'erro' : nome ? 'sucesso' : '') : ''}
                            error={errors.nome}
                        />

                        <FormInput
                            id="email"
                            label="E-mail"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />

                        <FormInput
                            id="telefone"
                            label="Telefone"
                            type="tel"
                            inputMode="numeric"
                            placeholder="(11) 91234-5678"
                            value={telefone}
                            onChange={handleTelefoneChange}
                            onBlur={handleTelefoneBlur}
                            required
                            status={touched.telefone ? (errors.telefone ? 'erro' : telefone ? 'sucesso' : '') : ''}
                            error={errors.telefone}
                        />

                        <PasswordField
                            id="senha"
                            label="Senha"
                            placeholder="Crie uma senha segura"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            strengthResult={strengthResult}
                            showRequirements
                        />

                        <PasswordField
                            id="confirmarSenha"
                            label="Confirmar senha"
                            placeholder="Digite a senha novamente"
                            value={confirmarSenha}
                            onChange={e => setConfirmarSenha(e.target.value)}
                            required
                            status={confirmStatus()}
                            error={confirmError()}
                        />

                        <FormInput
                            id="documento"
                            label={isCNPJ ? 'CNPJ' : 'CPF'}
                            type="text" inputMode="numeric"
                            placeholder={isCNPJ ? '00.000.000/0000-00' : '000.000.000-00'}
                            value={documento}
                            onChange={handleDocumentoChange}
                            onBlur={handleDocumentoBlur}
                            required
                            status={touched.documento ? (errors.documento ? 'erro' : documento ? 'sucesso' : '') : ''}
                            error={errors.documento}
                        />

                        <FormInput
                            id="endereco"
                            label="Endereço"
                            type="text"
                            placeholder="Digite seu endereço completo"
                            value={endereco}
                            onChange={e => setEndereco(e.target.value)}
                            required
                        />

                        <button type="submit" className={styles.btnCriarConta}>
                            Criar conta
                        </button>
                    </form>

                    <div className={styles.contaExistente}>
                        <p>Já tem uma conta?</p>
                        <a href="#" onClick={e => { e.preventDefault(); navigate('login') }}>Entrar</a>
                    </div>
                </div>
            </main>
        </div>
    )
}