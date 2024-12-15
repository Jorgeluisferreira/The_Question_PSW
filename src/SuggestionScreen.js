import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSuggestions, addSuggestion } from "./store/suggestionReducer";
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

  // Enviar nova sugestão
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

    dispatch(addSuggestion(suggestionData)); // Usa o thunk para enviar ao backend
    setNewSuggestion(""); // Limpa o campo de texto
  };

  return (
    <div className="suggestion-container">
      <h1>Caixa de Sugestões</h1>

      {currentUser?.tipo === "usuario" && (
        <div>
          <textarea
            className="suggestion-textarea"
            placeholder="Escreva sua sugestão aqui..."
            value={newSuggestion}
            onChange={(e) => setNewSuggestion(e.target.value)}
          />
          <button className="suggestion-button" onClick={handleSubmitSuggestion}>
            Enviar Sugestão
          </button>
        </div>
      )}

      {currentUser?.tipo === "admin" && (
        <div className="suggestion-list">
          <h2>Sugestões Recebidas</h2>
          {suggestions.length > 0 ? (
            suggestions.map((sugestao, index) => (
              <div key={index} className="suggestion-card">
                <h3>{sugestao.nome}</h3>
                <p>{sugestao.mensagem}</p>
                <small>{new Date(sugestao.createdAt).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p>Nenhuma sugestão recebida ainda.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestionScreen;
