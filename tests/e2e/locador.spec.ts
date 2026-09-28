import { expect, test } from '@playwright/test';
import { login } from './helpers';

// Garante que o perfil locador permanece na area de gestao e nao acessa rotas de compra.
test('locador acessa area do locador e nao navega para carrinho, busca ou pagamento', async ({ page }) => {
  await login(page, 'locador');
  await expect(page).toHaveURL(/#home/);

  await page.locator('header[class*="headerDesktop"] a[class*="logo"]').click();
  await expect(page).toHaveURL(/#homeLocador/);
  const navegacao = page.getByRole('navigation');
  await expect(navegacao.getByRole('link', { name: 'Minhas Ferramentas' })).toBeVisible();
  await expect(navegacao.getByRole('link', { name: 'Gerenciar Locações' })).toBeVisible();
  await expect(page.getByText('Carrinho')).toHaveCount(0);
  await expect(page.getByPlaceholder('Qual ferramenta você precisa hoje?')).toHaveCount(0);

  await page.goto('/#carrinho');
  await expect(page).toHaveURL(/#homeLocador/);
  await page.goto('/#busca');
  await expect(page).toHaveURL(/#homeLocador/);
  await page.goto('/#metodoPagamento');
  await expect(page).toHaveURL(/#homeLocador/);
});
