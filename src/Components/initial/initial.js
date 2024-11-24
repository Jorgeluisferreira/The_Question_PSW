import React from 'react';
import './initial.css'; 
import box from "../../images/box.png"

const Initial = () => {
    return (
        <div className='initial'>
            <div className='up'>
                <h2>Revele a verdade dentro da caixa</h2>
            </div>

            <div className='down'>
                <i class="bi bi-chevron-compact-down arrow-down"></i>
            </div>
        </div>
    );
};

export default Initial;