import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminConfig.css";

const AdminConfig = () => {
    const [plans, setPlans] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedTab, setSelectedTab] = useState("plans");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({});

    const API_URL = "http://localhost:3000";

    // Função para carregar dados do JSON Server
    const fetchData = async () => {
        try {
            const [plansRes, boxesRes, usersRes] = await Promise.all([
                axios.get(`${API_URL}/planos`),
                axios.get(`${API_URL}/caixasPassadas`),
                axios.get(`${API_URL}/users`),
            ]);
            setPlans(plansRes.data);
            setBoxes(boxesRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Função para lidar com o clique em "Adicionar Plano" ou "Adicionar Box"
    const handleAddClick = (type) => {
        setFormData({ type }); // Define o tipo de formulário
        setShowForm(true); // Exibe o formulário
    };

    // Função para enviar o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.type === "plan") {
                const response = await axios.post(`${API_URL}/planos`, formData);
                setPlans([...plans, response.data]);
            } else if (formData.type === "box") {
                const response = await axios.post(`${API_URL}/caixasPassadas`, formData);
                setBoxes([...boxes, response.data]);
            }
            setShowForm(false); // Fecha o formulário após adicionar
            setFormData({});
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
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
                        <button onClick={() => handleAddClick("plan")}>Adicionar Plano</button>
                        <ul>
                            {plans.map((plan) => (
                                <li key={plan.id}>
                                    {plan.nome} - Itens: {plan.itens.join(", ")}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {selectedTab === "boxes" && (
                    <div>
                        <h3>Boxes</h3>
                        <button onClick={() => handleAddClick("box")}>Adicionar Box</button>
                        <ul>
                            {boxes.map((box) => (
                                <li key={box.id}>
                                    {box.tema} - Itens: {box.itens.join(", ")}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {selectedTab === "users" && (
                    <div>
                        <h3>Cadastros</h3>
                        <ul>
                            {users.map((user) => (
                                <li key={user.id}>
                                    {user.nome} - Tipo: {user.tipo}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {showForm && (
                <div className="form-overlay">
                    <form className="admin-form" onSubmit={handleSubmit}>
                        <h3>{formData.type === "plan" ? "Adicionar Plano" : "Adicionar Box"}</h3>
                        {formData.type === "plan" && (
                            <>
                                <label>Nome do Plano:</label>
                                <input
                                    type="text"
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    required
                                />
                                <label>Itens (separados por vírgula):</label>
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        setFormData({ ...formData, itens: e.target.value.split(",") })
                                    }
                                    required
                                />
                                <label>Imagem (URL):</label>
                                <input
                                    type="text"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    required
                                />
                            </>
                        )}

                        {formData.type === "box" && (
                            <>
                                <label>Tema do Box:</label>
                                <input
                                    type="text"
                                    onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                                    required
                                />
                                <label>Itens (separados por vírgula):</label>
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        setFormData({ ...formData, itens: e.target.value.split(",") })
                                    }
                                    required
                                />
                            </>
                        )}

                        <button type="submit">Salvar</button>
                        <button type="button" onClick={() => setShowForm(false)}>
                            Cancelar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminConfig;
