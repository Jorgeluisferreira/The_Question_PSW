import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "./store/userReducer";
import axios from "axios";
import "./AdminConfig.css";
import PlanoDropdown from "./component/PlanDropdown"; // Ajuste o caminho conforme necessário
import { fetchBoxes, deleteBox, createBox } from "./store/boxesReducer"; // Ação de boxes

const AdminConfig = () => {
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState("users");
  const [formType, setFormType] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Estados de usuários e caixas
  const { users, status: userStatus, error: userError } = useSelector((state) => state.users);
  const { boxes, status: boxStatus, error: boxError } = useSelector((state) => state.boxes);

  // Efeitos para carregar usuários e caixas
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchBoxes());
    setShowForm(false);
  }, [selectedTab, dispatch]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setShowForm(false);
  };

  // Funções de manipulação de usuário
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

  const handleSubmitUser = async () => {
    try {
      const formattedData = {
        nome: formData.nome,
        email: formData.email,
        tipo: formData.role === "Administrador" ? "admin" : "usuario",
        isActive: formData.status === "Ativo",
        assinatura: formData.assinatura,
      };

  

      const handleSubmitBox = async () => {
        try {
          const formattedData = {
            nome: formData.nome,
            tema: formData.tema,
            itens: formData.itens.split(", "), // Transforma a string em array
            planId: formData.plan,
          };
      
          await dispatch(createBox(formattedData));
          alert("Caixa criada com sucesso!");
          dispatch(fetchBoxes()); // Atualiza a lista de caixas
          setShowForm(false);
        } catch (error) {
          console.error("Erro ao criar a caixa:", error);
          alert("Erro ao criar a caixa.");
        }
      };
      

      if (editingItem) {
        // Atualizar usuário existente
        const response = await axios.put(`http://localhost:3004/users/${editingItem._id}`, formattedData);
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

  // Funções de manipulação de caixa
  const handleEditBox = (box) => {
    setFormData({
      nome: box.nome,
      tema: box.tema,
      itens: box.itens.join(", "),
      plan: box.plan._id,
    });
    setFormType("box");
    setEditingItem(box);
    setShowForm(true);
  };

  const handleCreateBox = () => {
    setFormData({ nome: "", tema: "", itens: "", plan: "" });
    setFormType("box");
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSubmitBox = async () => {
    try {
      const formattedData = {
        nome: formData.nome,
        tema: formData.tema,
        itens: formData.itens.split(", "),
        planId: formData.plan,
      };

      if (editingItem) {
        // Atualizar caixa existente
        const response = await axios.put(`http://localhost:3004/boxes/${editingItem._id}`, formattedData);
        if (response.status === 200) {
          alert("Caixa editada com sucesso!");
        }
      } else {
        // Criar nova caixa
        const response = await axios.post("http://localhost:3004/boxes", formattedData);
        if (response.status === 201) {
          alert("Caixa criada com sucesso!");
        }
      }

      dispatch(fetchBoxes()); // Recarregar a lista

      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar a caixa:", error);
      alert(editingItem ? "Erro ao editar a caixa." : "Erro ao criar a caixa.");
    }
  };

  const handleDeleteBox = async (id) => {
    try {
      await dispatch(deleteBox(id));
      alert("Caixa deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar caixa:", error);
      alert("Erro ao deletar a caixa.");
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
        <button
          className={`tab-button ${selectedTab === "boxes" ? "active" : ""}`}
          onClick={() => handleTabChange("boxes")}
        >
          Caixas
        </button>
      </div>

      <div className="content">
        {/* Seção Cadastros */}
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
                  <li key={user._id} className="user-card">
                    {user.nome} - {user.email} - {user.tipo}
                    <button onClick={() => handleEdit(user)}>Editar</button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* Seção Caixas */}
        {selectedTab === "boxes" && (
          <div>
            <h3>Caixas</h3>
            <ul>
            <button onClick={handleCreateBox}>Adicionar Caixa</button>
              {boxStatus === "loading" ? (
                <p>Carregando caixas...</p>
              ) : boxStatus === "failed" ? (
                <p>Erro ao carregar caixas: {boxError}</p>
              ) : (
                boxes.map((box) => (
                  <li key={box._id} className="box-card">
                    Nome: {box.nome} - Tema: {box.tema} - Plano: {(box.plan && box.plan.name)}
                    <button onClick={() => handleEditBox(box)}>Editar</button>
                    <button onClick={() => handleDeleteBox(box._id)}>Excluir</button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Formulário de Adicionar/Editar Usuário */}
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
            <button onClick={handleSubmitUser}>Salvar</button>
            <button onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Formulário de Adicionar/Editar Caixa */}
      {showForm && formType === "box" && (
        <div className="form-overlay">
          <div className="admin-form">
            <h3>{editingItem ? "Editar Caixa" : "Adicionar Caixa"}</h3>
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
                value={formData.itens || ""}
                onChange={(e) => setFormData({ ...formData, itens: e.target.value })}
              />
            </label>
            <label>
            Plano:
            <PlanoDropdown
  selectedPlan={formData.plan} 
  setSelectedPlan={(value) => setFormData({ ...formData, plan: value })}
  isEditing={editingItem != null}
/>
    </label>
    <button onClick={handleSubmitBox}>Salvar</button>
    <button onClick={() => setShowForm(false)}>Cancelar</button>
  </div>
        </div>
      )}
    </div>
  );
};

export default AdminConfig;