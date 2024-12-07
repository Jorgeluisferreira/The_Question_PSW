import React, { useState } from "react";
import { useDispatch} from "react-redux";
import { editUser } from "../store/userReducer";

function UserInfo(props) {

  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false); // Estado de edição
  const [userData, setUserData] = useState({
    id: props.id,
    nome: props.nome,
    email: props.email,
    senha: props.senha,
    tipo: props.tipo,
    assinatura: props.assinatura || "Não possui assinatura",
    endereco: props.endereco || "Não informado",
  });

  console.log(userData)

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Alterna entre modo de edição e visualização
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value }); // Atualiza o valor do campo
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editUser(userData)); // Envia os dados atualizados para o Redux
    console.log("dados enviados")
    console.log(userData)
  };

  return (
    <div>
      <h3>Informações do Usuário</h3>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="assinatura" className="form-label">
            Assinatura:
          </label>
          <input
            type="text"
            id="assinatura"
            name="assinatura"
            className="form-control"
            value={userData.assinatura}
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

        {isEditing ? <button></button> : <button></button>}
        <button
          type={isEditing ? "submit" : "button"}
          className="btn btn-primary"
          onClick={handleEditClick}
        >
          {isEditing ? "Salvar" : "Editar"} {/* Alterna o texto do botão */}
        </button>
      </form>
    </div>
  );
}

export default UserInfo;
