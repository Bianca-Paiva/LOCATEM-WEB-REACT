import { useState, useEffect } from "react";
import styles from "./InformeToken.module.css"
import AuthHeader from "../../../components/Header/AuthHeader/AuthHeader";
import Etapas from "../../../components/RecuperarSenha/Etapas/Etapas";
import PageHeader from "../../../components/RecuperarSenha/PageHeader/PageHeader";
import TokenInput from '../../../components/RecuperarSenha/TokenInput/TokenInput'
import BtnPrincipal from "../../../components/BtnPrincipal/BtnPrincipal";
import type { Route } from "../../../router/useRouter";

interface InformeTokenProps {
    navigate: (route: Route) => void;
}

export default function InformeToken({ navigate }: InformeTokenProps) {

    const [token, setToken] = useState("");
    const [timeLeft, setTimeLeft] = useState(50);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Novo estado para a mensagem

    // Efeito que controla o relógio regressivo
    useEffect(() => {
        if (timeLeft === 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleVerifyToken = () => {
        const tokenCorreto = localStorage.getItem("codigo_recuperacao");

        // Validação 1: Faltam números
        if (token.length < 5) {
            setErrorMessage("Preencha todos os 5 dígitos do código.");
            setHasError(false);
            setTimeout(() => setHasError(true), 10);
            return;
        }

        // Validação 2: Código incorreto
        if (token !== tokenCorreto) {
            setErrorMessage("Código incorreto. Verifique e tente novamente.");
            setHasError(false);
            setTimeout(() => setHasError(true), 10);
            return;
        }

        // Sucesso
        setHasError(false);
        setErrorMessage(""); // Limpa a mensagem
        localStorage.removeItem("codigo_recuperacao");
        
        navigate('informeNovaSenha');
    };

    const handleResendCode = () => {
        // Gera um NOVO código de 5 dígitos
        const novoToken = Math.floor(10000 + Math.random() * 90000).toString();
        
        // Substitui o código antigo no armazenamento
        localStorage.setItem("codigo_recuperacao", novoToken);

        // Exibe no console
        console.log("=====================================");
        console.log("🔄 NOVO E-MAIL ENVIADO COM SUCESSO!");
        console.log(`Novo Código de verificação: ${novoToken}`);
        console.log("=====================================");

        // Reinicia o relógio e limpa os inputs
        setTimeLeft(50);
        setToken("");
        setHasError(false);
        setErrorMessage("");
    };

    return (
        <>
            <AuthHeader navigate={navigate} />

            <main className={styles.main}>
                <Etapas currentStep={2} />

                <PageHeader
                    title="Código de verificação"
                    subtitle="Insira o código de 5 dígitos que enviamos para o seu e-mail."
                />

                <div className={styles.tokenSection}>
                    <TokenInput
                        length={5}
                        value={token}
                        onChange={(newValue) => {
                            setToken(newValue);
                            if (hasError) setHasError(false);
                            if (errorMessage) setErrorMessage(""); // Limpa a mensagem ao digitar
                        }}
                        hasError={hasError}
                    />

                    {/* Exibe a mensagem de erro se ela existir */}
                    {errorMessage && (
                        <span className={styles.errorMessage}>{errorMessage}</span>
                    )}

                    <button
                        className={styles.reenviar}
                        onClick={handleResendCode}
                        disabled={timeLeft > 0} 
                    >
                        {timeLeft > 0
                            ? `Reenviar código em ${timeLeft}s`
                            : "Reenviar código"
                        }
                    </button>
                </div>

                <BtnPrincipal
                    text="Verificar código"
                    onClick={handleVerifyToken}
                />
            </main>
        </>
    );
}