import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, addUser } from "./store/userReducer";

function UserList() {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleAddUser = () => {
    const newUser = { id: Date.now(), name: "Novo Usuário" };
    dispatch(addUser(newUser));
  };

  return (
    <div>
      <h1>Lista de Usuários</h1>
      {status === "loading" && <p>Carregando...</p>}
      {status === "failed" && <p>Erro: {error}</p>}
      {status === "succeeded" && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.nome}</li>
          ))}
        </ul>
      )}
      <button onClick={handleAddUser}>Adicionar Usuário</button>
    </div>
  );
}

export default UserList;
