import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminConfig.css";

const AdminConfig = () => {
    const [plans, setPlans] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedTab, setSelectedTab] = useState("plans");
    const [formType, setFormType] = useState(null); // "plan" ou "box"
    const [formData, setFormData] = useState({}); // Dados do formulário
    const [showForm, setShowForm] = useState(false);

    const API_URL = "http://localhost:3000";

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

    const handleAdd = (type) => {
        setFormType(type);
        setFormData({});
        setShowForm(true);
    };

    const handleSubmit = async () => {
        try {
            if (formType === "plan") {
                const response = await axios.post(`${API_URL}/planos`, formData);
                setPlans([...plans, response.data]);
            } else if (formType === "box") {
                const response = await axios.post(`${API_URL}/caixasPassadas`, formData);
                setBoxes([...boxes, response.data]);
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
                        <button onClick={() => handleAdd("box")}>Adicionar Box</button>
                        <ul>
                            {boxes.map((box) => (
                                <li key={box.id}>
                                    Tema: {box.tema} - Itens: {box.itens.join(", ")}
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
                                <li key={user.id} className="user-card">
                                    <p><strong>Nome:</strong> {user.nome}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
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
                                    {user.tipo === "admin" && <p><strong>Tipo:</strong> Administrador</p>}
                                </li>
                            ))}
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
