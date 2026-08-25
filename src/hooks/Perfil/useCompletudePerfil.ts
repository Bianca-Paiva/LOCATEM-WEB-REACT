import { useMemo } from 'react';
import type { Usuario } from '../../types/usuario.types';

interface CriterioPerfil {
  chave: string;
  /** Peso em pontos percentuais — a soma de todos os pesos deve dar 100. */
  peso: number;
  /** Texto de ação usado para montar a dica (ex: "adicione uma foto"). */
  acao: string;
  atendido: (usuario: Usuario) => boolean;
}

/**
 * Critérios que compõem a porcentagem de "Complete seu Perfil".
 *
 * Fica como uma lista simples e isolada de propósito: para adicionar ou remover
 * um critério no futuro (ex: exigir CEP validado, ou remover a exigência de
 * telefone), basta editar esta lista — o cálculo do percentual e a mensagem de
 * dica abaixo se ajustam sozinhos, sem precisar mexer no resto da tela.
 *
 * Os 5 campos obrigatórios do cadastro (nome, e-mail, telefone, documento,
 * endereço) valem 17 pontos cada (85 no total); foto e e-mail verificado
 * completam os 15 pontos finais — por isso um perfil com todos os campos
 * cadastrais preenchidos mas sem foto/verificação bate nos mesmos "85%
 * concluído" do protótipo, sem esse valor estar fixo em nenhum lugar do código.
 */
const CRITERIOS_PERFIL: CriterioPerfil[] = [
  { chave: 'nome', peso: 17, acao: 'complete seu nome', atendido: (u) => Boolean(u.nome?.trim()) },
  { chave: 'email', peso: 17, acao: 'informe seu e-mail', atendido: (u) => Boolean(u.email?.trim()) },
  { chave: 'telefone', peso: 17, acao: 'informe seu telefone', atendido: (u) => Boolean(u.telefone?.trim()) },
  {
    chave: 'documento',
    peso: 17,
    acao: 'informe seu documento',
    atendido: (u) => Boolean(u.documento?.trim()),
  },
  { chave: 'endereco', peso: 17, acao: 'informe seu endereço', atendido: (u) => Boolean(u.endereco?.trim()) },
  { chave: 'foto', peso: 8, acao: 'adicione uma foto', atendido: (u) => Boolean(u.fotoUrl) },
  { chave: 'emailVerificado', peso: 7, acao: 'verifique seu e-mail', atendido: (u) => u.emailVerificado },
];

interface CompletudePerfil {
  percentual: number;
  completo: boolean;
  /** Frase pronta para o texto de apoio abaixo da barra de progresso. */
  mensagemDica: string;
}

/** Calcula dinamicamente o quão completo está o perfil do usuário logado. */
export function useCompletudePerfil(usuario: Usuario | null): CompletudePerfil {
  return useMemo(() => {
    if (!usuario) {
      return { percentual: 0, completo: false, mensagemDica: '' };
    }

    const criteriosFaltando = CRITERIOS_PERFIL.filter((criterio) => !criterio.atendido(usuario));
    const percentual = CRITERIOS_PERFIL.reduce(
      (soma, criterio) => soma + (criterio.atendido(usuario) ? criterio.peso : 0),
      0,
    );
    const completo = criteriosFaltando.length === 0;

    // Monta a dica citando até 2 pendências (ex: "Adicione uma foto e verifique
    // seu e-mail para chegar a 100%."), pra não ficar uma frase gigante quando
    // faltam muitos campos.
    let mensagemDica = 'Seu perfil está completo!';
    if (!completo) {
      const acoes = criteriosFaltando.slice(0, 2).map((c) => c.acao);
      const frase = acoes.length === 2 ? acoes.join(' e ') : acoes[0];
      mensagemDica = `${frase.charAt(0).toUpperCase()}${frase.slice(1)} para chegar a 100%.`;
    }

    return { percentual, completo, mensagemDica };
  }, [usuario]);
}
