import React from 'react';
import './feedback-box.css';

const FeedbackBox = (props) => {
    return (
        <div className='feedbackBox'>
            <div className='feedbackBox-img'>
                <img src={props.img} />
            </div>
            <h1>{props.nome}</h1>
            <p>{props.comment}</p>

        </div>
    );
};

export default FeedbackBox;