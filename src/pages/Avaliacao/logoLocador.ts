import MsFerramentasLogo from '../../assets/LogosLojas/logoLojaMS.png';
import JbFerramentasLogo from '../../assets/LogosLojas/logoLojaJB.png';

/**
 * Fonte única de verdade para as logos das lojas/locadores.
 * Locadores que não têm logo cadastrada aqui caem no fallback
 * (ícone de imagem quebrada) tratado por quem consome `obterLogoLocador`.
 */
const LOGO_POR_LOCADOR: Record<string, string> = {
    'MS Ferramentas': MsFerramentasLogo,
    'JB Ferramentas': JbFerramentasLogo,
};

/** Retorna a logo do locador informado, ou `null` se ele não tiver uma cadastrada. */
export function obterLogoLocador(nomeLocador: string): string | null {
    return LOGO_POR_LOCADOR[nomeLocador] ?? null;
}
