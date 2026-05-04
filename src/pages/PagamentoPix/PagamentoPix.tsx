import HeaderLogoChat from "../../components/HeaderDesktop/HeaderLogoChat";
import "./pagamentoPix.css";

export default function PagamentoPix() {
    return (
        <div className="app">

            <HeaderLogoChat />

            {/* CONTEÚDO */}
            <main className="pagamento-container">

                <section className="titulo-pagina">
                    <button className="btn-voltar" aria-label="Voltar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path
                                fillRule="evenodd"
                                d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
                            />
                        </svg>
                    </button>
                    <h1>Pagamento via Pix</h1>
                </section>

                <div className="pagamento-layout">

                    {/* COLUNA ESQUERDA */}
                    <div className="coluna-esquerda">
                        <section className="card area-pix">

                            {/* ESTADO: AGUARDANDO */}
                            <div id="estadoAguardandoPagamento" className="estado-pagamento">
                                <div id="tempoExpiracao" className="tempo-expiracao">Expira em 15:00</div>

                                <div className="qr-box">
                                    <img src="/src/assets/qrCodeFake.png" alt="QR Code" />
                                </div>

                                <p className="texto-qr">
                                    Escaneie o QR Code com seu app bancário
                                </p>

                                <div className="divisor">
                                    <hr />
                                    <span>ou</span>
                                    <hr />
                                </div>

                                <div className="campo-pix">
                                    <label htmlFor="codigoPix">Código Pix Copia e Cola</label>

                                    <div className="input-com-icone">
                                        <input
                                            id="codigoPix"
                                            type="text"
                                            readOnly
                                            value="00020126580014br.gov.bcb.pix0136..."
                                        />

                                        <button type="button">
                                            <img src="/src/assets/copiarBtn.svg" alt="Copiar código" />
                                        </button>
                                    </div>
                                </div>

                                <button className="btn-copiar-pix" type="button">
                                    Copiar Código Pix
                                </button>

                                <div className="instrucoes-pix">
                                    <h3>Por favor, siga as instruções:</h3>

                                    <div className="instrucao">
                                        <div className="numero">1</div>
                                        <p>Copie o código Pix acima</p>
                                    </div>

                                    <div className="instrucao">
                                        <div className="numero">2</div>
                                        <p>Acesse o app do seu banco ou internet banking de preferência.</p>
                                    </div>

                                    <div className="instrucao">
                                        <div className="numero">3</div>
                                        <p>Escolha pagar com Pix, cole o código e finalize o pagamento.</p>
                                    </div>

                                    <div className="instrucao">
                                        <div className="numero">4</div>
                                        <p>Seu pagamento será confirmado em alguns segundos.</p>
                                    </div>
                                </div>
                            </div>

                            {/* ESTADO EXPIRADO */}
                            <div className="estado-pagamento escondido">
                                <h2>Tempo Expirado</h2>
                                <p>Gere um novo código</p>
                            </div>

                        </section>
                    </div>

                    {/* COLUNA DIREITA */}
                    <aside className="coluna-direita">

                        <section className="card resumo-pedido">
                            <div className="linha-total">
                                <span>Total</span>
                                <span>R$ 380,00</span>
                            </div>

                            <div className="linha-prazo">
                                <p className="prazo-label">Pague em até</p>
                                <div className="prazo-info">
                                    <span className="prazo-tempo">23:54:45</span>
                                    <span className="prazo-vencimento">17 de abril de 2026</span>
                                </div>
                            </div>
                        </section>

                        <div className="seguranca">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-lock-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                    d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3" />
                            </svg>
                            <p>Pagamento 100% seguro</p>
                        </div>

                    </aside>
                </div>
            </main>
        </div>
    );
}