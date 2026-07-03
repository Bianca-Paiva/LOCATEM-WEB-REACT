import { useState } from "react";
import styles from "./InformeEmail.module.css";
import AuthHeader from "../../../components/Header/AuthHeader/AuthHeader";
import Etapas from "../../../components/RecuperarSenha/Etapas/Etapas";
import PageHeader from "../../../components/RecuperarSenha/PageHeader/PageHeader";
import FormInput from "../../../components/FormInput/FormInput";
import BtnPrincipal from "../../../components/BtnPrincipal/BtnPrincipal";
import FooterLink from "../../../components/RecuperarSenha/FooterLink/FooterLink";
import type { Route } from "../../../router/useRouter";

interface RecuperarSenhaProps {
    navigate: (route: Route) => void;
}

export default function RecuperarSenha({ navigate }: RecuperarSenhaProps) {
    const [email, setEmail] = useState("");
    const [showError, setShowError] = useState(false);

    // Função que valida o formato do e-mail
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Função executada ao clicar no botão Enviar
    const handleSendEmail = () => {
        if (!validateEmail(email)) {
            setShowError(true); // Ativa o erro no input
            return;
        }

        // Se passou na validação:
        setShowError(false);

        // Redireciona o usuário para a tela do token
        navigate("informeToken");
    };

    return (
        <>
            <AuthHeader navigate={navigate} />

            <main className={styles.main}>
                <Etapas currentStep={1} />

                <PageHeader
                    title="Informe seu e-mail"
                    subtitle="Digite o e-mail associado à sua conta. Enviaremos um token para recuperação da senha."
                />

                <div className={styles.btnInput}>
                    <FormInput
                        id="email"
                        label="E-mail"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (showError) setShowError(false); // Limpa o erro ao digitar
                        }}
                        required
                        status={showError ? "erro" : ""} // Fica vermelho se houver erro
                        error={
                            showError ? "Preencha de forma correta para continuar" : undefined
                        } // Mostra o texto do erro
                    />

                    <BtnPrincipal
                        text="Enviar e-mail"
                        onClick={handleSendEmail}
                        type="button"
                    />
                </div>

                {/* CONTAINER DO RODAPÉ */}
                <div className={styles.footerLinksContainer}>
                    <FooterLink
                        text="Precisa de ajuda?"
                        linkText="Entre em contato com o suporte."
                        onClick={() => {
                            alert("Esta funcionalidade está em desenvolvimento.");
                        }}
                    />

                    {/* Linha divisória com o "ou" */}
                    <div className={styles.divider}>ou</div>

                    {/* Links inferiores lado a lado */}
                    <div className={styles.bottomLinks}>
                        <FooterLink
                            text="Lembrou sua senha?"
                            linkText="Entrar na minha conta"
                            onClick={() => navigate("login")}
                        />

                        <span className={styles.bullet}>•</span>

                        <FooterLink
                            text="Ainda não tem conta?"
                            linkText="Criar nova conta"
                            onClick={() => navigate("cadastro")}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
