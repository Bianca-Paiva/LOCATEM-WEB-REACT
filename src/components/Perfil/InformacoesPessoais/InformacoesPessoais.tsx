import type { ReactNode } from 'react';
import { User, CreditCard, Mail, Phone, Home, Pencil } from 'lucide-react';
import type { Usuario } from '../../../types/usuario.types';
import styles from './InformacoesPessoais.module.css';

interface InformacoesPessoaisProps {
  usuario: Usuario;
  onEditar: () => void;
}

interface LinhaInfo {
  icone: ReactNode;
  rotulo: string;
  valor: string;
}

/** Card "Informações Pessoais": rótulo do documento e ícone mudam conforme o tipo de usuário. */
export default function InformacoesPessoais({ usuario, onEditar }: InformacoesPessoaisProps) {
  const rotuloDocumento = usuario.tipo === 'locador' ? 'CNPJ' : 'CPF';

  const linhas: LinhaInfo[] = [
    { icone: <User size={16} />, rotulo: 'Nome completo', valor: usuario.nome || '—' },
    { icone: <CreditCard size={16} />, rotulo: rotuloDocumento, valor: usuario.documento || 'Não informado' },
    { icone: <Mail size={16} />, rotulo: 'E-mail', valor: usuario.email || '—' },
    { icone: <Phone size={16} />, rotulo: 'Telefone', valor: usuario.telefone || 'Não informado' },
    { icone: <Home size={16} />, rotulo: 'Endereço principal', valor: usuario.endereco || 'Não informado' },
  ];

  return (
    <section className={styles.card}>
      <div className={styles.cabecalho}>
        <h2 className={styles.titulo}>Informações Pessoais</h2>
        <button type="button" className={styles.btnEditar} onClick={onEditar} aria-label="Editar informações pessoais">
          <Pencil size={16} />
        </button>
      </div>

      <dl className={styles.lista}>
        {linhas.map((linha) => (
          <div key={linha.rotulo} className={styles.linha}>
            <dt className={styles.rotulo}>
              {linha.icone}
              {linha.rotulo}
            </dt>
            <dd className={styles.valor}>{linha.valor}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
