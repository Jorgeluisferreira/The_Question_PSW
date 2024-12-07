import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import './index.css';
import loginPic from './images/UserProfile.png'
import { logout } from "./store/userReducer";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown, Button } from "react-bootstrap";
import UserInfo from "./component/userInfo";



function UserPage() {

    //informações do usuario logado
    const currentUser = useSelector((state) => state.users.currentUser);

    const [showMenu, setShowMenu] = useState(false);
    const [selectedOption, setSelectedOption] = useState("usuario");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setShowMenu((prev) => !prev); // Alterna entre abrir e fechar o menu
    };

    const handleLogout = () => {
        dispatch(logout()); // Dispara a ação de logout
        navigate("/"); // Redireciona para a página de login
    };

    
    const handleMenuClick = (option) => {
      setSelectedOption(option);
    };

    return(
        <div>
            {/* Navbar Sticky */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="container">
                <a className="navbar-brand" href="/">
                    The question
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
                    <li className="nav-item">
                    {currentUser ? (
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
                            <span style={{ marginLeft: "10px" }}>{currentUser.nome}</span>
                        </button>

                        {/* Menu dropdown exibido abaixo */}
                        {showMenu && (
                            <ul
                            className="dropdown-menu show position-absolute"
                            style={{ top: "100%", right: 0 }}
                            >
                            <li>
                                <button
                                className="dropdown-item"
                                onClick={handleLogout}
                                >
                                Logout
                                </button>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/user">
                                Meu Perfil
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/configuracoes">
                                Configurações
                                </a>
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

            <div className="container-fluid">
            {/* Navbar para dispositivos móveis */}
            <Navbar bg="dark" variant="dark" expand="lg" className="d-md-none">
                <Navbar.Brand href="#">Menu</Navbar.Brand>
                <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    Opções
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleMenuClick("usuario")}>
                    Opção 1
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleMenuClick("assinatura")}>
                    Opção 2
                    </Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </Navbar>

            <div className="row vh-100">
                {/* Coluna da esquerda (menu) para telas médias ou maiores */}
                <div className="col-md-2 bg-dark text-white p-4 d-none d-md-block">
                <h4 className="text-center">Menu</h4>
                <ul className="nav flex-column">
                    <li className="nav-item">
                    <Button
                        variant="link"
                        className={`text-white ${
                        selectedOption === "usuario" ? "active" : ""
                        }`}
                        onClick={() => handleMenuClick("usuario")}
                    >
                        Informações do usuario
                    </Button>
                    </li>
                    <li className="nav-item">
                    <Button
                        variant="link"
                        className={`text-white ${
                        selectedOption === "assinatura" ? "active" : ""
                        }`}
                        onClick={() => handleMenuClick("assinatura")}
                    >
                        Informações da Assinatura
                    </Button>
                    
                    </li>
                   
                </ul>
                </div>

                {/* Coluna da direita (conteúdo) */}
               
                <div className="col-md-9 p-4">
                {selectedOption === "usuario" && (
                    <UserInfo id={currentUser.id} nome={currentUser.nome} email={currentUser.email} senha={currentUser.senha} tipo={currentUser.tipo} assinatura={currentUser.assinatura} endereco={currentUser.endereco} />
                )}
                {selectedOption === "assinatura" && (
                    <div>
                    <h3>Informações da Assinatura</h3>
                    <p>Conteúdo relacionado à Opção 2.</p>
                    </div>
                )}
                
                </div>
            </div>
            </div>


        </div>
    )

}

export default UserPage;
