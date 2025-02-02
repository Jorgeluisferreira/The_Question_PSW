import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, loginUser, fetchUsers } from "./store/userReducer";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css"; 

function RegisterPage() {
  const { users, status, error } = useSelector((state) => state.users);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      nome,
      email,
      senha,
      tipo: "usuario",
      endereço: "",
    };
    dispatch(addUser(newUser));
    try {
      await dispatch(loginUser({ email, senha })).then(() => {
        navigate("/"); // Redireciona para a página inicial ou página protegida
      });
    } catch (error) {
      alert(error.message); // Se houver erro no login, mostra uma mensagem de erro
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Registrar</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nome">Usuário</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Usuário"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha"
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmaSenha">Confirmar Senha</label>
            <input
              type="password"
              id="confirmaSenha"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              placeholder="Confirmar Senha"
            />
          </div>
          <button type="submit" className="button">
            Entrar
          </button>
          <p className="register-link">
            já possui conta? <a href="/loginpage">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
