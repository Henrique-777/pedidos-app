import { useState } from "react";
import './App.css';
import './formulario.css';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { produtosMock } from "./produtos";

export default function App() {
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState({});
  const [cnpj, setCnpj] = useState("");
  const [pagamento, setPagamento] = useState("avista");
  const [cnpjErro, setCnpjErro] = useState("");

  // 1. MOVA O ESTADO DA CONDIÇÃO DE PAGAMENTO PARA CÁ
  const [condicaoPagamento, setCondicaoPagamento] = useState("avista");

  // 2. FUNÇÃO PARA FORMATAR MOEDA
  const formatarMoeda = (valor) => {
    return (valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // 3. FUNÇÃO AUXILIAR PARA OBTER PREÇO (Preparo para lógica à vista/a prazo e futura)
  const obterPrecoProduto = (produto, condicao, quantidade = 1) => {
    if (!produto) return 0;
    return condicao === "avista" ? (produto.precoAvista || 0) : (produto.precoAprazo || 0);
  };


  
  // Estados para dados da empresa
  const [dadosEmpresa, setDadosEmpresa] = useState(null);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [cnpjConsultado, setCnpjConsultado] = useState("");

  // FUNÇÕES DE VALIDAÇÃO DE CNPJ
  const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (!/^\d{14}$/.test(cnpj)) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    let soma = 0;
    let multiplicador = 5;
    for (let i = 0; i < 12; i++) {
      soma += parseInt(cnpj.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 2 ? 9 : multiplicador - 1;
    }
    let resto = soma % 11;
    let dv1 = resto < 2 ? 0 : 11 - resto;
    if (parseInt(cnpj.charAt(12)) !== dv1) return false;
    
    soma = 0;
    multiplicador = 6;
    for (let i = 0; i < 13; i++) {
      soma += parseInt(cnpj.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 2 ? 9 : multiplicador - 1;
    }
    resto = soma % 11;
    let dv2 = resto < 2 ? 0 : 11 - resto;
    return parseInt(cnpj.charAt(13)) === dv2;
  };

  const aplicarMascaraCNPJ = (valor) => {
    valor = valor.replace(/\D/g, '');
    valor = valor.substring(0, 14);
    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    return valor;
  }

  // FUNÇÃO PARA CONSULTAR CNPJ VIA API
  const consultarCNPJ = async (cnpjLimpo) => {
    if (cnpjLimpo === cnpjConsultado) return;
    
    setCarregandoDados(true);
    setCnpjConsultado(cnpjLimpo);
    
    try {
      // Primeira tentativa: BrasilAPI
      let response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      
      if (response.ok) {
        const data = await response.json();
        const dadosFormatados = {
          razao_social: data.company_name || data.nome || data.razao_social || '',
          nome_fantasia: data.trade_name || data.fantasia || data.nome_fantasia || '',
          municipio: data.city || data.municipio || '',
          uf: data.state || data.uf || '',
          logradouro: data.street || data.logradouro || '',
          numero: data.number || data.numero || '',
          bairro: data.neighborhood || data.bairro || '',
          cep: data.zip_code || data.cep || '',
          situacao: data.registration_status || data.situacao || data.descricao_situacao_cadastral || '',
          tipo: data.legal_nature || data.natureza_juridica || ''
        };
        setDadosEmpresa(dadosFormatados);
        setCnpjErro("");
      } else {
        // Segunda tentativa: ReceitaWS (backup)
        response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`);
        
        if (response.ok) {
          const data = await response.json();
          const dadosFormatados = {
            razao_social: data.nome || '',
            nome_fantasia: data.fantasia || '',
            municipio: data.municipio || '',
            uf: data.uf || '',
            logradouro: data.logradouro || '',
            numero: data.numero || '',
            bairro: data.bairro || '',
            cep: data.cep || '',
            situacao: data.situacao || '',
            tipo: data.natureza_juridica || ''
          };
          setDadosEmpresa(dadosFormatados);
          setCnpjErro("");
        } else {
          throw new Error('CNPJ não encontrado');
        }
      }
    } catch (error) {
      console.error('Erro ao consultar CNPJ:', error);
      setCnpjErro("Erro ao consultar CNPJ. Verifique o número e tente novamente.");
      setDadosEmpresa(null);
    } finally {
      setCarregandoDados(false);
    }
  };

  const handleCNPJChange = async (e) => {
    const valor = aplicarMascaraCNPJ(e.target.value);
    setCnpj(valor);
    
    const somenteNumeros = valor.replace(/\D/g, '');
    if (somenteNumeros.length === 14) {
      if (!validarCNPJ(valor)) {
        setCnpjErro("CNPJ inválido");
        setDadosEmpresa(null);
      } else {
        setCnpjErro("");
        await consultarCNPJ(somenteNumeros);
      }
    } else if (somenteNumeros.length > 0) {
      setCnpjErro("");
      setDadosEmpresa(null);
    }
  };

  // FUNÇÕES DE ADICIONAR E REMOVER PRODUTOS DO CARRINHO
  const adicionar = (id) => {
    const produto = produtosMock.find(p => p.id === id);
    const incremento = produto?.undPorEmbalagem || 1;
    setCarrinho((c) => ({
      ...c,
      [id]: (c[id] || 0) + incremento
    }));
  }

  const remover = (id) => {
    const produto = produtosMock.find(p => p.id === id);
    const decremento = produto?.undPorEmbalagem || 1;
    
    setCarrinho((c) =>
      c[id] > decremento
        ? { ...c, [id]: c[id] - decremento }
        : Object.fromEntries(Object.entries(c).filter(([k]) => k != id))
    );
  };

  // NOVA FUNÇÃO PARA EDIÇÃO MANUAL DE QUANTIDADE
  const editarQuantidadeManual = (id, novaQuantidade) => {
    const produto = produtosMock.find(p => p.id === id);
    
    // Só permite edição manual para produtos com undPorEmbalagem = 1
    if (produto?.undPorEmbalagem !== 1) return;
    
    const quantidade = parseInt(novaQuantidade) || 0;
    
    if (quantidade <= 0) {
      setCarrinho((c) => {
        const novoCarrinho = { ...c };
        delete novoCarrinho[id];
        return novoCarrinho;
      });
    } else {
      setCarrinho((c) => ({
        ...c,
        [id]: quantidade
      }));
    }
  };

  // FUNÇÃO DE FILTRO APRIMORADA - BUSCA POR NOME E CÓDIGO
  const produtosFiltrados = produtosMock.filter((produto) => {
    if (!busca.trim()) return true; // Se não há busca, mostra todos
    
    const termoBusca = busca.toLowerCase().trim();
    const nomeMatch = produto.nome.toLowerCase().includes(termoBusca);
    const codigoMatch = produto.codigo.toLowerCase().includes(termoBusca);
    
    // Retorna true se encontrar match no nome OU no código
    return nomeMatch || codigoMatch;
  });

  const totalItens = Object.values(carrinho).reduce((total, qtd) => total + qtd, 0);

  // FUNÇÃO PARA GERAR PDF
  const gerarPDF = () => {
    if (!cnpj.trim()) {
      alert("Por favor, informe o CNPJ do cliente.");
      return;
    }
    
    if (cnpjErro) {
      alert("Por favor, corrija o CNPJ antes de gerar o PDF.");
      return;
    }
    
    if (!dadosEmpresa || !dadosEmpresa.razao_social) {
      alert("Aguarde o carregamento dos dados da empresa ou verifique se o CNPJ é válido.");
      return;
    }
    
    if (Object.keys(carrinho).length === 0) {
      alert("Por favor, adicione produtos ao carrinho antes de gerar o PDF.");
      return;
    }

    const doc = new jsPDF();

    // Cabeçalho da empresa
    doc.setFontSize(16);
    doc.text("VALLETUBO INDUSTRIA DE PLASTICOS LTDA", 14, 15);
    
    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(14, 18, 200, 18);

    // Dados do cliente com informações da API
    doc.setFontSize(12);
    doc.text("DADOS DO CLIENTE", 14, 28);
    doc.setFontSize(10);
    
    let yPos = 35;
    doc.text(`Razão Social: ${dadosEmpresa.razao_social}`, 14, yPos);
    yPos += 5;
    doc.text(`CNPJ: ${cnpj}`, 14, yPos);
    yPos += 5;
    
    // Endereço completo
    const endereco = [
      dadosEmpresa.logradouro,
      dadosEmpresa.numero,
      dadosEmpresa.bairro
    ].filter(Boolean).join(', ');
    
    if (endereco) {
      doc.text(`Endereço: ${endereco}`, 14, yPos);
      yPos += 5;
    }
    
    const cidadeUF = [dadosEmpresa.municipio, dadosEmpresa.uf].filter(Boolean).join(' - ');
    if (cidadeUF) {
      doc.text(`Cidade: ${cidadeUF}`, 14, yPos);
      yPos += 5;
    }
    
    if (dadosEmpresa.cep) {
      doc.text(`CEP: ${dadosEmpresa.cep}`, 14, yPos);
      yPos += 5;
    }
    
    doc.text(`Pagamento: ${pagamento === "avista" ? "À vista" : "A prazo"}`, 14, yPos);
    yPos += 10;

  // Tabela de produtos com preços e subtotais
    const colunas = ["Código", "Descrição", "Qtd", "Preço Un.", "Subtotal"];
    
    let valorTotalOrcamento = 0;

    const linhas = Object.entries(carrinho).map(([id, qtd]) => {
      const prod = produtosMock.find((p) => p.id == id);
      const precoUnitario = obterPrecoProduto(prod, pagamento, qtd);
      const subtotal = precoUnitario * qtd;
      
      valorTotalOrcamento += subtotal;

      return [
        prod.codigo, 
        prod.nome, 
        qtd.toLocaleString('pt-BR'),
        formatarMoeda(precoUnitario),
        formatarMoeda(subtotal)
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [colunas],
      body: linhas,
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      }
    });

    // Rodapé com totais
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total de Itens: ${totalItens.toLocaleString('pt-BR')}`, 14, finalY);
    doc.text(`Valor Total (${pagamento === "avista" ? "À vista" : "A prazo"}): ${formatarMoeda(valorTotalOrcamento)}`, 14, finalY + 7);

    // Data de geração
    const dataAtual = new Date().toLocaleString('pt-BR');
    doc.setFontSize(8);
    doc.text(`Gerado em: ${dataAtual}`, 14, finalY + 17);

    // Salvar com nome mais específico
    const nomeArquivo = `pedido_${dadosEmpresa.razao_social.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(nomeArquivo);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Cabeçalho */}
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="glass" style={{ 
            padding: "2rem", 
            margin: "0", 
            borderRadius: "24px",
            fontSize: "2.5rem"
          }}>
            Sistema de Pedidos - Valletubo
          </h1>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2rem" }}>
          
          {/* Coluna Principal */}
          <div>
            
            {/* Formulário de Dados */}
            <div className="form-container">
              <h3>Dados do Cliente</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--gray-700)" }}>
                    CNPJ do Cliente *
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={handleCNPJChange}
                    style={{ marginBottom: cnpjErro ? "0.5rem" : "0" }}
                  />
                  {cnpjErro && (
                    <p style={{ color: "red", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
                      {cnpjErro}
                    </p>
                  )}
                  {carregandoDados && (
                    <p style={{ color: "var(--primary-blue)", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>
                      Consultando dados...
                    </p>
                  )}
                </div>
                
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--gray-700)" }}>
                    Razão Social
                  </label>
                  <input
                    type="text"
                    className="modern-input"
                    value={dadosEmpresa?.razao_social || ''}
                    readOnly
                    placeholder="Será preenchido automaticamente"
                    style={{ backgroundColor: "var(--gray-100)", cursor: "not-allowed" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "var(--gray-700)" }}>
                  Forma de Pagamento
                </label>
                <div className="payment-options">
                  <label>
                    <input
                      type="radio"
                      value="avista"
                      checked={pagamento === "avista"}
                      onChange={(e) => setPagamento(e.target.value)}
                    />
                    À vista
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="aprazo"
                      checked={pagamento === "aprazo"}
                      onChange={(e) => setPagamento(e.target.value)}
                    />
                    A prazo
                  </label>
                </div>
              </div>
            </div>

            {/* Busca de Produtos - APRIMORADA */}
            <div className="glass" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
              <input
                type="text"
                className="modern-input"
                placeholder="🔍 Buscar produtos por nome ou código..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              {busca.trim() && (
                <p style={{ 
                  fontSize: "0.875rem", 
                  color: "var(--gray-600)", 
                  margin: "0.5rem 0 0 0" 
                }}>
                  Encontrados: {produtosFiltrados.length} produto(s)
                </p>
              )}
            </div>

            {/* Grid de Produtos */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
              gap: "1.5rem" 
            }}>
              {produtosFiltrados.length > 0 ? (
                produtosFiltrados.map((p) => (
                  <div key={p.id} className="product-card">
                    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                      <div style={{ 
                        height: "120px", 
                        borderRadius: "12px", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        marginBottom: "0.75rem",
                        overflow: "hidden",
                        backgroundColor: "var(--gray-100)",
                        border: "1px solid var(--gray-200)"
                      }}>
                        <img 
                          src={p.img}
                          alt={p.nome}
                          style={{
                            width: "30%",
                            height: "auto",
                            objectFit: "cover",
                            borderRadius: "12px",
                            transition: "transform 0.3s ease"
                          }}
                          onLoad={() => {
                            console.log(`✅ Imagem carregada: ${p.img}`);
                          }}
                          onError={(e) => {
                            console.error(`❌ Erro ao carregar: ${p.img}`);
                            console.error(`❌ URL completa: ${e.target.src}`);
                            
                            // Esconder a imagem quebrada
                            e.target.style.display = 'none';
                            
                            // Criar fallback apenas se não existir
                            if (!e.target.parentNode.querySelector('.fallback-icon')) {
                              const fallbackDiv = document.createElement('div');
                              fallbackDiv.className = 'fallback-icon';
                              fallbackDiv.style.cssText = `
                                width: 100%; 
                                height: 100%; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center; 
                                font-size: 3rem; 
                                color: var(--gray-400);
                                background: var(--gray-100);
                                border-radius: 12px;
                              `;
                              fallbackDiv.textContent = '📦';
                              e.target.parentNode.appendChild(fallbackDiv);
                            }
                          }}
                        />
                      </div>
                      
                      <div style={{ 
                        background: "var(--gray-800)", 
                        color: "white", 
                        padding: "0.25rem 0.75rem", 
                        borderRadius: "8px", 
                        fontSize: "0.875rem", 
                        fontWeight: "600", 
                        display: "inline-block",
                        marginBottom: "0.5rem"
                      }}>
                        Código: {p.codigo}
                      </div>
                      
                      <h4 style={{ 
                        margin: "0 0 0.5rem 0", 
                        fontSize: "1.1rem", 
                        fontWeight: "600", 
                        color: "var(--gray-800)" 
                      }}>
                        {p.nome}
                      </h4>
                      
                      <p style={{ 
                        color: "var(--gray-600)", 
                        margin: "0 0 1rem 0", 
                        fontSize: "0.9rem" 
                      }}>
                        {p.desc}
                      </p>
                      
                      <p style={{ 
                        color: "var(--primary-blue)", 
                        fontWeight: "600", 
                        margin: "0 0 1rem 0", 
                        fontSize: "0.9rem" 
                      }}>
                        Vendido em lotes de {p.undPorEmbalagem} {p.undMedida}
                      </p>

                      {/* EXIBIÇÃO DOS PREÇOS À VISTA E A PRAZO */}
                      <div style={{ 
                        marginBottom: "1rem", 
                        fontSize: "0.875rem", 
                        display: "flex", 
                        justifyContent: "center", 
                        gap: "1rem" 
                      }}>
                        <span style={{ color: "#16a34a", fontWeight: "600" }}>
                          À vista: {formatarMoeda(p.precoAvista)}
                        </span>
                        <span style={{ color: "#dc2626", fontWeight: "600" }}>
                          A prazo: {formatarMoeda(p.precoAprazo)}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.75rem"
                    }}>
                      {p.undPorEmbalagem === 1 ? (
                        // Input manual para produtos com undPorEmbalagem = 1
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <button
                            className="btn-remover"
                            onClick={() => remover(p.id)}
                            disabled={!carrinho[p.id]}
                          >
                            −
                          </button>
                          
                          <input
                            type="number"
                            min="0"
                            value={carrinho[p.id] || 0}
                            onChange={(e) => editarQuantidadeManual(p.id, e.target.value)}
                            style={{
                              width: "80px",
                              textAlign: "center",
                              padding: "0.5rem",
                              border: "2px solid var(--gray-300)",
                              borderRadius: "8px",
                              fontSize: "1rem",
                              fontWeight: "600"
                            }}
                            placeholder="0"
                          />
                          
                          <button
                            className="btn-adicionar"
                            onClick={() => adicionar(p.id)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        // Botões normais para produtos com undPorEmbalagem > 1
                        <>
                          <button
                            className="btn-remover"
                            onClick={() => remover(p.id)}
                            disabled={!carrinho[p.id]}
                          >
                            −
                          </button>

                          <span style={{
                            minWidth: "80px",
                            textAlign: "center",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            color: "var(--gray-800)"
                          }}>
                            {carrinho[p.id] || 0} {p.undMedida}
                          </span>

                          <button
                            className="btn-adicionar"
                            onClick={() => adicionar(p.id)}
                          >
                            +
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass" style={{ 
                  padding: "3rem", 
                  textAlign: "center", 
                  gridColumn: "1 / -1" 
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                  <h3 style={{ color: "var(--gray-600)", margin: "0 0 0.5rem 0" }}>
                    Nenhum produto encontrado
                  </h3>
                  <p style={{ color: "var(--gray-500)", margin: 0 }}>
                    Tente buscar por outro nome ou código de produto
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Carrinho Lateral */}
          <div className="cart-container" style={{ padding: "2rem" }}>
            <h3 style={{ 
              marginTop: 0, 
              color: "var(--gray-800)", 
              fontSize: "1.3rem" 
            }}>
              🛒 Carrinho de Pedidos
            </h3>

            {Object.keys(carrinho).length > 0 ? (
              <>
                <div style={{ marginBottom: "2rem", maxHeight: "400px", overflowY: "auto" }}>
                  {Object.entries(carrinho).map(([id, qtd]) => {
                    const produto = produtosMock.find((p) => p.id == id);
                    const precoUnitario = obterPrecoProduto(produto, pagamento, qtd);
                    const subtotal = precoUnitario * qtd;

                    return (
                      <div
                        key={id}
                        className="glass-light"
                        style={{
                          padding: "1rem",
                          marginBottom: "0.75rem",
                          borderRadius: "12px"
                        }}
                      >
                        <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem" }}>
                          {produto.nome}
                        </h5>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.85rem",
                          color: "var(--gray-600)"
                        }}>
                          <span>Qtd: {qtd} {produto.undMedida}</span>
                          <span style={{ fontWeight: "600", color: "var(--primary-blue)" }}>
                            {formatarMoeda(subtotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bloco com Total de Itens e Valor Financeiro Total */}
                <div className="glass-strong" style={{ padding: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem"
                  }}>
                    <span style={{ fontSize: "1rem", fontWeight: "600" }}>
                      Total de Itens:
                    </span>
                    <span style={{ fontSize: "1.1rem", fontWeight: "700" }}>
                      {totalItens.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid var(--gray-200)",
                    paddingTop: "0.5rem"
                  }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                      Valor Total ({pagamento === "avista" ? "À vista" : "A prazo"}):
                    </span>
                    <span style={{
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: "var(--primary-blue)"
                    }}>
                      {formatarMoeda(
                        Object.entries(carrinho).reduce((total, [id, qtd]) => {
                          const prod = produtosMock.find((p) => p.id == id);
                          return total + obterPrecoProduto(prod, pagamento, qtd) * qtd;
                        }, 0)
                      )}
                    </span>
                  </div>
                </div>

                <div className="glass-strong" style={{ padding: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>
                      Total de Itens:
                    </span>
                    <span style={{
                      fontSize: "1.2rem",
                      fontWeight: "700",
                      color: "var(--primary-blue)"
                    }}>
                      {totalItens.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                <button className="btn-pdf" onClick={gerarPDF}>
                  📄 Gerar PDF do Pedido
                </button>
              </>
            ) : (
              <div style={{
                textAlign: "center",
                color: "var(--gray-500)",
                padding: "2rem 1rem"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
                <p>Nenhum item adicionado.</p>
                <p style={{ fontSize: "0.9rem" }}>
                  Adicione produtos para começar seu pedido
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
