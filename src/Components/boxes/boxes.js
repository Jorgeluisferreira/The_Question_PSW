import React from 'react';
import './boxes.css'; 
import BoxPannel from './box-pannel/box-pannel';
import lastbox from '../../images/lastBox.png';

const Boxes = () => {
    return (
        <div className='boxes'>
            <div className='boxes-title'>
                <p>Caixas Anteriores</p>
            </div>
            <div className='boxes-pannels'>
                <BoxPannel img={lastbox} nome={"teste"} desc={"Breve descrição"} />
                <BoxPannel img={lastbox} nome={"teste"} desc={"Breve descrição"} />
                <BoxPannel img={lastbox} nome={"teste"} desc={"Breve descrição"} />
            </div>
        </div>
    );
};

export default Boxes;