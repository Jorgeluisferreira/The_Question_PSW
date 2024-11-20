import React from 'react';
import './navBar.css'; 
import profile from '../../images/UserProfile.png'

const NavBar = () => {
    return (
        <nav className="navbar-mobile">
            <div className='mobile-left'>  
                <a href='#'><i class="bi bi-list"></i></a>
            </div>
            
            <div className='mobile-center'>
                <h1 className="navbar-title">The Question</h1>
            </div>
            
            <div className='mobile-right'>
                <a href="login.html"><img src={profile}/></a>
            </div>     
        </nav> 
    );
};

export default NavBar;