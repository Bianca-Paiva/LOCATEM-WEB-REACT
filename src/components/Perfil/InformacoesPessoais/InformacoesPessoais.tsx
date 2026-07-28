import { Pencil, User, CreditCard, Mail, Phone, Home, Check, X } from 'lucide-react';
import type { PerfilUsuario, InfoPessoalEditavel } from '../../../types/perfil.types';
import FormInput from '../../Inputs/FormInput/FormInput';
import styles from './InformacoesPessoais.module.css';

interface InformacoesPessoaisProps {
    usuario: PerfilUsuario;
    modoEdicao: boolean;
    form: InfoPessoalEditavel;
    onIniciarEdicao: () => void;
    onCancelarEdicao: () => void;
    onSalvarEdicao: () => void;
    onChangeCampo: (campo: keyof InfoPessoalEditavel, valor: string) => void;
}

export default function InformacoesPessoais({
    usuario,
    modoEdicao,
    form,
    onIniciarEdicao,
    onCancelarEdicao,
    onSalvarEdicao,
    onChangeCampo,
}: InformacoesPessoaisProps) {
    const ehLocatario = usuario.tipo === 'locatario';
    const documentoAtual = ehLocatario ? usuario.cpf : usuario.cnpj;

    return (
        <div className={styles.card}>
            <div className={styles.cabecalho}>
                <h2 className={styles.titulo}>Informações Pessoais</h2>

                {!modoEdicao ? (
                    <button
                        type="button"
                        className={styles.btnIcone}
                        onClick={onIniciarEdicao}
                        aria-label="Editar informações pessoais"
                    >
                        <Pencil size={15} />
                    </button>
                ) : (
                    <div className={styles.acoesEdicao}>
                        <button
                            type="button"
                            className={`${styles.btnIcone} ${styles.btnSalvar}`}
                            onClick={onSalvarEdicao}
                            aria-label="Salvar alterações"
                        >
                            <Check size={15} />
                        </button>
                        <button
                            type="button"
                            className={`${styles.btnIcone} ${styles.btnCancelar}`}
                            onClick={onCancelarEdicao}
                            aria-label="Cancelar edição"
                        >
                            <X size={15} />
                        </button>
                    </div>
                )}
            </div>

            {!modoEdicao ? (
                <dl className={styles.lista}>
                    <div className={styles.item}>
                        <span className={styles.icone}><User size={16} /></span>
                        <div className={styles.itemTexto}>
                            <dt>NOME COMPLETO</dt>
                            <dd>{usuario.nome}</dd>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <span className={styles.icone}><CreditCard size={16} /></span>
                        <div className={styles.itemTexto}>
                            <dt>{ehLocatario ? 'CPF' : 'CNPJ'}</dt>
                            <dd>{documentoAtual}</dd>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <span className={styles.icone}><Mail size={16} /></span>
                        <div className={styles.itemTexto}>
                            <dt>E-MAIL</dt>
                            <dd>{usuario.email}</dd>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <span className={styles.icone}><Phone size={16} /></span>
                        <div className={styles.itemTexto}>
                            <dt>TELEFONE</dt>
                            <dd>{usuario.telefone}</dd>
                        </div>
                    </div>

                    <div className={`${styles.item} ${styles.semBorda}`}>
                        <span className={styles.icone}><Home size={16} /></span>
                        <div className={styles.itemTexto}>
                            <dt>ENDEREÇO PRINCIPAL</dt>
                            <dd>{usuario.enderecoLinha1}</dd>
                            <dd>{usuario.enderecoLinha2}</dd>
                        </div>
                    </div>
                </dl>
            ) : (
                <div className={styles.formEdicao}>
                    <FormInput
                        id="perfil-nome"
                        label="Nome completo"
                        value={form.nome}
                        onChange={(e) => onChangeCampo('nome', e.target.value)}
                    />
                    <FormInput
                        id="perfil-documento"
                        label={ehLocatario ? 'CPF' : 'CNPJ'}
                        value={form.documento}
                        onChange={(e) => onChangeCampo('documento', e.target.value)}
                    />
                    <FormInput
                        id="perfil-email"
                        label="E-mail"
                        type="email"
                        value={form.email}
                        onChange={(e) => onChangeCampo('email', e.target.value)}
                    />
                    <FormInput
                        id="perfil-telefone"
                        label="Telefone"
                        value={form.telefone}
                        onChange={(e) => onChangeCampo('telefone', e.target.value)}
                    />
                    <FormInput
                        id="perfil-endereco1"
                        label="Endereço"
                        value={form.enderecoLinha1}
                        onChange={(e) => onChangeCampo('enderecoLinha1', e.target.value)}
                    />
                    <FormInput
                        id="perfil-endereco2"
                        label="Cidade / CEP"
                        value={form.enderecoLinha2}
                        onChange={(e) => onChangeCampo('enderecoLinha2', e.target.value)}
                    />
                </div>
            )}
        </div>
    );
}
