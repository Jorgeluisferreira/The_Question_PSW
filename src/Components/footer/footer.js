import React from 'react';
import './footer.css'; 


const Footer = () => {
    return (
        <div className='footer'>
            <h1>Contato</h1>
            <p>Entre em contato através das nossas redes sociais ou pelo email: thequestion@caixas.br</p>
            <div>
                <i class="bi bi-instagram"></i>
                <i class="bi bi-twitter"></i>
                <i class="bi bi-whatsapp"></i>
                <i class="bi bi-facebook"></i>
            </div>
            <p>copyright 2024© todos os direitos reservados</p>
        </div>
    );
};

export default Footer;