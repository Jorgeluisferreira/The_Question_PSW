function PlanCard(props) {
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
                    <a className="btn btn-primary">Ver mais</a>
                </div>
            </div>
        </div>
    )
}

export default PlanCard;