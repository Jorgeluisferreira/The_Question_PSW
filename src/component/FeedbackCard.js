import image from '../images/lastBox.png'

function FeedbackCard(props) {
    return(
        <div key={props.id} className="card-item">
            <div className="card" style={{ width: "18rem" }}>
                <img src={image} alt={props.nome} />
                <div className="card-body">
                    <h4 className="card-title">{props.nome}</h4>
                    <h5 className="card-title">{props.mensagem}</h5>
                </div>
            </div>
        </div>
    )
}

export default FeedbackCard;