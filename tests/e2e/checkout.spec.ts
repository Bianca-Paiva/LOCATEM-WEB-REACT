import { expect, test } from '@playwright/test';
import { abrirPrimeiroProduto, selecionarPeriodoEHorarioNoModal } from './helpers';

// Fluxo critico: visitante monta carrinho, faz login e volta para concluir a compra.
test('checkout preserva fluxo do carrinho apos login do visitante', async ({ page }) => {
  await abrirPrimeiroProduto(page, 'Makita');
  await selecionarPeriodoEHorarioNoModal(page);
  await page.goto('/#carrinho');
  await page.getByRole('button', { name: 'Continuar para Pagamento' }).click();
  await page.getByRole('button', { name: 'Entrar na minha conta' }).click();

  await page.getByLabel('E-mail').fill('maria.oliveira@exemplo.com');
  await page.getByPlaceholder('Digite sua senha').fill('Teste@123');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL(/#carrinho/);
});
