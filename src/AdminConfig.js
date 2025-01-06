import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "./store/plansReducer";
import { fetchBoxes } from "./store/boxesReducer";
import { fetchUsers } from "./store/userReducer"; 
import axios from 'axios';
import "./AdminConfig.css";

const AdminConfig = () => {
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState("plans");
  const [formType, setFormType] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);

  const { plans, status: planStatus, error: planError } = useSelector((state) => state.plans);
  const { boxes, status: boxStatus, error: boxError } = useSelector((state) => state.boxes);
  const { users, status: userStatus, error: userError } = useSelector((state) => state.users);


  useEffect(() => {
    if (planStatus === "idle") {
      dispatch(fetchPlans());
    }
    if (boxStatus === "idle") {
      dispatch(fetchBoxes());
    }
    if (userStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [dispatch, planStatus, boxStatus, userStatus]);

  
  const handleAdd = (type) => {
    setFormType(type);
    setFormData({});
    setShowForm(true);
  };

  
  const handleSubmit = async () => {
    try {
      if (formType === "plan") {
        
        const response = await axios.post("http://localhost:3000/planos", formData);
        dispatch(fetchPlans());  // Recarregar planos
      } else if (formType === "box") {
        
        const response = await axios.post("http://localhost:3000/caixasPassadas", formData);
        dispatch(fetchBoxes());  // Recarregar caixas
      }
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <div className="admin-config">
      <h2>Configurações de Administrador</h2>
      <div className="tabs">
        <button
          className={`tab-button ${selectedTab === "plans" ? "active" : ""}`}
          onClick={() => setSelectedTab("plans")}
        >
          Planos
        </button>
        <button
          className={`tab-button ${selectedTab === "boxes" ? "active" : ""}`}
          onClick={() => setSelectedTab("boxes")}
        >
          Boxes
        </button>
        <button
          className={`tab-button ${selectedTab === "users" ? "active" : ""}`}
          onClick={() => setSelectedTab("users")}
        >
          Cadastros
        </button>
      </div>

      <div className="content">
        {selectedTab === "plans" && (
          <div>
            <h3>Planos</h3>
            <button onClick={() => handleAdd("plan")}>Adicionar Plano</button>
            <ul>
              {planStatus === "loading" ? (
                <p>Carregando planos...</p>
              ) : planStatus === "failed" ? (
                <p>Erro ao carregar planos: {planError}</p>
              ) : (
                plans.map((plan) => (
                  <li key={plan.id}>
                    {plan.nome} - Itens: {plan.itens.join(", ")}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {selectedTab === "boxes" && (
          <div>
            <h3>Boxes</h3>
            <button onClick={() => handleAdd("box")}>Adicionar Box</button>
            <ul>
              {boxStatus === "loading" ? (
                <p>Carregando caixas...</p>
              ) : boxStatus === "failed" ? (
                <p>Erro ao carregar caixas: {boxError}</p>
              ) : (
                boxes.map((box) => (
                  <li key={box.id}>
                    Tema: {box.tema} - Itens: {box.itens.join(", ")}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {selectedTab === "users" && (
          <div>
            <h3>Cadastros</h3>
            <ul>
              {userStatus === "loading" ? (
                <p>Carregando usuários...</p>
              ) : userStatus === "failed" ? (
                <p>Erro ao carregar usuários: {userError}</p>
              ) : (
                users.map((user) => (
                  <li key={user.id} className="user-card">
                    <p><strong>Nome:</strong> 
                      {user.tipo === "admin" ? ( 
                        <input 
                          type="text" 
                          defaultValue={user.nome} 
                          className="name-input"
                        />
                      ) : (
                        user.nome
                      )}
                    </p>
                    <p><strong>Email:</strong> 
                      {user.tipo === "admin" ? ( 
                        <input 
                          type="email" 
                          defaultValue={user.email} 
                          className="email-input"
                        />
                      ) : (
                        user.email
                      )}
                    </p>
                    <p><strong>Tipo:</strong>
                      {user.tipo === "admin" ? (
                        <select 
                          defaultValue={user.tipo} 
                          className="type-select"
                        >
                          <option value="usuario">Usuário</option>
                          <option value="admin">Administrador</option>
                        </select>
                      ) : (
                        user.tipo === "usuario" ? "Usuário" : "Administrador"
                      )}
                    </p>
                    {user.tipo === "usuario" && (
                      <>
                        <p><strong>Assinatura:</strong> {user.assinatura || "Nenhuma"}</p>
                        <p><strong>Endereço:</strong> {user.endereco || "Não informado"}</p>
                        {user.cpf && <p><strong>CPF:</strong> {user.cpf}</p>}
                        {user.numeroCartao && (
                          <p><strong>Cartão:</strong> **** **** **** {user.numeroCartao.slice(-4)}</p>
                        )}
                      </>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="admin-form">
            <h3>{formType === "plan" ? "Adicionar Plano" : "Adicionar Box"}</h3>
            <label>
              Nome:
              <input
                type="text"
                value={formData.nome || ""}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </label>
            <label>
              Itens:
              <input
                type="text"
                value={formData.itens?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    itens: e.target.value.split(",").map((item) => item.trim()),
                  })
                }
              />
            </label>
            {formType === "box" && (
              <label>
                Tema:
                <input
                  type="text"
                  value={formData.tema || ""}
                  onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                />
              </label>
            )}
            <button onClick={handleSubmit}>Salvar</button>
            <button onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConfig;
