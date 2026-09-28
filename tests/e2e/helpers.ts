import { expect, type Page } from '@playwright/test';

/*
 * Passos compartilhados dos fluxos E2E.
 * Usam seletores acessiveis sempre que possivel para simular a jornada real do usuario.
 */
export async function login(page: Page, perfil: 'locatario' | 'locador') {
  await page.goto('/#login');
  await page.getByLabel('E-mail').fill(
    perfil === 'locatario'
      ? 'maria.oliveira@exemplo.com'
      : 'joao.silva@exemplo.com',
  );
  await page.getByPlaceholder('Digite sua senha').fill('Teste@123');
  await page.getByRole('button', { name: 'Entrar' }).click();
}

export async function abrirPrimeiroProduto(page: Page, termo = 'Makita') {
  await page.goto('/#home');
  await page.locator('header[class*="headerDesktop"] input[type="search"]').fill(termo);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#busca/);
  await page.getByRole('button', { name: /Ver detalhes de/i }).first().click();
  await expect(page).toHaveURL(/#produtoDetalhe/);
  await expect(page.getByRole('button', { name: 'Adicionar ao carrinho' })).toBeVisible();
}

export async function selecionarPeriodoEHorarioNoModal(page: Page) {
  await page.getByRole('button', { name: 'Selecione' }).click();
  await page.getByRole('option', { name: '2 dias', exact: true }).click();
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click();

  await expect(page.getByRole('dialog', { name: 'Detalhes da Locação' })).toBeVisible();
  await page.locator('#modalDataEntrega').click();
  await page.locator('[class*="grade"] button:not([disabled])').first().click();
  await page.locator('#modalHorarioEntrega').click();
  await page.getByRole('option', { name: '09:00 - 12:00' }).click();
  await page.locator('#modalHorarioDevolucao').click();
  await page.getByRole('option', { name: '12:00 - 15:00' }).click();
  await page
    .getByRole('dialog', { name: 'Detalhes da Locação' })
    .getByRole('button', { name: 'Adicionar ao carrinho' })
    .click();
}
