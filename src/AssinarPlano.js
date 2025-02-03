import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "./store/plansReducer";
import { editUser } from "./store/userReducer";
import { associarPlanoAoUsuario } from "./store/plansReducer";
import "./AssinarPlano.css";


function AssinarPlano() {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { plans, PlanStatus, error } = useSelector((state) => state.plans);
    const currentUser = useSelector((state) => state.users.currentUser);

    // Verifique se o usuário está logado, se não, redirecione para a página de login
    

    const [userData, setUserData] = useState({
        id: currentUser  ? currentUser._id : "",
        nome: currentUser ? currentUser.nome : "",
        cpf: currentUser ? currentUser.cpf : "",
        email: currentUser ? currentUser.email : "",
        senha: currentUser ? currentUser.senha : "", 
        tipo: currentUser ? currentUser.tipo : "",
        assinatura: currentUser ? currentUser.assinatura : "",
        endereco: currentUser ? currentUser.endereco : "",
        numeroCartao: currentUser ? currentUser.numeroCartao : "",
        validadeCartao: currentUser ? currentUser.validadeCartao : "",
        cvv: currentUser ? currentUser.cvv : "",
        inicioAssinatura: currentUser ? currentUser.inicioAssinatura : ""
        
      });

  useEffect(() => {
    if (currentUser) {
      setUserData({
        id: currentUser  ? currentUser._id : "",
        nome: currentUser ? currentUser.nome : "",
        cpf: currentUser ? currentUser.cpf : "",
        email: currentUser ? currentUser.email : "",
        senha: currentUser ? currentUser.senha : "", 
        tipo: currentUser ? currentUser.tipo : "",
        assinatura: currentUser ? currentUser.assinatura : "",
        endereco: currentUser ? currentUser.endereco : "",
        numeroCartao: currentUser ? currentUser.numeroCartao : "",
        validadeCartao: currentUser ? currentUser.validadeCartao : "",
        cvv: currentUser ? currentUser.cvv : "",
        inicioAssinatura: currentUser ? currentUser.inicioAssinatura : ""
      })
    }
  },[currentUser, navigate]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/loginpage');  // Redireciona para a página de login
    }
  }, [currentUser, navigate]);

 

    
    // Carregar planos
    useEffect(() => {
      if (PlanStatus === "idle") {
        dispatch(fetchPlans());
      }
    }, [PlanStatus, dispatch]);

    
      // Verifique se os dados do usuário estão disponíveis antes de renderizar
      if (!currentUser) {
        return null;  // Retorna null enquanto redireciona, ou você pode exibir um carregando
      }
  
    if (PlanStatus === "loading") {
      return <div>Carregando...</div>;
    }
  
    if (PlanStatus === "failed") {
      return <div>Erro: {error}</div>;
    }
  
    if (!plans || plans.length === 0) {
      return <div>Nenhum plano encontrado.</div>;
    }

  
    // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
      e.preventDefault();
    
  const validateCardNumber = (number) => {
    return /^\d{16}$/.test(number);
  };

  
  const validateCVV = (cvv) => {
    return /^\d{3}$/.test(cvv);
  };


  const validateCPF = (cpf) => {
    return /^\d{11}$/.test(cpf);
  };

  const validateCardExpiry = (expiry) => {
    return /^(0[1-9]|1[0-2])\/\d{4}$/.test(expiry);
  };


  if (!validateCardNumber(userData.numeroCartao)) {
    alert('Número do cartão inválido. Deve conter exatamente 16 dígitos numéricos.');
    return;
  }

  if (!validateCVV(userData.cvv)) {
    alert('CVV inválido. Deve conter exatamente 3 dígitos numéricos.');
    return;
  }

  if (!validateCPF(userData.cpf)) {
    alert('CPF inválido. Deve conter exatamente 11 dígitos numéricos.');
    return;
  }

  if (!validateCardExpiry(userData.validadeCartao)) {
    alert('Validade do cartão inválida. Formato correto: MM/AAAA.');
    return;
  }

  try {

    dispatch(editUser(userData));
    
    if (userData.assinatura) {
      dispatch(associarPlanoAoUsuario({ userId: userData.id, planoId: userData.assinatura }));
  }
    navigate("/agradecimento");
  } catch (error) {
    console.error("Erro ao assinar o plano:", error);
    alert('Erro ao assinar o plano. Tente novamente.');
  }
     
    };

    const handleBack = () => {
        navigate("/"); // Navega para a página inicial
      };
  
    return (
        
      <div>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <button onClick={handleBack} className="btn btn-link voltar">
            <i class="bi bi-arrow-left"></i> Voltar
            </button>
       </nav>

       
        <div className="tema-formulário">
  <div className="card p-4 w-100" style={{ maxWidth: "600px", overflowY: "auto", maxHeight: "90vh" }}>
    <h3 className="text-center mb-4">Assine o Plano</h3>
    <form onSubmit={handleSubmit}>
      {/* Seção 1: Informações Pessoais */}
      <h5 className="mb-3">Informações Pessoais</h5>
      <div className="form-group">
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          className="form-control"
          id="nome"
          value={userData.nome}
          onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cpf">CPF:</label>
        <input
          type="text"
          className="form-control"
          id="cpf"
          value={userData.cpf}
          onChange={(e) => setUserData({ ...userData, cpf: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="endereco">Endereço:</label>
        <input
          type="text"
          className="form-control"
          id="endereco"
          value={userData.endereco}
          onChange={(e) => setUserData({ ...userData, endereco: e.target.value })}
          required
        />
      </div>

      {/* Seção 2: Informações de Pagamento */}
      <h5 className="mb-3 mt-4">Informações de Pagamento</h5>
      <div className="form-group">
        <label htmlFor="numeroCartao">Número do Cartão:</label>
        <input
          type="text"
          className="form-control"
          id="numeroCartao"
          value={userData.numeroCartao}
          onChange={(e) => setUserData({ ...userData, numeroCartao: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="validadeCartao">Validade do Cartão (MM/AAAA):</label>
        <input
          type="text"
          className="form-control"
          id="validadeCartao"
          value={userData.validadeCartao}
          onChange={(e) => setUserData({ ...userData, validadeCartao: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cvv">CVV:</label>
        <input
          type="text"
          className="form-control"
          id="cvv"
          value={userData.cvv}
          onChange={(e) => setUserData({ ...userData, cvv: e.target.value })}
          required
        />
      </div>

      {/* Seção 3: Escolha do Plano */}
      <h5 className="mb-3 mt-4">Escolha do Plano</h5>
      <div className="form-group">
        <label htmlFor="planSelect">Plano:</label>
        <select
          id="planSelect"
          className="form-control"
          value={userData.assinatura}
          onChange={(e) => setUserData({ ...userData, assinatura: e.target.value })}
          required
        >
          <option value="" disabled>Selecione um plano</option>
          {plans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>

      {/* Seção 4: Detalhes da Camiseta */}
      <h5 className="mb-3 mt-4">Camiseta</h5>
      <div className="form-group">
        <label htmlFor="tamanho">Tamanho:</label>
        <select
          id="tamanho"
          className="form-control"
          value={userData.tamanho}
          onChange={(e) => setUserData({ ...userData, tamanho: e.target.value })}
        >
          <option value="PP">PP</option>
          <option value="P">P</option>
          <option value="M">M</option>
          <option value="G">G</option>
          <option value="GG">GG</option>
          <option value="XGG">XGG</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="estilo">Estilo:</label>
        <select
          id="estilo"
          className="form-control"
          value={userData.estilo}
          onChange={(e) => setUserData({ ...userData, estilo: e.target.value })}
        >
          <option value="Unisex">Unisex</option>
          <option value="Babylook">Babylook</option>
        </select>
      </div>
            <button type="submit" className="btn btn-primary w-100">
                Confirmar Assinatura
            </button>
            </form>
        </div>
        </div>
      </div>
      
    );
  }

export default AssinarPlano;