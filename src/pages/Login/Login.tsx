import React, { useState } from 'react'
import AuthHeader from '../../components/Header/AuthHeader/AuthHeader'
import FormInput from '../../components/FormInput/FormInput'
import PasswordField from '../../components/PasswordField/PasswordField'
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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        let possuiErro = false

        if (!email) {
            setEmailErrState({ active: true, shake: false })
            setTimeout(() => setEmailErrState({ active: true, shake: true }), 10)
            possuiErro = true
        }
        if (!senha) {
            setSenhaErrState({ active: true, shake: false })
            setTimeout(() => setSenhaErrState({ active: true, shake: true }), 10)
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
                    <form onSubmit={handleSubmit}>
                        <FormInput
                            id="email"
                            label="E-mail"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value)
                                if (emailErrState.active) setEmailErrState({ active: false, shake: false })
                            }}
                            status={emailErrState.active ? 'erro' : ''}
                            error={emailErrState.active ? 'Preencha de forma correta para continuar' : ''}
                            shake={emailErrState.shake}
                        />

                        <PasswordField
                            id="senha"
                            label="Senha"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={e => {
                                setSenha(e.target.value)
                                if (senhaErrState.active) setSenhaErrState({ active: false, shake: false })
                            }}
                            status={senhaErrState.active ? 'erro' : ''}
                            error={senhaErrState.active ? 'Preencha de forma correta para continuar' : ''}
                            shake={senhaErrState.shake}
                        />

                        {error && <p className={styles.errorMsg}>{error}</p>}

                        <button
                            className={styles.esqueceuSenha}
                            onClick={e => { e.preventDefault(); navigate('recuperarSenha') }}
                        >
                            Esqueceu sua senha?
                        </button>

                        <button type="submit" className={styles.btnEntrar}>
                            Entrar
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
