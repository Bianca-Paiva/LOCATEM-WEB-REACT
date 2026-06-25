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

    const confirmError = (): string => {
        if (!confirmarSenha) return ''

        // Prioridade: se não for igual, avisa. Se for igual mas fraca, avisa.
        if (!senhasIguais) return 'As senhas não coincidem'
        if (!strengthResult.isStrong) return 'A senha precisa ser mais forte'

        return ''
    }

    const confirmStatus = (): 'erro' | 'sucesso' | '' => {
        if (!confirmarSenha) return ''
        // Retorna erro se não forem iguais OU se a senha for fraca
        return (senhasIguais && strengthResult.isStrong) ? 'sucesso' : 'erro'
    }

    const getValidations = () => {
        return [
            { label: 'Pelo menos 8 caracteres', valid: senha.length >= 8 },
            { label: 'Pelo menos uma letra maiúscula', valid: /[A-Z]/.test(senha) },
            { label: 'Pelo menos uma letra minúscula', valid: /[a-z]/.test(senha) },
            { label: 'Pelo menos um número', valid: /\d/.test(senha) },
            { label: 'Pelo menos um caractere especial', valid: /[!@#$%^&*(),.?":{}|<>]/.test(senha) },
        ];
    };

    const handleSubmit = () => {
        // 1. Verifica se a senha é forte
        if (!strengthResult.isStrong) {
            alert("A senha precisa ser mais forte. Verifique os critérios de segurança.");
            return;
        }

        // 2. Verifica se as senhas coincidem
        if (!senhasIguais) {
            alert("As senhas não coincidem.");
            return;
        }

        // 3. Se passou nas validações, prossegue
        console.log("Senha alterada com sucesso!");
        // navigate('/proxima-tela'); 
    };

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
                            />

                            <PasswordStrengthMeter
                                strength={strengthResult.strength}
                                visible={senha.length > 0}
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
                                items={getValidations()}
                            />
                        </div>
                    </div>

                    <BtnPrincipal
                        text="Alterar senha"
                        type="button"
                        onClick={handleSubmit}
                    />
                </form>
            </main>
        </>
    );
}