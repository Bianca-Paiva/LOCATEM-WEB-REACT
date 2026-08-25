import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { X, Camera } from 'lucide-react';
import Avatar from '../../Avatar/Avatar';
import FormInput from '../../Inputs/FormInput/FormInput';
import BtnPrincipal from '../../BtnPrincipal/BtnPrincipal';
import { maskCPF, maskCNPJ, maskPhone } from '../../../hooks/masks';
import type { Usuario } from '../../../types/usuario.types';
import styles from './EditarPerfilModal.module.css';

interface EditarPerfilModalProps {
  usuario: Usuario;
  onClose: () => void;
  onSalvar: (dados: Partial<Usuario>) => void;
}

/**
 * Modal de edição das Informações Pessoais + foto do perfil.
 *
 * Não existe endpoint de upload no projeto ainda, então a foto escolhida vira uma
 * object URL local (só pra pré-visualização em tela) — nada é enviado a um backend
 * inexistente, mas dá pra testar de verdade o cenário "usuário com foto" pedido na
 * checklist de QA da tarefa.
 */
export default function EditarPerfilModal({ usuario, onClose, onSalvar }: EditarPerfilModalProps) {
  const [nome, setNome] = useState(usuario.nome);
  const [telefone, setTelefone] = useState(usuario.telefone);
  const [documento, setDocumento] = useState(usuario.documento);
  const [endereco, setEndereco] = useState(usuario.endereco);
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(usuario.fotoUrl);

  // Ressincroniza o formulário com o usuário atual toda vez que o modal abre.
  const isCNPJ = usuario.tipo === 'locador';

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) setFotoUrl(URL.createObjectURL(arquivo));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSalvar({ nome, telefone, documento, endereco, fotoUrl });
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
          <Avatar nome={nome || usuario.nome} fotoUrl={fotoUrl} size={72} />
          <label className={styles.btnFoto}>
            <Camera size={14} />
            Alterar foto
            <input type="file" accept="image/*" onChange={handleFotoChange} hidden />
          </label>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            id="perfil-nome"
            label="Nome completo"
            type="text"
            value={nome}
            required
            onChange={(e) => setNome(e.target.value)}
          />

          <FormInput
            id="perfil-telefone"
            label="Telefone"
            type="tel"
            inputMode="numeric"
            value={telefone}
            required
            onChange={(e) => setTelefone(maskPhone(e.target.value))}
          />

          <FormInput
            id="perfil-documento"
            label={isCNPJ ? 'CNPJ' : 'CPF'}
            type="text"
            inputMode="numeric"
            value={documento}
            required
            onChange={(e) => setDocumento(isCNPJ ? maskCNPJ(e.target.value) : maskCPF(e.target.value))}
          />

          <FormInput
            id="perfil-endereco"
            label="Endereço"
            type="text"
            value={endereco}
            required
            onChange={(e) => setEndereco(e.target.value)}
          />

          <BtnPrincipal text="Salvar alterações" type="submit" />
        </form>
      </div>
    </div>
  );
}
