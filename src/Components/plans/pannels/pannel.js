import React from 'react';
import './pannel.css'; 
import Button from '../../button/button';


const Pannel = (props) => {
    return (
        <div className='pannel'>
           <div class="plans-item-img">
                <img src={props.img}/>
            </div>

            <h1>{props.nome}</h1>
            <h2>Items presentes:</h2>
            {props.itens.map((item, index) => (
                <p key={index}>{item}</p>
            ))}
            <div className='button'>
                <Button></Button>
            </div>
        </div>
    );
};

export default Pannel;