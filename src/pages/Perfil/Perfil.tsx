import { useState } from 'react';
import { LogOut } from 'lucide-react';
import Header from '../../components/Header/Header';
import PerfilHeader from '../../components/Perfil/PerfilHeader/PerfilHeader';
import CompletarPerfil from '../../components/Perfil/CompletarPerfil/CompletarPerfil';
import InformacoesPessoais from '../../components/Perfil/InformacoesPessoais/InformacoesPessoais';
import ReputacaoCard from '../../components/Perfil/ReputacaoCard/ReputacaoCard';
import PainelControle from '../../components/Perfil/PainelControle/PainelControle';
import EditarPerfilModal from '../../components/Perfil/EditarPerfilModal/EditarPerfilModal';
import { useAuth } from '../../hooks/useAuth';
import { useCompletudePerfil } from '../../hooks/Perfil/useCompletudePerfil';
import type { Route } from '../../router/useRouter';
import styles from './Perfil.module.css';

interface PerfilProps {
  navigate: (route: Route) => void;
}

/**
 * Tela de Perfil — compartilhada entre Locatário e Locador. A estrutura é a mesma nos dois protótipos; o que muda (rótulo do documento, indicador de entregas no prazo, badge "desde") é resolvido a partir de `usuario.tipo` dentro de cada subcomponente, então não existem duas implementações paralelas de tela — só este ponto único que decide o que exibir.
 */
export default function Perfil({ navigate }: PerfilProps) {
  const { usuario, logout, atualizarUsuario } = useAuth();
  const { percentual, mensagemDica } = useCompletudePerfil(usuario);
  const [editando, setEditando] = useState(false);

  // Sem sessão: não há o que exibir nesta tela (o Header já direciona o clique no avatar para o login quando não autenticado, mas cobrimos o acesso direto à rota também).
  if (!usuario) {
    return (
      <>
        <Header navigate={navigate} currentRoute="perfil" />
        <main className={styles.pagina}>
          <div className={styles.semSessao}>
            <p>Você precisa entrar na sua conta para ver o perfil.</p>
            <button type="button" className={styles.btnLogin} onClick={() => navigate('login')}>
              Entrar na conta
            </button>
          </div>
        </main>
      </>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('home');
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="perfil" />

      <main className={styles.pagina}>
        <div className={styles.linhaPerfil}>
          <PerfilHeader usuario={usuario} onEditar={() => setEditando(true)} />

          <CompletarPerfil percentual={percentual} mensagemDica={mensagemDica} />
        </div>

        <div className={styles.colunas}>
          <InformacoesPessoais usuario={usuario} onEditar={() => setEditando(true)} />
          <ReputacaoCard reputacao={usuario.reputacao} tipo={usuario.tipo}/>
        </div>

        <PainelControle tipo={usuario.tipo} navigate={navigate} />

        <button type="button" className={styles.btnSair} onClick={handleLogout}>
          <LogOut size={16} />
          Sair da Conta
        </button>
      </main>

      {editando && (
        <EditarPerfilModal
          usuario={usuario}
          onClose={() => setEditando(false)}
          onSalvar={atualizarUsuario}
        />
      )}
    </>
  );
}
