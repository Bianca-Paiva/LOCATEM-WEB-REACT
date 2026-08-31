import FormInput from '../../Inputs/FormInput/FormInput';
import FormTextarea from '../../Inputs/FormTextarea/FormTextarea';
import { maskCEP, maskPhone } from '../../../hooks/masks';
import type { SolicitarLocacaoFormState } from '../../../pages/Locacoes/SolicitarLocacao/SolicitarLocacao.types';
import styles from './EnderecoEntrega.module.css';

/** Chaves do form relacionadas a este bloco (endereço + contato) */
type CampoEndereco =
    | 'cep'
    | 'cepDesconhecido'
    | 'ruaAvenida'
    | 'numero'
    | 'complemento'
    | 'nomeCompleto'
    | 'telefoneContato';

interface ErrosEndereco {
    cep?: string;
    ruaAvenida?: string;
    numero?: string;
    nomeCompleto?: string;
    telefoneContato?: string;
}

interface EnderecoEntregaProps {
    form: Pick<SolicitarLocacaoFormState, CampoEndereco>;
    onChangeCampo: <K extends CampoEndereco>(campo: K, valor: SolicitarLocacaoFormState[K]) => void;
    erros: ErrosEndereco;
    shake: boolean;
}

export default function EnderecoEntrega({
    form,
    onChangeCampo,
    erros,
    shake,
}: EnderecoEntregaProps) {
    const { cep, cepDesconhecido, ruaAvenida, numero, complemento, nomeCompleto, telefoneContato } = form;

    return (
        <section className={styles.card}>
            <h2 className={styles.titulo}>Endereço de entrega e devolução</h2>

            <div className={styles.linhaCep}>
                <div className={styles.campoCep}>
                    <FormInput
                        id="cep"
                        label="CEP"
                        placeholder="00000-000"
                        inputMode="numeric"
                        value={cep}
                        disabled={cepDesconhecido}
                        required={!cepDesconhecido}
                        error={erros.cep}
                        status={erros.cep ? 'erro' : ''}
                        shake={shake && Boolean(erros.cep)}
                        onChange={(e) => onChangeCampo('cep', maskCEP(e.target.value))}
                    />
                </div>

                <button
                    type="button"
                    className={styles.linkCepDesconhecido}
                    onClick={() => {
                        // Alerta nativo
                        alert('Funcionalidade em desenvolvimento.');
                    }}
                >
                    {cepDesconhecido ? 'Informar meu CEP' : 'Não sei meu CEP'}
                </button>
            </div>

            <div className={styles.linhaRuaNumero}>
                <FormInput
                    id="ruaAvenida"
                    label="Rua / Avenida"
                    placeholder="Ex.: Avenida los Leones"
                    value={ruaAvenida}
                    required
                    error={erros.ruaAvenida}
                    status={erros.ruaAvenida ? 'erro' : ''}
                    shake={shake && Boolean(erros.ruaAvenida)}
                    onChange={(e) => onChangeCampo('ruaAvenida', e.target.value)}
                />

                <FormInput
                    id="numero"
                    label="Número"
                    placeholder="Ex.: 1234"
                    value={numero}
                    required
                    error={erros.numero}
                    status={erros.numero ? 'erro' : ''}
                    shake={shake && Boolean(erros.numero)}
                    onChange={(e) => onChangeCampo('numero', e.target.value)}
                />
            </div>

            <FormTextarea
                id="complemento"
                label="Complemento (opcional)"
                placeholder="Apartamento, bloco, referência..."
                value={complemento}
                onChange={(e) => onChangeCampo('complemento', e.target.value)}
            />

            <div className={styles.dadosContato}>
                <h3 className={styles.subtitulo}>Dados de contato</h3>
                <p className={styles.descricaoContato}>
                    Se houver algum problema na entrega e/ou devolução, você receberá uma ligação neste número.
                </p>
            </div>

            <FormInput
                id="nomeCompleto"
                label="Nome Completo"
                placeholder="Digite seu nome"
                value={nomeCompleto}
                required
                error={erros.nomeCompleto}
                status={erros.nomeCompleto ? 'erro' : ''}
                shake={shake && Boolean(erros.nomeCompleto)}
                onChange={(e) => onChangeCampo('nomeCompleto', e.target.value)}
            />

            <FormInput
                id="telefoneContato"
                label="Telefone de contato"
                placeholder="(00) 00000-0000"
                inputMode="tel"
                value={telefoneContato}
                required
                error={erros.telefoneContato}
                status={erros.telefoneContato ? 'erro' : ''}
                shake={shake && Boolean(erros.telefoneContato)}
                onChange={(e) => onChangeCampo('telefoneContato', maskPhone(e.target.value))}
            />
        </section>
    );
}
