import { expect, test } from '@playwright/test';
import { abrirPrimeiroProduto, selecionarPeriodoEHorarioNoModal } from './helpers';

// Jornada publica: pesquisa e carrinho funcionam, mas o checkout exige autenticacao.
test('visitante pesquisa ferramenta, adiciona ao carrinho e e direcionado ao Login no checkout', async ({ page }) => {
  await abrirPrimeiroProduto(page);
  await selecionarPeriodoEHorarioNoModal(page);

  await page.goto('/#carrinho');
  await expect(page.getByRole('heading', { name: 'Carrinho' })).toBeVisible();

  await page.getByRole('button', { name: 'Continuar para Pagamento' }).click();
  await expect(page.getByRole('dialog', { name: 'Login necessário' })).toBeVisible();
  await page.getByRole('button', { name: 'Entrar na minha conta' }).click();
  await expect(page).toHaveURL(/#login/);
});
