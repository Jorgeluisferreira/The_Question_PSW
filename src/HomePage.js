import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/userReducer";
import { useNavigate } from "react-router-dom";
import { fetchPlans } from "./store/plansReducer";
import './index.css';
import PlanCard from "./component/PlanCard";
import homeImage from './images/box.png'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import loginPic from './images/UserProfile.png'
import { fetchBoxes } from "./store/boxesReducer";
import BoxCard from "./component/BoxCard";
import { fetchFeedbacks } from "./store/feedbackReducer";
import FeedbackCard from "./component/FeedbackCard";
import { useState } from "react";

function HomePage() {

    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu((prev) => !prev); // Alterna entre abrir e fechar o menu
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    //para usuarios
    const currentUser = useSelector((state) => state.users.currentUser);

    // Buscar planos do Redux Store
    const { plans, PlanStatus, error } = useSelector((state) => state.plans);
    // Buscar caixas do Redux Store
   const { boxes, boxStatus, boxError } = useSelector((state) => state.boxes);
    //buscar feedbacks do redux store
   const { feedbacks, feedbackStatus, feedbackError } = useSelector((state) => state.feedbacks);

    // Quando a página for carregada, dispara a ação para buscar os planos
    useEffect(() => {
        if (PlanStatus === "idle") {
        dispatch(fetchPlans());
        }
    }, [PlanStatus, dispatch]);

    // Quando a página for carregada, dispara a ação para buscar as caixas
   useEffect(() => {
    if (boxStatus === "idle") {
    dispatch(fetchBoxes());
    }
    }, [boxStatus, dispatch]);
    // Quando a página for carregada, dispara a ação para buscar os feedbacks
   useEffect(() => {
    if (feedbackStatus === "idle") {
    dispatch(fetchFeedbacks());
    }
    }, [feedbackStatus, dispatch]);

    if (PlanStatus === "loading") {
        return <p>Carregando planos...</p>;
    }
     
    if (PlanStatus === "failed") {
    return <p>Erro ao carregar planos: {error}</p>;
    } 


    //para caixasS
   if (boxStatus === "loading") {
       return <p>Carregando planos...</p>;
   }
   
   if (boxStatus === "failed") {
   return <p>Erro ao carregar planos: {boxError}</p>;
   }

   //para Feedbacks
   if (feedbackStatus === "loading") {
    return <p>Carregando planos...</p>;
    }

    if (feedbackStatus === "failed") {
    return <p>Erro ao carregar planos: {feedbackError}</p>;
    }
      
    
    const handleLogout = () => {
        dispatch(logout()); // Dispara a ação de logout
        navigate("/"); // Redireciona para a página de login
      };


    return (
    <div>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>
      {/* Navbar Sticky */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container">
          <a className="navbar-brand" href="#home">
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
                  Caxias Anteriores
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
            

        {/* Seção de Início */}
        <section id="home" className="text-white text-center vh-100 d-flex align-items-center justify-content-center sectionHome">
            <div className="container ">
                {/* Coluna da esquerda com o texto */}
                <Row className="homeRow" xs={1} md={2}>
                <Col className="homeLeft" >
                    <h1 className="titulo">Bem-vindo {currentUser ? currentUser.nome : ""}</h1>
                    <p className="lead">Explore nossos serviços e saiba mais sobre nós!</p>
                </Col>

                {/* Coluna da direita com a imagem */}
                <Col >
                    <img src={homeImage} alt="Imagem" className="img-fluid" />
                </Col>
                </Row>
            </div>
        </section>

      {/* Seção Sobre */}
      <section id="sobre" className="py-5 bg-light text-center">
        <div className="container">
          <h2>Sobre Nós</h2>
          <p className="lead">Somos apaixonados pela cultura geek e queremos compartilhar essa paixão com você! A cada mês, selecionamos os itens mais incríveis do mundo nerd, de colecionáveis exclusivos a produtos licenciados das suas franquias favoritas. Nossa missão é levar surpresas épicas diretamente à sua porta, proporcionando momentos de diversão e nostalgia. Seja você fã de filmes, séries, games ou quadrinhos, nossas caixas misteriosas são feitas sob medida para alimentar seu lado nerd. Prepare-se para descobrir o inesperado e mergulhar em um universo de aventuras a cada entrega!</p>
        </div>
      </section>

        {/* Seção de caixas com Carrossel */}
        <section className="py-5 bg-light text-center" id="caixas">
                <div className="container">
                    <h2>Caixas Anteriores</h2>
                    {boxes.length === 0 ? (
                        <p>Nenhuma caixa encontrada.</p>
                    ) : (
                        <div className="scroll-container">
                            {boxes.map((box, index) => (
                                <BoxCard id={box.id} tema={box.tema}  itens={box.itens} />
                            ))}
                        </div>
                    )}
                </div>
        </section>



      {/* Seção de Planos com Carrossel */}
      <section className="py-5 bg-light text-center" id="planos">
                <div className="container">
                    <h2>Nossos Planos</h2>
                    {plans.length === 0 ? (
                        <p>Nenhum plano encontrado.</p>
                    ) : (
                        <div className="scroll-container">
                            {plans.map((plano, index) => (
                                <PlanCard planoUser={currentUser ? currentUser.assinatura : ""}id={plano.id} nome={plano.nome} image={`http://localhost:3001${plano.image}`} itens={plano.itens} />
                            ))}
                        </div>
                    )}
                </div>
        </section>

        {/* Seção de Planos com Carrossel */}
      <section className="py-5 bg-light text-center">
                <div className="container">
                    <h2>Feedbacks</h2>
                    {feedbacks.length === 0 ? (
                        <p>Nenhum plano encontrado.</p>
                    ) : (
                        <div className="scroll-container">
                            {feedbacks.map((feedback, index) => (
                               <FeedbackCard id={feedback.id} nome={feedback.nome} mensagem={feedback.mensagem} />
                            ))}
                        </div>
                    )}
                </div>
        </section>

      {/* Seção Contato */}
      <section id="contato" className="py-5 bg-dark text-white text-center">
        <div className="container">
            <h2>Contato</h2>
            <p className="lead">Entre em contato através das nossas redes sociais ou pelo email: thequestion@caixas.br</p>
            <div className="footerRedes">
            <Row xs={4} >
                <Col md="auto">
                    <i class="bi bi-instagram"></i>
                </Col>
                <Col md="auto">
                    <i class="bi bi-twitter"></i>
                </Col>
                <Col md="auto">
                    <i class="bi bi-whatsapp"></i>
                </Col>
                <Col md="auto">
                    <i class="bi bi-facebook"></i>
                </Col>
            </Row>
            </div>
            <p className="lead">copyright 2024© todos os direitos reservados</p>
          
        </div>
      </section>
    </div>
  );
}

export default HomePage;
