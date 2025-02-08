import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoxes } from "./store/boxesReducer";
import { deleteBox } from "./store/boxesReducer";
import { fetchUsers } from "./store/userReducer"; 
import axios from "axios";
import "./AdminConfig.css";
import CreateBoxScreen from "./component/CreateBoxScreen";

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

  useEffect(() => {
    dispatch(fetchBoxes());
    dispatch(fetchUsers());
    setShowForm(false);
  }, [selectedTab, dispatch]);

  const handleAdd = (type) => {
    setFormType(type);
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

      if (formType === "box") {
        if (editingItem) {
          await axios.put(`http://localhost:3004/boxes/${editingItem._id}`, formData);
        } else {
          response = await axios.post("http://localhost:3004/boxes", formData);
        }
        dispatch(fetchBoxes());

        if (response && response.status === 201) {
          alert("Box salvo com sucesso!");
        }
      }
      setShowForm(false);
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
                      onClick={() => handleEdit(box)}
                    >
                      Editar
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => handleDelete(box.id)}
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
                    <button onClick={() => handleEdit(user)}>Editar</button>
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
                      itens: e.target.value.split(/,\s*/g).map((item) => item.trim()).filter((item) => item !== "")
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
