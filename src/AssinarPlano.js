import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans, associarPlanoAoUsuario } from "./store/plansReducer";
import "./AssinarPlano.css";

function AssinarPlano() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans, PlanStatus, error } = useSelector((state) => state.plans);
  const currentUser = useSelector((state) => state.users.currentUser);

  const [userData, setUserData] = useState({
    id: currentUser ? currentUser._id : "",
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
    inicioAssinatura: currentUser ? currentUser.inicioAssinatura : "",
    tamanho: currentUser?.tamanho || "M",
    estilo: currentUser?.estilo || "Unisex",
  });

  useEffect(() => {
    if (currentUser) {
      setUserData((prev) => ({
        ...prev,
        id: currentUser._id,
        nome: currentUser.nome,
        cpf: currentUser.cpf,
        email: currentUser.email,
        senha: currentUser.senha,
        tipo: currentUser.tipo,
        assinatura: currentUser.assinatura,
        endereco: currentUser.endereco,
        numeroCartao: currentUser.numeroCartao,
        validadeCartao: currentUser.validadeCartao,
        cvv: currentUser.cvv,
        inicioAssinatura: currentUser.inicioAssinatura,
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/loginpage");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (PlanStatus === "idle") {
      dispatch(fetchPlans());
    }
  }, [PlanStatus, dispatch]);

  if (!currentUser) return null;
  if (PlanStatus === "loading") return <div>Carregando...</div>;
  if (PlanStatus === "failed") return <div>Erro: {error}</div>;
  if (!plans || plans.length === 0) return <div>Nenhum plano encontrado.</div>;

  const validateCardNumber = (number) => /^\d{16}$/.test(number);
  const validateCVV = (cvv) => /^\d{3}$/.test(cvv);
  const validateCPF = (cpf) => /^\d{11}$/.test(cpf);
  const validateCardExpiry = (expiry) => /^(0[1-9]|1[0-2])\/\d{4}$/.test(expiry);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateCardNumber(userData.numeroCartao)) {
      alert("Número do cartão inválido. Deve conter exatamente 16 dígitos.");
      return;
    }
    if (!validateCVV(userData.cvv)) {
      alert("CVV inválido. Deve conter exatamente 3 dígitos.");
      return;
    }
    if (!validateCPF(userData.cpf)) {
      alert("CPF inválido. Deve conter exatamente 11 dígitos.");
      return;
    }
    if (!validateCardExpiry(userData.validadeCartao)) {
      alert("Validade do cartão inválida. Formato correto: MM/AAAA.");
      return;
    }
    if (!userData.assinatura) {
      alert("Por favor, selecione um plano.");
      return;
    }

    dispatch(associarPlanoAoUsuario({ userId: userData.id, planoId: userData.assinatura }));
    navigate("/agradecimento");
  };

  const handlePlanoChange = (e) => {
    setUserData({ ...userData, assinatura: e.target.value });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <button onClick={handleBack} className="btn btn-link voltar">
          <i className="bi bi-arrow-left"></i> Voltar
        </button>
      </nav>

      <div className="tema-formulário">
        <div className="card p-4 w-100" style={{ maxWidth: "600px", overflowY: "auto", maxHeight: "90vh" }}>
          <h3 className="text-center mb-4">Assine o Plano</h3>
          <form onSubmit={handleSubmit}>
            <h5 className="mb-3">Escolha do Plano</h5>
            <div className="form-group">
              <label htmlFor="planSelect">Plano:</label>
              <select
                id="planSelect"
                className="form-control"
                value={userData.assinatura}
                onChange={handlePlanoChange}
                required
              >
                <option value="" disabled>Selecione um plano</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>{plan.name}</option>
                ))}
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
