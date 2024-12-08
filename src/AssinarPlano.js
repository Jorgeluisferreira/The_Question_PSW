import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "./store/plansReducer";
import { editUser } from "./store/userReducer";

function AssinarPlano() {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { plans, PlanStatus, error } = useSelector((state) => state.plans);
    const currentUser = useSelector((state) => state.users.currentUser);


    const [userData, setUserData] = useState({
        id: currentUser.id,
        nome: currentUser.nome,
        cpf: currentUser.cpf,
        email: currentUser.email,
        senha: currentUser.senha,
        tipo: currentUser.tipo,
        assinatura: currentUser.assinatura,
        endereco: currentUser.endereco,
        numeroCartao: currentUser.numeroCartao,
        validadeCartao: currentUser.validadeCartao,
        cvv: currentUser.cvv
      });


    // Atualiza o estado local se o currentUser for alterado
   useEffect(() => {
    if (currentUser) {
      setUserData({
        id: currentUser.id,
        nome: currentUser.nome,
        cpf: currentUser.cpf,
        email: currentUser.email,
        senha: currentUser.senha,
        tipo: currentUser.tipo,
        assinatura: currentUser.assinatura,
        endereco: currentUser.endereco,
        numeroCartao: currentUser.numeroCartao,
        validadeCartao: currentUser.validadeCartao,
        cvv: currentUser.cvv
      });
    }
  }, [currentUser]);
  
    // Carregar planos
    useEffect(() => {
      if (PlanStatus === "idle") {
        dispatch(fetchPlans());
      }
    }, [PlanStatus, dispatch]);
  
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
      // Aqui você pode fazer algo com os dados, como enviar para o Redux ou backend
      dispatch(editUser(userData));
      navigate("/agradecimento")
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

       <div className="container d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
      <div className="card p-4 w-100" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4">Assine o Plano</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="planSelect">Selecione o Plano:</label>
            <select
              id="planSelect"
              className="form-control"
              value={userData.assinatura}
              onChange={(e) => setUserData({ ...userData, assinatura: e.target.value })}
              required
            >
              <option value="" disabled>
                Selecione um plano
              </option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.nome}>
                  {plan.nome} - {plan.itens}
                </option>
              ))}
            </select>
          </div>

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

            <h5>Informações de Pagamento</h5>

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
                <label htmlFor="validadeCartao">Validade do Cartão:</label>
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