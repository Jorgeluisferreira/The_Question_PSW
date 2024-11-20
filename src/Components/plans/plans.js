import React from 'react';
import './plans.css'; 
import Pannel from './pannels/pannel';
import plan1 from '../../images/box1.png'
import plan2 from '../../images/box2.png'
import plan3 from '../../images/box.png'

const Plans = () => {
    return (
        <div className='plans'>
            <div className='plans-title'>
                <p>Planos</p>
            </div>
            <div className='pannels'>
                <Pannel img={plan1} nome={"Plano 1"} itens={["camisa"]} />
                <Pannel img={plan2} nome={"Plano 2"} itens={["camisa","livro","2x Item Aleatório"]} />
                <Pannel img={plan3} nome={"Plano 3"} itens={["camisa","livro","3x Item Aleatório","Pelucia"]} />
            </div>
        </div>
    );
};

export default Plans;