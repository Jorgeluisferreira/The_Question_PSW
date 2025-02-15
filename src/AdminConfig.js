import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoxes, deleteBox } from "./store/boxesReducer";
import { fetchUsers } from "./store/userReducer";
import axios from "axios";
import "./AdminConfig.css";
import PlanoDropdown from "./component/PlanDropdown"; // Ajuste o caminho conforme necessário

const AdminConfig = () => {
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState("boxes");
  const [formType, setFormType] = useState(null);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { boxes, status: boxStatus, error: boxError } = useSelector(
    (state) => state.boxes
  );
  const { users, status: userStatus, error: userError } = useSelector(
    (state) => state.users
  );

  // Simulação de planos disponíveis (caso não venham da API)
  const plans = [
    { id: "1", nome: "Básico" },
    { id: "2", nome: "Premium" },
    { id: "3", nome: "Deluxe" },
  ];

  useEffect(() => {
    dispatch(fetchBoxes());
    dispatch(fetchUsers());
    setShowForm(false);
  }, [selectedTab, dispatch]);

  const handleAdd = () => {
    setFormType("box");
    setFormData({});
    setEditingItem(null);
    setShowForm(true);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setShowForm(false);
  };

  const handleEdit = (box) => {
    setFormData({
      nome: box.nome,
      itens: box.itens || [],
      tema: box.tema || "",
      planId: box.plan || "", // Garantindo que o plano seja editável
    });
    setFormType("box");
    setEditingItem(box);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteBox(id));
  };

  const handleSubmit = async () => {
    try {
      let response;
      
      // Verifica se formData.itens é uma string e, caso seja, divide. Se for um array, mantém o valor.
      const itensArray = Array.isArray(formData.itens)
        ? formData.itens
        : formData.itens.split(",").map(item => item.trim());  // Transformar string em array, se necessário
    
      const formattedData = {
        nome: formData.nome,
        tema: formData.tema,
        itens: itensArray, // Usar itens já processados
        planId: formData.planId, // Enviar o `planId` correto
      };
    
      if (editingItem) {
        // Atualizar caixa existente
        response = await axios.put(
          `http://localhost:3004/boxes/${editingItem._id}`,
          formattedData
        );
        if (response.status === 200) {
          alert("Box editado com sucesso!");
        }
      } else {
        // Criar nova caixa
        response = await axios.post("http://localhost:3004/boxes", formattedData);
        if (response.status === 201) {
          alert("Box criado com sucesso!");
        }
      }
      
      dispatch(fetchBoxes()); // Recarregar a lista
      
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar a caixa:", error);
      alert(editingItem ? "Erro ao editar a caixa." : "Erro ao criar a caixa.");
    }
  };
  

  return (
    <div className="admin-config">
      <h2>Configurações de Administrador</h2>
      <div className="tabs">
        <button
          className={`tab-button ${selectedTab === "boxes" ? "active" : ""}`}
          onClick={() => handleTabChange("boxes")}
        >
          Boxes
        </button>
        <button
          className={`tab-button ${selectedTab === "users" ? "active" : ""}`}
          onClick={() => handleTabChange("users")}
        >
          Cadastros
        </button>
      </div>

      <div className="content">
        {selectedTab === "boxes" && (
          <div>
            <h3>Boxes</h3>
            <button onClick={handleAdd}>Adicionar Box</button>
            <ul>
              {boxStatus === "loading" ? (
                <p>Carregando caixas...</p>
              ) : boxStatus === "failed" ? (
                <p>Erro ao carregar caixas: {boxError}</p>
              ) : (
                boxes.map((box) => (
                  <li key={box.id}>
                    Nome: {box.nome} - Tema: {box.tema} - Itens: {box.itens.join(", ")} - Plano:{" "}
                    {box.plano ? plans.find((plan) => plan.id === box.plano)?.nome : "Nenhum"}
                    <button className="edit-button" onClick={() => handleEdit(box)}>
                      Editar
                    </button>
                    <button className="delete-button" onClick={() => handleDelete(box.id)}>
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
                    <button onClick={() => handleEdit(user)}>Editar</button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {showForm && formType === "box" && (
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
                value={formData.itens || ""}
                onChange={(e) => setFormData({ ...formData, itens: e.target.value })}
              />
            </label>

            <label>
              Plano:
              <PlanoDropdown
                selectedPlan={formData.planId}
                setSelectedPlan={(selectedPlan) => setFormData({ ...formData, planId: selectedPlan })}
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
