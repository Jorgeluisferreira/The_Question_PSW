import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./store/userReducer"; // Ação de login do Redux
import "./LoginPage.css"; // Importando o arquivo CSS customizado

function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(""); // Estado para mensagens de erro
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Faz a requisição para o backend
      const response = await fetch("http://localhost:3004/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }), // Envia e-mail e senha
      });

      const data = await response.json();

      if (response.ok) {
        // Se o login for bem-sucedido, dispatch a ação de login e navegue para a página inicial
        dispatch(loginUser(data)); // Envia os dados do usuário e o token para o Redux
        navigate("/"); // Redireciona para a página inicial
      } else {
        // Se houver erro, exibe a mensagem de erro
        setError(data.error || "E-mail ou senha inválidos!");
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Erro ao conectar ao servidor. Tente novamente.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">LOGIN</h2>
        {error && <p className="error-message">{error}</p>} {/* Exibe mensagens de erro */}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <i className="bi bi-person"></i>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <i className="bi bi-lock"></i>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
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