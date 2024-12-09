import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers, loginUser } from "./store/userReducer";
import "./LoginPage.css"; // Importando o arquivo CSS customizado

function LoginPage() {
  const { users, status } = useSelector((state) => state.users);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = users.find((u) => u.email === email && u.senha === senha);

    if (user) {
      dispatch(loginUser({ email, senha }));
      navigate("/");
    } else {
      alert("E-mail ou senha inválidos!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <i className="bi bi-person"></i>
            <input
              type="email"
              placeholder="Usuário"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <i className="bi bi-lock"></i>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button type="submit" className="button">
            ENTRAR
          </button>
        </form>
        <p className="register-link">
          Não tem conta? <a href="/cadastro">registre-se</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
