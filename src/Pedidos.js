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
    // Carregar o usuário atual do localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    console.log("Usuário atual:", currentUser); // Log para verificar o usuário
    this.setState({ currentUser });

    // Buscar dados de vendas
    axios
      .get('http://localhost:3004/assinatura') // Substitua a URL com o endpoint correto
      .then((response) => {
        console.log("Dados de vendas recebidos:", response.data); // Log para verificar dados de vendas
        this.setState({ vendas: response.data });
      })
      .catch((error) => {
        console.error('Erro ao buscar vendas:', error);
      });

    // Buscar dados de boxes
    axios
      .get('http://localhost:3004/boxes') // Substitua a URL com o endpoint correto
      .then((response) => {
        console.log("Dados de boxes recebidos:", response.data); // Log para verificar dados de boxes
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

  findUserSubscription = (userId) => {
    const { vendas } = this.state;
    const user = vendas.find((venda) => venda.idUser === userId);
    if (user && user.assinatura) {
      return user.assinatura; // Retorna a assinatura associada ao usuário
    }
    return null;
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
              vendas.map((venda) => {
                if (venda.idUser === currentUser.id) {
                  const assinatura = this.findUserSubscription(currentUser.id);
                  const plano = assinatura ? assinatura.plano : "Plano não informado"; // Usando o nome do plano
                  const dataAssinatura = assinatura ? new Date(assinatura.dataAssinatura).toLocaleDateString() : "Data não informada";
                  const boxesInclusas = assinatura ? assinatura.boxes : [];

                  return (
                    <div key={venda._id} className="list-group-item mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5>Plano: {plano}</h5> {/* Exibindo o nome do plano */}
                          <p>Status: {venda.status || "Não informado"}</p>
                          {assinatura && (
                            <>
                              <p>Data da Assinatura: {dataAssinatura}</p>
                              <p>Caixas inclusas:</p>
                              <ul>
                                {boxesInclusas.length > 0 ? (
                                  boxesInclusas.map((boxId) => (
                                    <li key={boxId}>{this.findBox(boxId)}</li>
                                  ))
                                ) : (
                                  <p>Nenhuma caixa associada.</p>
                                )}
                              </ul>
                            </>
                          )}
                        </div>
                        <button
                          className="btn btn-link"
                          onClick={() => this.toggleExpand(venda._id)}
                        >
                          {expanded === venda._id ? "Fechar" : "Detalhes"}
                        </button>
                      </div>

                      {expanded === venda._id && (
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
                  );
                }
                return null;
              })
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
