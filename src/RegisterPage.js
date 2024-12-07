import React, { useState, useEffect } from "react";
import { useDispatch , useSelector } from "react-redux";
import { addUser, loginUser, fetchUsers } from "./store/userReducer";
import { useNavigate } from "react-router-dom";

function RegisterPage() {

    const { users, status, error } = useSelector((state) => state.users);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (status === "idle") {
          dispatch(fetchUsers());
        }
      }, [status, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = { id: Math.max(0, ...users.map((user) => user.id)) + 1, nome, email, senha, tipo: "usuario", assinatura: '', endereço: '' };
        dispatch(addUser(newUser))
        try{
            await dispatch(loginUser({ email, senha })).then(() => {
                navigate("/"); // Redireciona para a página inicial ou página protegida
              })
        }catch (error) {
            alert(error.message); // Se houver erro no login, mostra uma mensagem de erro
          }
       
      };

      
    


  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="container p-4 shadow-lg rounded bg-white" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Cadastro</h2>     
        <form onSubmit={handleSubmit}>
          {/* Campo de Nome */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nome Completo
            </label>
            <input
              type="text"
              className="form-control"
              id="nome"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          {/* Campo de E-mail */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Campo de Senha */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
          </div>

          {/* Campo de Confirmação de Senha */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Senha
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirme sua senha"
              value={confirmaSenha}
              onChange={e => setConfirmaSenha(e.target.value)}
            />
          </div>

          {/* Botão de Cadastro */}
          <button type="submit" className="btn btn-primary w-100"  >
            cadastrar
          </button>
          
        </form>

        {/* Link para Login */}
        <div className="text-center mt-3">
          <p>Já possui uma conta? <a href="/loginpage">Faça login</a></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
