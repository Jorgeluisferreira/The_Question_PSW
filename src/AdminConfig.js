
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "./store/plansReducer";
import { fetchBoxes } from "./store/boxesReducer";
import { fetchUsers, editUser, addUser } from "./store/userReducer"; // Importando editUser e addUser
import axios from "axios";
import "./AdminConfig.css";
import CreateBoxScreen from "./component/CreateBoxScreen";

const AdminConfig = () => {
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState("plans");
  const [formType, setFormType] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Para saber qual item está sendo editado

  const { plans, status: planStatus, error: planError } = useSelector(
    (state) => state.plans
  );
  const { boxes, status: boxStatus, error: boxError } = useSelector(
    (state) => state.boxes
  );
  const { users, status: userStatus, error: userError } = useSelector(
    (state) => state.users
  );

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
    setEditingItem(null); // Não estamos editando nenhum item
    setShowForm(true);
  };
  
  const handleEdit = (item, type) => {
    setFormType(type);
    setEditingItem(item);
    setFormData({ ...item }); // Preencher os dados do item a ser editado no formulário
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      let response;
  
      if (formType === "plan") {
        if (editingItem) {
          // Atualizando um plano
          await axios.put(`http://localhost:3000/planos/${editingItem.id}`, formData);
        } else {
          // Adicionando um novo plano
          response = await axios.post("http://localhost:3000/planos", formData);
        }
        dispatch(fetchPlans()); // Recarregar planos
      } else if (formType === "box") {
        if (editingItem) {
          // Atualizando um box
          await axios.put(`http://localhost:3000/caixasPassadas/${editingItem.id}`, formData);
        } else {
          // Adicionando um novo box com ID manual
          const newBox = { id: Date.now().toString(), ...formData };
          response = await axios.post("http://localhost:3000/caixasPassadas", newBox);
        }
        dispatch(fetchBoxes()); // Recarregar caixas
      } else if (formType === "user") {
        if (editingItem) {
          // Atualizando dados de usuário através da ação Redux
          await dispatch(editUser({ ...formData, id: editingItem.id }));
        } else {
          // Adicionando um novo usuário
          await dispatch(addUser(formData));
        }
        dispatch(fetchUsers()); // Recarregar usuários
      }
  
      // Exibir alerta em caso de sucesso para planos e caixas
      if (response && response.status === 201) {
        alert(`${formType === "plan" ? "Plano" : "Box"} salvo com sucesso!`);
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
                    <button onClick={() => handleEdit(plan, "plan")}>Editar</button>
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
                    <button onClick={() => handleEdit(box, "box")}>Editar</button>
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
                    {user.nome} - {user.email} - {user.tipo}
                    <button onClick={() => handleEdit(user, "user")}>Editar</button>
                  </li>
                ))
              )}
            </ul>
            </div>
        )}
        </div>

      
        {showForm && (
        <>
          {formType === "box" ? (
            <CreateBoxScreen onCancel={() => setShowForm(false)} />
          ) : (
            <div className="form-overlay">
              <div className="admin-form">
                <h3>Adicionar Box</h3>

                <label>
                  Nome: 
                  <input type="text" value={formData.nome || ""} onChange={(e) => setFormData({ ...formData,
                    nome: e.target.value
                  })}
                  />
                </label>

                <label>
                  Itens: 
                  <input type="text" value={formData.itens?.join(", ") || ""}
                    onChange={(e) => 
                    setFormData({ 
                      ...formData, 
                      itens: e.target.value.split(", ").map((item) => item.trim()), 

                    })
                  }
                  />
                </label>

                <button onClick={handleSubmit}>Salvar</button>
                <button onClick={() => setShowForm(false)}>Cancelar</button>

              </div>
            </div>


        )}

        </>
      
      )}
    </div>
  );
};

export default AdminConfig;
