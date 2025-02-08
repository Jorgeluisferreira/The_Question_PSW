import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../store/userReducer";
import axios from "axios";

function AssinaturaUser() {
  const currentUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    id: currentUser._id,
    nome: currentUser.nome,
    email: currentUser.email,
    senha: currentUser.senha,
    tipo: currentUser.tipo,
    assinatura: currentUser.assinatura, // Agora, a assinatura é um objeto completo
    endereco: currentUser.endereco,
    inicioAssinatura: currentUser.inicioAssinatura,
  });

  // Atualização do estado quando a assinatura muda
  useEffect(() => {
    setUserData({
      id: currentUser._id,
      nome: currentUser.nome,
      email: currentUser.email,
      senha: currentUser.senha,
      tipo: currentUser.tipo,
      assinatura: currentUser.assinatura,
      endereco: currentUser.endereco,
      inicioAssinatura: currentUser.inicioAssinatura,
    });
  }, [currentUser]);

  const handleSubmit = async () => {
    const confirmCancel = window.confirm(
      "Você tem certeza que deseja cancelar a assinatura?"
    );

    if (confirmCancel) {
      const updatedUserData = { ...userData, assinatura: null, inicioAssinatura: null };
      setUserData(updatedUserData);

      // Atualiza o usuário no Redux
      dispatch(editUser(updatedUserData));

      // Envia a requisição para o backend para cancelar a assinatura
      try {
        await axios.put(`/api/users/${userData.id}/cancelSubscription`, updatedUserData);
        alert("Assinatura cancelada com sucesso!");
      } catch (error) {
        console.error("Erro ao cancelar a assinatura:", error);
        alert("Erro ao cancelar a assinatura.");
      }
    }
  };

  return (
    <div>
      <h3>Informações do Usuário</h3>
      <h5>
        Tipo de assinatura: {userData.assinatura ? userData.assinatura.name : "não possui assinatura"}
      </h5>
      <h5>
        Preço: {userData.assinatura ? userData.assinatura.price : "não possui assinatura"}
      </h5>
      <h5>Itens:</h5>
      {userData.assinatura ? (
        userData.assinatura.itens.map((item, index) => <h6 key={index}>{item}</h6>)
      ) : (
        <p>Não possui assinatura</p>
      )}
      <br />
      {userData.assinatura && (
        <button type="button" className="btn btn-danger" onClick={handleSubmit}>
          Cancelar
        </button>
      )}
    </div>
  );
}

export default AssinaturaUser;
