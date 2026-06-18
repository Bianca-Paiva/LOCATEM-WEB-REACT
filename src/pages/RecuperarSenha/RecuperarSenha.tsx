import { useState } from 'react'
// import styles from './RecuperarSenha.module.css'
import AuthHeader from '../../components/Header/AuthHeader/AuthHeader'
import Etapas from '../../components/RecuperarSenha/Etapas/Etapas'
import PageHeader from '../../components/RecuperarSenha/PageHeader/PageHeader'
import FormInput from '../../components/FormInput/FormInput'
import BtnPrincipal from '../../components/BtnPrincipal/BtnPrincipal'
import FooterLink from '../../components/RecuperarSenha/FooterLink/FooterLink'

interface Props {
    navigate: (route: string) => void
}

export default function RecuperarSenha({ navigate }: Props) {

    const [email, setEmail] = useState('')

    return (
        <>
            <AuthHeader navigate={navigate} />

            <Etapas currentStep={1} />

            <PageHeader title='Informe seu E-mail' subtitle='Digite o e-mail associado à sua conta. Enviaremos um token para recuperação da senha.' />

            <FormInput
                id="email"
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />

            <BtnPrincipal text='Enviar' onClick={() => {}} /> 

            <FooterLink text='Precisa de ajuda?' linkText='Entre em contato com o suporte' onLinkClick={() => { }} />

            {/* ou */}

            <FooterLink text='Lembrou sua senha?' linkText='Entrar na minha conta' onLinkClick={() => {}}/>

            <FooterLink text='Ainda não tem conta?' linkText='Criar nova conta' onLinkClick={() => {}}/>
        </>
    );
}