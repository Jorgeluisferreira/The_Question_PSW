import React from 'react';
import './feedback.css'; 
import FeedbackBox from './feedback-box/feedback-box';
import teste from '../../images/pfpteste.png'

const Feedback = () => {
    return (
        <div className='feedbacks'>
            <div className='feedbacks-title'>
                <p>Feedbacks</p>
            </div>
            <div className='feedbacks-pannels'>
                <FeedbackBox img={teste} nome={"Nome"} comment={"breve comentario sobre"}/>
                <FeedbackBox img={teste} nome={"Nome"} comment={"breve comentario sobre"}/>
                <FeedbackBox img={teste} nome={"Nome"} comment={"breve comentario sobre"}/>
            </div>
        </div>
    );
};

export default Feedback;