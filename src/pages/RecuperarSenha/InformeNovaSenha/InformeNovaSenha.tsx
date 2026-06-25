// CSS DA PÁGINA
import styles from "./InformeNovaSenha.module.css";

// COMPONENTES 
import AuthHeader from "../../../components/Header/AuthHeader/AuthHeader";
import Etapas from "../../../components/RecuperarSenha/Etapas/Etapas";
import PageHeader from "../../../components/RecuperarSenha/PageHeader/PageHeader";
import PasswordField from "../../../components/PasswordInput/PasswordInput";
import BtnPrincipal from "../../../components/BtnPrincipal/BtnPrincipal";
import PasswordValidationList from "../../../components/RecuperarSenha/PasswordValidationList/PasswordValidationList";
import PasswordStrengthMeter from "../../../components/PasswordMedidor/PasswordStrengthMeter";
import Alerta from "../../../components/RecuperarSenha/Alerta/Alerta";


// HOOKS / REGRAS DE NEGÓCIO / VALIDAÇÕES
import { useState } from "react";

import { checkPasswordStrength } from "../../../hooks/usePasswordStrength";

import {
    getConfirmPasswordError,
    getConfirmPasswordStatus,
    getPasswordValidations,
    validatePasswordForm,
} from "../../../hooks/passwordValidation";

import { PASSWORD_MESSAGES } from "../../../hooks/passwordMessages";


// ROTAS 
import type { Route } from "../../../router/useRouter";

interface InformeNovaSenhaProps {
    navigate: (route: Route) => void;
}

export default function InformeNovaSenha({ navigate }: InformeNovaSenhaProps) {
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')

    // Estado para controlar se o alerta deve aparecer
    const [alerta, setAlerta] = useState<{ titulo: string, mensagem: string } | null>(null)

    const [senhaErrState, setSenhaErrState] = useState({ active: false, shake: false })
    const [confirmErrState, setConfirmErrState] = useState({ active: false, shake: false })

    const strengthResult = checkPasswordStrength(senha)

    const handleSubmit = () => {
        setSenhaErrState({ active: false, shake: false })
        setConfirmErrState({ active: false, shake: false })

        const result = validatePasswordForm(
            senha,
            confirmarSenha,
            strengthResult
        )

        switch (result.type) {
            case 'required':
                if (!senha) {
                    setSenhaErrState({ active: true, shake: true })
                }

                if (!confirmarSenha) {
                    setConfirmErrState({ active: true, shake: true })
                }

                setAlerta(PASSWORD_MESSAGES.REQUIRED)
                return

            case 'mismatch':
                setConfirmErrState({ active: true, shake: true })
                setAlerta(PASSWORD_MESSAGES.MISMATCH)
                return

            case 'fraca':
                setSenhaErrState({ active: true, shake: true })
                setAlerta(PASSWORD_MESSAGES.WEAK)
                return

            case 'media':
                setSenhaErrState({ active: true, shake: true })
                setAlerta(PASSWORD_MESSAGES.MEDIUM)
                return

            case 'success':
                console.log('Senha alterada com sucesso!')
                return
        }
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

                {alerta && (
                    <Alerta
                        titulo={alerta.titulo}
                        mensagem={alerta.mensagem}
                        onClose={() => setAlerta(null)}
                    />
                )}

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
                                onChange={e => {
                                    setSenha(e.target.value);
                                    if (senhaErrState.active) setSenhaErrState({ active: false, shake: false });
                                }}
                                status={senhaErrState.active ? 'erro' : ''}
                                error=""
                                shake={senhaErrState.shake}
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
                                onChange={e => {
                                    setConfirmarSenha(e.target.value);
                                    if (confirmErrState.active) setConfirmErrState({ active: false, shake: false });
                                }}
                                status={
                                    confirmErrState.active
                                        ? 'erro'
                                        : getConfirmPasswordStatus(senha, confirmarSenha)
                                }

                                error={
                                    confirmErrState.active
                                        ? ''
                                        : getConfirmPasswordError(senha, confirmarSenha)
                                }
                                shake={confirmErrState.shake}
                            />
                        </div>

                        {/* COLUNA DA DIREITA: Dicas de Segurança de Senha */}
                        <div className={styles.colunaDireita}>
                            <PasswordValidationList
                                title="Dicas de segurança"
                                items={getPasswordValidations(senha)}
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