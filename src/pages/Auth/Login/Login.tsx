import { useState } from 'react'
import { CircleAlert } from 'lucide-react'
import AuthHeader from '../../../components/Layout/Header/AuthHeader/AuthHeader'
import PageHeader from '../../../components/Auth/RecuperarSenha/PageHeader/PageHeader'
import FormInput from '../../../components/Shared/Inputs/FormInput/FormInput'
import PasswordField from '../../../components/Shared/Inputs/PasswordInput/PasswordInput'
//import { loginUsuario } from '../../services/authService'
import { useAuth } from '../../../hooks/Auth/useAuth'
import { lerRedirectAposLogin, limparRedirectAposLogin } from '../../../utils/Auth/redirectAposLogin'
import type { Route } from '../../../router/useRouter'
import styles from './Login.module.css'

interface LoginProps {
    navigate: (route: Route) => void
}

export default function Login({ navigate }: LoginProps) {
    const { login } = useAuth()
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

        if (!email || !emailRegex.test(email)) {
            triggerShake(setEmailErrState)
            possuiErro = true
        }

        if (!senha) {
            triggerShake(setSenhaErrState)
            possuiErro = true
        }

        if (possuiErro) return
        if (submitting) return

        setSubmitting(true)
        setError('')

        try {
            // await loginUsuario({ email, senha })
            // authService ainda não está integrado a um backend real (endpoint comentado acima), então resolvemos o usuário autenticado a partir do AuthContext, que por sua vez usa o catálogo mockado em mocks/usuarios.mock.ts.
            if (senha === 'erro-login') throw new Error('Falha de autenticacao simulada')
            login(email)

            // Login originado do Carrinho (usuário deslogado tentou "Continuar para Pagamento"):
            // volta exatamente para lá, com os itens do carrinho preservados. Sem essa marcação,
            // mantém o comportamento atual (vai para a Home).
            const rotaRedirect = lerRedirectAposLogin()
            if (rotaRedirect) {
                limparRedirectAposLogin()
                navigate(rotaRedirect)
            } else {
                navigate('home')
            }
        } catch {
            setError('E-mail ou senha inválidos.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <AuthHeader navigate={navigate} />

            <main>
                <PageHeader title='Bem-vindo de volta!' subtitle='Entre na sua conta para continuar' />

                <div className={styles.card}>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className={styles.inputGroup}>
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
                                error={senhaErrState.active && !senha ? 'A senha é obrigatória' : ''}
                                shake={senhaErrState.shake}
                                required
                            />
                        </div>

                        {error && (
                            <p className={styles.errorMsg}>
                                <CircleAlert size={14} strokeWidth={2.2} aria-hidden="true" />
                                <span className={styles.errorTextos}>
                                    <strong>Não foi possí­vel entrar</strong>
                                    <span>{error}</span>
                                </span>
                            </p>
                        )}

                        <button
                            type="button"
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
