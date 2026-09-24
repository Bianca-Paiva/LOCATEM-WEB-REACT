import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

import Header from '../../../components/Layout/Header/Header';
import CabecalhoPagina from '../../../components/Layout/CabecalhoPagina/CabecalhoPagina';
import SecaoCard from '../../../components/Ferramentas/CadastroFerramenta/SecaoCard/SecaoCard';
import FotosFerramenta from '../../../components/Ferramentas/CadastroFerramenta/FotosFerramenta/FotosFerramenta';
import InformacoesBasicas from '../../../components/Ferramentas/CadastroFerramenta/InformacoesBasicas/InformacoesBasicas';
import DescricaoFerramenta from '../../../components/Ferramentas/CadastroFerramenta/DescricaoFerramenta/DescricaoFerramenta';
import EspecificacoesTecnicasForm from '../../../components/Ferramentas/CadastroFerramenta/EspecificacoesTecnicasForm/EspecificacoesTecnicasForm';
import Precificacao from '../../../components/Ferramentas/CadastroFerramenta/Precificacao/Precificacao';
import AcessoriosInclusos from '../../../components/Ferramentas/CadastroFerramenta/AcessoriosInclusos/AcessoriosInclusos';
import CalendarioDisponibilidade from '../../../components/Ferramentas/CadastroFerramenta/CalendarioDisponibilidade/CalendarioDisponibilidade';
import AprovacaoLocacao from '../../../components/Ferramentas/CadastroFerramenta/AprovacaoLocacao/AprovacaoLocacao';
import EnderecoRetirada from '../../../components/Ferramentas/CadastroFerramenta/EnderecoRetirada/EnderecoRetirada';
import SuccessModal from '../../../components/Shared/SuccessModal/SucessesModal';
import ConfirmModal from '../../../components/Shared/ConfirmModal/ConfirmModal';
import BtnPrincipal from '../../../components/Botoes/BtnPrincipal/BtnPrincipal';
import BtnNegativo from '../../../components/Botoes/BtnNegativo/BtnNegativo';
import {
  cadastrarFerramenta,
  deletarFotoFerramenta,
  editarFerramenta,
  normalizarUrlImagem,
  uploadFotosFerramenta,
  buscarFerramentaPorId,
  type FerramentaDisponivel,
} from '../../../services/ferramentaservice';

import { useCadastroFerramenta } from '../../../hooks/Ferramentas/useCadastroFerramenta';
import { useCatalogoStore } from '../../../hooks/Ferramentas/useCatalogoStore';
import { useAuth } from '../../../hooks/Auth/useAuth';
import styles from './CadastroFerramenta.module.css';

import type { Route } from '../../../router/useRouter';

const CATEGORIA_IDS: Record<string, number> = {
  'Ferramentas Elétricas • Parafusadeira/Furadeira': 1,
  'Ferramentas Elétricas • Corte e Desgaste': 2,
  'Ferramentas Elétricas • Pintura': 3,
  'Ferramentas Manuais': 4,
  'Jardinagem e Paisagismo': 5,
  'Construção e Alvenaria': 6,
  'Elevação e Transporte': 7,
  'Limpeza e Lavagem': 8,
};

interface CadastroFerramentaProps {
  navigate: (route: Route) => void;
}


export default function CadastroFerramenta({ navigate }: CadastroFerramentaProps) {
  const { usuario } = useAuth();
  const { setFerramentaSelecionadaId, ferramentaSelecionadaId } = useCatalogoStore();

  const [ferramentaEmEdicao, setFerramentaEmEdicao] = useState<FerramentaDisponivel | undefined>();
  const [fotosOriginais, setFotosOriginais] = useState<FerramentaDisponivel['fotos']>([]);
  const [carregandoEdicao, setCarregandoEdicao] = useState(ferramentaSelecionadaId !== null);
  const [erroEdicao, setErroEdicao] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarFerramentaParaEdicao() {
      if (ferramentaSelecionadaId === null) {
        setFerramentaEmEdicao(undefined);
        setFotosOriginais([]);
        setCarregandoEdicao(false);
        setErroEdicao('');
        return;
      }

      setCarregandoEdicao(true);
      setErroEdicao('');

      try {
        const ferramenta = await buscarFerramentaPorId(ferramentaSelecionadaId);

        if (!ativo) return;

        if (usuario?.id && ferramenta.usuarioId !== Number(usuario.id)) {
          throw new Error('Você não tem permissão para editar esta ferramenta.');
        }

        setFerramentaEmEdicao(ferramenta);
        setFotosOriginais(ferramenta.fotos);
      } catch (error) {
        if (!ativo) return;
        setFerramentaEmEdicao(undefined);
        setFotosOriginais([]);
        setErroEdicao(error instanceof Error ? error.message : 'Não foi possível carregar a ferramenta.');
      } finally {
        if (ativo) setCarregandoEdicao(false);
      }
    }

    void carregarFerramentaParaEdicao();

    return () => {
      ativo = false;
    };
  }, [ferramentaSelecionadaId, usuario?.id]);

  const { form, setCampo, toggleDiaIndisponivel, erros, formularioCompleto } =
    useCadastroFerramenta(ferramentaEmEdicao);

  const produtoEmEdicao = ferramentaEmEdicao;

  const [tentouPublicar, setTentouPublicar] = useState(false);
  const [shake, setShake] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [confirmCancelarAberto, setConfirmCancelarAberto] = useState(false);

  const handleAbrirConfirmCancelar = () => setConfirmCancelarAberto(true);
  const handleFecharConfirmCancelar = () => setConfirmCancelarAberto(false);

  const handleCancelar = () => {
    setFerramentaSelecionadaId(null);
    navigate('minhasFerramentas');
  };

  const handleConfirmarCancelar = () => {
    setConfirmCancelarAberto(false);
    handleCancelar();
  };
