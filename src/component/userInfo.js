import React, { useState, useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { editUser, loginUser } from "../store/userReducer";

function UserInfo() {

  const currentUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false); // Estado de edição
  const [userData, setUserData] = useState({
    id: currentUser.id,
    nome: currentUser.nome,
    email: currentUser.email,
    senha: currentUser.senha,
    tipo: currentUser.tipo,
    assinatura: currentUser.assinatura || "Não possui assinatura",
    endereco: currentUser.endereco || "Não informado",
  });

   // Atualiza o estado local se o currentUser for alterado
   useEffect(() => {
    if (currentUser) {
      setUserData({
        id: currentUser.id,
        nome: currentUser.nome,
        email: currentUser.email,
        senha: currentUser.senha,
        tipo: currentUser.tipo,
        assinatura: currentUser.assinatura || "Não possui assinatura",
        endereco: currentUser.endereco || "Não informado",
      });
    }
  }, [currentUser]);

  console.log(userData)

  const handleEditClick = (e) => {
    e.preventDefault();
    setIsEditing(!isEditing); // Alterna entre modo de edição e visualização
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value })// Atualiza o valor do campo
  
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(editUser(userData)); // Envia os dados atualizados para o Redux
    setIsEditing(false);

  };

  return (
    <div>
      <h3>Informações do Usuário</h3>
      <form>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">
            Nome do Usuário:
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            className="form-control"
            value={userData.nome}
            onChange={handleChange}
            disabled={!isEditing} // Bloqueia ou habilita o input
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={userData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endereco" className="form-label">
            Endereço:
          </label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            className="form-control"
            value={userData.endereco}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {isEditing ? <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Salvar</button> : <button type="button" className="btn btn-primary" onClick={handleEditClick}>Editar</button>}

      </form>
    </div>
  );
}

export default UserInfo;
