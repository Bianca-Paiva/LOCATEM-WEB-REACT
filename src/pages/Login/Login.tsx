import React, { useState } from 'react'
import AuthHeader from '../../components/Header/AuthHeader/AuthHeader'
import FormInput from '../../components/FormInput/FormInput'
import PasswordField from '../../components/PasswordInput/PasswordInput'
import { loginUsuario } from '../../services/authService'
import type { Route } from '../../router/useRouter'
import styles from './Login.module.css'

interface LoginProps {
    navigate: (route: Route) => void
}

export default function Login({ navigate }: LoginProps) {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const [emailErrState, setEmailErrState] = useState({ active: false, shake: false })
    const [senhaErrState, setSenhaErrState] = useState({ active: false, shake: false })

    const triggerShake = (setState: React.Dispatch<React.SetStateAction<{ active: boolean, shake: boolean }>>) => {
        setState(prev => ({ ...prev, shake: false }))
        
        setTimeout(() => {
            setState({ active: true, shake: true })
        }, 10)

        setTimeout(() => {
            setState(prev => ({ ...prev, shake: false }))
        }, 410)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        let possuiErro = false
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        // Validação de força da senha (mesmos critérios do cadastro)
        const hasTamanho = senha.length >= 8
        const hasMinuscula = /[a-z]/.test(senha)
        const hasMaiuscula = /[A-Z]/.test(senha)
        const hasNumero = /[0-9]/.test(senha)
        const hasEspecial = /[^A-Za-z0-9]/.test(senha)
        const isSenhaValida = hasTamanho && hasMinuscula && hasMaiuscula && hasNumero && hasEspecial

        if (!email || !emailRegex.test(email)) {
            triggerShake(setEmailErrState)
            possuiErro = true
        }
        
        // Dispara o erro se a senha estiver vazia OU se não cumprir os requisitos de segurança
        if (!senha || !isSenhaValida) {
            triggerShake(setSenhaErrState)
            possuiErro = true
        }

        if (possuiErro) return
        if (submitting) return

        setSubmitting(true)
        setError('')

        try {
            await loginUsuario({ email, senha })
            navigate('home')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'E-mail ou senha inválidos')
            triggerShake(setEmailErrState)
            triggerShake(setSenhaErrState)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <AuthHeader navigate={navigate} />

            <main>
                <div className={styles.topo}>
                    <h1 className={styles.titulo}>Bem-vindo de volta</h1>
                    <p className={styles.paragrafo}>Entre na sua conta para continuar</p>
                </div>

                <div className={styles.card}>
                    <form onSubmit={handleSubmit} noValidate>
                        <FormInput
                            key={`email-shake-${emailErrState.shake}`}
                            id="email"
                            label="E-mail"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value)
                                if (emailErrState.active) setEmailErrState({ active: false, shake: false })
                                setError('')
                            }}
                            status={emailErrState.active || error ? 'erro' : ''}
                            error={emailErrState.active && !email ? 'O e-mail é obrigatório' : emailErrState.active ? 'Digite um e-mail válido' : ''}
                            shake={emailErrState.shake}
                            required
                        />

                        <PasswordField
                            key={`senha-shake-${senhaErrState.shake}`}
                            id="senha"
                            label="Senha"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={e => {
                                setSenha(e.target.value)
                                if (senhaErrState.active) setSenhaErrState({ active: false, shake: false })
                                setError('')
                            }}
                            status={senhaErrState.active || error ? 'erro' : ''}
                            // Exibe um erro genérico para não poluir a tela, já que os requisitos visuais só ficam na tela de cadastro
                            error={senhaErrState.active && !senha ? 'A senha é obrigatória' : senhaErrState.active ? 'Senha inválida' : ''}
                            shake={senhaErrState.shake}
                            required
                        />

                        {error && <p className={styles.errorMsg}>{error}</p>}

                        <button
                            className={styles.esqueceuSenha}
                            onClick={e => { e.preventDefault(); navigate('recuperarSenha') }}
                        >
                            Esqueceu sua senha?
                        </button>

                        <button type="submit" className={styles.btnEntrar} disabled={submitting}>
                            {submitting ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className={styles.semConta}>
                        <p>Não tem uma conta?</p>
                        <button
                            onClick={e => { e.preventDefault(); navigate('cadastro') }}
                        >
                            Criar conta
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}