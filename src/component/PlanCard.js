import { useNavigate } from "react-router-dom";

function PlanCard(props) {
    const navigate = useNavigate();
  
    return(
        <div key={props.id} className="card-item">
            <div className="card" style={{ width: "18rem" }}>
                <img src={props.image} className="card-img-top" alt={props.nome} />
                <div className="card-body">
                    <h5 className="card-title">{props.nome}</h5>
                    <ul className="list-group list-group-flush">
                        {props.itens.map((item, idx) => (
                            <li key={idx} className="list-group-item">{item}</li>
                        ))}
                    </ul>
                    
                    <div className="price-section mt-3">
                        <strong className="text-success">
                            Preço: {props.price ? `R$ ${props.price}` : "Sob consulta"}
                        </strong>
                    </div>
                    <a className="button" onClick={() => props.planoUser ? alert("Usuario já possui Assinatura") : navigate(`/planos`)}>Assinar</a>
                </div>
            </div>
        </div>
    )
}

export default PlanCard;