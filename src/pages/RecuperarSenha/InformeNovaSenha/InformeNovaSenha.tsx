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
import SuccessModal from "../../../components/SuccessModal/SucessesModal";


// HOOKS / REGRAS DE NEGÓCIO / VALIDAÇÕES
import { useState } from "react";

import { checkPasswordStrength } from "../../../hooks/passwordStrength";

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

    const [senhaErroState, setSenhaErroState] = useState({ active: false, shake: false })
    const [confirmErroState, setConfirmErroState] = useState({ active: false, shake: false })

    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const strengthResult = checkPasswordStrength(senha)

    const handleSubmit = () => {
        setSenhaErroState({ active: false, shake: false })
        setConfirmErroState({ active: false, shake: false })

        const result = validatePasswordForm(
            senha,
            confirmarSenha,
            strengthResult
        )

        switch (result.type) {
            case 'required':
                if (!senha) {
                    setSenhaErroState({ active: true, shake: true })
                }

                if (!confirmarSenha) {
                    setConfirmErroState({ active: true, shake: true })
                }

                setAlerta(PASSWORD_MESSAGES.REQUIRED)
                return

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

            case 'success':
                setSuccessModalOpen(true);
                return;
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

                <SuccessModal
                    open={successModalOpen}
                    title="Senha alterada!"
                    message="Sua senha foi alterada com sucesso. Entre na sua conta para continuar."
                    buttonText="Continuar"
                    onConfirm={() => {
                        setSuccessModalOpen(false);
                        navigate("login");
                    }}
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
                                onChange={e => {
                                    setSenha(e.target.value);
                                    if (senhaErroState.active) setSenhaErroState({ active: false, shake: false });
                                }}
                                status={senhaErroState.active ? 'erro' : ''}
                                error=""
                                shake={senhaErroState.shake}
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