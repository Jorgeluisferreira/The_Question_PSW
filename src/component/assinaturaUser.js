import React, { useState, useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { editUser, loginUser } from "../store/userReducer";


function AssinaturaUser() {

  const currentUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    id: currentUser._id,
    nome: currentUser.nome,
    email: currentUser.email,
    senha: currentUser.senha,
    tipo: currentUser.tipo,
    assinatura: currentUser.assinatura,
    endereco: currentUser.endereco,
    inicioAssinatura: currentUser.inicioAssinatura
  });

  
  const handleSubmit = () => {
    const confirmCancel = window.confirm("Você tem certeza que deseja cancelar a assinatura?");
    
    if (confirmCancel) {
      // Se o usuário confirmar, atualiza a assinatura para vazio
      const updatedUserData = { ...userData, assinatura: "", inicioAssinatura: null };
      setUserData(updatedUserData);
      
      // Envia a atualização para o Redux
      dispatch(editUser(updatedUserData));
    }

  };

  return (
    <div>
      <h3>Informações do Usuário</h3>
      <h5>Tipo de assinatura: {userData.assinatura == "" ? "não possui assinatura" : userData.assinatura}</h5><br></br>
      <h5>Assinatura ativa desde: {userData.assinatura == "" ? "não possui assinatura" : userData.inicioAssinatura}</h5><br></br>

      {userData.assinatura != "" ?
        <button type="button" className="btn btn-danger" onClick={handleSubmit} >
          Cancelar
        </button> : <></>
      }
      
      
    </div>
  );
}

export default AssinaturaUser;
