import React from 'react';
import './box-pannel.css'; 


const BoxPannel = (props) => {
    return (
        <div className='box'>
           <div class="box-img">
                <img src={props.img}/>
            </div>

            <div className='box-title'>
                <h1>{props.nome}</h1>   
            </div>
            <div className='box-text'>
                <h3>{props.desc}</h3>
            </div>
        </div>
    );
};

export default BoxPannel;