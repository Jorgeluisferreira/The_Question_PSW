import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSuggestions, addSuggestion, updateSuggestion, deleteSuggestion } from "./store/suggestionReducer";
import "./SuggestionScreen.css";

const SuggestionScreen = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);
  const { suggestions, suggestionStatus } = useSelector((state) => state.suggestions);
  const [newSuggestion, setNewSuggestion] = useState("");

  // Buscar sugestões ao carregar o componente
  useEffect(() => {
    if (suggestionStatus === "idle") {
      dispatch(fetchSuggestions());
    }
  }, [dispatch, suggestionStatus]);

  // Enviar nova sugestão (somente usuários)
  const handleSubmitSuggestion = () => {
    if (newSuggestion.trim() === "") {
      alert("Por favor, escreva uma sugestão antes de enviar.");
      return;
    }

    const suggestionData = {
      nome: currentUser.nome,
      mensagem: newSuggestion,
      createdAt: new Date().toISOString(),
    };

    dispatch(addSuggestion(suggestionData));
    setNewSuggestion("");
  };

  // Editar sugestão
  const handleEditSuggestion = (id, currentMessage) => {
    const newMessage = prompt("Edite sua sugestão:", currentMessage);
    if (newMessage && newMessage.trim() !== "") {
      dispatch(updateSuggestion({ id, mensagem: newMessage }));
    }
  };

  // Excluir sugestão
  const handleDeleteSuggestion = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta sugestão?")) {
      dispatch(deleteSuggestion(id));
    }
  };

  return (
    <div className="suggestion-container">
      <h1>Caixa de Sugestões</h1>

      {/* Campo para nova sugestão (somente para usuários, não admins) */}
      {currentUser?.tipo === "usuario" && (
        <>
          <textarea
            className="suggestion-textarea"
            placeholder="Escreva sua sugestão aqui..."
            value={newSuggestion}
            onChange={(e) => setNewSuggestion(e.target.value)}
          />
          <button className="suggestion-button" onClick={handleSubmitSuggestion}>
            Enviar Sugestão
          </button>
        </>
      )}

      {/* Lista de sugestões */}
      <h2>{currentUser?.tipo === "admin" ? "Todas as Sugestões" : "Suas Sugestões"}</h2>

      {suggestions.length > 0 ? (
        <div className="suggestion-list">
          {suggestions
            .filter((sugestao) => currentUser?.tipo === "admin" || sugestao.nome === currentUser.nome) // Admins veem todas, usuários só as próprias
            .map((sugestao) => (
              <div key={sugestao._id} className="suggestion-card">
                <h3>{sugestao.nome}</h3>
                <p>{sugestao.mensagem}</p>
                <small>{new Date(sugestao.createdAt).toLocaleString()}</small>

                {/* Botões de editar e excluir (apenas para o autor da sugestão) */}
                {currentUser?.nome === sugestao.nome && (
                  <>
                    <button onClick={() => handleEditSuggestion(sugestao._id, sugestao.mensagem)}>
                      Editar
                    </button>
                    <button onClick={() => handleDeleteSuggestion(sugestao._id)}>
                      Excluir
                    </button>
                  </>
                )}
              </div>
            ))}
        </div>
      ) : (
        <p>Nenhuma sugestão recebida ainda.</p>
      )}
    </div>
  );
};

export default SuggestionScreen;
