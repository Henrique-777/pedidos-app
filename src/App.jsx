import { useState } from "react";
import './index.css'; // Certifique-se de importar o CSS
import './formulario.css';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const produtosMock = [
  { 
    id: 1, 
    nome: "MICRO ASPERSOR 50 L/H BRANCO", 
    desc: "Embalagem com 500 unidades", 
    img: "/img/micro-branco.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  { 
    id: 2, 
    nome: "MICRO ASPERSOR 75 L/H MARROM", 
    desc: "Embalagem com 500 unidades", 
    img: "/img/micro-marrom.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 3, 
    nome: "MICRO ASPERSOR 100 L/H LARANJA", 
    desc: "Embalagem com 500 unidades", 
    img: "/img/micro-laranja.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 4, 
    nome: "MICRO ASPERSOR 120 L/H AZUL", 
    desc: "Embalagem com 500 unidades", 
    img: "/img/micro-azul.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  { 
    id: 5, 
    nome: "ESTACA 300MM", 
    desc: "Saco com 500 unidades", 
    img: "/img/estaca.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 6, 
    nome: "ESTACA 600MM", 
    desc: "Saco com 100 unidades", 
    img: "/img/micro-aspersores.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },

  { 
    id: 7, 
    nome: "MICROTUBO 4/6 x 100CM COM CONECTOR", 
    desc: "500 unidades", 
    img: "/img/microtubo.webp",
    undPorEmbalagem: 500,
    undMedida: "unidades"
  },

  {
    id: 8, 
    nome: "TAMPÃO 4/5", 
    desc: "Embalagem com 1.000 unidades", 
    img: "/img/tampao-4x5.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },

  {
    id: 9, 
    nome: "TAMPÃO 4/7", 
    desc: "Embalagem com 1.000 unidades", 
    img: "/img/tampao-4x7.webp",
    undPorEmbalagem: 100,
    undMedida: "unidades"
  },

  {
    id: 10, 
    nome: "TAMPÃO DUPLO (PLUG) 4/6", 
    desc: "Embalagem com 1000 unidades", 
    img: "/img/tampao-duplo-4x6.webp",
    undPorEmbalagem: 1000,
    undMedida: "unidades"
  },
];

export default function App() {
  const [busca, setBusca] = useState("");
  const [carrinho, setCarrinho] = useState({});
  const [cnpj, setCnpj] = useState("");
  const [razao, setRazao] = useState("");
  const [pagamento, setPagamento] = useState("avista");

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

  /* FUNÇÃO PARA GERAR PDF */
  const gerarPDF = () => {
  const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(14);
    doc.text("VALLETUBO INDUSTRIA DE PLASTICOS LTDA", 14, 15);
    doc.setFontSize(10);
    doc.text(`Cliente: ${razao}`, 14, 25);
    doc.text(`CNPJ: ${cnpj}`, 14, 30);
    doc.text(`Pagamento: ${pagamento === "avista" ? "À vista" : "A prazo"}`, 14, 35);

    // Tabela de produtos
    const colunas = ["Código", "Descrição", "Quantidade"];
    const linhas = Object.entries(carrinho).map(([id, qtd]) => {
      const prod = produtosMock.find((p) => p.id == id);
      return ["00", prod.nome, qtd];
    });

    autoTable(doc, {
      startY: 45,
      head: [colunas],
      body: linhas,
      styles: { fontSize: 9 },
    });

    // Rodapé
    const totalItens = Object.values(carrinho).reduce((t, qtd) => t + qtd, 0);
    doc.text(`Total de Itens: ${totalItens}`, 14, doc.lastAutoTable.finalY + 10);

    // Salvar
    doc.save("pedido.pdf");
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
          <input 
            type="text" 
            placeholder="CNPJ" 
            className="modern-input"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
          />
          <br /><br />
          <input 
            type="text" 
            placeholder="Razão Social" 
            className="modern-input"
            value={razao}
            onChange={(e) => setRazao(e.target.value)}
          />
          <br /><br />
          <label>
            <input 
              type="radio" 
              value="avista"
              checked={pagamento === "avista"}
              onChange={() => setPagamento("avista")}
            /> À vista
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input 
              type="radio" 
              value="aprazo"
              checked={pagamento === "aprazo"}
              onChange={() => setPagamento("aprazo")}
            /> A prazo
          </label>
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
                  {totalItens} itens
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
                            Quantidade: {qtd}
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