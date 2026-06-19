import { useState } from 'react'
import styles from "./InformeNovaSenha.module.css"
import AuthHeader from "../../../components/Header/AuthHeader/AuthHeader";
import Etapas from "../../../components/RecuperarSenha/Etapas/Etapas";
import PageHeader from "../../../components/RecuperarSenha/PageHeader/PageHeader";
import PasswordField from '../../../components/PasswordField/PasswordField'
import BtnPrincipal from "../../../components/BtnPrincipal/BtnPrincipal";
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

                <BtnPrincipal
                    text="Alterar senha"
                    type="button"
                />


            </main>
        </>
    );
}