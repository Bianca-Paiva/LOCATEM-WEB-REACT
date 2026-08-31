import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { X, Camera } from 'lucide-react';
import Avatar from '../../Avatar/Avatar';
import FormInput from '../../Inputs/FormInput/FormInput';
import BtnPrincipal from '../../BtnPrincipal/BtnPrincipal';
import Alerta from '../../RecuperarSenha/Alerta/Alerta';
import { maskCPF, maskCNPJ, maskPhone, maskCEP, formatPhone } from '../../../hooks/masks';
import { useEditarPerfilForm } from '../../../hooks/Perfil/useEditarPerfilForm';
import type { PerfilFormData } from '../../../hooks/Perfil/perfilSchema';
import type { Usuario } from '../../../types/usuario.types';
import styles from './EditarPerfilModal.module.css';

interface EditarPerfilModalProps {
  usuario: Usuario;
  onClose: () => void;
  onSalvar: (dados: Partial<Usuario>) => void;
}

export default function EditarPerfilModal({ usuario, onClose, onSalvar }: EditarPerfilModalProps) {
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(usuario.fotoUrl);

  const {
    control, isCNPJ, alerta, setAlerta, shakes, clearShake,
    touchedFields, errors, trigger, buildSubmit
  } = useEditarPerfilForm(usuario);

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) setFotoUrl(URL.createObjectURL(arquivo));
  };

  const onValidSubmit = (data: PerfilFormData) => {
    const enderecoCompleto = `${data.logradouro}, ${data.numero} - CEP: ${data.cep}`;
    onSalvar({
      nome: data.nome,
      telefone: data.telefone,
      documento: data.documento,
      endereco: enderecoCompleto,
      fotoUrl,
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.cabecalho}>
          <h2 className={styles.titulo}>Editar Perfil</h2>
          <button type="button" className={styles.btnFechar} onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className={styles.fotoWrapper}>
          <Avatar nome={usuario.nome} fotoUrl={fotoUrl} size={72} />
          <label className={styles.btnFoto}>
            <Camera size={14} />
            Alterar foto
            <input type="file" accept="image/*" onChange={handleFotoChange} hidden />
          </label>
        </div>

        {alerta && (
          <Alerta titulo={alerta.titulo} mensagem={alerta.mensagem} onClose={() => setAlerta(null)} />
        )}

        <form className={styles.inputs} onSubmit={(e) => { e.preventDefault(); buildSubmit(onValidSubmit)(); }} noValidate>
          {/* CAMPO NOME */}
          <Controller
            control={control} name="nome"
            render={({ field: { onChange, value } }) => (
              <FormInput
                key={`nome-shake-${JSON.stringify(shakes.nome)}`}
                id="perfil-nome"
                label="Nome completo"
                type="text"
                placeholder="Ex: João da Silva"
                value={value}
                required
                shake={shakes.nome.shake}
                onBlur={() => trigger('nome')}
                onChange={(e) => { onChange(e.target.value); clearShake('nome'); }}
                status={errors.nome || shakes.nome.active ? 'erro' : touchedFields.nome ? 'sucesso' : ''}
                error={errors.nome?.message || ''}
              />
            )}
          />

          {/* CAMPO TELEFONE */}
          <Controller
            control={control} name="telefone"
            render={({ field: { onChange, value } }) => (
              <FormInput
                key={`telefone-shake-${JSON.stringify(shakes.telefone)}`}
                id="perfil-telefone"
                label="Telefone"
                type="tel"
                inputMode="numeric"
                placeholder="(00) 00000-0000"
                value={value}
                required
                shake={shakes.telefone.shake}
                onBlur={() => { onChange(formatPhone(value)); trigger('telefone'); }}
                onChange={(e) => { onChange(maskPhone(e.target.value)); clearShake('telefone'); }}
                status={errors.telefone || shakes.telefone.active ? 'erro' : touchedFields.telefone ? 'sucesso' : ''}
                error={errors.telefone?.message || ''}
              />
            )}
          />

          {/* CAMPO DOCUMENTO */}
          <Controller
            control={control} name="documento"
            render={({ field: { onChange, value } }) => (
              <FormInput
                key={`documento-shake-${JSON.stringify(shakes.documento)}`}
                id="perfil-documento"
                label={isCNPJ ? 'CNPJ' : 'CPF'}
                type="text"
                inputMode="numeric"
                placeholder={isCNPJ ? '00.000.000/0000-00' : '000.000.000-00'}
                value={value}
                required
                shake={shakes.documento.shake}
                onBlur={() => trigger('documento')}
                onChange={(e) => { onChange(isCNPJ ? maskCNPJ(e.target.value) : maskCPF(e.target.value)); clearShake('documento'); }}
                status={errors.documento || shakes.documento.active ? 'erro' : touchedFields.documento ? 'sucesso' : ''}
                error={errors.documento?.message || ''}
              />
            )}
          />

          <div className={styles.endereco}>
            <p>Endereço</p>

            <div className={styles.linhaCep}>
              <div className={styles.inputCep}>
                <Controller
                  control={control} name="cep"
                  render={({ field: { onChange, value } }) => (
                    <FormInput
                      key={`cep-shake-${JSON.stringify(shakes.cep)}`}
                      id="perfil-cep"
                      label="Cep"
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
                      id="perfil-logradouro"
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
                      id="perfil-numero"
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

          <BtnPrincipal text="Salvar alterações" type="submit" />
        </form>
      </div>
    </div>
  );
}