import loginPic from '../images/UserProfile.png'
import { logout } from '../store/userReducer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


function Navbar(props){

    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu((prev) => !prev); // Alterna entre abrir e fechar o menu
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout()); // Dispara a ação de logout
        navigate("/"); // Redireciona para a página de login
      };

    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <a className="navbar-brand" href="/">
            THE QUESTION
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              
            {props.itens === "all" && (
                <>
                    <li className="nav-item">
                    <a className="nav-link" href="#home">
                        Início
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#sobre">
                        Sobre
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#caixas">
                        Caixas Anteriores
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#planos">
                        Planos
                    </a>
                    </li>
                    <li className="nav-item">
                    <a className="nav-link" href="#contato">
                        Contato
                    </a>
                    </li>
                </>
                )}

              <li className="nav-item">
              {props.nome ? (
                <div className="position-relative" >
                {/* Botão para abrir/fechar o menu */}
                <button
                    className="nav-link btn btn-link"
                    onClick={toggleMenu}
                    style={{ display: "flex", alignItems: "center" }}
                >
                    <img
                    className="userPic"
                    src={loginPic}
                    alt="User"
                
                    />
                    <span style={{ marginLeft: "10px" }}>{props.nome}</span>
                </button>

                {/* Menu dropdown exibido abaixo */}
                {showMenu && (
                    <ul
                    className="dropdown-menu show position-absolute"
                    style={{ top: "100%", right: 0 }}
                    >
                    <li>
                        <a className="dropdown-item" href="/user">
                        Meu Perfil
                        </a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="/user/pedidos">
                        Meus Pedidos
                        </a>
                    </li>
                    <li>
                        <button
                        className="dropdown-item"
                        onClick={handleLogout}
                        >
                        Logout
                        </button>
                    </li>
                    </ul>
                )}
                </div>
            ) : (
                <a className="nav-link" href="/loginpage">
                <img
                    className="userPic"
                    src={loginPic}
                    alt="Login"
                />
                </a>
            )}
            </li>
            </ul>
          </div>
        </div>
      </nav>

    )
}

export default Navbar