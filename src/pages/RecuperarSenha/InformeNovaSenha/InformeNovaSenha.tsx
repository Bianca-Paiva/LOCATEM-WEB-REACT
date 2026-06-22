import { useState } from 'react'
import styles from "./InformeNovaSenha.module.css"
import AuthHeader from "../../../components/Header/AuthHeader/AuthHeader";
import Etapas from "../../../components/RecuperarSenha/Etapas/Etapas";
import PageHeader from "../../../components/RecuperarSenha/PageHeader/PageHeader";
import PasswordField from '../../../components/PasswordInput/PasswordInput'
import BtnPrincipal from "../../../components/BtnPrincipal/BtnPrincipal";
import PasswordValidationList from '../../../components/RecuperarSenha/PasswordValidationList/PasswordValidationList'
import PasswordStrengthMeter from '../../../components/PasswordMedidor/PasswordStrengthMeter'
import { checkPasswordStrength } from '../../../hooks/usePasswordStrength'
import type { Route } from "../../../router/useRouter";

interface InformeNovaSenhaProps {
    navigate: (route: Route) => void;
}

export default function InformeNovaSenha({ navigate }: InformeNovaSenhaProps) {
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')

    const strengthResult = checkPasswordStrength(senha)
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

    return (
        <>
            <AuthHeader navigate={navigate} />

            <main className={styles.main}>
                <Etapas currentStep={3} />

                <PageHeader
                    title="Informe sua nova senha"
                    subtitle=""
                />

                {/* FORM CONTAINER: Alinha todo o bloco centralizado */}
                <form className={styles.formulario} onSubmit={(e) => e.preventDefault()}>

                    {/* CONTAINER DUAS COLUNAS (Lado a Lado no Desktop) */}
                    <div className={styles.layoutColunas}>

                        {/* COLUNA DA ESQUERDA: Inputs e Medidor de Força */}
                        <div className={styles.colunaEsquerda}>
                            <PasswordField
                                id="senha"
                                label="Digite sua nova senha"
                                placeholder="Crie uma senha segura"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                required
                                strengthResult={strengthResult}
                            />

                            <PasswordStrengthMeter
                                strength={strengthResult.strength}
                                visible={senha.length > 2}
                            />

                            <PasswordField
                                id="confirmarSenha"
                                label="Confirme sua nova senha"
                                placeholder="Digite a senha novamente"
                                value={confirmarSenha}
                                onChange={e => setConfirmarSenha(e.target.value)}
                                required
                                status={confirmStatus()}
                                error={confirmError()}
                            />
                        </div>

                        {/* COLUNA DA DIREITA: Dicas de Segurança de Senha */}
                        <div className={styles.colunaDireita}>
                            <PasswordValidationList
                                title="Dicas de segurança"
                                items={[
                                    { label: 'Pelo menos 8 caracteres', valid: false },
                                    { label: 'Pelo menos uma letra maiúscula', valid: false },
                                    { label: 'Pelo menos uma letra minúscula', valid: false },
                                    { label: 'Pelo menos um número', valid: true },
                                    { label: 'Pelo menos um caractere especial', valid: false },
                                ]}
                            />
                        </div>
                    </div>

                    <BtnPrincipal
                        text="Alterar senha"
                        type="submit"
                    />
                </form>
            </main>
        </>
    );
}