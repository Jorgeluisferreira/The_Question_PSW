import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, editUser } from "./store/userReducer";
import axios from "axios";
import "./AdminConfig.css";
import PlanoDropdown from "./component/PlanDropdown"; // Ajuste o caminho conforme necessário

const AdminConfig = () => {
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState("users");
  const [formType, setFormType] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { users, status: userStatus, error: userError } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
    setShowForm(false);
  }, [selectedTab, dispatch]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setShowForm(false);
  };

  const handleEdit = (user) => {
    setFormData({
      nome: user.nome,
      email: user.email,
      role: user.tipo === "admin" ? "Administrador" : "Usuário",
      status: user.isActive ? "Ativo" : "Desativado",
      assinatura: user.assinatura,
    });
    setFormType("user");
    setEditingItem(user);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    try {
      const formattedData = {
        nome: formData.nome,
        email: formData.email,
        tipo: formData.role === "Administrador" ? "admin" : "usuario",
        isActive: formData.status === "Ativo",
        assinatura: formData.assinatura,
      };

      if (editingItem) {
        // Atualizar usuário existente
        const response = await axios.put(
          `http://localhost:3004/users/${editingItem._id}`,
          formattedData
        );
        if (response.status === 200) {
          alert("Usuário editado com sucesso!");
        }
      } else {
        // Criar novo usuário
        const response = await axios.post("http://localhost:3004/users", formattedData);
        if (response.status === 201) {
          alert("Usuário criado com sucesso!");
        }
      }

      dispatch(fetchUsers()); // Recarregar a lista

      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar o usuário:", error);
      alert(editingItem ? "Erro ao editar o usuário." : "Erro ao criar o usuário.");
    }
  };

  return (
    <div className="admin-config">
      <h2>Configurações de Administrador</h2>
      <div className="tabs">
        <button
          className={`tab-button ${selectedTab === "users" ? "active" : ""}`}
          onClick={() => handleTabChange("users")}
        >
          Cadastros
        </button>
      </div>

      <div className="content">
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
                    <button onClick={() => handleEdit(user)}>Editar</button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {showForm && formType === "user" && (
        <div className="form-overlay">
          <div className="admin-form">
            <h3>{editingItem ? "Editar Usuário" : "Adicionar Usuário"}</h3>

            <label>
              Nome:
              <input
                type="text"
                value={formData.nome || ""}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </label>

            <label>
              E-mail:
              <input
                type="text"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </label>

            <label>
              Role:
              <select
                value={formData.role || ""}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Usuário">Usuário</option>
                <option value="Administrador">Administrador</option>
              </select>
            </label>

            <label>
              Status:
              <select
                value={formData.status || ""}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Ativo">Ativo</option>
                <option value="Desativado">Desativado</option>
              </select>
            </label>

            <label>
              Assinatura:
              <PlanoDropdown
                selectedPlan={formData.assinatura}
                setSelectedPlan={(selectedPlan) => setFormData({ ...formData, assinatura: selectedPlan })}
                isEditing={!!editingItem}
              />
            </label>

            <button onClick={handleSubmit}>Salvar</button>
            <button onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConfig;
