import { expect, test } from '@playwright/test';
import { abrirPrimeiroProduto, login, selecionarPeriodoEHorarioNoModal } from './helpers';

// Jornada feliz do locatario: login, catalogo, carrinho, frete e entrada no pagamento.
test('locatario acessa areas próprias e continua fluxo de checkout', async ({ page }) => {
  await login(page, 'locatario');
  await expect(page).toHaveURL(/#home/);

  const navegacao = page.getByRole('navigation');
  await expect(navegacao.getByRole('link', { name: 'Minhas Locações' })).toBeVisible();
  await expect(navegacao.getByRole('link', { name: 'Favoritos' })).toBeVisible();
  await expect(page.getByText('Minhas Ferramentas')).toHaveCount(0);

  await abrirPrimeiroProduto(page, 'Furadeira');
  await selecionarPeriodoEHorarioNoModal(page);
  await page.goto('/#carrinho');
  await page.getByLabel('CEP').fill('01310-100');
  await page.getByRole('button', { name: 'Usar' }).click();
  await page.getByRole('button', { name: 'Continuar para Pagamento' }).click();

  await expect(page).toHaveURL(/#metodoPagamento/);
});
