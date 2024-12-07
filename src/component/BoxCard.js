import image from '../images/lastBox.png'

function BoxCard(props) {
    return(
        <div key={props.id} className="card-item">
            <div className="card-boxes" style={{ width: "18rem" }}>
                <img src={image} alt={props.tema} />
                <div className="card-body">
                    <h5 className="card-title">{props.tema}</h5>
                    <ul className="list-group list-group-flush">
                        {props.itens.map((item, idx) => (
                            <li key={idx} className="list-group-item">{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default BoxCard;