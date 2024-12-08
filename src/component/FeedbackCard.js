import image from '../images/UserProfile.png'

function FeedbackCard(props) {
    return(
        <div key={props.id} className="card-feedback">
            <div className="">
                <div className="card-feedback-body text-center">
                    {/* Imagem centralizada e circular */}
                    <img 
                        src={image} 
                        alt={props.nome}  
                    />
                    <div className="card-feedback-text">
                        {/* Nome logo abaixo da imagem */}
                        <h4 className="card-title mt-3">{props.nome}</h4>
                        {/* Mensagem abaixo do nome */}
                        <h5 className="card-title">{props.mensagem}</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedbackCard;