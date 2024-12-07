import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers, loginUser} from "./store/userReducer";

function LoginPage() {

    const { users, status, error } = useSelector((state) => state.users);
  
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    

    useEffect(() => {
        if (status === "idle") {
          dispatch(fetchUsers());
        }
      }, [status, dispatch]);
    

    const handleSubmit = (event) => {
        event.preventDefault();
        // Verifica se o estado `users` está vazio
        if (!users || users.length === 0) {
          alert("Nenhum usuário registrado.");
          return;
        }
      
        // Busca o usuário no array
        const user = users.find((u) => u.email === email && u.senha === senha);
      
        if (user) {
          dispatch(loginUser({ email, senha }));
          navigate("/");
        } else {
          alert("E-mail ou senha inválidos!");
        }
    };
      
  
   
  
    return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="container p-4 shadow-lg rounded bg-white" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Login ou Cadastro</h2>
        {/* Formulário de Login */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" >
              E-mail
            </label>
            <input type="email" className="form-control" id="email" placeholder="Digite seu e-mail"  value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input type="password" className="form-control" id="password" placeholder="Digite sua senha"  value={senha} onChange={e => setSenha(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
        <hr />
        {/* Formulário de Cadastro */}
        <div className="text-center">
          <p>Não tem uma conta? <a href="/cadastro">Cadastre-se aqui</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
