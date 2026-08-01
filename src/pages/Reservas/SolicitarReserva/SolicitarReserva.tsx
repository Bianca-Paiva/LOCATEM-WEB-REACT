import { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import CabecalhoPagina from '../../../components/CabecalhoPagina/CabecalhoPagina';
import ProdutoResumoCard from '../../../components/SolicitarReserva/ProdutoResumoCard/ProdutoResumoCard';
import CampoData from '../../../components/SolicitarReserva/CampoData/CampoData';
import HorarioDropdown from '../../../components/SolicitarReserva/HorarioDropdown/HorarioDropdown';
import SeletorQuantidade from '../../../components/Inputs/SeletorQuantidade/SeletorQuantidade';
import EnderecoEntrega from '../../../components/SolicitarReserva/EnderecoEntrega/EnderecoEntrega';
import ResumoReserva from '../../../components/SolicitarReserva/ResumoReserva/ResumoReserva';
import { useProdutoStore } from '../../../hooks/useProdutoStore';
import { useReservaStore } from '../../../hooks/Reservas/useReservaStore';
import { useSolicitarReserva } from '../../../hooks/Reservas/useSolicitarReserva';
import { validateCEP, validateFullName, validatePhone } from '../../../hooks/masks';
import styles from './SolicitarReserva.module.css';

import type { Route } from '../../../router/useRouter';
import type { ProdutoSelecionado } from '../../../context/ProdutoContext';

interface SolicitarReservaProps {
  navigate: (route: Route) => void;
}

// Produto vazio usado apenas para satisfazer o hook enquanto o redirect (useEffect) não dispara
const PRODUTO_VAZIO: ProdutoSelecionado = {
  title: '',
  brand: '',
  price: '0',
  images: [],
  imageVerificado: '',
  imageNota: '',
  rating: 0,
  reviewCount: 0,
  locador: '',
  localizacao: '',
  categoria: '',
  estoqueDisponivel: 1,
};

export default function SolicitarReserva({ navigate }: SolicitarReservaProps) {
  const { produtoSelecionado } = useProdutoStore();
  const { adicionarReserva, setReservaSelecionada } = useReservaStore();

  // Sem produto selecionado (ex: acesso direto à rota), volta para a busca.
  useEffect(() => {
    if (!produtoSelecionado) {
      navigate('home');
    }
  }, [produtoSelecionado, navigate]);

  const produto = produtoSelecionado ?? PRODUTO_VAZIO;

  const {
    form,
    setCampo,
    decrementarQuantidade,
    incrementarQuantidade,
    resumo,
    montarDadosReserva,
  } = useSolicitarReserva({ produto });

  // Controla se já houve uma tentativa de envio, para exibir as mensagens de erro
  const [tentouEnviar, setTentouEnviar] = useState(false);
  // Reaplica a animação de shake a cada nova tentativa inválida
  const [shake, setShake] = useState(false);

  if (!produtoSelecionado) {
    return null;
  }

  // Mensagens de erro exibidas apenas após uma tentativa de envio, por campo obrigatório
  const erros = {
    dataEntrega: !form.dataEntrega ? 'Selecione a data de entrega' : undefined,
    horarioEntrega: !form.horarioEntrega ? 'Selecione o horário de entrega' : undefined,
    dataDevolucao: !form.dataDevolucao ? 'Selecione a data de devolução' : undefined,
    horarioDevolucao: !form.horarioDevolucao ? 'Selecione o horário de devolução' : undefined,
    cep: !form.cepDesconhecido && !validateCEP(form.cep) ? 'Informe um CEP válido' : undefined,
    ruaAvenida: !form.ruaAvenida ? 'Informe a rua/avenida' : undefined,
    numero: !form.numero ? 'Informe o número' : undefined,
    nomeCompleto: !validateFullName(form.nomeCompleto) ? 'Informe seu nome completo' : undefined,
    telefoneContato: !validatePhone(form.telefoneContato) ? 'Informe um telefone válido' : undefined,
  };

  const handleCancelar = () => {
    navigate('produtoDetalhe');
  };

  const handleEnviarSolicitacao = () => {
    if (!resumo.formularioCompleto) {
      setTentouEnviar(true);
      setShake(true);

      // Identifica qual é o primeiro campo com erro
      const primeiroIdComErro = Object.keys(erros).find(
        (chave) => erros[chave as keyof typeof erros] !== undefined
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

    const novaReserva = adicionarReserva(montarDadosReserva());
    setReservaSelecionada(novaReserva);
    navigate('solicitacaoEnviada');
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="home" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Solicitar Reserva"
          subtitulo="Preencha as informações abaixo para solicitar a reserva desta ferramenta."
        />

        <ProdutoResumoCard produto={produto} />

        <div className={styles.gridCampos}>
          <CampoData
            id="dataEntrega"
            label="Data de entrega"
            value={form.dataEntrega}
            onChange={(valor) => setCampo('dataEntrega', valor)}
            required
            error={tentouEnviar ? erros.dataEntrega : undefined}
            shake={shake && Boolean(erros.dataEntrega)}
          />
          <HorarioDropdown
            id="horarioEntrega"
            label="Horário da entrega"
            value={form.horarioEntrega}
            onChange={(valor) => setCampo('horarioEntrega', valor)}
            required
            error={tentouEnviar ? erros.horarioEntrega : undefined}
            shake={shake && Boolean(erros.horarioEntrega)}
          />
          <CampoData
            id="dataDevolucao"
            label="Data prevista da devolução"
            value={form.dataDevolucao}
            min={form.dataEntrega}
            onChange={(valor) => setCampo('dataDevolucao', valor)}
            required
            error={tentouEnviar ? erros.dataDevolucao : undefined}
            shake={shake && Boolean(erros.dataDevolucao)}
          />
          <HorarioDropdown
            id="horarioDevolucao"
            label="Horário da devolução"
            value={form.horarioDevolucao}
            onChange={(valor) => setCampo('horarioDevolucao', valor)}
            required
            error={tentouEnviar ? erros.horarioDevolucao : undefined}
            shake={shake && Boolean(erros.horarioDevolucao)}
          />

          <SeletorQuantidade
            quantidade={form.quantidade}
            estoqueDisponivel={produto.estoqueDisponivel}
            onDecrementar={decrementarQuantidade}
            onIncrementar={incrementarQuantidade}
          />

          {!resumo.periodoValido && form.dataEntrega && form.dataDevolucao && (
            <p className={styles.erroPeriodo}>
              A data de devolução deve ser posterior à data de entrega.
            </p>
          )}
        </div>

        <EnderecoEntrega
          form={form}
          onChangeCampo={setCampo}
          erros={{
            cep: tentouEnviar ? erros.cep : undefined,
            ruaAvenida: tentouEnviar ? erros.ruaAvenida : undefined,
            numero: tentouEnviar ? erros.numero : undefined,
            nomeCompleto: tentouEnviar ? erros.nomeCompleto : undefined,
            telefoneContato: tentouEnviar ? erros.telefoneContato : undefined,
          }}
          shake={shake}
        />

        <ResumoReserva resumo={resumo} />

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoSecundario} onClick={handleCancelar}>
            Cancelar
          </button>
          <button
            type="button"
            className={styles.botaoPrimario}
            onClick={handleEnviarSolicitacao}
          >
            Enviar solicitação
          </button>
        </div>
      </main>
    </>
  );
}