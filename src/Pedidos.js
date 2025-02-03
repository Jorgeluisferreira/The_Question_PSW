import Navbar from "./component/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchVendas } from "./store/vendasReducer";
import { fetchBoxes } from "./store/boxesReducer";

function Pedidos() {
  const currentUser = useSelector((state) => state.users.currentUser);
  const { vendas, vendasStatus, vendasError } = useSelector(
    (state) => state.vendas
  );
  const { boxes, boxStatus, boxError } = useSelector((state) => state.boxes);
  const [expanded, setExpanded] = useState(null); // Controle da expansão

  const dispatch = useDispatch();

  // Quando a página for carregada, dispara a ação para buscar as vendas
  useEffect(() => {
    if (vendasStatus === "idle") {
      dispatch(fetchVendas());
    }
  }, [vendasStatus, dispatch]);

  // Quando a página for carregada, dispara a ação para buscar as caixas
  useEffect(() => {
    if (boxStatus === "idle") {
      dispatch(fetchBoxes());
    }
  }, [boxStatus, dispatch]);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id); // Alterna entre expandir e contrair
  };

  const findBox = (idCaixa) => {
    // Aqui estamos garantindo que estamos acessando o campo correto de boxes
    const box = boxes.find((box) => box._id === idCaixa); // Supondo que você use "_id"
    if (box) {
      return box.tema;
    }
    return "Tema não encontrado"; // Caso a caixa não seja encontrada
  };

  return (
    <>
      <Navbar nome={currentUser ? currentUser.nome : ""} />
      <div className="container mt-4">
        <h2>Seus Pedidos</h2>
        <div className="list-group">
          {vendas.map((venda) => (
            venda.idUser === currentUser.id ? (
              <div key={venda.id} className="list-group-item mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5>Pedido numero: {venda.id}</h5>
                    <p>Status: {venda.status || "Não informado"}</p>
                  </div>
                  <button
                    className="btn btn-link"
                    onClick={() => toggleExpand(venda.id)}
                  >
                    {expanded === venda.id ? "Fechar" : "Detalhes"}
                  </button>
                </div>

                {expanded === venda.id && (
                  <div className="mt-3">
                    <h6>Detalhes do Pedido:</h6>
                    {/* Aqui usamos a função findBox para encontrar o tema da caixa */}
                    <p>tema da Caixa: {findBox(venda.idCaixa)}</p>
                    <p>
                      Atualizações:{" "}
                      {venda.mensagens
                        .slice() // Cria uma cópia do array para não alterar o original
                        .reverse() // Inverte a ordem das mensagens
                        .map((mensagem, index) => (
                          <p key={index}>{mensagem}</p>
                        ))}
                    </p>
                  </div>
                )}
              </div>
            ) : null
          ))}
        </div>
      </div>
    </>
  );
}

export default Pedidos;
