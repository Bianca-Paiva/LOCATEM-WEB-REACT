import { Controller } from 'react-hook-form'
import styles from './Cadastro.module.css'

import { maskCPF, maskCNPJ, maskPhone } from '../../hooks/masks'
import { getPasswordValidations, getConfirmPasswordStatus } from '../../hooks/passwordValidation'
import { useCadastroForm } from '../../hooks/implementaçãoBibliotecas/useCadastroForm'
import type { Route } from '../../router/useRouter'

import FormInput from '../../components/FormInput/FormInput'
import PasswordInput from '../../components/PasswordInput/PasswordInput'
import AuthHeader from '../../components/Header/AuthHeader/AuthHeader'
import PageHeader from '../../components/RecuperarSenha/PageHeader/PageHeader'
import CardOpcaoConta from '../../components/CardOpcaoConta/CardOpcaoConta'
import BtnPricipal from '../../components/BtnPrincipal/BtnPrincipal'
import FooterLink from '../../components/RecuperarSenha/FooterLink/FooterLink'
import PasswordStrengthMeter from '../../components/PasswordMedidor/PasswordStrengthMeter'
import PasswordValidationList from '../../components/RecuperarSenha/PasswordValidationList/PasswordValidationList'
import Alerta from "../../components/RecuperarSenha/Alerta/Alerta"
import SuccessModal from "../../components/SuccessModal/SucessesModal"

import IconLocatario from '../../assets/IconLocatario.svg'
import IconLocador from '../../assets/IconLocador.svg'

interface CadastroProps { navigate: (route: Route) => void }

