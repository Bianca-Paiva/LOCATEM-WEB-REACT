import { Controller } from 'react-hook-form'
import styles from './CadastroUsuario.module.css'

import { maskCPF, maskCNPJ, maskPhone, maskCEP } from '../../hooks/Mascaras/masks'
import { getPasswordValidations, getConfirmPasswordStatus } from '../../hooks/Password/passwordValidation'
import { useCadastroForm } from '../../hooks/Cadastro/useCadastroForm'
import type { Route } from '../../router/useRouter'

import FormInput from '../../components/Inputs/FormInput/FormInput'
import PasswordInput from '../../components/Inputs/PasswordInput/PasswordInput'
import AuthHeader from '../../components/Header/AuthHeader/AuthHeader'
import PageHeader from '../../components/RecuperarSenha/PageHeader/PageHeader'
import CardOpcaoConta from '../../components/CardOpcaoConta/CardOpcaoConta'
import BtnPricipal from '../../components/BtnPrincipal/BtnPrincipal'
import FooterLink from '../../components/RecuperarSenha/FooterLink/FooterLink'
import PasswordStrengthMeter from '../../components/PasswordMedidor/PasswordStrengthMeter'
import PasswordValidationList from '../../components/RecuperarSenha/PasswordValidationList/PasswordValidationList'
import Alerta from "../../components/RecuperarSenha/Alerta/Alerta"
import SuccessModal from "../../components/SuccessModal/SucessesModal"


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
                        />

                        <CardOpcaoConta
                            id="locador" name="tipo" value="locador"
                            selected={tipo === "locador"} title="Locador"
                            description="Quero anunciar ferramentas" onChange={handleTipoChange}
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

                    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} noValidate>

                        <div className={styles.inputGroup}>

                            {/* CAMPO NOME */}
                            <Controller
                                control={control} name="nome"
                                render={({ field: { onChange, value } }) => (
                                    <FormInput
                                        // Usando o objeto inteiro na key para forçar o React a reiniciar a animação do zero a cada clique
                                        key={`nome-shake-${JSON.stringify(shakes.nome)}`}
                                        id="nome"
                                        label="Nome completo"
                                        type="text"
                                        placeholder="Digite seu nome completo"
                                        value={value}
                                        required
                                        shake={shakes.nome.shake}
                                        onBlur={() => trigger('nome')}
                                        onChange={(e) => { onChange(e.target.value); clearShake('nome'); }}
                                        // Fica vermelho fixo se houver erro ou se o shake estiver ativo
                                        status={errors.nome || shakes.nome.active ? 'erro' : touchedFields.nome ? 'sucesso' : ''}
                                        // Exibe a mensagem de erro direto do hook-form sem sumir textualmente
                                        error={errors.nome?.message || ''}
                                    />
                                )}
                            />

                            {/* CAMPO EMAIL */}
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value } }) => (
                                    <FormInput
                                        key={`email-shake-${JSON.stringify(shakes.email)}`}
                                        id="email"
                                        label="E-mail"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={value}
                                        required
                                        shake={shakes.email.shake}
                                        onChange={(e) => { onChange(e.target.value); clearShake('email'); }}
                                        onBlur={() => trigger('email')}
                                        status={errors.email || shakes.email.active ? 'erro' : touchedFields.email ? 'sucesso' : ''}
                                        error={errors.email?.message || ''}
                                    />
                                )}
                            />

                            {/* CAMPO TELEFONE */}
                            <Controller
                                control={control} name="telefone"
                                render={({ field: { onChange, value } }) => (
                                    <FormInput
                                        key={`tel-shake-${JSON.stringify(shakes.telefone)}`}
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
                                        status={errors.telefone || shakes.telefone.active ? 'erro' : touchedFields.telefone ? 'sucesso' : ''}
                                        error={errors.telefone?.message || ''}
                                    />
                                )}
                            />

                            <div className={styles.senhaGroup}>
                                {/* CAMPO SENHA */}
                                <Controller
                                    control={control} name="senha"
                                    render={({ field: { onChange, value } }) => (
                                        <PasswordInput
                                            key={`senha-shake-${JSON.stringify(shakes.senha)}`}
                                            id="senha" label="Senha" placeholder="Crie uma senha segura"
                                            value={value} required shake={shakes.senha.shake}
                                            onChange={(e) => { onChange(e.target.value); clearShake('senha'); }}
                                            status={errors.senha || shakes.senha.active ? 'erro' : ''}
                                            error={errors.senha?.message || ''}
                                        />
                                    )}
                                />

                                {senha.length > 0 && (
                                    <>
                                        <PasswordStrengthMeter strength={strengthResult.strength} visible={true} />
                                        <PasswordValidationList title="Dicas de segurança" items={getPasswordValidations(senha)} />
                                    </>
                                )}

                                {/* CAMPO CONFIRMAR SENHA */}
                                <Controller
                                    control={control} name="confirmarSenha"
                                    render={({ field: { onChange, value } }) => (
                                        <PasswordInput
                                            key={`confirmar-shake-${JSON.stringify(shakes.confirmarSenha)}`}
                                            id="confirmarSenha" label="Confirmar senha" placeholder="Digite a senha novamente"
                                            value={value} required shake={shakes.confirmarSenha.shake}
                                            onChange={(e) => { onChange(e.target.value); clearShake('confirmarSenha'); }}
                                            status={errors.confirmarSenha || shakes.confirmarSenha.active ? 'erro' : getConfirmPasswordStatus(senha, confirmarSenha)}
                                            error={errors.confirmarSenha?.message || ''}
                                        />
                                    )}
                                />


                                {/* CAMPO DOCUMENTO */}
                                <Controller
                                    control={control} name="documento"
                                    render={({ field: { onChange, value } }) => (
                                        <FormInput
                                            key={`doc-shake-${JSON.stringify(shakes.documento)}`}
                                            id="documento" label={isCNPJ ? 'CNPJ' : 'CPF'} type="text" inputMode="numeric"
                                            placeholder={isCNPJ ? '00.000.000/0000-00' : '000.000.000-00'}
                                            value={value} required shake={shakes.documento.shake}
                                            onBlur={() => trigger('documento')}
                                            onChange={(e) => { onChange(isCNPJ ? maskCNPJ(e.target.value) : maskCPF(e.target.value)); clearShake('documento'); }}
                                            status={errors.documento || shakes.documento.active ? 'erro' : touchedFields.documento ? 'sucesso' : ''}
                                            error={errors.documento?.message || ''}
                                        />
                                    )}
                                />
                            </div>

                            {/* CAMPO ENDEREÇO */}
                            <div className={styles.endereco}>
                                <p>Endereço</p>

                                <div className={styles.linhaCep}>
                                    <div className={styles.inputCep}>
                                        <Controller
                                            control={control} name="cep"
                                            render={({ field: { onChange, value } }) => (
                                                <FormInput
                                                    key={`cep-shake-${JSON.stringify(shakes.cep)}`}
                                                    id="cep"
                                                    label="CEP"
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={value}
                                                    placeholder="00000-000"
                                                    required
                                                    shake={shakes.cep.shake}
                                                    onBlur={() => trigger('cep')}
                                                    onChange={(e) => { onChange(maskCEP(e.target.value)); clearShake('cep'); }}
                                                    status={errors.cep || shakes.cep.active ? 'erro' : touchedFields.cep ? 'sucesso' : ''}
                                                    error={errors.cep?.message || ''}
                                                />
                                            )}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.btnNaoSeiCep}

                                        // API do Correio para buscar um cep
                                        onClick={() => window.open('https://buscacepinter.correios.com.br/app/endereco/index.php', '_blank')}
                                    >
                                        Não sei meu CEP
                                    </button>
                                </div>

                                <div className={styles.linhaRuaNumero}>
                                    <div className={styles.inputRua}>
                                        <Controller
                                            control={control} name="logradouro"
                                            render={({ field: { onChange, value } }) => (
                                                <FormInput
                                                    key={`logradouro-shake-${JSON.stringify(shakes.logradouro)}`}
                                                    id="logradouro"
                                                    label="Rua/Logradouro"
                                                    type="text"
                                                    value={value}
                                                    placeholder="Ex: Avenida Paulista"
                                                    required
                                                    shake={shakes.logradouro.shake}
                                                    onBlur={() => trigger('logradouro')}
                                                    onChange={(e) => { onChange(e.target.value); clearShake('logradouro'); }}
                                                    status={errors.logradouro || shakes.logradouro.active ? 'erro' : touchedFields.logradouro ? 'sucesso' : ''}
                                                    error={errors.logradouro?.message || ''}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className={styles.inputNumero}>
                                        <Controller
                                            control={control} name="numero"
                                            render={({ field: { onChange, value } }) => (
                                                <FormInput
                                                    key={`numero-shake-${JSON.stringify(shakes.numero)}`}
                                                    id="numero"
                                                    label="Número"
                                                    type="text"
                                                    value={value}
                                                    placeholder="Ex: 123"
                                                    required
                                                    shake={shakes.numero.shake}
                                                    onBlur={() => trigger('numero')}
                                                    onChange={(e) => { onChange(e.target.value); clearShake('numero'); }}
                                                    status={errors.numero || shakes.numero.active ? 'erro' : touchedFields.numero ? 'sucesso' : ''}
                                                    error={errors.numero?.message || ''}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

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