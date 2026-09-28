import { http, HttpResponse, delay } from 'msw';
import { apiFerramentas, apiLogin, apiUsuarioLogado } from '../fixtures/api';

/*
 * Contratos HTTP simulados pelo MSW.
 * Mantem testes de integracao deterministas: a UI chama os services reais,
 * mas as respostas sao controladas aqui em vez de depender do backend local.
 */
const API_BASE = 'http://localhost:5033/api';

export const handlers = [
  http.get(`${API_BASE}/Ferramenta/Disponiveis`, () => HttpResponse.json(apiFerramentas)),
  http.get(`${API_BASE}/Ferramenta/:id`, ({ params }) => {
    const ferramenta = apiFerramentas.find((item) => item.ferramentaId === Number(params.id));
    return ferramenta
      ? HttpResponse.json(ferramenta)
      : new HttpResponse('Ferramenta nao encontrada', { status: 404 });
  }),
  http.get(`${API_BASE}/Favoritos`, () => HttpResponse.json([])),
  http.get(`${API_BASE}/Usuarios/me`, () => HttpResponse.json(apiUsuarioLogado.locatario)),
  http.post(`${API_BASE}/Login/login`, async ({ request }) => {
    const body = await request.json() as { email?: string; senha?: string };
    if (body.email === 'api@locatem.test' && body.senha === 'Teste@123') {
      return HttpResponse.json(apiLogin);
    }
    return new HttpResponse('Credenciais invalidas', { status: 401 });
  }),
];

// Cenarios reaproveitados pelos testes para validar sucesso, fallback, erro e loading.
export const cenariosApi = {
  ferramentasComSucesso: () =>
    http.get(`${API_BASE}/Ferramenta/Disponiveis`, () => HttpResponse.json(apiFerramentas)),
  ferramentasListaVazia: () =>
    http.get(`${API_BASE}/Ferramenta/Disponiveis`, () => HttpResponse.json([])),
  ferramentasErro500: () =>
    http.get(`${API_BASE}/Ferramenta/Disponiveis`, () => new HttpResponse('Erro interno', { status: 500 })),
  ferramentasComAtraso: () =>
    http.get(`${API_BASE}/Ferramenta/Disponiveis`, async () => {
      await delay(150);
      return HttpResponse.json(apiFerramentas);
    }),
  loginValido: () =>
    http.post(`${API_BASE}/Login/login`, () => HttpResponse.json(apiLogin)),
  loginInvalido: () =>
    http.post(`${API_BASE}/Login/login`, () => new HttpResponse('Credenciais invalidas', { status: 401 })),
};
