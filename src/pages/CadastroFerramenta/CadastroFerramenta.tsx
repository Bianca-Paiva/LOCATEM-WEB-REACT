import { useState } from 'react';
import { Icon } from '@iconify/react';

import Header from '../../components/Header/Header';
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina';
import SecaoCard from '../../components/CadastroFerramenta/SecaoCard/SecaoCard';
import FotosFerramenta from '../../components/CadastroFerramenta/FotosFerramenta/FotosFerramenta';
import InformacoesBasicas from '../../components/CadastroFerramenta/InformacoesBasicas/InformacoesBasicas';
import DescricaoFerramenta from '../../components/CadastroFerramenta/DescricaoFerramenta/DescricaoFerramenta';
import EspecificacoesTecnicasForm from '../../components/CadastroFerramenta/EspecificacoesTecnicasForm/EspecificacoesTecnicasForm';
import Precificacao from '../../components/CadastroFerramenta/Precificacao/Precificacao';
import AcessoriosInclusos from '../../components/CadastroFerramenta/AcessoriosInclusos/AcessoriosInclusos';
import CalendarioDisponibilidade from '../../components/CadastroFerramenta/CalendarioDisponibilidade/CalendarioDisponibilidade';
import AprovacaoLocacao from '../../components/CadastroFerramenta/AprovacaoLocacao/AprovacaoLocacao';
import EnderecoRetirada from '../../components/CadastroFerramenta/EnderecoRetirada/EnderecoRetirada';
import SuccessModal from '../../components/SuccessModal/SucessesModal';

import { useCadastroFerramenta } from '../../hooks/CadastroFerramenta/useCadastroFerramenta';
import { useCatalogoStore } from '../../hooks/useCatalogoStore';
import styles from './CadastroFerramenta.module.css';

import type { Route } from '../../router/useRouter';

interface CadastroFerramentaProps {
  navigate: (route: Route) => void;
}


