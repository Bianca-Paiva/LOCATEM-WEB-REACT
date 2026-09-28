import { describe, expect, it } from 'vitest';
import { formatarValorMonetario, paraNumero } from '../../../src/utils/Formatacao/valorMonetario';
import { adicionarDias, formatarDataBr, parseDataIso } from '../../../src/utils/Locacoes/dataLocacao';

/*
 * Utilitarios compartilhados por checkout e locacoes.
 * As datas sao verificadas sem deslocamento de fuso para evitar regressao em ambientes diferentes.
 */
describe('formatadores', () => {
  it('deve converter valores monetarios com virgula para numero', () => {
    expect(paraNumero('1.234,56')).toBe(1234.56);
    expect(paraNumero('45,00')).toBe(45);
  });

  it('deve formatar numero como moeda brasileira simplificada', () => {
    expect(formatarValorMonetario(45)).toBe('R$ 45,00');
    expect(formatarValorMonetario(45.5)).toBe('R$ 45,50');
  });
});

describe('datas de locacao', () => {
  it('deve parsear data ISO sem deslocamento de fuso', () => {
    const data = parseDataIso('2026-10-03');

    expect(data?.getFullYear()).toBe(2026);
    expect(data?.getMonth()).toBe(9);
    expect(data?.getDate()).toBe(3);
  });

  it('deve formatar e somar dias de locacao', () => {
    expect(formatarDataBr('2026-10-03')).toBe('03/10/2026');
    expect(adicionarDias('2026-10-03', 4)).toBe('2026-10-07');
  });
});
