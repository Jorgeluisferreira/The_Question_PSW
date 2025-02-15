import React, { Component } from "react";
import Navbar from "./component/Navbar";
import axios from "axios";

class Pedidos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null, // Armazenar usuário atual
      vendas: [], // Armazenar vendas
      boxes: [], // Armazenar caixas
      expanded: null, // Controle da expansão
    };
  }

  componentDidMount() {
    // Buscar dados de vendas
    axios
      .get('http://localhost:3004/assinatura') // Substitua a URL com o endpoint correto
      .then((response) => {
        this.setState({ vendas: response.data });
      })
      .catch((error) => {
        console.error('Erro ao buscar vendas:', error);
      });

    // Buscar dados de boxes
    axios
      .get('http://localhost:3004/boxes') // Substitua a URL com o endpoint correto
      .then((response) => {
        this.setState({ boxes: response.data });
      })
      .catch((error) => {
        console.error('Erro ao buscar caixas:', error);
      });
  }

  toggleExpand = (id) => {
    this.setState((prevState) => ({
      expanded: prevState.expanded === id ? null : id, // Alterna entre expandir e contrair
    }));
  };

  findBox = (idCaixa) => {
    const box = this.state.boxes.find((box) => box._id === idCaixa);
    if (box) {
      return box.tema;
    }
    return "Tema não encontrado"; // Caso a caixa não seja encontrada
  };

  render() {
    const { currentUser, vendas, expanded } = this.state;

    return (
      <>
        <Navbar nome={currentUser ? currentUser.nome : ""} />
        <div className="container mt-4">
          <h2>Seus Pedidos</h2>
          <div className="list-group">
            {currentUser ? (
              vendas.map((venda) =>
                venda.idUser === currentUser.id ? (
                  <div key={venda.id} className="list-group-item mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5>Pedido numero: {venda.id}</h5>
                        <p>Status: {venda.status || "Não informado"}</p>
                      </div>
                      <button
                        className="btn btn-link"
                        onClick={() => this.toggleExpand(venda.id)}
                      >
                        {expanded === venda.id ? "Fechar" : "Detalhes"}
                      </button>
                    </div>

                    {expanded === venda.id && (
                      <div className="mt-3">
                        <h6>Detalhes do Pedido:</h6>
                        <p>tema da Caixa: {this.findBox(venda.idCaixa)}</p>
                        <p>
                          Atualizações:{" "}
                          {venda.mensagens
                            .slice()
                            .reverse()
                            .map((mensagem, index) => (
                              <p key={index}>{mensagem}</p>
                            ))}
                        </p>
                      </div>
                    )}
                  </div>
                ) : null
              )
            ) : (
              <p>Carregando dados do usuário...</p> // Exibe mensagem enquanto não tiver o usuário
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Pedidos;
