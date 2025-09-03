import { useState } from "react";
import './app.css'; // Certifique-se de importar o CSS
import './formulario.css';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const produtosMock = [
  { 
    id: 1,
    codigo: "1199", 
    nome: "MICRO ASPERSOR 50 L/H BRANCO", 
    desc: "Embalagem com 500 unidades", 
    img: "img/micro-branco.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  { 
    id: 2,
    codigo: "82",
    nome: "MICRO ASPERSOR 75 L/H MARROM",
    desc: "Embalagem com 500 unidades", 
    img: "img/micro-marrom.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 3,
    codigo: "81",
    nome: "MICRO ASPERSOR 100 L/H LARANJA",
    desc: "Embalagem com 500 unidades", 
    img: "img/micro-laranja.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 4,
    codigo: "80", 
    nome: "MICRO ASPERSOR 120 L/H AZUL", 
    desc: "Embalagem com 500 unidades", 
    img: "img/micro-azul.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  { 
    id: 5,
    codigo: "85",
    nome: "ESTACA 300MM",
    desc: "Saco com 500 unidades", 
    img: "img/estaca.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 6,
    codigo: "84",
    nome: "ESTACA 600MM", 
    desc: "Saco com 100 unidades", 
    img: "img/estaca.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },

  { 
    id: 7,
    codigo: "86",
    nome: "MICROTUBO 4/6 x 100CM COM CONECTOR", 
    desc: "500 unidades", 
    img: "img/microtubo.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 8,
    codigo: "87",
    nome: "TAMPÃO 4/5",
    desc: "Embalagem com 1.000 unidades", 
    img: "img/tampao-4x5.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },

  {
    id: 9,
    codigo: "88",
    nome: "TAMPÃO 4/7", 
    desc: "Embalagem com 1.000 unidades", 
    img: "img/tampao-4x7.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },

  {
    id: 10,
    codigo: "89",
    nome: "TAMPÃO DUPLO (PLUG) 4/6", 
    desc: "Embalagem com 1.000 unidades", 
    img: "img/tampao-duplo-4x6.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },
];

export default function App() {
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState({});
  const [cnpj, setCnpj] = useState("");
  
  const [pagamento, setPagamento] = useState("avista");
  const [ cnpjErro, setCnpjErro] = useState("");

// Novos estados para dados da empresa
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
    if (cnpjLimpo === cnpjConsultado) return; // Evita consultas repetidas

    setCarregandoDados(true);
    setCnpjConsultado(cnpjLimpo);

    try {
      // Primeira tentativa: BrasilAPI
      let response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);

      if (response.ok) {
        const data = await response.json();
        
        // Padronizar os dados independente da API
        const dadosFormatados = {
          razao_social: data.company_name || data.nome || '',
          nome_fantasia: data.trade_name || data.fantasia || '',
          municipio: data.city || data.municipio || '',
          uf: data.state || data.uf || '',
          logradouro: data.street || data.logradouro || '',
          numero: data.number || data.numero || '',
          bairro: data.neighborhood || data.bairro || '',
          cep: data.zip_code || data.cep || '',
          situacao: data.registration_status || data.situacao || '',
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
        // Consulta automaticamente quando CNPJ é válido e completo
        await consultarCNPJ(somenteNumeros);
      }
    } else if (somenteNumeros.length > 0) {
      setCnpjErro("");
      setDadosEmpresa(null);
    }
  };

//  ---------------------------------------------------------------------
// FUNÇÕES DE ADICIONAR E REMOVER PRODUTOS DO CARRINHO
  const adicionar = (id) => {
    const produto = produtosMock.find(p => p.id === id);
    const incremento = produto?.undPorEmbalagem || 1;
    setCarrinho((c) => ({ ...c, [id]: (c[id] || 0) + incremento }));
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

  const produtosFiltrados = produtosMock.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const totalItens = Object.values(carrinho).reduce((total, qtd) => total + qtd, 0);
  // --------------------------------------------------------------------


  /* FUNÇÃO PARA GERAR PDF */
  const gerarPDF = () => {

    // Validação antes de gerar o PDF
    if (!cnpj.trim()) {
      alert("Por favor, informe o CNPJ do cliente.");
      return;
    }

    if (cnpjErro) {
      alert("Por favor, corrija o CNPJ antes de gerar o PDF.");
      return;
    }

    if (!dadosEmpresa || (!dadosEmpresa)) {
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
      yPos +=5;
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

    // Tabela de produtos
    const colunas = ["Código", "Descrição", "Quantidade"];
    const linhas = Object.entries(carrinho).map(([id, qtd]) => {
      const prod = produtosMock.find((p) => p.id == id);
      return [prod.codigo, prod.nome, qtd.toLocaleString('pt-BR')];
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

    // Data de geração
    const dataAtual = new Date().toLocaleString('pt-BR');
    doc.setFontSize(8);
    doc.text(`Gerado em: ${dataAtual}`, 14, finalY + 10);

    // Salvar com nome mais espeficico
    const nomeArquivo = `pedido_${dadosEmpresa.razao_social.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

    // Salvar
    doc.save(nomeArquivo);
  };


  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      {/* Container principal com glassmorphism */}
      <div className="glass" style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem' 
      }}>
        
        {/* Título principal */}
        <h1>VallePedidos</h1>

        {/* FORMULÁRIO DE CLIENTE */}
        <div className="form-container">
          <h3>Dados do Cliente</h3>

          <div style={{ position: 'relative', marginBottom: '1rem'}}>
            <input 
            type="text" 
            placeholder="00.000.000/000-00"
            className={`modern-input ${cnpjErro ? 'error' : ''}`}
            value={cnpj}
            onChange={handleCNPJChange}
            maxLength="18"
            style={{
              borderColor: cnpjErro ? '#ef4444' : (dadosEmpresa ? '#10b981' : undefined),
              boxShadow: cnpjErro ? '0 0 0 1px #ef4444' : (dadosEmpresa ? '0 0 0 1px #10b981' : undefined)
            }}
            />
            {carregandoDados && (
              <div style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1rem'
              }}>
                ⏳
              </div> 
            )}
            {cnpjErro && (
              <div style={{
                color: '#ef4444',
                fontSize: '0.85rem',
                marginTop: '.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '.25rem'
              }}>
                ⚠️ {cnpjErro}
              </div>
            )}
            {dadosEmpresa && !cnpjErro && (
              <div style={{
                color: '#10b981',
                fontSize: '.85rem',
                marginTop: '.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '.25rem'
              }}>
                ✅ CNPJ válido e dados carregados
              </div>
            )}
          </div>
          
          <input 
            type = "text" 
            placeholder = "Razão Social" 
            className = "modern-input"
            value = {dadosEmpresa?.razao_social || ""}
            onChange={(e) => setDadosEmpresa(prev => ({ ...prev, razao_social: e.target.value }))}
            style = {{ marginBottom: '1rem' }}
          />

          {/* Exibir dados da empresa quando carregados */}
          {dadosEmpresa && (
            <div className="glass-light" style={{
              padding: '1rem',
              marginBottom: '1rem',
              fontSize: '.9rem',
              color: '#475569'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '.5rem', color: '#334155'}}>
                📋 Dados da Empresa:
              </div>
              {dadosEmpresa.nome_fantasia && (
                <div>🏷️ Nome Fantasia: {dadosEmpresa.nome_fantasia}</div>
              )}
              <div>🏙️ Cidade: {dadosEmpresa.municipio} - {dadosEmpresa.uf}</div>
              {dadosEmpresa.situacao && (
                <div>📊 Situação: {dadosEmpresa.situacao}</div>
              )}
            </div>
            
          )}
          
          {/* Condições de pagamento */}
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="avista"
                checked={pagamento === "avista"}
                onChange={() => setPagamento("avista")}
              /> À vista
            </label>
            <label>
              <input
                type="radio"
                value="aprazo"
                checked={pagamento === "aprazo"}
                onChange={() => setPagamento("aprazo")}
              /> A prazo
            </label>
          </div>
        </div>

        {/* Barra de pesquisa moderna */}
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="🔍 Pesquisar produtos..."
            className="modern-input fade-in"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '2rem',
          alignItems: 'flex-start'
        }}>
          {/* Lista de produtos */}
          <div style={{ 
            flex: '1', 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1.5rem' 
          }}>
            {produtosFiltrados.length === 0 ? (
              <div className="glass-light" style={{ 
                padding: '3rem', 
                textAlign: 'center' 
              }}>
                <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
                  Nenhum produto encontrado para "{busca}"
                </p>
              </div>
            ) : (
              produtosFiltrados.map((p, index) => (
                <div
                  key={p.id}
                  className="product-card fade-in"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem'
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.nome}
                    className="product-image"
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover' 
                    }}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjFmNWY5IiByeD0iOCIvPgo8cGF0aCBkPSJtMjQgMzJoMzJ2MTZoLTMyeiIgZmlsbD0iI2NiZDVlMSIvPgo8Y2lyY2xlIGN4PSIzMiIgY3k9IjM2IiByPSIyIiBmaWxsPSIjOTRhM2I4Ii8+CjxwYXRoIGQ9Im0yNiA0NiA2LTYgNC4wMiA0LjAyIDEwLTEwIDQgNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+';
                    }}
                  />
                  <div style={{ flex: '1' }}>
                    <h2>{p.nome}</h2>
                    <p>{p.desc}</p>
                  </div>
                  <div className="quantity-controls">
                    <button
                      onClick={() => remover(p.id)}
                      className="btn-remover"
                      disabled={!carrinho[p.id]}
                      style={{
                        opacity: carrinho[p.id] ? 1 : 0.5,
                        cursor: carrinho[p.id] ? 'pointer' : 'not-allowed'
                      }}
                    >
                      −
                    </button>
                    <span className="quantity-display">
                      {carrinho[p.id] || 0}
                    </span>
                    <button
                      onClick={() => adicionar(p.id)}
                      className="btn-adicionar"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Carrinho lateral */}
          <div className="cart-container" style={{ 
            width: '350px', 
            padding: '2rem' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h3>🛒 Carrinho</h3>
              {totalItens > 0 && (
                <span style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  {totalItens.toLocaleString('pt-BR')} itens
                </span>
              )}
            </div>
            
            {Object.entries(carrinho).length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem 1rem',
                color: '#64748b'
              }}>
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1rem',
                  opacity: 0.5
                }}>
                  🛍️
                </div>
                <p>Nenhum item adicionado.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  Adicione produtos para começar seu pedido
                </p>
              </div>
            ) : (
              <>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  {Object.entries(carrinho).map(([id, qtd]) => {
                    const prod = produtosMock.find((p) => p.id == id);
                    return (
                      <div
                        key={id}
                        className="glass-light"
                        style={{ 
                          padding: '1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            fontSize: '0.95rem',
                            color: '#334155'
                          }}>
                            {prod.nome}
                          </div>
                          <div style={{ 
                            fontSize: '0.8rem', 
                            color: '#64748b',
                            marginTop: '0.25rem'
                          }}>
                            Quantidade: {qtd.toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <button
                          onClick={() => remover(id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            fontSize: '1.1rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                          onMouseOut={(e) => e.target.style.background = 'none'}
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <button 
                  className="btn-primary" 
                  onClick={() => alert('Pedido enviado! 🎉')}
                >
                  Finalizar Pedido
                </button>

                <button 
                  className="btn-pdf" 
                  onClick={gerarPDF}
                >
                  Gerar PDF
                </button>


              </>

              
            )}
          </div>
        </div>
      </div>
    </div>
  );
}