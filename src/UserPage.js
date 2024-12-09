import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import './index.css';
import loginPic from './images/UserProfile.png';
import { logout } from "./store/userReducer";
import { useNavigate } from "react-router-dom";
import { Navbar, Dropdown, Button } from "react-bootstrap";
import UserInfo from "./component/userInfo";
import AssinaturaUser from "./component/assinaturaUser";
import AdminConfig from "./AdminConfig"; // Componente da página de configurações do administrador
import FeedbackScreen from "./feedbackScreen";

function UserPage() {
    // Informações do usuário logado
    const currentUser = useSelector((state) => state.users.currentUser);

    const [showMenu, setShowMenu] = useState(false);
    const [selectedOption, setSelectedOption] = useState("usuario");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Verifica se há usuário logado
    useEffect(() => {
        if (!currentUser) {
            navigate('/loginpage'); // Redireciona para a página de login
        }
    }, [currentUser, navigate]);

    // Verifica se os dados do usuário estão disponíveis antes de renderizar
    if (!currentUser) {
        return null; // Retorna null enquanto redireciona
    }

    const toggleMenu = () => {
        setShowMenu((prev) => !prev); // Alterna entre abrir e fechar o menu
    };

    const handleLogout = () => {
        dispatch(logout()); // Dispara a ação de logout
        navigate("/"); // Redireciona para a página inicial
    };

    const handleMenuClick = (option) => {
        setSelectedOption(option);
    };

    return (
        <div>
            {/* Navbar Sticky */}
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
                            <li className="nav-item">
                                {currentUser ? (
                                    <div className="position-relative">
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
                                                    <a className="dropdown-item" href="/user">
                                                        Meu Perfil
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="/feedback">
                                                        Feedback
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

            <div className="container-fluid">
                <div className="row vh-100">
                    {/* Coluna da esquerda (menu) */}
                    <div className="col-md-2 bg-dark text-white p-4 d-none d-md-block">
                        <h4 className="text-center">Menu</h4>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Button
                                    variant="link"
                                    className={`text-white ${selectedOption === "usuario" ? "active" : ""}`}
                                    onClick={() => handleMenuClick("usuario")}
                                >
                                    Informações do Usuário
                                </Button>
                            </li>
                            <li className="nav-item">
                                <Button
                                    variant="link"
                                    className={`text-white ${selectedOption === "assinatura" ? "active" : ""}`}
                                    onClick={() => handleMenuClick("assinatura")}
                                >
                                    Informações da Assinatura
                                </Button>
                            </li>
                            {currentUser?.tipo === "admin" && (
                                <li className="nav-item">
                                    <Button
                                        variant="link"
                                        className={`text-white ${selectedOption === "adminConfig" ? "active" : ""}`}
                                        onClick={() => handleMenuClick("adminConfig")}
                                    >
                                        Configurações de Administrador
                                    </Button>
                                </li>
                            )}
                            <li className="nav-item">
                                <Button
                                    variant="link"
                                    className={`text-white ${selectedOption === "feedback" ? "active" : ""}`}
                                    onClick={() => handleMenuClick("feedback")}
                                >
                                    Feedback
                                </Button>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna da direita (conteúdo) */}
                    <div className="col-md-9 p-4">
                        {selectedOption === "usuario" && <UserInfo />}
                        {selectedOption === "assinatura" && <AssinaturaUser />}
                        {selectedOption === "adminConfig" && currentUser?.tipo === "admin" && <AdminConfig />}
                        {selectedOption === "feedback" && <FeedbackScreen />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;
