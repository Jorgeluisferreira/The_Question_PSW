import Navbar from "./component/Navbar"
import { useSelector , useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchVendas } from "./store/vendasReducer";
import { fetchBoxes } from "./store/boxesReducer";

function Pedidos(){

    const currentUser = useSelector((state) => state.users.currentUser);
    const { vendas, vendasStatus, vendasError } = useSelector((state) => state.vendas);
    const { boxes, boxStatus, boxError } = useSelector((state) => state.boxes);
    const [expanded, setExpanded] = useState(null); // Controle da expansão

    const dispatch = useDispatch();

    useEffect(() => {
        if (vendasStatus === "idle") {
            dispatch(fetchVendas());
        }
    })

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
        const response = boxes.find((box) => box.id === idCaixa)
        if(response){
            return response.tema
        }
        
    } 

    return (<>
        <Navbar nome={currentUser ? currentUser.nome : ''}  />
        <div className="container mt-4">
      <h2>Seus Pedidos</h2>
      <div className="list-group">
        {vendas.map((venda) => (
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
                <p>Tema da Caixa: {findBox(venda.idCaixa)}</p>
                <p>
                  Atualizações:{" "}
                  {venda.mensagens
                    .slice() // Cria uma cópia do array para não alterar o original
                    .reverse() // Inverte a ordem das mensagens
                    .map((mensagem) => (
                        <p>{mensagem}</p>
                    ))}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
        </>
    )
}

export default Pedidos