export default function CadastroFerramenta({ navigate }: CadastroFerramentaProps) {
  const { form, setCampo, toggleDiaIndisponivel, erros, formularioCompleto, montarProduto } = useCadastroFerramenta();
  const { adicionarProduto } = useCatalogoStore();

  const [tentouPublicar, setTentouPublicar] = useState(false);
  const [shake, setShake] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const handleCancelar = () => {
    navigate('minhasFerramentas');
  };

  const handlePublicar = () => {
    if (!formularioCompleto) {
      setTentouPublicar(true);
      setShake(true);

      const primeiroIdComErro = Object.keys(erros).find(
        (chave) => erros[chave as keyof typeof erros] !== undefined,
      );

      if (primeiroIdComErro) {
        const elemento = document.getElementById(primeiroIdComErro);
        elemento?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      setTimeout(() => setShake(false), 400);
      return;
    }

    adicionarProduto(montarProduto());
    setModalAberto(true);
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="minhasFerramentas" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Cadastrar Ferramenta"
          subtitulo="Preencha as informações abaixo para publicar sua ferramenta para aluguel."
        />

        <div className={styles.grid}>
          {/* ── Coluna esquerda ── */}
          <div className={styles.coluna}>
            <SecaoCard
              icone={<Icon icon="mdi:camera-outline" width={20} height={20} />}
              titulo="Fotos da Ferramenta"
              obrigatorio
              subtitulo="Adicione fotos de qualidade para atrair mais locatários."
            >
              <FotosFerramenta
                fotos={form.fotos}
                onChange={(fotos) => setCampo('fotos', fotos)}
                error={tentouPublicar ? erros.fotos : undefined}
                shake={shake && Boolean(erros.fotos)}
              />
            </SecaoCard>

            <SecaoCard
              icone={<Icon icon="mdi:file-document-outline" width={20} height={20} />}
              titulo="Informações Básicas"
              obrigatorio
              subtitulo="Dados principais da sua ferramenta."
            >
              <InformacoesBasicas
                form={form}
                onChangeCampo={setCampo}
                erros={{
                  nome: tentouPublicar ? erros.nome : undefined,
                  marca: tentouPublicar ? erros.marca : undefined,
                  modelo: tentouPublicar ? erros.modelo : undefined,
                  categoria: tentouPublicar ? erros.categoria : undefined,
                  estadoConservacao: tentouPublicar ? erros.estadoConservacao : undefined,
                  fonteAlimentacao: tentouPublicar ? erros.fonteAlimentacao : undefined,
                }}
                shake={shake}
              />
            </SecaoCard>

            <SecaoCard
              icone={<Icon icon="mdi:file-document-edit-outline" width={20} height={20} />}
              titulo="Descrição"
              obrigatorio
              subtitulo="Descreva seu equipamento com detalhes para atrair locatários."
            >
              <DescricaoFerramenta
                value={form.descricao}
                onChange={(valor) => setCampo('descricao', valor)}
                error={tentouPublicar ? erros.descricao : undefined}
                shake={shake && Boolean(erros.descricao)}
              />
            </SecaoCard>

            <SecaoCard
              icone={<Icon icon="mdi:tune-variant" width={20} height={20} />}
              titulo="Especificações Técnicas"
              obrigatorio
              subtitulo="Adicione dados técnicos detalhados da ferramenta."
            >
              <EspecificacoesTecnicasForm
                especificacoes={form.especificacoes}
                onChange={(especificacoes) => setCampo('especificacoes', especificacoes)}
                erroPublicacao={tentouPublicar ? erros.especificacoes : undefined}
              />
            </SecaoCard>

            <SecaoCard
              icone={<Icon icon="mdi:clipboard-check-outline" width={20} height={20} />}
              titulo="Aprovação da locação"
              obrigatorio
              subtitulo="Defina como as solicitações de locação serão aprovadas."
            >
              <AprovacaoLocacao
                tipoAprovacao={form.tipoAprovacao}
                onChange={(valor) => setCampo('tipoAprovacao', valor)}
              />
            </SecaoCard>

          </div>

          {/* ── Coluna direita ── */}
          <div className={styles.coluna}>
            <SecaoCard
              icone={<Icon icon="mdi:currency-usd" width={20} height={20} />}
              titulo="Precificação"
              obrigatorio
              subtitulo="Defina os valores de locação e caução."
            >
              <Precificacao
                valorDiaria={form.valorDiaria}
                caucao={form.caucao}
                onChangeValorDiaria={(valor) => setCampo('valorDiaria', valor)}
                onChangeCaucao={(valor) => setCampo('caucao', valor)}
                error={tentouPublicar ? erros.valorDiaria : undefined}
                shake={shake}
              />
            </SecaoCard>

            <SecaoCard
              icone={<Icon icon="mdi:toolbox-outline" width={20} height={20} />}
              titulo="Acessórios Inclusos"
              subtitulo="Informe os itens que acompanham a ferramenta."
            >
              <AcessoriosInclusos
                acessorios={form.acessorios}
                onChange={(acessorios) => setCampo('acessorios', acessorios)}
              />
            </SecaoCard>

            <SecaoCard
              icone={<Icon icon="mdi:calendar-month-outline" width={20} height={20} />}
              titulo="Disponibilidade"
              obrigatorio
              subtitulo="Marque os dias em que a ferramenta não estará disponível."
            >
              <CalendarioDisponibilidade
                diasIndisponiveis={form.diasIndisponiveis}
                onToggleDia={toggleDiaIndisponivel}
              />
            </SecaoCard>

            <SecaoCard
              icone={<Icon icon="mdi:map-marker-outline" width={20} height={20} />}
              titulo="Endereço de Retirada e Devolução"
              obrigatorio
              subtitulo="Local onde o locatário poderá retirar a ferramenta."
            >
              <EnderecoRetirada
                form={form}
                onChangeCampo={setCampo}
                erros={{
                  cep: tentouPublicar ? erros.cep : undefined,
                  ruaAvenida: tentouPublicar ? erros.ruaAvenida : undefined,
                  numero: tentouPublicar ? erros.numero : undefined,
                }}
                shake={shake}
              />
            </SecaoCard>
          </div>
        </div>

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoSecundario} onClick={handleCancelar}>
            Cancelar
          </button>
          <button type="button" className={styles.botaoPrimario} onClick={handlePublicar}>
            Publicar Ferramenta
          </button>
        </div>
      </main>

      <SuccessModal
        open={modalAberto}
        title="Ferramenta publicada!"
        message="Sua ferramenta já está disponível para locação."
        buttonText="Ver minhas ferramentas"
        onConfirm={() => navigate('minhasFerramentas')}
      />
    </>
  );
}