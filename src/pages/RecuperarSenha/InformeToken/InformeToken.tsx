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

    // Efeito que controla o relógio regressivo
    useEffect(() => {
        // Se o tempo chegou a 0, não faz mais nada
        if (timeLeft === 0) return;

        // Cria um cronômetro que roda a cada 1 segundo (1000ms)
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        // Limpa o cronômetro da memória se o usuário sair da tela ou o tempo mudar
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleVerifyToken = () => {
        if (token.length < 5) {
            // Se já estava com erro, desliga e liga rápido para resetar a animação e chacoalhar de novo
            setHasError(false);
            setTimeout(() => setHasError(true), 10);
            return;
        }

        setHasError(false);
        console.log("Token enviado para validação:", token);
        // Lógica para avançar para a rota de criar nova senha
    };

    // Função disparada ao clicar para reenviar
    const handleResendCode = () => {
        console.log("Chamando API para reenviar e-mail...");

        // Aqui vai a requisição para o Back-end.
        // Após o sucesso dela, reiniciamos o contador:
        setTimeLeft(50);
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
                        /* Atualiza o valor e remove o erro assim que o usuário digita */
                        onChange={(newValue) => {
                            setToken(newValue);
                            if (hasError) setHasError(false);
                        }}
                        hasError={hasError} // Passa o estado do erro para o componente
                    />

                    <button
                        className={styles.reenviar}
                        onClick={handleResendCode}
                        disabled={timeLeft > 0} // Fica bloqueado enquanto timeLeft for maior que 0
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
