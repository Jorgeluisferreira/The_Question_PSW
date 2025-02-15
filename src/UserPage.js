import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import './index.css';
import loginPic from './images/UserProfile.png';
import { logout } from "./store/userReducer";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import UserInfo from "./component/userInfo";
import AssinaturaUser from "./component/assinaturaUser";
import AdminConfig from "./AdminConfig"; // Componente da página de configurações do administrador
import Navbar from "./component/Navbar";
import FeedbackScreen from "./feedbackScreen"
import SuggestionScreen from "./SuggestionScreen";
import CreatePlanScreen from "./component/CreatePlanScreen";
import EditPlans from "./component/EditPlans";



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
            <Navbar nome={currentUser ? currentUser.nome : ''} />

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
                            {/* 
                                <li className="nav-item">
                                    <Button
                                        variant="link"
                                        className={`text-white ${selectedOption === "assinatura" ? "active" : ""}`}
                                        onClick={() => handleMenuClick("assinatura")}
                                    >
                                        Informações da Assinatura
                                    </Button>
                                </li>
                            */}
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

                            <li className="nav-item">
                            <Button
                                variant="link"
                                className={`text-white ${selectedOption === "suggestion" ? "active" : ""}`}
                                onClick={() => handleMenuClick("suggestion")}
                            >
                                Sugestão de Temas
                            </Button>
                            </li>
                            {currentUser?.tipo === "admin" && (
                                    <li className="nav-item">
                                        <Button
                                            variant="link"
                                            className={`text-white ${selectedOption === "criarPlanos" ? "active" : ""}`}
                                            onClick={() => handleMenuClick("criarPlanos")}
                                        >
                                            Criar Novos Planos
                                        </Button>
                                    </li>
                                    
                                )}

                            {currentUser?.tipo === "admin" && (
                                    <li className="nav-item">
                                        <Button
                                            variant="link"
                                            className={`text-white ${selectedOption === "editarPlanos" ? "active" : ""}`}
                                            onClick={() => handleMenuClick("editarPlanos")}
                                        >
                                            Editar Planos
                                        </Button>
                                    </li>
                                    
                            )}
                        </ul>
                    </div>

                    {/* Coluna da direita (conteúdo) */}
                    <div className="col-md-9 p-4">
                        {selectedOption === "usuario" && <UserInfo />}
                        {selectedOption === "assinatura" && <AssinaturaUser />}
                        {selectedOption === "adminConfig" && currentUser?.tipo === "admin" && <AdminConfig />}
                        {selectedOption === "feedback" && <FeedbackScreen />}
                        {selectedOption === "suggestion" && <SuggestionScreen />}
                        {selectedOption === "criarPlanos" && currentUser?.tipo === "admin" && <CreatePlanScreen />}
                        {selectedOption === "editarPlanos" && currentUser?.tipo === "admin" && <EditPlans />}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;
