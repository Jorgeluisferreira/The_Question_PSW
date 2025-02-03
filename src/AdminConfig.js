
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "./store/plansReducer";
import { fetchBoxes } from "./store/boxesReducer";
import { deleteBox } from "./store/boxesReducer";
import { fetchUsers, editUser, addUser } from "./store/userReducer"; 
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
    dispatch(fetchBoxes(), fetchPlans(), fetchUsers, fetchUsers);
    setShowForm(false);
  }, [selectedTab], [dispatch]);


  const handleAdd = (type) => {
    setFormType(type);
    setFormData({});
    setEditingItem(null); // Não estamos editando nenhum item
    setShowForm(true);
  };
  
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setShowForm(false); // Fecha o formulário ao mudar de aba
  };

  const handleEdit = (box) => {
    setFormData({
      nome: box.nome,
      itens: box.itens || [],
      tema: box.tema || "",  // Inicializando o tema
    });
    setFormType("box");
    setEditingItem(box);  // Definindo o item a ser editado
    setShowForm(true);  // Exibindo o formulário para edição
  };

  const handleDelete = (id) => {
    dispatch(deleteBox(id)); // Deleta a caixa
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
          // Atualizando uma caixa existente
          await axios.put(`http://localhost:3004/boxes/${editingItem._id}`, formData); // Usando o _id para MongoDB
        } else {
          // Adicionando uma nova caixa
          response = await axios.post("http://localhost:3004/boxes", formData);
        }
        dispatch(fetchBoxes()); // Recarregar as caixas após a criação ou edição
  
        // Exibir alerta em caso de sucesso
        if (response && response.status === 201) {
          alert("Box salvo com sucesso!");
        }
      }
  
      setShowForm(false); // Fechar o formulário após o envio
    } catch (error) {
      console.error("Erro ao salvar a caixa:", error);
      alert("Erro ao salvar a caixa.");
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
                    Nome: {box.nome} - Tema: {box.tema} - Itens: {box.itens.join(", ")}
                    <button 
                      className="edit-button"
                      onClick={() => handleEdit(box, "box")}
                    >
                      Editar
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => handleDelete(box.id)} // Passando o id corretamente
                    >
                      Deletar
                    </button>
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
            <div className="form-overlay">
              <div className="admin-form">
                <h3>{editingItem ? "Editar Box" : "Adicionar Box"}</h3>
  
                <label>
                  Nome:
                  <input
                    type="text"
                    value={formData.nome || ""}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  />
                </label>
  
                <label>
                  Tema:
                  <input
                    type="text"
                    value={formData.tema || ""}
                    onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
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
                      itens: e.target.value
                        .split(/,\s*/g)  // Divide por vírgula e qualquer quantidade de espaço após ela
                        .map((item) => item.trim())  // Remove espaços extras ao redor dos itens
                        .filter((item) => item !== "")  // Remove itens vazios
                    })
                  }
                />
              </label>

                <button onClick={handleSubmit}>Salvar</button>
                <button onClick={() => setShowForm(false)}>Cancelar</button>
              </div>
            </div>
          ) : (
            <CreateBoxScreen onCancel={() => setShowForm(false)} />
          )}
        </>
      )}
    </div>
  );
}

export default AdminConfig;