export default function Cadastro({ navigate }: CadastroProps) {

    const {
        control, tipo, senha, confirmarSenha, isCNPJ, strengthResult,
        alerta, setAlerta, successModalOpen, setSuccessModalOpen, shakes, clearShake,
        touchedFields, errors, trigger, handleTipoChange, onSubmit
    } = useCadastroForm()

    return (
        <div>
            <AuthHeader navigate={navigate} />

            <main>
                <PageHeader title="Crie sua conta" subtitle="Escolha como você deseja usar o site" />

                <div className={styles.card}>
                    <div className={styles.tipoConta}>
                        <CardOpcaoConta
                            id="locatario" name="tipo" value="locatario"
                            selected={tipo === "locatario"} title="Locatário"
                            description="Quero alugar ferramentas" onChange={handleTipoChange}
                            icon={<img src={IconLocatario} alt="Icone Locatário" />}
                        />

                        <CardOpcaoConta
                            id="locador" name="tipo" value="locador"
                            selected={tipo === "locador"} title="Locador"
                            description="Quero anunciar ferramentas" onChange={handleTipoChange}
                            icon={<img src={IconLocador} alt="Icone Locador" />}
                        />
                    </div>

                    {alerta && (
                        <Alerta titulo={alerta.titulo} mensagem={alerta.mensagem} onClose={() => setAlerta(null)} />
                    )}

                    <SuccessModal
                        open={successModalOpen}
                        title="Conta criada!"
                        message="Sua conta foi criada com sucesso. Entre para continuar."
                        buttonText="Entrar"
                        onConfirm={() => {
                            setSuccessModalOpen(false);
                            navigate("login");
                        }}
                    />

                    {/* O noValidate impede que o balão nativo do navegador bloqueie suas animações */}
                    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} noValidate>

                        {/* CAMPO NOME */}
                        <Controller
                            control={control} name="nome"
                            render={({ field: { onChange, value } }) => (
                                <FormInput
                                    key={`nome-shake-${shakes.nome.shake}`} // <-- Força re-render da animação do CSS
                                    id="nome"
                                    label="Nome completo"
                                    type="text"
                                    placeholder="Digite seu nome completo"
                                    value={value}
                                    required
                                    shake={shakes.nome.shake}
                                    onBlur={() => trigger('nome')}
                                    onChange={(e) => { onChange(e.target.value); clearShake('nome'); }}
                                    status={shakes.nome.active ? 'erro' : touchedFields.nome ? (errors.nome ? 'erro' : 'sucesso') : ''}
                                    error={shakes.nome.active ? '' : errors.nome?.message}
                                />
                            )}
                        />

                        {/* CAMPO EMAIL */}
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <FormInput
                                    key={`email-shake-${shakes.email.shake}`} // <-- Força re-render da animação do CSS
                                    id="email"
                                    label="E-mail"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={value}
                                    required
                                    shake={shakes.email.shake}
                                    onChange={(e) => {
                                        onChange(e.target.value);
                                        clearShake('email');
                                    }}
                                    onBlur={() => trigger('email')}
                                    status={shakes.email.active ? 'erro' : touchedFields.email ? (errors.email ? 'erro' : 'sucesso') : ''}
                                    error={shakes.email.active ? '' : errors.email?.message}
                                />
                            )}
                        />

                        {/* CAMPO TELEFONE */}
                        <Controller
                            control={control} name="telefone"
                            render={({ field: { onChange, value } }) => (
                                <FormInput
                                    key={`tel-shake-${shakes.telefone.shake}`} // <-- Força re-render da animação do CSS
                                    id="telefone"
                                    label="Telefone"
                                    type="tel"
                                    inputMode="numeric"
                                    placeholder="(11) 91234-5678"
                                    value={value}
                                    required
                                    shake={shakes.telefone.shake}
                                    onBlur={() => trigger('telefone')}
                                    onChange={(e) => { onChange(maskPhone(e.target.value)); clearShake('telefone'); }}
                                    status={shakes.telefone.active ? 'erro' : touchedFields.telefone ? (errors.telefone ? 'erro' : 'sucesso') : ''}
                                    error={shakes.telefone.active ? '' : errors.telefone?.message}
                                />
                            )}
                        />

                        {/* CAMPO SENHA */}
                        <Controller
                            control={control} name="senha"
                            render={({ field: { onChange, value } }) => (
                                <PasswordInput
                                    key={`senha-shake-${shakes.senha.shake}`} // <-- Força re-render da animação do CSS
                                    id="senha" label="Senha" placeholder="Crie uma senha segura"
                                    value={value} required shake={shakes.senha.shake}
                                    onChange={(e) => { onChange(e.target.value); clearShake('senha'); }}
                                    status={shakes.senha.active ? 'erro' : ''} error=""
                                />
                            )}
                        />

                        <PasswordStrengthMeter strength={strengthResult.strength} visible={senha.length > 0} />

                        {senha.length > 0 && (
                            <PasswordValidationList title="Dicas de segurança" items={getPasswordValidations(senha)} />
                        )}

                        {/* CAMPO CONFIRMAR SENHA */}
                        <Controller
                            control={control} name="confirmarSenha"
                            render={({ field: { onChange, value } }) => (
                                <PasswordInput
                                    key={`confirmar-shake-${shakes.confirmarSenha.shake}`} // <-- Força re-render da animação do CSS
                                    id="confirmarSenha" label="Confirmar senha" placeholder="Digite a senha novamente"
                                    value={value} required shake={shakes.confirmarSenha.shake}
                                    onChange={(e) => { onChange(e.target.value); clearShake('confirmarSenha'); }}
                                    status={shakes.confirmarSenha.active ? 'erro' : getConfirmPasswordStatus(senha, confirmarSenha)}
                                    error={shakes.confirmarSenha.active ? '' : errors.confirmarSenha?.message}
                                />
                            )}
                        />

                        {/* CAMPO DOCUMENTO */}
                        <Controller
                            control={control} name="documento"
                            render={({ field: { onChange, value } }) => (
                                <FormInput
                                    key={`doc-shake-${shakes.documento.shake}`} // <-- Força re-render da animação do CSS
                                    id="documento" label={isCNPJ ? 'CNPJ' : 'CPF'} type="text" inputMode="numeric"
                                    placeholder={isCNPJ ? '00.000.000/0000-00' : '000.000.000-00'}
                                    value={value} required shake={shakes.documento.shake}
                                    onBlur={() => trigger('documento')}
                                    onChange={(e) => { onChange(isCNPJ ? maskCNPJ(e.target.value) : maskCPF(e.target.value)); clearShake('documento'); }}
                                    status={shakes.documento.active ? 'erro' : touchedFields.documento ? (errors.documento ? 'erro' : 'sucesso') : ''}
                                    error={shakes.documento.active ? '' : errors.documento?.message}
                                />
                            )}
                        />

                        {/* CAMPO ENDEREÇO */}
                        <Controller
                            control={control} name="endereco"
                            render={({ field: { onChange, value } }) => (
                                <FormInput
                                    key={`endereco-shake-${shakes.endereco.shake}`} // <-- Força re-render da animação do CSS
                                    id="endereco" label="Endereço" type="text" placeholder="Digite seu endereço completo"
                                    value={value} required shake={shakes.endereco.shake}
                                    onChange={(e) => { onChange(e.target.value); clearShake('endereco'); }}
                                    status={shakes.endereco.active ? 'erro' : ''} error=""
                                />
                            )}
                        />

                        <BtnPricipal text="Criar conta" type="submit" />

                    </form>
                </div>

                <FooterLink
                    text='Já tem uma conta?' linkText='Entrar'
                    onClick={e => { e.preventDefault(); navigate('login'); }}
                />

            </main>
        </div>
    );
}