const handlePublicar = async () => {
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

    try {
      const categoriaId = CATEGORIA_IDS[form.categoria];

      if (!categoriaId) {
        throw new Error('Categoria selecionada inválida.');
      }

      const payload = {
        nome: form.nome.trim(),
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        descricao: form.descricao.trim(),
        acessorios: form.acessorios,
        diaria: Number(form.valorDiaria.replace('.', '').replace(',', '.')),
        caucao: Number(form.caucao.replace('.', '').replace(',', '.')) || 0,
        categoriaId,
        quantidadeDisponivel: form.quantidadeDisponivel,
        estadoConservacao: form.estadoConservacao,
        fonteAlimentacao: form.fonteAlimentacao,
        especificacoesTecnicas: form.especificacoes
          .filter((esp) => esp.label.trim() && esp.valor.trim())
          .map((esp) => ({
            label: esp.label.trim(),
            valor: esp.valor.trim(),
          })),
        diasIndisponiveis: form.diasIndisponiveis,
        tipoAprovacao: form.tipoAprovacao as 'manual' | 'automatica',
        enderecoRetirada: {
          logradouro: form.ruaAvenida.trim(),
          numero: form.numero.trim(),
          complemento: form.complemento.trim(),
          bairro: form.bairro.trim(),
          cidade: form.cidade.trim(),
          estado: form.estado.trim(),
          cep: form.cep,
          tipoEndereco: 1,
          ehPrioritario: false,
        },
      };

      if (produtoEmEdicao) {
        const ferramentaId = produtoEmEdicao.ferramentaId;

        await editarFerramenta(ferramentaId, payload);

        const fotosMantidas = new Set(
          form.fotos.filter((foto) => /^https?:\/\//i.test(foto)),
        );

        const fotosRemovidas = fotosOriginais.filter(
          (foto) => !fotosMantidas.has(normalizarUrlImagem(foto.urlImagem)),
        );

        await Promise.all(
          fotosRemovidas.map((foto) => deletarFotoFerramenta(foto.id)),
        );

        const novasFotos = form.fotos.filter((foto) => foto.startsWith('data:image/'));

        if (novasFotos.length > 0) {
          await uploadFotosFerramenta(ferramentaId, novasFotos);
        }

        setModalAberto(true);
        return;
      }

      const ferramentaCriada = await cadastrarFerramenta(payload);

      if (form.fotos.length > 0) {
        await uploadFotosFerramenta(ferramentaCriada.ferramentaId, form.fotos);
      }

      setModalAberto(true);
    } catch (erro) {
      console.error('Erro ao salvar ferramenta:', erro);
      alert(
        erro instanceof Error
          ? erro.message
          : produtoEmEdicao
            ? 'Erro ao atualizar ferramenta.'
            : 'Erro ao cadastrar ferramenta.',
      );
    }
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="minhasFerramentas" />

      <main className={styles.pagina}>
        {carregandoEdicao ? (
          <div className={styles.estadoCarregando}>Carregando os dados da ferramenta...</div>
        ) : erroEdicao ? (
          <div className={styles.estadoErro}>
            <strong>Não foi possível carregar a ferramenta.</strong>
            <span>{erroEdicao}</span>
            <BtnNegativo type="button" onClick={() => { setFerramentaSelecionadaId(null); navigate('minhasFerramentas'); }}>
              Voltar para Minhas Ferramentas
            </BtnNegativo>
          </div>
        ) : (
          <>
        <CabecalhoPagina
          titulo={produtoEmEdicao ? 'Editar Ferramenta' : 'Cadastrar Ferramenta'}
          subtitulo={
            produtoEmEdicao
              ? 'Atualize as informações da sua ferramenta.'
              : 'Preencha as informações abaixo para publicar sua ferramenta para aluguel.'
          }
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
                error={tentouPublicar ? erros.tipoAprovacao : undefined}
                shake={shake && Boolean(erros.tipoAprovacao)}
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
                  bairro: tentouPublicar ? erros.bairro : undefined,
                  cidade: tentouPublicar ? erros.cidade : undefined,
                  estado: tentouPublicar ? erros.estado : undefined,
                }}
                shake={shake}
              />
            </SecaoCard>
          </div>
        </div>

        <div className={styles.acoes}>
          <BtnNegativo type="button" onClick={handleAbrirConfirmCancelar}>
            Cancelar
          </BtnNegativo>
          <BtnPrincipal
            type="button"
            onClick={handlePublicar}
            text={produtoEmEdicao ? 'Salvar Alterações' : 'Publicar Ferramenta'}
          />
        </div>
          </>
        )}
      </main>

      <ConfirmModal
        open={confirmCancelarAberto}
        title="Cancelar cadastro"
        message={
          produtoEmEdicao
            ? 'Tem certeza que deseja cancelar? As alterações feitas nesta ferramenta serão perdidas.'
            : 'Tem certeza que deseja cancelar? As informações preenchidas serão perdidas.'
        }
        confirmLabel="Sim, cancelar"
        cancelLabel="Continuar editando"
        onConfirm={handleConfirmarCancelar}
        onCancel={handleFecharConfirmCancelar}
      />

      <SuccessModal
        open={modalAberto}
        title={produtoEmEdicao ? 'Ferramenta atualizada!' : 'Ferramenta publicada!'}
        message={
          produtoEmEdicao
            ? 'As alterações foram salvas com sucesso.'
            : 'Sua ferramenta já está disponível para locação.'
        }
        buttonText="Ver minhas ferramentas"
        onConfirm={() => {
          setFerramentaSelecionadaId(null);
          navigate('minhasFerramentas');
        }}
      />
    </>
  );
}
